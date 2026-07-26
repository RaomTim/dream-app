// src/lib/kairos/text-layers.ts
import Anthropic from "@anthropic-ai/sdk";

// src/lib/req-lang.ts
var LANG_NAME = {
  fr: "fran\xE7ais",
  en: "anglais"
};

// src/lib/kairos/text-layers.ts
var MODEL = "claude-haiku-4-5-20251001";
var MIN_LEN_FOR_LAYERS = 220;
var MAX_MARKED_RATIO = 0.6;
var SNAP_DRIFT = 40;
var MAX_SPANS = 8;
var systemFor = (lang) => `Une personne a racont\xE9 un r\xEAve \xE0 voix haute, au r\xE9veil. Dans le m\xEAme souffle, elle m\xE9lange souvent trois choses. Ta t\xE2che est de rep\xE9rer DEUX d'entre elles \u2014 la troisi\xE8me est le d\xE9faut.

1. LE R\xC9CIT \u2014 ce que le r\xEAve a montr\xE9. C'est le d\xE9faut : tout ce que tu ne marques pas est du r\xE9cit. Tu ne le cites jamais.

2. LA LECTURE DU R\xCAVEUR \u2014 ce que la personne dit elle-m\xEAme du SENS de son r\xEAve, en sortant du r\xEAve pour le regarder. \xAB d'ailleurs je sens que \xE7a me parle de\u2026 \xBB, \xAB \xE7a c'est clairement ma peur de\u2026 \xBB, \xAB le loup, c'est ma col\xE8re \xBB, \xAB je crois que ce r\xEAve me dit de\u2026 \xBB, \xAB ce que \xE7a montre, c'est\u2026 \xBB, \xAB \xE0 quels endroits est-ce que je suis encore comme \xE7a ? \xBB. C'est SON sens, dans SES mots. C'est pr\xE9cieux : tu le marques pour qu'il soit reconnu comme sien, jamais pour l'\xE9carter.

3. LE CADRE DU DIRE \u2014 ce qui n'est ni le r\xEAve ni son sens : la date ou l'heure dites \xE0 voix haute (\xAB r\xEAve du 24 avril \xBB, \xAB il est 11h \xBB), l'\xE9tat du r\xE9veil et du micro (\xAB bon, alors \xBB, \xAB j'ai bien dormi \xBB, \xAB attends je reprends \xBB), les intentions de tenue de journal (\xAB il faut vraiment que je prenne l'habitude de les enregistrer \xBB), et les r\xE9sidus de transcription automatique qui n'ont rien \xE0 faire l\xE0 (\xAB Sous-titrage ST' 501 \xBB, \xAB n'h\xE9sitez pas \xE0 vous abonner \xE0 la cha\xEEne \xBB).

LES DEUX TESTS, \xE0 passer TOUS LES DEUX avant de marquer une phrase \xAB lecture \xBB.

  TEST 1 \u2014 \xAB si je retire cette phrase, est-ce que la SC\xC8NE perd quelque chose ? \xBB
    Si oui : R\xC9CIT. Tu ne la marques pas. Toute phrase qui dit ce qui se passait,
    ce qui \xE9tait vu, entendu, senti, craint, devin\xE9, remarqu\xE9 PENDANT la sc\xE8ne est
    du r\xE9cit \u2014 y compris quand elle explique un pourquoi (\xAB parce que\u2026 \xBB), quand
    elle juge un personnage, quand elle d\xE9crit une sensation, quand elle dit ce que
    le r\xEAveur savait ou croyait dans le r\xEAve, quand elle dit ce qu'un AUTRE
    personnage ressentait. Rien de tout cela ne sort du r\xEAve.

  TEST 2 \u2014 \xAB faut-il \xEAtre r\xE9veill\xE9, et regarder le r\xEAve de l'ext\xE9rieur, pour dire
    cette phrase ? \xBB
    Si oui : LECTURE. Elle parle DU r\xEAve, pas DEPUIS le r\xEAve. Elle le nomme
    (\xAB ce r\xEAve \xBB, \xAB \xE7a \xBB, \xAB ce que \xE7a montre \xBB), le relie \xE0 la vie \xE9veill\xE9e, en
    tire une question ou une r\xE9solution.

  Une phrase qui ne passe pas les deux tests reste du r\xE9cit. Toujours.

R\xC8GLES DURES
- Tu ne r\xE9\xE9cris RIEN. Chaque passage que tu renvoies est copi\xE9 EXACTEMENT depuis le texte : m\xEAmes mots, m\xEAmes accents, m\xEAme ponctuation. Une citation reformul\xE9e est rejet\xE9e.
- Tu cites des passages ENTIERS (phrase compl\xE8te, ou suite de phrases). Jamais un bout de phrase coup\xE9 au milieu.
- DANS LE DOUTE, TU NE MARQUES PAS. Mieux vaut laisser un commentaire dans le r\xE9cit que retirer une image du r\xEAve. C'est la r\xE8gle la plus importante.
- Une image reste une image m\xEAme quand le r\xEAveur l'explique. \xAB il y avait un loup, c'\xE9tait ma col\xE8re \xBB : seul \xAB c'\xE9tait ma col\xE8re \xBB est une lecture. Le loup reste dans le r\xE9cit.
- L'\xE9tranget\xE9 du r\xEAve n'est PAS un commentaire. Logique bizarre, d\xE9cors qui changent, \xAB je savais que \xBB, \xAB c'\xE9tait comme si \xBB : r\xE9cit.
- Ce que la personne a ressenti DANS le r\xEAve (peur, d\xE9go\xFBt, joie, le c\u0153ur qui bat) est du R\xC9CIT, m\xEAme formul\xE9 apr\xE8s coup. Seul ce qu'elle en CONCLUT, \xE9veill\xE9e, est une lecture.
- Le doute sur sa propre m\xE9moire (\xAB je sais plus trop ce qui s'est pass\xE9 \xBB, \xAB c'\xE9tait pas clair \xBB) est du r\xE9cit : c'est la texture du souvenir, pas une interpr\xE9tation.
- Plus le texte est long, plus tu marques PEU. Sur un r\xE9cit tr\xE8s long, seuls les tout premiers mots (le cadre) et le passage final de r\xE9flexion sont en g\xE9n\xE9ral marquables.
- Au TOTAL, 8 passages au maximum, toutes natures confondues. S'il y en a plus, garde les plus \xE9vidents. Il vaut mieux en manquer que d'en inventer.
- Ne marque jamais plus de la moiti\xE9 du texte. Si tu en es l\xE0, c'est que tu te trompes : renvoie des listes vides.
- Si tout le texte est du r\xE9cit : listes vides.

LANGUE : le texte peut \xEAtre dans n'importe quelle langue. Tu ne traduis rien, tu ne reformules rien. (Les explications \xE9ventuelles seraient en ${LANG_NAME[lang]}, mais on ne t'en demande aucune.)

R\xE9ponds UNIQUEMENT en JSON, rien autour :
{"lecture":["passage exact","passage exact"],"cadre":["passage exact"],"confidence":0.0}
confidence = ta certitude sur ce marquage (1 = certain, 0.5 = h\xE9sitant).`;
var SENT_END = /[.!?…]/;
function snapToSentence(text, a, b) {
  let s = a;
  let i = a - 1;
  while (i >= 0 && a - i <= SNAP_DRIFT) {
    if (SENT_END.test(text[i]) || text[i] === "\n") {
      s = i + 1;
      break;
    }
    i--;
  }
  if (i < 0) s = 0;
  while (s < b && /\s/.test(text[s])) s++;
  let e = b;
  let j = b;
  while (j < text.length && j - b <= SNAP_DRIFT) {
    if (SENT_END.test(text[j])) {
      e = j + 1;
      break;
    }
    if (text[j] === "\n") {
      e = j;
      break;
    }
    j++;
  }
  if (j >= text.length) e = text.length;
  return [s, Math.max(e, b)];
}
function mergeSpans(spans) {
  const sorted = [...spans].sort((x, y) => x.start - y.start || x.end - y.end);
  const out = [];
  for (const s of sorted) {
    const last = out[out.length - 1];
    if (last && s.start <= last.end) {
      last.end = Math.max(last.end, s.end);
      if (s.kind === "cadre") last.kind = "cadre";
      last.confidence = Math.min(last.confidence ?? 1, s.confidence ?? 1);
    } else {
      out.push({ ...s });
    }
  }
  return out;
}
function resolveQuotes(text, quotes, kind, confidence) {
  const spans = [];
  let from = 0;
  for (const q of quotes) {
    const raw = (q || "").trim();
    if (raw.length < 8) continue;
    let at = text.indexOf(raw, from);
    if (at === -1) at = text.indexOf(raw);
    if (at === -1) continue;
    const [s, e] = snapToSentence(text, at, at + raw.length);
    spans.push({ kind, start: s, end: e, quote: text.slice(s, e), source: "ai", confidence });
    from = at + raw.length;
  }
  return spans;
}
function projectText(rawText, spans, exclude) {
  if (!spans.length || !exclude.length) return rawText;
  const drop = mergeSpans(spans.filter((s) => exclude.includes(s.kind)));
  if (!drop.length) return rawText;
  let out = "";
  let cursor = 0;
  for (const s of drop) {
    if (s.start > cursor) out += rawText.slice(cursor, s.start);
    cursor = Math.max(cursor, s.end);
  }
  out += rawText.slice(cursor);
  return out.replace(/[ \t]{2,}/g, " ").replace(/\n{3,}/g, "\n\n").trim();
}
function collectText(rawText, spans, kind) {
  return mergeSpans(spans.filter((s) => s.kind === kind)).map((s) => rawText.slice(s.start, s.end).trim()).filter(Boolean).join("\n").trim();
}
function buildProjections(rawText, spans) {
  return {
    recit_text: projectText(rawText, spans, ["cadre"]),
    recit_only_text: projectText(rawText, spans, ["cadre", "lecture"]),
    lecture_text: collectText(rawText, spans, "lecture")
  };
}
function extractJson(raw) {
  const s = raw.indexOf("{");
  const e = raw.lastIndexOf("}");
  if (s === -1 || e === -1 || e < s) return null;
  try {
    return JSON.parse(raw.slice(s, e + 1));
  } catch {
    return null;
  }
}
async function detectTextLayers(opts) {
  const text = opts.rawText || "";
  const lang = opts.lang || "fr";
  if (text.trim().length < MIN_LEN_FOR_LAYERS) {
    return { spans: [], status: "skipped", confidence: 0, reason: "too_short" };
  }
  let parsed = null;
  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const res = await anthropic.messages.create({
      model: MODEL,
      // Assez large pour que le JSON ne soit jamais tronqué sur un rêve de 12 000
      // caractères : une réponse coupée = zéro couche (mesuré le 26/07 sur un
      // récit de 9 567 car., `unparsable`).
      max_tokens: 3e3,
      system: systemFor(lang),
      messages: [{ role: "user", content: `LE TEXTE :

${text.slice(0, 14e3)}` }]
    });
    const out = res.content[0]?.type === "text" ? res.content[0].text : "";
    parsed = extractJson(out);
  } catch (e) {
    console.error("[text-layers] model failed:", String(e).slice(0, 200));
    return { spans: [], status: "skipped", confidence: 0, reason: "model_error" };
  }
  if (!parsed) return { spans: [], status: "skipped", confidence: 0, reason: "unparsable" };
  const conf = typeof parsed.confidence === "number" ? Math.max(0, Math.min(1, parsed.confidence)) : 0.6;
  const lecture = Array.isArray(parsed.lecture) ? parsed.lecture.filter((q) => typeof q === "string") : [];
  const cadre = Array.isArray(parsed.cadre) ? parsed.cadre.filter((q) => typeof q === "string") : [];
  const spans = mergeSpans([
    ...resolveQuotes(text, cadre.slice(0, MAX_SPANS), "cadre", conf),
    ...resolveQuotes(text, lecture.slice(0, MAX_SPANS), "lecture", conf)
  ]).slice(0, MAX_SPANS);
  if (!spans.length) return { spans: [], status: "none", confidence: conf };
  const marked = spans.reduce((n, s) => n + (s.end - s.start), 0);
  if (marked / text.length > MAX_MARKED_RATIO) {
    return { spans: [], status: "skipped", confidence: conf, reason: "over_marked" };
  }
  return { spans, status: "proposed", confidence: conf };
}
export {
  MIN_LEN_FOR_LAYERS,
  buildProjections,
  collectText,
  detectTextLayers,
  projectText
};
