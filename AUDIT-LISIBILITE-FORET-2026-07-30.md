# AUDIT DE LISIBILITÉ DE LA FORÊT — 2026-07-30

> Réparation du cœur épistémique. Base `rtrkxzcyblgonwgfzovj`, tables `forest_books` (409 livres) et `forest_chunks` (98 123 chunks).
> Tout ce qui suit est mesuré. Aucun chiffre n'est estimé. Aucun contenu n'a été détruit : tout ce qui a été touché est copié verbatim (texte **et** embedding) dans `forest_chunks_backup_20260730`.

---

## 0. Verdict en dix lignes

Le diagnostic du 27/07 avait raison qu'il y avait un problème, mais il visait à côté sur trois points, et c'est important :

1. **Le signal `word_count = 1` n'est pas un signal de corruption.** `forest_chunks.word_count` est une colonne **GÉNÉRÉE** : `array_length(string_to_array(chunk_text, ' '), 1)`. Elle découpe sur l'**espace littéral uniquement**. Un texte séparé par des **tabulations** — sortie normale de pdfplumber — donne un `word_count` absurde alors que le texte est parfaitement lisible. La moitié des livres « repérés » le 27/07 (`jung-archetypes-collective-unconscious`, `roberts-seth-early-sessions-*`, `seth-speaks`, `moss-secret-history-dreaming`, `kaplan-williams-jungian-senoi`) étaient **lisibles**. Recompté sur `\s+`, le corpus illisible tombe de « 6 livres + » à **2**.
2. **Hillman n'est plus cassé** — et c'est le point n°1 de la mission. `hillman-dream-and-the-underworld` compte aujourd'hui **237 chunks / 69 194 mots, 0 chunk illisible, couverture p.1→259 sur un PDF de 260 pages**, texte authentique vérifié à la lecture. Il a été ré-ingéré avant cette session (le job en base dit encore 231 chunks). **Rien à réparer.**
3. **Le vrai problème est ailleurs, et il est pire.** `jung-psychology-and-alchemy` ne contient pas Jung : il contient **Robert A. Johnson, *He: Understanding Masculine Psychology*** — vérifié au texte (l'en-tête courant `U n d e rs ta n d in g M a s c u lin e P sy c h o lo g y` est dans les chunks). **16 livres sur 409 servent le texte d'un autre livre.** C'est exactement le « bien pire qu'un trou » de la consigne, et personne ne le voyait.

**Cause racine trouvée et reproduite à l'identique** (§2) : deux bugs distincts, aucun n'est celui qu'on soupçonnait.

**État final** : 1 livre réellement réparé et re-embeddé (`the-cosmic-serpent`, ×3,4 de texte lisible), 20 livres mis en quarantaine documentée, garde-fou installé et **vert**.

---

## 1. L'inventaire des 409 livres

### 1.1 Synthèse

| État | Livres | dont corpus Rêve 🌙 | Définition |
|---|---:|---:|---|
| `sain` | **351** | 71 | Texte lisible, contenu propre au livre, embeddings présents |
| `vide` | **35** | 4 | Aucun chunk en base (le livre existe dans `forest_books`, jamais ingéré) |
| `source_fausse` | **16** | 7 | ⚠️ Le `book_id` sert le texte d'un **autre livre** |
| `ingestion_partielle` | **3** | 1 | Texte lisible mais couverture très inférieure au volume réel |
| `doublon_alias` | **3** | 0 | Même livre ingéré deux fois sous deux slugs (contenu correct, redondant) |
| `texte_recolle` | **1** | 0 | Espaces perdus à l'extraction, texte illisible |
| **TOTAL** | **409** | 83 | |

### 1.2 Corpus Rêve — réponse à la question posée

Croisé avec `forest/dream_alpha/INVENTAIRE-CORPUS-REVE-2026-07-26.md` : **83 slugs du corpus rêve existent en base, dont 12 ne sont pas sains** (14 %).

| Livre du corpus rêve | État | Détail |
|---|---|---|
| `jung-psychology-and-alchemy` | source_fausse | sert **Johnson, *He*** — ⚠️ le plus grave |
| `seth-unknown-reality` | source_fausse + illisible | sert *The Nature of Personal Reality*, en plus recollé |
| `seth-speaks` | source_fausse | sert *The Magical Approach* |
| `seth-dreams-evolution-vol1` | source_fausse | sert le Volume 2 |
| `roberts-seth-early-sessions-1` | source_fausse | sert *Early Sessions Book 4* |
| `roberts-seth-early-sessions-7` | source_fausse | sert *Early Sessions Book 4* |
| `von-franz-feminine-fairy-tales` | source_fausse | sert *The Interpretation of Fairy Tales* |
| `von-franz-way-of-the-dream` | source_fausse | sert *The Interpretation of Fairy Tales* |
| `hay-heal-your-body` | ingestion_partielle | 5 583 mots pour 63 pages |
| `hillman-souls-code` | vide | 0 chunk — **cité par `DOCTRINE-MIROIR.md`** |
| `moss-sidewalk-oracles` | vide | 0 chunk |
| `seth-nature-of-the-psyche` | vide | 0 chunk |
| `wangyal-tibetan-yogas` | vide | 0 chunk |

Le pôle Seth est le plus atteint : **6 des 11 livres Seth/Roberts du corpus rêve servent le texte d'un autre Seth.** Un agent qui « consulte Seth Speaks » lisait en réalité *The Magical Approach*, sous le mauvais titre, avec la mauvaise pagination.

### 1.3 La requête

Le classement est reproductible. La colonne `word_count` étant piégée, tout se recompte depuis le texte :

```sql
-- installé en base : forest_readability_report()  (+ vues forest_chunk_readability / forest_book_readability)
select book_id, n_chunks, real_words, n_unreadable, pct_unreadable,
       n_missing_embedding, n_quarantined, content_fingerprint
from forest_readability_report()
order by pct_unreadable desc;

-- sources fausses : deux book_id qui partagent une empreinte de contenu
select content_fingerprint, count(*), array_agg(book_id order by book_id)
from forest_readability_report()
group by content_fingerprint having count(*) > 1;
```

Le tableau complet des 409 livres est en **Annexe A**.

---

## 2. La cause

Il n'y avait pas un bug, il y en avait **deux**, plus un facteur aggravant. Aucun n'est l'hypothèse de départ (« une police sans information d'espacement »).

### 2.1 Cause A — le texte recollé : `pypdf`, pas `pdfplumber`

L'hypothèse de départ était qu'un extracteur perdait les espaces sur certains PDF à cause de la police. **Elle est fausse, et je peux le prouver.**

`seth-unknown-reality` (recollé) et `seth-nature-personal-reality` (propre) proviennent du **même fichier PDF**. Même fichier, deux résultats opposés — donc la police n'y est pour rien. J'ai rejoué l'extraction sur ce fichier aujourd'hui :

| Extracteur | tokens (p.200) | chars/token | verdict |
|---|---:|---:|---|
| `pdfplumber` (pipeline officiel) | 386 | 5,8 | ✅ propre |
| `PyMuPDF` (fitz) | 388 | 5,7 | ✅ propre |
| `pdftotext` (poppler) | 355 | 6,2 | ✅ propre |
| **`pypdf`** | **7** | **263,6** | 🔴 **recollé** |

Et la reproduction est **exacte, pas approximative**. `pypdf` sur ce PDF sort :

```
lleduponwithgreateffectiveness,asyouwillseeinthenextchapter.Wewilldiscussthe
waysinwhichthiscanbeencouraged,aswellastheroleofthecon-sciousmindasthedirectorof
"thesoulinchemicalclothe…
```

et `forest_chunks` contient, pour `seth-unknown-reality` chunk 200, **la même chaîne au caractère près** — jusqu'au trait d'union de césure conservé dans `con-sciousmind`.

**Pourquoi.** Ces PDF n'encodent aucun caractère espace : l'espacement est fait par positionnement (opérateurs `TJ`). `pdfplumber`, `PyMuPDF` et `pdftotext` calculent les écarts entre glyphes et réinsèrent les espaces. `pypdf` restitue les chaînes telles qu'encodées, et les mots se recollent. **L'outil fautif est `pypdf`. Les trois autres auraient marché** — `PyMuPDF` est le meilleur choix (le plus rapide, et il gère aussi les EPUB).

Note : `chunk_pdf.py` et `chunk_any.py` utilisent tous deux `pdfplumber`. Le ou les runs fautifs ont donc emprunté un **chemin d'ingestion hors pipeline** (script ad hoc), ce qui explique que seuls certains livres soient touchés.

### 2.2 Cause B — les sources fausses : l'appariement flou de `chunk_pdf.py`

C'est le défaut le plus grave, et il est dans le pipeline versionné. `forest/pipelines/chunk_pdf.py` :

```python
def find_pdf_for_book(book_id, ebooks_dir=EBOOKS_DIR):
    keywords = book_id.replace('-', ' ').split()
    for pdf in all_pdfs:
        fname = os.path.basename(pdf).lower()
        score = sum(1 for kw in keywords if kw.lower() in fname)
        if score > best_score:
            best_score = score; best_match = pdf
    return best_match if best_score >= 2 else None
```

Trois défauts qui se combinent :

- **Deux mots-clés suffisent.** `seth-speaks` → mots `seth`, `speaks` ; le fichier *« The Magical Approach: **Seth Speaks** About the Art of Creative Living »* marque 2 → accepté. Le livre est ingéré sous le mauvais nom.
- **Aucun contrôle d'unicité.** Rien n'empêche un même fichier d'être attribué à plusieurs `book_id`. Mesuré : **17 fichiers PDF servent 36 livres.** Les 3 von Franz pointent tous sur *The Interpretation of Fairy Tales*.
- **Aucune vérification, et l'échec est silencieux.** Quand le vrai PDF est absent, la fonction ne renvoie pas « introuvable » : elle renvoie **le moins mauvais voisin**. `jung-psychology-and-alchemy` (mots `jung`, `psychology`, `alchemy`) a capté *« **He**: understanding masculine **psychology** … **Jung**, C. G. »* — 2 points, accepté. Jung CW12 devient Johnson.

