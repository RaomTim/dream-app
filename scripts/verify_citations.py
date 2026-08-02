#!/usr/bin/env python3
"""
verify_citations.py — la loi de citation, rendue opposable.

Contexte : trois citations fabriquees en une semaine (Weller 30/07, Jung 02/08,
Hillman Soul's Code 02/08), par trois agents differents, sur trois livres
differents. Cause : les agents lisent des *digests*, ou rien ne distingue
visuellement une glose du digesteur d'un verbatim du livre, et recopient la
glose entre guillemets.

Ce script extrait toute citation entre guillemets d'un document markdown, la
cherche dans forest_chunks apres normalisation (cesures, sauts de ligne,
ponctuation, tabulations-separateurs), et rend trois statuts :

    verbatim      -> retrouve tel quel dans le corpus
    approximatif  -> une fenetre glissante de n-grammes retrouve >= SEUIL
    introuvable   -> rien. NE PAS REPARER AU JUGE : ecrire "introuvable dans le corpus".

Usage :
    export SUPABASE_DB_URL='postgresql://...'   # projet rtrkxzcyblgonwgfzovj
    python3 scripts/verify_citations.py DOCTRINE-MIROIR.md 1_BIBLE.md
    python3 scripts/verify_citations.py --ci *.md      # code de sortie 1 si nouvel introuvable

Notes :
  - Une citation en francais d'un livre anglais ne peut PAS etre validee par ce
    script. Elle sort en `introuvable` et c'est correct : la loi de citation dit
    que les guillemets sont reserves au texte dans sa langue d'origine.
  - Les citations deja annotees dans le document par un marqueur d'exemption
    (voir EXEMPT_MARKERS) sont ignorees : ce sont les phrases de l'app, les mots
    de Tim, et les citations explicitement declarees introuvables.
  - Decalages de pagination mesures (page du livre = page_start - offset) :
        jung-red-book (= Psychology and Alchemy, CW 12) : 35
        weller-wild-edge-of-sorrow                      : 24
        kalsched-inner-world-trauma                     : 10
    Un agent qui cite une page sans connaitre le decalage de son livre cite un
    numero invente.
"""

import argparse
import os
import re
import sys
import unicodedata

MIN_LEN = 25          # en dessous, c'est un mot d'interface, pas une citation
NGRAM = 6             # taille de la fenetre pour le mode approximatif
APPROX_THRESHOLD = .5 # part des fenetres retrouvees pour classer "approximatif"

PAGE_OFFSETS = {
    "jung-red-book": 35,
    "weller-wild-edge-of-sorrow": 24,
    "kalsched-inner-world-trauma": 10,
}

# Une citation portant l'un de ces marqueurs sur sa ligne est exemptee :
# elle est deja declaree comme non-verbatim, ou elle n'est pas une citation de livre.
EXEMPT_MARKERS = (
    "introuvable dans le corpus",
    "restitution",
    "sans guillemets",
    "glose de digest",
    "fabriquee", "fabriquée",
    "l'app peut dire", "l'app ne peut pas dire",
    "porte lexicale", "lexique banni",
    "trad. libre",
)

QUOTE_RE = re.compile(r"[«“]\s*(.{%d,}?)\s*[»”]" % MIN_LEN, re.S)


def nrm(text: str) -> str:
    """Meme normalisation que la fonction SQL nrm() : cesures collees, blancs
    ecrases, ponctuation retiree, minuscules, accents deposes."""
    text = text.replace("­", "-")
    text = re.sub(r"-\s*\n\s*", "", text)          # cesure de fin de ligne
    text = re.sub(r"\s+", " ", text)               # tabulations-separateurs inclus
    text = unicodedata.normalize("NFKD", text)
    text = "".join(c for c in text if not unicodedata.combining(c))
    text = re.sub(r"[^a-z0-9 ]", "", text.lower())
    return text.strip()


def extract(path):
    """Rend [(ligne, citation_brute, citation_normalisee)] pour un markdown."""
    out = []
    with open(path, encoding="utf-8") as fh:
        for lineno, line in enumerate(fh, 1):
            low = line.lower()
            if any(m in low for m in EXEMPT_MARKERS):
                continue
            for m in QUOTE_RE.finditer(line):
                raw = m.group(1).strip()
                n = nrm(raw)
                if len(n) >= MIN_LEN:
                    out.append((lineno, raw, n))
    return out


def connect():
    url = os.environ.get("SUPABASE_DB_URL")
    if not url:
        sys.exit("SUPABASE_DB_URL manquant (projet Forest rtrkxzcyblgonwgfzovj).")
    try:
        import psycopg2
    except ImportError:
        sys.exit("pip install psycopg2-binary")
    return psycopg2.connect(url)


def ensure_nrm(cur):
    cur.execute("""
        create or replace function nrm(t text) returns text language sql immutable as $$
          select lower(regexp_replace(regexp_replace(regexp_replace(
                   t, '[­-]\\s*\\n\\s*', '', 'g'), '\\s+', ' ', 'g'),
                   '[^a-z0-9 ]', '', 'gi'))
        $$;
    """)


def lookup(cur, needle):
    cur.execute(
        "select book_id, page_start from forest_chunks "
        "where nrm(chunk_text) like %s limit 3", ("%" + needle + "%",))
    return cur.fetchall()


def classify(cur, norm):
    hits = lookup(cur, norm)
    if hits:
        return "verbatim", hits
    words = norm.split()
    if len(words) < NGRAM:
        return "introuvable", []
    windows = [" ".join(words[i:i + NGRAM]) for i in range(0, len(words) - NGRAM + 1, NGRAM)]
    found, where = 0, []
    for w in windows:
        h = lookup(cur, w)
        if h:
            found += 1
            where.extend(h)
    if windows and found / len(windows) >= APPROX_THRESHOLD:
        return "approximatif", where[:3]
    return "introuvable", where[:3]


def fmt(hits):
    parts = []
    for book, page in hits:
        off = PAGE_OFFSETS.get(book)
        parts.append(f"{book} p.{page - off}" if off is not None else f"{book} #{page}")
    return ", ".join(dict.fromkeys(parts)) or "-"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("files", nargs="+")
    ap.add_argument("--ci", action="store_true",
                    help="code de sortie 1 des qu'une citation est introuvable")
    args = ap.parse_args()

    conn = connect()
    cur = conn.cursor()
    ensure_nrm(cur)
    conn.commit()

    tally = {"verbatim": 0, "approximatif": 0, "introuvable": 0}
    print(f"{'STATUT':<14} {'FICHIER:L':<28} {'SOURCE':<42} CITATION")
    print("-" * 140)
    for path in args.files:
        for lineno, raw, norm in extract(path):
            status, hits = classify(cur, norm)
            tally[status] += 1
            loc = f"{os.path.basename(path)}:{lineno}"
            print(f"{status:<14} {loc:<28} {fmt(hits):<42} {raw[:70]}")

    print("-" * 140)
    print(f"verbatim {tally['verbatim']} · approximatif {tally['approximatif']} "
          f"· introuvable {tally['introuvable']}")
    if tally["introuvable"]:
        print("\nUn trou nomme vaut mieux qu'un remplissage plausible : pour chaque "
              "`introuvable`, soit on trouve le verbatim, soit on retire les "
              "guillemets. Jamais d'entre-deux.")
    if args.ci and tally["introuvable"]:
        sys.exit(1)


if __name__ == "__main__":
    main()