Le job est ensuite marqué `complete`. Rien ne crie.

Preuve au texte pour chaque verdict (échantillon) :

| `book_id` | Ce que contiennent réellement les chunks |
|---|---|
| `jung-psychology-and-alchemy` | en-tête courant `U n d e rs ta n d in g M a s c u lin e P sy c h o lo g y`, préface de Ruth Tiffany Barnhouse → **Johnson, *He*** |
| `carson-silent-spring` | « *American Environmental History. Students in this course…* » → préface universitaire de **Lytle** |
| `some-ritual` | sommaire « *Journey into the Underworld… The Fearful Return* » → ***Of Water and the Spirit*** |
| `melchizedek-flower-of-life-vol1` | sommaire « *The Superpsychic Children… Fourth-Dimensional Shift* » → **Volume 2** |
| `seth-unknown-reality` | « *CHAPTER 11 The Conscious Mind as the Carrier of Beliefs* » → ***The Nature of Personal Reality*** |
| `ong-orality-and-literacy` | blurbs de Martin Shaw pour *Hospicing Modernity* → **Machado de Oliveira** |

### 2.3 Facteur aggravant — 470 des 775 sources sont des fantômes iCloud

`eBOOKS/` est sur iCloud Drive. Sur **775 PDF/EPUB, 470 sont des placeholders non matérialisés** : toute lecture renvoie `OSError: Resource deadlock avoided`. Côté livres ingérés, **348 des 409 sources sont évincées, 43 seulement sont lisibles.**

C'est ce qui rend l'appariement flou dévastateur : quand le vrai fichier est un fantôme, le matcher se rabat sur un voisin présent. Et c'est ce qui **bloque aujourd'hui la ré-extraction** de presque tout (§4). Cause racine connue et documentée : `reference_icloud_eviction.md` — disque plein → macOS évince.

---

## 3. Ce qui a été réparé

### 3.1 `the-cosmic-serpent` — réparé pour de bon, par ré-OCR

Ici la couche texte du PDF elle-même était de l'OCR pourri : `pdfplumber`, `PyMuPDF` et `pdftotext` sortaient **la même bouillie**, donc aucun changement d'extracteur ne pouvait sauver le livre. Le PDF contenant une couche image, je l'ai **ré-OCRisé intégralement** (Tesseract, 275 pages, 200 dpi).

**Avant** (couche texte du PDF, chunk 60) :

> `ontoftheshaman'seyes:Itismadeupof three-dimensionalimagesthatcoalesceintosoundand thatthe shamanimitatesbyemittingcorrespondingmelodies.'^I should checkwhetherDNAemitssoundornot. d8 TheCosmicStrpeiii "Anotherwayoi'testingthisideawouldbetodrinkayahuasca aiidobservethennicroscopicimages. . . ."`

**Après** (ré-OCR, chunk 52) :

> `remarkable that such a mechanism exists at all and even more remarkable that every living cell, whether animal, plant or microbial, contains a version of it."! Crick compares a protein to a paragraph made up of 200 let-ters lined up in the correct order, If the chances are infinitesimal for one par…`

Autre comparaison sur la même page, qui montre l'ampleur :

| | texte |
|---|---|
| avant | `During tliis Immersion in mvsfenoiis moments of mv past. I starU'd tlunkiu^ :ilj<ml wliat Carlos iud seucI.` |
| après | `During this immersion in mysterious moments of my past, I started thinking about what Carlos had said.` |

| Mesure | Avant | Après |
|---|---:|---:|
| chunks | 220 | 183 |
| **mots réels** | **27 072** | **91 242** |
| **chunks illisibles** | **194 / 220 (88 %)** | **0** |
| embeddings | 220 (sur du bruit) | **183, recalculés** |
| couverture | p.→274 | p.→275 |

**×3,4 de texte lisible.** Les 220 anciens chunks sont intégralement conservés dans `forest_chunks_backup_20260730`.

**Vérifié bout en bout par le vrai chemin de production** — RPC `match_forest_chunks`, requête *« ayahuasca visions serpents DNA origin of knowledge »* :

```
the-cosmic-serpent   sim=0.6861  Wuat HAD BECOME of the investigation that posed the enigma of the hallucinatory knowledge of We…
the-cosmic-serpent   sim=0.6555  snakes with two tails. In a great number of creation myths, the serpent that plays the main par…
the-cosmic-serpent   sim=0.6331  eye, while focusing the other on the shamanism of Amazonian ayahuasqueros…
```

Le livre est de nouveau consultable. (Réserve honnête : quelques chunks correspondent aux planches illustrées du livre, dont l'OCR ne produit que du bruit — c'est irréductible et sans gravité.)

### 3.2 Les 20 livres mis en quarantaine — « un trou nommé vaut mieux qu'un remplissage plausible »

Pour les 16 sources fausses, la vraie source est indisponible (§4) : **impossible de réparer, mais inacceptable de laisser la Forêt citer un faux**. J'ai donc appliqué une quarantaine **non destructive** :

1. copie verbatim (texte **+ embedding**) dans `forest_chunks_backup_20260730` — **4 933 chunks sauvegardés** ;
2. `forest_chunks.quarantine_reason` renseigné avec le motif exact et le livre réellement servi ;
3. `embedding = NULL` → le faux contenu **disparaît de la recherche sémantique**, sans qu'une ligne soit supprimée.

Vérifié : le faux ne remonte plus, le vrai remonte toujours.

```
seth-speaks                  -> 0 résultat      (source fausse, neutralisée)
jung-psychology-and-alchemy  -> 0 résultat      (source fausse, neutralisée)
seth-unknown-reality         -> 0 résultat      (source fausse, neutralisée)
seth-magical-approach        -> 3 résultats     (détenteur légitime, intact)
```

**Les 16 sources fausses** (le `book_id` → ce qu'il servait réellement) :

`von-franz-feminine-fairy-tales` → von-franz-interpretation-fairy-tales · `von-franz-way-of-the-dream` → idem · `andersen-contes-merveilleux-2` → tome 1 · `carson-silent-spring` → lytle-gentle-subversive · `gag-tales-from-grimm` → grimm-more-tales-gag · `gougaud-livre-des-amours` → gougaud-arbre-aux-tresors · `ong-orality-and-literacy` → machado-hospicing-modernity · `melchizedek-flower-of-life-vol1` → vol2 · `roberts-seth-early-sessions-1` → book 4 · `roberts-seth-early-sessions-7` → book 4 · `rudd-gene-keys` → rudd-human-design-revelation · `seth-dreams-evolution-vol1` → value-fulfillment · `seth-speaks` → seth-magical-approach · `some-ritual` → some-of-water-and-spirit · `jung-psychology-and-alchemy` → johnson-he · `seth-unknown-reality` → seth-nature-personal-reality

**+ 1 illisible** : `ostrom-governing-commons` (170/170 chunks recollés, source évincée).
**+ 3 doublons d'alias** (contenu correct, slug redondant, un seul doit servir la recherche) : `keller-feeling-for-organism`, `lee-indigenous-womens-voices`, `scholz-ours-to-hack`.

**Tout est réversible** : `forest_chunks_backup_20260730` contient texte et embedding d'origine.

---

## 4. Ce qui reste cassé, et pourquoi

Ce n'est pas de la paresse : c'est un mur physique. **Les fichiers sources ne sont pas sur le disque.**

| Livre | Ce qu'il faudrait | Bloqué par |
|---|---|---|
| `jung-psychology-and-alchemy` ⭐ | ré-ingérer Jung CW12 | PDF **évincé iCloud** (124 Mo, illisible) |
| `seth-unknown-reality` | ré-ingérer *The Unknown Reality* | PDF présent mais **évincé** |
| `roberts-seth-early-sessions-1` / `-7` | ré-ingérer Books 1 et 7 | les deux PDF existent, **évincés** |
| `ostrom-governing-commons` | ré-extraire (pypdf → PyMuPDF) | PDF **évincé** |
| les 10 autres sources fausses | ré-ingérer chacune | PDF **évincés** |
| `hara-designing-design` | OCR intégral | source lisible mais **aucune couche texte** (livre d'art scanné, 10 mots sur 478 pages) |
| 35 livres `vide` | ingérer | 21 sources évincées, **14 sans aucun chemin source** |

**Le déblocage tient en une action, et elle est pour Tim** : libérer de l'espace disque et forcer le téléchargement d'`eBOOKS/` (cf. `reference_disque_mac_nettoyage.md` — le gisement est `Claude vm_bundles` 16 Go). Dès que les fichiers sont matérialisés, la ré-ingestion est mécanique.

⚠️ **Ne pas tenter la re-séparation algorithmique (Viterbi) sur les livres recollés.** Le brief l'autorisait en dernier recours ; je ne l'ai pas fait et je recommande de ne pas le faire. Sur ce corpus, le vocabulaire qui porte le sens est précisément celui qu'un segmenteur par dictionnaire casse : *Sumari*, *Tagesreste*, *epistrophè*, *eidola*, *ayahuasqueros*, *Dagara*, les noms propres. On produirait un texte **plausible et faux** — exactement ce que la règle intégrité-vérité interdit. Un trou nommé vaut mieux.

### La note sur les embeddings

Le piège signalé dans la consigne — *« si le texte change, les embeddings deviennent faux et le chunk réparé reste invisible »* — a été vérifié, pas supposé. J'ai ré-embeddé un échantillon et comparé au vecteur stocké : **cosinus = 1,0000** sur Hillman, Moss, Kaplan-Williams, Campbell et seth-unknown-reality. **Aucun embedding périmé dans la base.** (Corollaire désagréable : le texte corrompu était fidèlement embeddé — la Forêt indexait donc soigneusement du bruit.)

**Coût du ré-embedding** : `text-embedding-3-small`, 0,02 $/M tokens. Les 183 chunks du Cosmic Serpent ont coûté **~0,002 $**. Ré-embedder **la totalité des 98 123 chunks coûterait ~1,30 $** — le coût n'est jamais l'argument, il est négligeable ; c'est la disponibilité des sources qui bloque.

---

## 5. Le garde-fou anti-récidive

Ajouté à `forest/pipelines/sync_digests_to_supabase.py` (fonction `check_chunk_readability`), adossé à la fonction SQL `forest_readability_report()` installée en base. Il tourne à chaque exécution du script, ou seul via `--check-only`, et **sort en code 1** quand il trouve quelque chose de neuf — donc il casse un cron.

Il surveille les trois pièges de cet audit :

1. **Livres illisibles** — tokens recomptés sur `\s+`, jamais depuis `word_count` (la colonne générée est piégée, c'est écrit dans le code et dans le commentaire SQL).
2. **Sources fausses** — deux `book_id` partageant une empreinte de contenu.
3. **Embeddings manquants** — un chunk réparé mais jamais ré-embeddé est invisible.

Les problèmes déjà mis en quarantaine restent **affichés en 🟡 mais ne sont plus bloquants** : le garde-fou est vert aujourd'hui, et il repassera rouge à la première régression **nouvelle**. C'est ce qui le rend utilisable en cron.

**Sortie réelle, exécutée le 2026-07-30 après réparation** (`exit=0`) :

```
==============================================================================
CONTRÔLE DE LISIBILITÉ — forest_chunks
==============================================================================
corpus : 374 livres avec chunks, 98123 chunks, 4933 en quarantaine

🟡 2 LIVRE(S) AU TEXTE ILLISIBLE (>=20% de chunks recollés) — dont 0 NOUVEAU(X)
   Cause type : extracteur PDF qui perd les espaces sur une police sans
   information d'espacement. Re-extraire depuis la source, ne PAS re-couper.
   - ostrom-governing-commons      100.0% illisible (170/170 chunks, 8717 mots réels)  [quarantaine — connu]
   - seth-unknown-reality          100.0% illisible (439/439 chunks, 3704 mots réels)  [quarantaine — connu]

🟡 15 GROUPE(S) DE CONTENU DUPLIQUÉ — dont 0 NON TRAITÉ(S)
   Au moins un book_id est une SOURCE FAUSSE : un livre déclaré affiche le
   texte d'un autre. Pire qu'un trou : à traiter en premier.
   - 3 livres : von-franz-feminine-fairy-tales, von-franz-interpretation-fairy-tales,
     von-franz-way-of-the-dream    [traité — seul von-franz-interpretation-fairy-tales reste actif]
   - 2 livres : carson-silent-spring, lytle-gentle-subversive
                                   [traité — seul lytle-gentle-subversive reste actif]
   - 2 livres : machado-hospicing-modernity, ong-orality-and-literacy
                                   [traité — seul machado-hospicing-modernity reste actif]
   - 2 livres : seth-magical-approach, seth-speaks
                                   [traité — seul seth-magical-approach reste actif]
   … (15 groupes au total, tous traités)
✅ tout chunk non quarantainé a son embedding

✅ CONTRÔLE DE LISIBILITÉ PASSÉ.
==============================================================================
```

**Correctif à apporter au pipeline** (identifié, non appliqué — touche l'ingestion, à faire tourner sur Claude Code) : `find_pdf_for_book()` dans `chunk_pdf.py` doit (a) exiger un score de recouvrement **relatif** et pas 2 mots absolus, (b) **refuser** un fichier déjà attribué à un autre `book_id`, (c) renvoyer « introuvable » plutôt que le moins mauvais voisin, (d) écrire `pdf_path` **et son hash** dans `forest_chunking_jobs` pour que le lien livre↔fichier soit auditable. Et **bannir `pypdf`** au profit de PyMuPDF.

---

## 6. L'impact épistémique — ce qui est fragilisé, ce qui tient

C'est la question qui compte, et la réponse est plus rassurante que le diagnostic ne le laissait craindre.

### Ce qui tient — `DOCTRINE-MIROIR.md`

**La doctrine du miroir n'est pas fragilisée.** Trois raisons, toutes vérifiées :

1. **Elle est bâtie sur les digests Tier 1, pas sur le texte intégral.** Le digest canonique de `hillman-dream-and-the-underworld` fait 9 138 caractères, il est propre, `locked: true`, daté du 2026-04-12, avec `source_hash`. Le Tier 2 fait 7 286 caractères. Ces digests n'ont jamais transité par les chunks cassés.
2. **Le document le disait déjà.** Sa ligne 10 porte l'avertissement : *« cette doctrine est fondée sur les digests Tier 1, qui sont sains… Rien de ce qui est écrit ici n'en dépend ; toute amplification future depuis le texte intégral en dépend »*. L'auteur avait vu la limite et l'avait nommée — c'est exactement la discipline attendue.
3. **Et surtout : le texte de Hillman est aujourd'hui propre.** 237 chunks, 69 194 mots, 0 illisible, couverture complète, contenu authentique vérifié à la lecture (`« This little book attempts a different view of the dream… does not rely on ideas of repression (Freud) or of compensation (Jung) »`). L'avertissement de la ligne 10 est **périmé** : il peut être levé pour ce livre.

Les trois appuis de la doctrine sur Hillman — *stick to the image*, l'erreur d'Hercule, *esse est percipi* — proviennent des digests, sont conformes au livre, et **tiennent**.

### Ce qui est réellement fragilisé

| Point | Statut |
|---|---|
| `hillman-souls-code`, cité en §1.3 et §7 de la doctrine comme source d'*esse est percipi* | **0 chunk en base.** L'appui repose entièrement sur le digest Tier 1. Pas faux — mais **non vérifiable contre le texte** tant que le livre n'est pas ingéré. À citer avec cette réserve. |
| Toute consultation Seth passée | 6 des 11 Seth du corpus rêve servaient un autre Seth. Une consultation qui a cité *Seth Speaks* ou *The Unknown Reality* **a cité le mauvais livre** — le contenu était du vrai Seth, mais sous le mauvais titre et la mauvaise pagination. Les références sont à revérifier ; le fond l'est moins. |
| Toute citation de `jung-psychology-and-alchemy` | ⚠️ **Le plus grave.** Une consultation qui a « cité Jung, *Psychologie et Alchimie* » depuis les chunks citait **Robert Johnson**. Le digest Tier 1 (9 715 car.) est, lui, un vrai digest de Jung — donc les usages passés via digest tiennent, les usages via texte intégral sont **faux**. Ce livre est en tête de la file de réparation. |
| `von-franz-way-of-the-dream` et `-feminine-fairy-tales` | servaient *The Interpretation of Fairy Tales*. Même logique : digests sains, texte intégral faux. |

### La leçon

Le corpus a tenu parce que **la Forêt travaille surtout par digests Tier 1, et que ceux-là sont propres**. C'est la couche des chunks — celle qui sert la recherche sémantique et l'amplification — qui était atteinte. La règle qui a sauvé la mise est la même que celle appliquée ici : **nommer la limite au lieu de la combler**. `DOCTRINE-MIROIR.md` l'avait fait spontanément ; c'est pour ça qu'elle tient.

---

## 7. Ce qu'il reste à faire, dans l'ordre

1. **Tim — libérer le disque et matérialiser `eBOOKS/`** (470 fichiers fantômes). C'est le déblocage de tout le reste. Rien de la file ci-dessous ne peut avancer avant.
2. Ré-ingérer, dans cet ordre : `jung-psychology-and-alchemy` (CW12) · `seth-unknown-reality` · `roberts-seth-early-sessions-1` et `-7` · `ostrom-governing-commons` · les 10 autres sources fausses.
3. Corriger `find_pdf_for_book()` et bannir `pypdf` (§5) — **sur Claude Code**, ça doit tourner.
4. Ingérer les 35 livres `vide` (4 sont dans le corpus rêve, dont `hillman-souls-code`).
5. Lever l'avertissement de la ligne 10 de `DOCTRINE-MIROIR.md` pour `hillman-dream-and-the-underworld`, et le conserver pour `hillman-souls-code`.
6. Mettre `sync_digests_to_supabase.py --check-only` en cron hebdomadaire.

---

## Annexe A — les 409 livres

Légende : 🌙 = livre du corpus Rêve · « source » = état du fichier d'origine sur disque · « mots réels » = tokens recomptés sur `\s+` (jamais `word_count`).

| # | book_id | état | chunks | mots réels | source | 🌙 | note |
|---|---|---|---|---|---|---|---|
| 1 | `andersen-contes-merveilleux-2` | **source_fausse** | 229 | 98152 | évincée iCloud |  | sert le texte de `andersen-contes-merveilleux-1` |
| 2 | `carson-silent-spring` | **source_fausse** | 254 | 85839 | évincée iCloud |  | sert le texte de `lytle-gentle-subversive` |
| 3 | `gag-tales-from-grimm` | **source_fausse** | 117 | 55024 | évincée iCloud |  | sert le texte de `grimm-more-tales-gag` |
| 4 | `gougaud-livre-des-amours` | **source_fausse** | 323 | 133226 | évincée iCloud |  | sert le texte de `gougaud-arbre-aux-tresors` |
| 5 | `jung-psychology-and-alchemy` | **source_fausse** | 79 | 31300 | évincée iCloud | 🌙 | sert le texte de `johnson-he` |
| 6 | `melchizedek-flower-of-life-vol1` | **source_fausse** | 290 | 140371 | évincée iCloud |  | sert le texte de `melchizedek-flower-of-life-vol2` |
| 7 | `ong-orality-and-literacy` | **source_fausse** | 278 | 124910 | évincée iCloud |  | sert le texte de `machado-hospicing-modernity` |
| 8 | `roberts-seth-early-sessions-1` | **source_fausse** | 350 | 178166 | lisible | 🌙 | sert le texte de `roberts-seth-early-sessions-4` |
| 9 | `roberts-seth-early-sessions-7` | **source_fausse** | 350 | 178166 | lisible | 🌙 | sert le texte de `roberts-seth-early-sessions-4` |
| 10 | `rudd-gene-keys` | **source_fausse** | 194 | 78646 | évincée iCloud |  | sert le texte de `rudd-human-design-revelation` |
| 11 | `seth-dreams-evolution-vol1` | **source_fausse** | 271 | 177480 | évincée iCloud |  | sert le texte de `seth-dreams-evolution-value-fulfillment` |
| 12 | `seth-speaks` | **source_fausse** | 139 | 67526 | lisible | 🌙 | sert le texte de `seth-magical-approach` |
| 13 | `seth-unknown-reality` | **source_fausse** | 439 | 3704 | lisible | 🌙 | sert le texte de `seth-nature-personal-reality` + texte recolle illisible |
| 14 | `some-ritual` | **source_fausse** | 334 | 148862 | évincée iCloud |  | sert le texte de `some-of-water-and-spirit` |
| 15 | `von-franz-feminine-fairy-tales` | **source_fausse** | 206 | 89432 | évincée iCloud | 🌙 | sert le texte de `von-franz-interpretation-fairy-tales` |
| 16 | `von-franz-way-of-the-dream` | **source_fausse** | 206 | 89432 | évincée iCloud | 🌙 | sert le texte de `von-franz-interpretation-fairy-tales` |
| 17 | `ostrom-governing-commons` | **texte_recolle** | 170 | 8717 | évincée iCloud |  | 100.0% de chunks illisibles |
| 18 | `hara-designing-design` | **ingestion_partielle** | 1 | 10 | lisible |  | 10 mots pour 478 pages |
| 19 | `hay-heal-your-body` | **ingestion_partielle** | 13 | 5643 | évincée iCloud | 🌙 | 5643 mots pour 63 pages |
| 20 | `hyde-the-gift` | **ingestion_partielle** | 1 | 119 | évincée iCloud |  | 119 mots pour 459 pages |
| 21 | `keller-feeling-for-organism` | **doublon_alias** | 217 | 96687 | évincée iCloud |  | meme livre que `fox-keller-feeling-for-the-organism` |
| 22 | `lee-indigenous-womens-voices` | **doublon_alias** | 279 | 151273 | évincée iCloud |  | meme livre que `lee-evans-indigenous-womens-voices` |
| 23 | `scholz-ours-to-hack` | **doublon_alias** | 208 | 73846 | évincée iCloud |  | meme livre que `scholz-schneider-ours-to-hack` |
| 24 | `anzaldua-borderlands` | **vide** | 0 | 0 | aucune |  | aucun chunk en base |
| 25 | `barabasi-linked` | **vide** | 0 | 0 | évincée iCloud |  | aucun chunk en base |
| 26 | `bataille-histoire-erotisme` | **vide** | 0 | 0 | aucune |  | aucun chunk en base |
| 27 | `block-visual-story` | **vide** | 0 | 0 | évincée iCloud |  | aucun chunk en base |
| 28 | `bringhurst-elements-typographic-style` | **vide** | 0 | 0 | évincée iCloud |  | aucun chunk en base |
| 29 | `dana-polyvagal-exercises` | **vide** | 0 | 0 | aucune |  | aucun chunk en base |
| 30 | `easton-hardy-salope-ethique` | **vide** | 0 | 0 | évincée iCloud |  | aucun chunk en base |
| 31 | `fabre-plantes-mediterraneennes` | **vide** | 0 | 0 | aucune |  | aucun chunk en base |
| 32 | `grimm-kinder-und-hausmarchen` | **vide** | 0 | 0 | aucune |  | aucun chunk en base |
| 33 | `hildegarde-physica` | **vide** | 0 | 0 | aucune |  | aucun chunk en base |
| 34 | `hildegarde-scivias` | **vide** | 0 | 0 | aucune |  | aucun chunk en base |
| 35 | `hillman-souls-code` | **vide** | 0 | 0 | aucune | 🌙 | aucun chunk en base |
| 36 | `hoffmann-medical-herbalism` | **vide** | 0 | 0 | évincée iCloud |  | aucun chunk en base |
| 37 | `hua-shurangama-mantra-vol1` | **vide** | 0 | 0 | aucune |  | aucun chunk en base |
| 38 | `jacobs-english-fairy-tales` | **vide** | 0 | 0 | évincée iCloud |  | aucun chunk en base |
| 39 | `johnson-he` | **vide** | 0 | 0 | évincée iCloud |  | aucun chunk en base |
| 40 | `karkkainen-panarchy-adaptive-change` | **vide** | 0 | 0 | évincée iCloud |  | aucun chunk en base |
| 41 | `lakoff-johnson-metaphors-we-live-by` | **vide** | 0 | 0 | évincée iCloud |  | aucun chunk en base |
| 42 | `lorde-uses-of-the-erotic` | **vide** | 0 | 0 | évincée iCloud |  | aucun chunk en base |
| 43 | `macfarlane-underland` | **vide** | 0 | 0 | aucune |  | aucun chunk en base |
| 44 | `martin-untrue` | **vide** | 0 | 0 | évincée iCloud |  | aucun chunk en base |
| 45 | `mayne-bataille-erotisme-ecriture` | **vide** | 0 | 0 | évincée iCloud |  | aucun chunk en base |
| 46 | `mazzucato-entrepreneurial-state` | **vide** | 0 | 0 | évincée iCloud |  | aucun chunk en base |
| 47 | `mckenna-archaic-revival` | **vide** | 0 | 0 | évincée iCloud |  | aucun chunk en base |
| 48 | `moreton-robinson-critical-indigenous-studies` | **vide** | 0 | 0 | évincée iCloud |  | aucun chunk en base |
| 49 | `moss-sidewalk-oracles` | **vide** | 0 | 0 | aucune | 🌙 | aucun chunk en base |
| 50 | `nettlau-panarchy` | **vide** | 0 | 0 | aucune |  | aucun chunk en base |
| 51 | `ngugi-decolonising-the-mind` | **vide** | 0 | 0 | évincée iCloud |  | aucun chunk en base |
| 52 | `niego-fungi-global-economy` | **vide** | 0 | 0 | aucune |  | aucun chunk en base |
| 53 | `odier-lillusionniste` | **vide** | 0 | 0 | évincée iCloud |  | aucun chunk en base |
| 54 | `ovide-metamorphoses` | **vide** | 0 | 0 | aucune |  | aucun chunk en base |
| 55 | `seth-nature-of-the-psyche` | **vide** | 0 | 0 | évincée iCloud | 🌙 | aucun chunk en base |
| 56 | `simpson-as-we-have-always-done` | **vide** | 0 | 0 | évincée iCloud |  | aucun chunk en base |
| 57 | `tanizaki-praise-shadows` | **vide** | 0 | 0 | évincée iCloud |  | aucun chunk en base |
| 58 | `wangyal-tibetan-yogas` | **vide** | 0 | 0 | évincée iCloud | 🌙 | aucun chunk en base |
| 59 | `abram-becoming-animal` | **sain** | 303 | 140641 | évincée iCloud | 🌙 |  |
| 60 | `abram-spell-of-the-sensuous` | **sain** | 319 | 163595 | évincée iCloud | 🌙 |  |
| 61 | `afanassiev-contes-populaires-russes` | **sain** | 251 | 121468 | évincée iCloud |  |  |
| 62 | `aizenstat-dream-tending` | **sain** | 9 | 3709 | évincée iCloud | 🌙 |  |
| 63 | `akomolafe-these-wilds-beyond-our-fences` | **sain** | 331 | 140763 | évincée iCloud |  |  |
| 64 | `alexander-luminous-ground` | **sain** | 25 | 4145 | évincée iCloud |  |  |
| 65 | `alexander-nature-of-order` | **sain** | 563 | 256908 | évincée iCloud |  |  |
| 66 | `alexander-new-theory-urban-design` | **sain** | 7 | 21 | évincée iCloud |  |  |
| 67 | `alexander-pattern-language` | **sain** | 665 | 262649 | évincée iCloud |  |  |
| 68 | `alton-painting-with-light` | **sain** | 211 | 98637 | évincée iCloud |  |  |
| 69 | `anand-art-sexual-ecstasy` | **sain** | 383 | 163914 | lisible |  |  |
| 70 | `andersen-contes-merveilleux-1` | **sain** | 229 | 98152 | évincée iCloud |  |  |
| 71 | `arvigo-sastun` | **sain** | 179 | 85156 | évincée iCloud |  |  |
| 72 | `attached-levine-heller` | **sain** | 234 | 93454 | évincée iCloud | 🌙 |  |
| 73 | `attar-conference-des-oiseaux` | **sain** | 217 | 76979 | évincée iCloud |  |  |
| 74 | `bach-flower-remedies` | **sain** | 39 | 14273 | évincée iCloud |  |  |
| 75 | `bachelard-earth-reveries-repose` | **sain** | 360 | 170619 | évincée iCloud |  |  |
| 76 | `bachelard-eau-et-les-reves` | **sain** | 209 | 95951 | évincée iCloud | 🌙 |  |
| 77 | `bachelard-poetics-space` | **sain** | 258 | 99274 | lisible | 🌙 |  |
| 78 | `bachelard-poetique-reverie` | **sain** | 180 | 89755 | évincée iCloud |  |  |
| 79 | `badenoch-heart-of-trauma` | **sain** | 340 | 144565 | évincée iCloud |  |  |
| 80 | `barad-meeting-universe-halfway` | **sain** | 609 | 245744 | évincée iCloud |  |  |
| 81 | `barker-entangled-life-organism` | **sain** | 384 | 168618 | évincée iCloud |  |  |
| 82 | `barthes-fragments-discours-amoureux` | **sain** | 149 | 58267 | évincée iCloud |  |  |
| 83 | `bartlett-real-alchemy` | **sain** | 109 | 52689 | évincée iCloud |  |  |
| 84 | `bateson-mind-and-nature` | **sain** | 204 | 96778 | évincée iCloud |  |  |
| 85 | `beak-red-hot-and-holy` | **sain** | 239 | 97539 | lisible |  |  |
| 86 | `beck-spiral-dynamics` | **sain** | 365 | 148028 | évincée iCloud |  |  |
| 87 | `beer-brain-of-the-firm` | **sain** | 438 | 201996 | évincée iCloud |  |  |
| 88 | `beer-designing-freedom` | **sain** | 69 | 31248 | évincée iCloud |  |  |
| 89 | `belonging-toko-pau` | **sain** | 225 | 111147 | évincée iCloud |  |  |
| 90 | `benkler-wealth-of-networks` | **sain** | 561 | 231138 | évincée iCloud |  |  |
| 91 | `bennett-gift-of-healing-herbs` | **sain** | 521 | 221433 | évincée iCloud |  |  |
| 92 | `benton-banai-mishomis-book` | **sain** | 98 | 49056 | évincée iCloud |  |  |
| 93 | `benyus-biomimicry` | **sain** | 308 | 152543 | évincée iCloud |  |  |
| 94 | `berger-ways-of-seeing` | **sain** | 77 | 29217 | évincée iCloud |  |  |
| 95 | `beyer-singing-to-the-plants` | **sain** | 557 | 234237 | aucune |  |  |
| 96 | `black-elk-speaks` | **sain** | 228 | 172679 | évincée iCloud |  |  |
| 97 | `blackie-if-women-rose-rooted` | **sain** | 361 | 167678 | évincée iCloud |  |  |
| 98 | `bohm-wholeness-and-the-implicate-order` | **sain** | 282 | 106082 | évincée iCloud |  |  |
| 99 | `bolen-goddesses-in-everywoman` | **sain** | 330 | 127996 | évincée iCloud |  |  |
| 100 | `boyd-its-complicated` | **sain** | 278 | 116525 | évincée iCloud |  |  |
| 101 | `brand-how-buildings-learn` | **sain** | 348 | 136024 | évincée iCloud |  |  |
| 102 | `breindl-hildegarde-bingen-vie-oeuvre-art-guerir` | **sain** | 236 | 104988 | évincée iCloud |  |  |
| 103 | `bresson-notes-cinematograph` | **sain** | 29 | 15884 | évincée iCloud |  |  |
| 104 | `brown-daring-greatly` | **sain** | 194 | 81849 | lisible |  |  |
| 105 | `brown-emergent-strategy` | **sain** | 202 | 80505 | évincée iCloud |  |  |
| 106 | `brown-holding-change` | **sain** | 154 | 57668 | évincée iCloud |  |  |
| 107 | `brown-pleasure-activism` | **sain** | 330 | 145746 | évincée iCloud |  |  |
| 108 | `brown-undoing-the-demos` | **sain** | 280 | 109443 | évincée iCloud |  |  |
| 109 | `brownell-matter-floating-world` | **sain** | 206 | 90638 | évincée iCloud |  |  |
| 110 | `buhner-plant-intelligence-imaginal-realm` | **sain** | 537 | 230926 | évincée iCloud | 🌙 |  |
| 111 | `bulkeley-big-dreams` | **sain** | 317 | 140177 | évincée iCloud | 🌙 |  |
| 112 | `bulkeley-intro-psychology-dreaming` | **sain** | 165 | 73567 | évincée iCloud | 🌙 |  |
| 113 | `bunnell-human-design-definitive` | **sain** | 505 | 208077 | évincée iCloud |  |  |
| 114 | `burckhardt-alchemy-cosmos-soul` | **sain** | 151 | 67863 | évincée iCloud |  |  |
| 115 | `burlingham-small-giants` | **sain** | 247 | 114015 | évincée iCloud |  |  |
| 116 | `cajete-native-science` | **sain** | 281 | 126254 | évincée iCloud |  |  |
| 117 | `calvino-fiabe-italiane` | **sain** | 327 | 143330 | évincée iCloud |  |  |
| 118 | `campbell-hero-thousand-faces` | **sain** | 401 | 173436 | évincée iCloud |  |  |
| 119 | `campbell-the-power-of-myth` | **sain** | 297 | 112170 | évincée iCloud |  |  |
| 120 | `capra-tao-of-physics` | **sain** | 262 | 102213 | évincée iCloud |  |  |
| 121 | `capra-web-of-life` | **sain** | 315 | 130099 | évincée iCloud |  |  |
| 122 | `carse-finite-infinite-games` | **sain** | 113 | 41405 | évincée iCloud |  |  |
| 123 | `carse-religious-case-against-belief` | **sain** | 218 | 84223 | évincée iCloud |  |  |
| 124 | `carson-eros-bittersweet` | **sain** | 159 | 64424 | évincée iCloud |  |  |
| 125 | `chao-kirksey-multispecies-justice` | **sain** | 283 | 122934 | évincée iCloud |  |  |
| 126 | `chatwin-the-songlines` | **sain** | 271 | 112715 | évincée iCloud |  |  |
| 127 | `chekhov-to-the-actor` | **sain** | 185 | 67646 | lisible |  |  |
| 128 | `chodron-when-things-fall-apart` | **sain** | 138 | 56630 | évincée iCloud |  |  |
| 129 | `chouinard-let-my-people-go-surfing` | **sain** | 183 | 73580 | lisible |  |  |
| 130 | `cialdini-influence` | **sain** | 272 | 123112 | évincée iCloud |  |  |
| 131 | `corbin-alone-with-alone` | **sain** | 406 | 182016 | évincée iCloud | 🌙 |  |
| 132 | `cosens-practical-panarchy-water-governance` | **sain** | 408 | 154690 | évincée iCloud |  |  |
| 133 | `coyle-culture-code` | **sain** | 165 | 69133 | lisible |  |  |
| 134 | `crawford-atlas-of-ai` | **sain** | 292 | 109326 | évincée iCloud |  |  |
| 135 | `cumes-africa-in-my-bones` | **sain** | 126 | 62033 | évincée iCloud |  |  |
| 136 | `cunningfolk-apothecary-of-belonging` | **sain** | 193 | 89208 | évincée iCloud |  |  |
| 137 | `damasio-feeling-of-what-happens` | **sain** | 402 | 80768 | lisible |  |  |
| 138 | `dana-anchored` | **sain** | 150 | 67966 | évincée iCloud |  |  |
| 139 | `davis-wayfinders` | **sain** | 256 | 95126 | évincée iCloud |  |  |
| 140 | `debus-chemical-philosophy` | **sain** | 262 | 124749 | évincée iCloud |  |  |
| 141 | `defouw-svoboda-light-on-life` | **sain** | 401 | 168392 | évincée iCloud |  |  |
| 142 | `dekoven-well-played-game` | **sain** | 162 | 69815 | évincée iCloud |  |  |
| 143 | `delaney-all-about-dreams` | **sain** | 305 | 140180 | évincée iCloud | 🌙 |  |
| 144 | `delaney-living-your-dreams` | **sain** | 357 | 271175 | évincée iCloud | 🌙 |  |
| 145 | `deloria-god-is-red` | **sain** | 315 | 130568 | évincée iCloud |  |  |
| 146 | `dethlefsen-dahlke-healing-power-illness` | **sain** | 278 | 137444 | évincée iCloud |  |  |
| 147 | `deutscher-through-the-language-glass` | **sain** | 268 | 128747 | évincée iCloud |  |  |
| 148 | `dowman-divine-madman-drukpa-kunley` | **sain** | 168 | 68598 | évincée iCloud |  |  |
| 149 | `easley-horne-modern-herbal-dispensatory` | **sain** | 267 | 97102 | évincée iCloud |  |  |
| 150 | `easton-hardy-radical-ecstasy` | **sain** | 154 | 74193 | évincée iCloud |  |  |
| 151 | `eisenstein-more-beautiful-world` | **sain** | 247 | 115400 | évincée iCloud |  |  |
| 152 | `eliade-cosmos-and-history` | **sain** | 171 | 74207 | évincée iCloud |  |  |
| 153 | `eliade-images-and-symbols` | **sain** | 176 | 70221 | lisible |  |  |
| 154 | `eliade-myths-dreams-mysteries` | **sain** | 245 | 113100 | évincée iCloud | 🌙 |  |
| 155 | `eliade-occultism-witchcraft-cultural-fashions` | **sain** | 152 | 66063 | évincée iCloud |  |  |
| 156 | `eliade-sacred-and-profane` | **sain** | 211 | 67587 | évincée iCloud |  |  |
| 157 | `eliade-shamanism` | **sain** | 625 | 282546 | évincée iCloud |  |  |
| 158 | `eliade-tales-sacred-supernatural` | **sain** | 98 | 43383 | évincée iCloud |  |  |
| 159 | `elkin-aboriginal-men-high-degree` | **sain** | 201 | 84566 | évincée iCloud | 🌙 |  |
| 160 | `elliott-existential-kink` | **sain** | 180 | 72688 | évincée iCloud |  |  |
| 161 | `escobar-designs-pluriverse` | **sain** | 357 | 167640 | évincée iCloud |  |  |
| 162 | `estes-women-who-run-with-the-wolves` | **sain** | 543 | 254812 | évincée iCloud | 🌙 |  |
| 163 | `everett-dont-sleep-snakes` | **sain** | 272 | 130711 | évincée iCloud |  |  |
| 164 | `eyal-hooked` | **sain** | 123 | 49891 | évincée iCloud |  |  |
| 165 | `fern-cooley-polywise` | **sain** | 278 | 112653 | évincée iCloud |  |  |
| 166 | `fern-polysecure` | **sain** | 249 | 89138 | évincée iCloud |  |  |
| 167 | `food-of-the-gods` | **sain** | 226 | 102201 | évincée iCloud |  |  |
| 168 | `fox-keller-feeling-for-the-organism` | **sain** | 217 | 96687 | évincée iCloud |  |  |
| 169 | `frankl-mans-search-for-meaning` | **sain** | 116 | 55141 | évincée iCloud |  |  |
| 170 | `frawley-lad-yoga-of-herbs` | **sain** | 191 | 66182 | aucune |  |  |
| 171 | `frichot-architecture-feminisms` | **sain** | 394 | 162455 | évincée iCloud |  |  |
| 172 | `fulcanelli-mystere-cathedrales` | **sain** | 158 | 75906 | évincée iCloud |  |  |
| 173 | `gagliano-thus-spoke-the-plant` | **sain** | 150 | 68416 | évincée iCloud |  |  |
| 174 | `gendlin-focusing` | **sain** | 185 | 64337 | lisible | 🌙 |  |
| 175 | `gendlin-let-body-interpret-dreams` | **sain** | 192 | 70859 | évincée iCloud | 🌙 |  |
| 176 | `gilbert-big-magic` | **sain** | 132 | 60159 | évincée iCloud |  |  |
| 177 | `gladstar-medicinal-herbs-beginners-guide` | **sain** | 170 | 77232 | évincée iCloud |  |  |
| 178 | `godin-the-practice` | **sain** | 138 | 52009 | évincée iCloud |  |  |
| 179 | `godin-this-is-marketing` | **sain** | 172 | 63546 | évincée iCloud |  |  |
| 180 | `gougaud-abecedaire-amoureux` | **sain** | 60 | 30122 | évincée iCloud |  |  |
| 181 | `gougaud-arbre-a-soleils` | **sain** | 332 | 131651 | évincée iCloud | 🌙 |  |
| 182 | `gougaud-arbre-aux-tresors` | **sain** | 323 | 133226 | évincée iCloud |  |  |
| 183 | `gougaud-bible-hibou` | **sain** | 214 | 88489 | évincée iCloud |  |  |
| 184 | `gougaud-contes-asie` | **sain** | 60 | 29473 | évincée iCloud |  |  |
| 185 | `gougaud-contes-pacifique` | **sain** | 37 | 15037 | évincée iCloud |  |  |
| 186 | `gougaud-rire-de-lange` | **sain** | 246 | 96136 | évincée iCloud |  |  |
| 187 | `gougaud-sept-plumes-aigle` | **sain** | 215 | 88790 | évincée iCloud |  |  |
| 188 | `graeber-debt` | **sain** | 635 | 312005 | évincée iCloud |  |  |
| 189 | `graves-the-white-goddess` | **sain** | 577 | 262991 | évincée iCloud |  |  |
| 190 | `green-herbal-medicine-makers-handbook` | **sain** | 422 | 159658 | évincée iCloud |  |  |
| 191 | `griesinger-eaton-gift-of-story` | **sain** | 391 | 173491 | évincée iCloud |  |  |
| 192 | `grimm-more-tales-gag` | **sain** | 117 | 55024 | évincée iCloud |  |  |
| 193 | `gunderson-holling-panarchy` | **sain** | 586 | 246876 | évincée iCloud |  |  |
| 194 | `hall-plants-as-persons` | **sain** | 248 | 99195 | évincée iCloud |  |  |
| 195 | `han-psychopolitics` | **sain** | 71 | 26381 | évincée iCloud |  |  |
| 196 | `haraway-staying-with-the-trouble` | **sain** | 345 | 141666 | évincée iCloud |  |  |
| 197 | `harpur-philosophers-secret-fire` | **sain** | 249 | 115861 | évincée iCloud |  |  |
| 198 | `harrington-sacred-kink` | **sain** | 200 | 91789 | évincée iCloud |  |  |
| 199 | `harrison-when-languages-die` | **sain** | 271 | 119888 | évincée iCloud |  |  |
| 200 | `hesiode-theogonie-travaux-bouclier` | **sain** | 254 | 106431 | évincée iCloud |  |  |
| 201 | `hildegarde-causes-remedes` | **sain** | 291 | 163011 | évincée iCloud |  |  |
| 202 | `hill-dream-work-therapy` | **sain** | 382 | 135008 | évincée iCloud | 🌙 |  |
| 203 | `hillman-archetypal-psychology` | **sain** | 166 | 53324 | évincée iCloud | 🌙 |  |
| 204 | `hillman-dream-and-the-underworld` | **sain** | 237 | 91802 | lisible | 🌙 |  |
| 205 | `hillman-re-visioning-psychology` | **sain** | 312 | 141123 | évincée iCloud | 🌙 |  |
| 206 | `hinton-tao-te-ching` | **sain** | 42 | 23467 | évincée iCloud |  |  |
| 207 | `hobbs-medicinal-mushrooms` | **sain** | 218 | 111271 | aucune |  |  |
| 208 | `hooks-all-about-love` | **sain** | 157 | 61619 | évincée iCloud |  |  |
| 209 | `hopkins-from-what-is-to-what-if` | **sain** | 231 | 105386 | évincée iCloud |  |  |
| 210 | `hui-art-cosmotechnics` | **sain** | 298 | 133222 | évincée iCloud |  |  |
| 211 | `hunt-multiplicity-of-dreams` | **sain** | 322 | 135923 | évincée iCloud | 🌙 |  |
| 212 | `hunter-light-science-magic` | **sain** | 213 | 91796 | évincée iCloud |  |  |
| 213 | `illich-tools-for-conviviality` | **sain** | 125 | 49111 | évincée iCloud |  |  |
| 214 | `ingold-perception-of-environment` | **sain** | 798 | 345083 | évincée iCloud |  |  |
| 215 | `jacobs-celtic-fairy-tales` | **sain** | 313 | 167491 | évincée iCloud |  |  |
| 216 | `jarvis-company-of-one` | **sain** | 182 | 80211 | lisible |  |  |
| 217 | `jenkinson-die-wise` | **sain** | 348 | 168257 | évincée iCloud |  |  |
| 218 | `jiwa-story-driven` | **sain** | 102 | 34781 | lisible |  |  |
| 219 | `jodorowsky-psychomagie` | **sain** | 323 | 122913 | évincée iCloud |  |  |
| 220 | `johnson-she` | **sain** | 61 | 21230 | lisible |  |  |
| 221 | `jung-archetypes-collective-unconscious` | **sain** | 423 | 219927 | lisible | 🌙 |  |
| 222 | `jung-man-and-his-symbols` | **sain** | 361 | 173582 | évincée iCloud | 🌙 |  |
| 223 | `jung-memories-dreams-reflections` | **sain** | 423 | 201315 | évincée iCloud | 🌙 |  |
| 224 | `jung-red-book` | **sain** | 469 | 205677 | évincée iCloud | 🌙 |  |
| 225 | `junger-tribe` | **sain** | 110 | 43752 | évincée iCloud |  |  |
| 226 | `junius-spagyrics` | **sain** | 241 | 163994 | évincée iCloud |  |  |
| 227 | `kalsched-inner-world-trauma` | **sain** | 299 | 132517 | évincée iCloud | 🌙 |  |
| 228 | `kaplan-williams-jungian-senoi` | **sain** | 307 | 133044 | lisible | 🌙 |  |
| 229 | `kenworthy-master-shots-vol1` | **sain** | 105 | 38694 | évincée iCloud |  |  |
| 230 | `kimmerer-braiding-sweetgrass` | **sain** | 359 | 162345 | évincée iCloud |  |  |
| 231 | `kimmerer-gathering-moss` | **sain** | 161 | 76691 | évincée iCloud | 🌙 |  |
| 232 | `kohn-forest-forms-ethical-life` | **sain** | 26 | 10645 | évincée iCloud | 🌙 |  |
| 233 | `kolk-body-keeps-score` | **sain** | 478 | 189688 | évincée iCloud |  |  |
| 234 | `laberge-a-course-in-lucid-dreaming` | **sain** | 83 | 40226 | évincée iCloud | 🌙 |  |
| 235 | `lame-deer-seeker-of-visions` | **sain** | 268 | 126581 | évincée iCloud |  |  |
| 236 | `landemore-open-democracy` | **sain** | 341 | 149709 | évincée iCloud |  |  |
| 237 | `lanier-ten-arguments` | **sain** | 126 | 43068 | évincée iCloud |  |  |
| 238 | `larsen-mythic-imagination` | **sain** | 371 | 140136 | lisible | 🌙 |  |
| 239 | `lawlor-voices-first-day` | **sain** | 426 | 190518 | évincée iCloud | 🌙 |  |
| 240 | `lee-evans-indigenous-womens-voices` | **sain** | 279 | 151273 | évincée iCloud |  |  |
| 241 | `levin-computational-boundary-self` | **sain** | 70 | 28666 | évincée iCloud |  |  |
| 242 | `levine-unspoken-voice` | **sain** | 354 | 194635 | évincée iCloud | 🌙 |  |
| 243 | `levine-waking-the-tiger` | **sain** | 238 | 81289 | lisible | 🌙 |  |
| 244 | `levy-collective-intelligence` | **sain** | 256 | 99954 | évincée iCloud |  |  |
| 245 | `lorca-in-search-of-duende` | **sain** | 71 | 30065 | évincée iCloud |  |  |
| 246 | `lytle-gentle-subversive` | **sain** | 254 | 85839 | évincée iCloud |  |  |
| 247 | `maathai-unbowed` | **sain** | 313 | 140134 | évincée iCloud |  |  |
| 248 | `machado-hospicing-modernity` | **sain** | 278 | 124910 | évincée iCloud |  |  |
| 249 | `mackendrick-on-filmmaking` | **sain** | 62 | 29531 | évincée iCloud |  |  |
| 250 | `magana-dawn-sixth-sun` | **sain** | 147 | 62817 | évincée iCloud |  |  |
| 251 | `mahfouz-akhenaten-dweller-in-truth` | **sain** | 137 | 51435 | évincée iCloud |  |  |
| 252 | `margulis-symbiotic-planet` | **sain** | 131 | 52007 | évincée iCloud |  |  |
| 253 | `martel-grand-dictionnaire-malaises` | **sain** | 834 | 408923 | évincée iCloud | 🌙 |  |
| 254 | `mate-hungry-ghosts` | **sain** | 463 | 170029 | évincée iCloud |  |  |
| 255 | `mate-myth-of-normal` | **sain** | 447 | 184469 | évincée iCloud |  |  |
| 256 | `mazzucato-mission-economy` | **sain** | 190 | 75678 | évincée iCloud |  |  |
| 257 | `mcgilchrist-master-emissary` | **sain** | 755 | 341372 | évincée iCloud | 🌙 |  |
| 258 | `mcgonigal-reality-is-broken` | **sain** | 381 | 162318 | évincée iCloud |  |  |
| 259 | `mckenna-invisible-landscape` | **sain** | 208 | 88749 | évincée iCloud |  |  |
| 260 | `mckenna-true-hallucinations` | **sain** | 219 | 97645 | lisible |  |  |
| 261 | `mclaren-art-of-empathy` | **sain** | 333 | 133860 | évincée iCloud |  |  |
| 262 | `mclaren-embracing-anxiety` | **sain** | 163 | 69258 | lisible |  |  |
| 263 | `meade-genius-myth` | **sain** | 237 | 108316 | évincée iCloud |  |  |
| 264 | `meadows-leverage-points` | **sain** | 25 | 10652 | évincée iCloud |  |  |
| 265 | `meadows-thinking-in-systems` | **sain** | 194 | 88945 | évincée iCloud |  |  |
| 266 | `melchizedek-flower-of-life-vol2` | **sain** | 290 | 140371 | évincée iCloud |  |  |
| 267 | `menakem-my-grandmothers-hands` | **sain** | 278 | 101611 | évincée iCloud |  |  |
| 268 | `mercado-filmmakers-eye` | **sain** | 178 | 80052 | évincée iCloud |  |  |
| 269 | `merleau-ponty-visible-invisible` | **sain** | 340 | 148987 | évincée iCloud |  |  |
| 270 | `miller-drama-of-the-gifted-child` | **sain** | 91 | 39769 | lisible |  |  |
| 271 | `mindell-dreambody` | **sain** | 199 | 147067 | évincée iCloud | 🌙 |  |
| 272 | `mindell-working-dreaming-body` | **sain** | 105 | 44460 | évincée iCloud | 🌙 |  |
| 273 | `mishra-bhavishya-malika-puran` | **sain** | 60 | 28365 | évincée iCloud |  |  |
| 274 | `moore-care-of-the-soul` | **sain** | 301 | 131689 | évincée iCloud |  |  |
| 275 | `morozov-to-save-everything` | **sain** | 440 | 180967 | évincée iCloud |  |  |
| 276 | `moss-boy-who-died-came-back` | **sain** | 284 | 121477 | évincée iCloud | 🌙 |  |
| 277 | `moss-dreamgates` | **sain** | 370 | 157669 | évincée iCloud | 🌙 |  |
| 278 | `moss-dreaming-soul-back-home` | **sain** | 213 | 105521 | évincée iCloud | 🌙 |  |
| 279 | `moss-dreamways-of-the-iroquois` | **sain** | 260 | 128261 | évincée iCloud | 🌙 |  |
| 280 | `moss-growing-big-dreams` | **sain** | 253 | 123488 | évincée iCloud | 🌙 |  |
| 281 | `moss-mysterious-realities` | **sain** | 212 | 92455 | évincée iCloud | 🌙 |  |
| 282 | `moss-secret-history-dreaming` | **sain** | 357 | 164141 | lisible | 🌙 |  |
| 283 | `moss-three-only-things` | **sain** | 230 | 96859 | évincée iCloud | 🌙 |  |
| 284 | `murch-in-the-blink-of-an-eye` | **sain** | 84 | 38770 | lisible | 🌙 |  |
| 285 | `murdock-heroines-journey-workbook` | **sain** | 138 | 66462 | évincée iCloud | 🌙 |  |
| 286 | `mutwa-indaba-my-children` | **sain** | 476 | 232239 | évincée iCloud |  |  |
| 287 | `naval-almanack` | **sain** | 153 | 56747 | évincée iCloud |  |  |
| 288 | `neale-kelly-songlines` | **sain** | 146 | 64826 | évincée iCloud | 🌙 |  |
| 289 | `nettlau-anarchy-is-order` | **sain** | 12 | 4736 | évincée iCloud |  |  |
| 290 | `neumeier-brand-gap` | **sain** | 68 | 25447 | évincée iCloud |  |  |
| 291 | `ngubane-body-mind-zulu-medicine` | **sain** | 187 | 90012 | évincée iCloud |  |  |
| 292 | `nguyen-games-agency-as-art` | **sain** | 264 | 122575 | évincée iCloud |  |  |
| 293 | `nhat-hanh-heart-of-buddha` | **sain** | 254 | 109669 | évincée iCloud |  |  |
| 294 | `odier-desirs-passions-spiritualite` | **sain** | 144 | 53886 | évincée iCloud |  |  |
| 295 | `odier-incendie-du-coeur` | **sain** | 121 | 45051 | évincée iCloud |  |  |
| 296 | `odier-sept-secondes-arc-en-ciel` | **sain** | 228 | 84409 | évincée iCloud |  |  |
| 297 | `odier-tantra-yoga` | **sain** | 97 | 33102 | évincée iCloud | 🌙 |  |
| 298 | `odier-tantric-quest` | **sain** | 151 | 54737 | lisible | 🌙 |  |
| 299 | `odoul-dis-moi-ou-tu-as-mal` | **sain** | 165 | 41918 | évincée iCloud | 🌙 |  |
| 300 | `ogden-sensorimotor-psychotherapy` | **sain** | 651 | 263631 | évincée iCloud |  |  |
| 301 | `ostrom-understanding-institutional-diversity` | **sain** | 401 | 164935 | évincée iCloud |  |  |
| 302 | `pallasmaa-eyes-skin` | **sain** | 97 | 42599 | évincée iCloud |  |  |
| 303 | `paracelsus-essential-readings` | **sain** | 174 | 78736 | évincée iCloud |  |  |
| 304 | `parker-art-of-gathering` | **sain** | 213 | 90919 | évincée iCloud |  |  |
| 305 | `paz-double-flame` | **sain** | 184 | 70526 | évincée iCloud |  |  |
| 306 | `pelton-trickster-west-africa` | **sain** | 308 | 132632 | évincée iCloud |  |  |
| 307 | `pendell-pharmako-dynamis` | **sain** | 293 | 131015 | évincée iCloud |  |  |
| 308 | `pendell-pharmako-gnosis` | **sain** | 331 | 153591 | évincée iCloud |  |  |
| 309 | `pendell-pharmako-poeia` | **sain** | 224 | 94461 | évincée iCloud |  |  |
| 310 | `perel-mating-in-captivity` | **sain** | 200 | 86809 | évincée iCloud |  |  |
| 311 | `perkins-world-as-you-dream-it` | **sain** | 156 | 76453 | évincée iCloud | 🌙 |  |
| 312 | `perrault-contes-mere-oye` | **sain** | 136 | 56468 | évincée iCloud |  |  |
| 313 | `peterson-understanding-exposure` | **sain** | 107 | 51571 | évincée iCloud |  |  |
| 314 | `pierre-gayet-bible-herboristerie` | **sain** | 410 | 168772 | évincée iCloud |  |  |
| 315 | `plato-symposium` | **sain** | 112 | 45188 | évincée iCloud |  |  |
| 316 | `plotkin-soulcraft` | **sain** | 359 | 172924 | évincée iCloud | 🌙 |  |
| 317 | `plotkin-tales-shamans-apprentice` | **sain** | 328 | 145208 | évincée iCloud |  |  |
| 318 | `polanyi-grande-transformation` | **sain** | 430 | 190431 | évincée iCloud |  |  |
| 319 | `pourrat-tresor-contes` | **sain** | 230 | 99163 | évincée iCloud |  |  |
| 320 | `powers-the-overstory` | **sain** | 595 | 219157 | évincée iCloud |  |  |
| 321 | `prechtel-secrets-talking-jaguar` | **sain** | 272 | 130305 | lisible |  |  |
| 322 | `prechtel-smell-rain-dust` | **sain** | 107 | 46660 | lisible |  |  |
| 323 | `ratsch-encyclopedia-aphrodisiacs` | **sain** | 1355 | 629710 | évincée iCloud |  |  |
| 324 | `ratsch-encyclopedia-psychoactive-plants` | **sain** | 1835 | 838472 | évincée iCloud |  |  |
| 325 | `raworth-doughnut-economics` | **sain** | 321 | 124508 | évincée iCloud |  |  |
| 326 | `ries-lean-startup` | **sain** | 211 | 92148 | évincée iCloud |  |  |
| 327 | `rilke-lettres-jeune-poete` | **sain** | 133 | 53261 | évincée iCloud |  |  |
| 328 | `roberts-oversoul-seven` | **sain** | 622 | 235224 | évincée iCloud | 🌙 |  |
| 329 | `roberts-seth-early-sessions-4` | **sain** | 346 | 164136 | lisible | 🌙 |  |
| 330 | `rosenberg-nonviolent-communication` | **sain** | 209 | 75332 | évincée iCloud |  |  |
| 331 | `rovelli-order-of-time` | **sain** | 119 | 48971 | lisible |  |  |
| 332 | `rudd-human-design-revelation` | **sain** | 194 | 78646 | évincée iCloud |  |  |
| 333 | `rudd-venus-sequence` | **sain** | 182 | 78341 | évincée iCloud |  |  |
| 334 | `sahlins-stone-age-economics` | **sain** | 83 | 37904 | évincée iCloud |  |  |
| 335 | `said-orientalism` | **sain** | 453 | 205354 | évincée iCloud |  |  |
| 336 | `salaman-way-of-hermes` | **sain** | 107 | 49840 | évincée iCloud |  |  |
| 337 | `schafer-new-soundscape` | **sain** | 55 | 24133 | évincée iCloud |  |  |
| 338 | `scharmer-theory-u` | **sain** | 477 | 214902 | évincée iCloud |  |  |
| 339 | `scholz-own-this` | **sain** | 206 | 81535 | évincée iCloud |  |  |
| 340 | `scholz-platform-cooperativism` | **sain** | 57 | 44230 | évincée iCloud |  |  |
| 341 | `scholz-schneider-ours-to-hack` | **sain** | 208 | 73846 | évincée iCloud |  |  |
| 342 | `schultes-hofmann-plants-of-the-gods` | **sain** | 268 | 104921 | évincée iCloud |  |  |
| 343 | `schwartz-no-bad-parts` | **sain** | 158 | 73080 | évincée iCloud |  |  |
| 344 | `schwartz-you-are-the-one` | **sain** | 212 | 73987 | évincée iCloud |  |  |
| 345 | `scott-seeing-like-state` | **sain** | 540 | 238269 | évincée iCloud |  |  |
| 346 | `seeley-honeybee-democracy` | **sain** | 250 | 112794 | évincée iCloud |  |  |
| 347 | `sennett-craftsman` | **sain** | 318 | 129657 | évincée iCloud |  |  |
| 348 | `seth-dreams-evolution-value-fulfillment` | **sain** | 271 | 177480 | évincée iCloud | 🌙 |  |
| 349 | `seth-individual-mass-events` | **sain** | 297 | 135572 | lisible | 🌙 |  |
| 350 | `seth-magical-approach` | **sain** | 139 | 67526 | lisible | 🌙 |  |
| 351 | `seth-nature-personal-reality` | **sain** | 447 | 196744 | lisible | 🌙 |  |
| 352 | `shaw-passionate-enlightenment` | **sain** | 321 | 135307 | lisible |  |  |
| 353 | `shaw-smoke-hole` | **sain** | 112 | 42715 | évincée iCloud |  |  |
| 354 | `sheldrake-entangled-life` | **sain** | 345 | 134626 | évincée iCloud |  |  |
| 355 | `sheldrake-mckenna-abraham-chaos-creativity` | **sain** | 178 | 76433 | évincée iCloud | 🌙 |  |
| 356 | `sheldrake-presence-of-the-past` | **sain** | 388 | 160772 | lisible |  |  |
| 357 | `sheldrake-sense-being-stared-at` | **sain** | 357 | 155865 | lisible | 🌙 |  |
| 358 | `shirky-here-comes-everybody` | **sain** | 306 | 115988 | évincée iCloud |  |  |
| 359 | `shiva-monocultures-of-the-mind` | **sain** | 166 | 63102 | évincée iCloud |  |  |
| 360 | `sinek-start-with-why` | **sain** | 231 | 108387 | évincée iCloud |  |  |
| 361 | `smith-decolonizing-methodologies` | **sain** | 290 | 128735 | évincée iCloud |  |  |
| 362 | `sobiecki-southern-african-psychoactive-plants` | **sain** | 133 | 48551 | aucune |  |  |
| 363 | `solnit-paradise-built-in-hell` | **sain** | 331 | 157106 | évincée iCloud |  |  |
| 364 | `some-of-water-and-spirit` | **sain** | 334 | 148862 | évincée iCloud |  |  |
| 365 | `stanislavski-an-actor-prepares` | **sain** | 323 | 112926 | évincée iCloud |  |  |
| 366 | `storl-herbal-lore-wise-women` | **sain** | 277 | 114733 | évincée iCloud |  |  |
| 367 | `storybrand-building-a-storybrand` | **sain** | 148 | 56438 | évincée iCloud |  |  |
| 368 | `strand-madonna-secret` | **sain** | 574 | 239778 | évincée iCloud |  |  |
| 369 | `strand-the-body-is-a-doorway` | **sain** | 219 | 99756 | évincée iCloud |  |  |
| 370 | `strand-the-flowering-wand` | **sain** | 161 | 62377 | évincée iCloud |  |  |
| 371 | `strehlow-prevention-cancer-hildegarde` | **sain** | 187 | 61930 | évincée iCloud |  |  |
| 372 | `strehlow-rhumatisme-goutte-hildegarde` | **sain** | 206 | 71046 | évincée iCloud |  |  |
| 373 | `sveiby-treading-lightly` | **sain** | 267 | 112382 | évincée iCloud | 🌙 |  |
| 374 | `sweezy-ifs-shame-guilt` | **sain** | 284 | 125401 | évincée iCloud |  |  |
| 375 | `talbot-holographic-universe` | **sain** | 329 | 139459 | évincée iCloud |  |  |
| 376 | `taleb-antifragile` | **sain** | 504 | 197767 | évincée iCloud |  |  |
| 377 | `tarkovsky-sculpting-in-time` | **sain** | 195 | 96382 | évincée iCloud |  |  |
| 378 | `taylor-where-people-fly` | **sain** | 284 | 113099 | lisible | 🌙 |  |
| 379 | `teish-jambalaya` | **sain** | 231 | 113866 | évincée iCloud |  |  |
| 380 | `ter-kuile-power-of-ritual` | **sain** | 203 | 72359 | évincée iCloud |  |  |
| 381 | `tero-physarum-network-rules` | **sain** | 9 | 3431 | évincée iCloud |  |  |
| 382 | `the-cosmic-serpent` | **sain** | 183 | 91242 | lisible |  |  |
| 383 | `three-initiates-hermeticism-collection` | **sain** | 211 | 86344 | évincée iCloud |  |  |
| 384 | `tsing-mushroom-end-of-world` | **sain** | 277 | 124139 | évincée iCloud |  |  |
| 385 | `unger-knowledge-economy` | **sain** | 279 | 94655 | évincée iCloud |  |  |
| 386 | `vaid-menon-beyond-gender-binary` | **sain** | 30 | 13024 | évincée iCloud |  |  |
| 387 | `van-gennep-rites-passage` | **sain** | 215 | 101692 | évincée iCloud | 🌙 |  |
| 388 | `varela-thompson-rosch-embodied-mind` | **sain** | 294 | 132303 | évincée iCloud |  |  |
| 389 | `vogl-art-of-community` | **sain** | 129 | 57886 | évincée iCloud |  |  |
| 390 | `von-franz-interpretation-fairy-tales` | **sain** | 206 | 89432 | évincée iCloud | 🌙 |  |
| 391 | `wahl-designing-regenerative` | **sain** | 368 | 153065 | évincée iCloud |  |  |
| 392 | `waters-book-of-hopi` | **sain** | 347 | 169412 | évincée iCloud |  |  |
| 393 | `watkins-waking-dreams` | **sain** | 194 | 92256 | évincée iCloud | 🌙 |  |
| 394 | `weed-healing-wise` | **sain** | 259 | 104840 | lisible |  |  |
| 395 | `weller-wild-edge-of-sorrow` | **sain** | 201 | 84656 | évincée iCloud | 🌙 |  |
| 396 | `west-scale` | **sain** | 468 | 211853 | évincée iCloud |  |  |
| 397 | `wheatley-leadership-new-science` | **sain** | 212 | 80705 | évincée iCloud |  |  |
| 398 | `whorf-language-thought-reality` | **sain** | 373 | 153272 | évincée iCloud |  |  |
| 399 | `winston-adaptogens` | **sain** | 307 | 119311 | évincée iCloud |  |  |
| 400 | `wohlleben-the-hidden-life-of-trees` | **sain** | 220 | 89332 | évincée iCloud |  |  |
| 401 | `wolff-original-wisdom` | **sain** | 179 | 66098 | évincée iCloud | 🌙 |  |
| 402 | `wolkstein-kramer-inanna` | **sain** | 150 | 62812 | lisible |  |  |
| 403 | `wolynn-it-didnt-start-with-you` | **sain** | 219 | 90979 | évincée iCloud |  |  |
| 404 | `wood-herbal-wisdom` | **sain** | 504 | 232454 | évincée iCloud |  |  |
| 405 | `yanagi-unknown-craftsman` | **sain** | 149 | 74269 | évincée iCloud |  |  |
| 406 | `yunkaporta-right-story-wrong-story` | **sain** | 185 | 83242 | évincée iCloud |  |  |
| 407 | `yunkaporta-sand-talk` | **sain** | 175 | 74735 | évincée iCloud |  |  |
| 408 | `zuboff-surveillance-capitalism` | **sain** | 769 | 299822 | évincée iCloud |  |  |
| 409 | `zumthor-atmospheres` | **sain** | 35 | 9838 | évincée iCloud |  |  |

---

*Audit mené le 2026-07-30. Sauvegarde : `forest_chunks_backup_20260730` (4 933 chunks, texte + embeddings). Instruments installés : `forest_readability_report()`, vues `forest_chunk_readability` / `forest_book_readability`, table `forest_book_readability_snapshot`, colonne `forest_chunks.quarantine_reason`.*
