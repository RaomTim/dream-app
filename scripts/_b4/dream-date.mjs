// src/lib/kairos/dream-date.ts
import Anthropic from "@anthropic-ai/sdk";
var DREAM_DATE_PRECISIONS = ["night", "day", "week", "month", "season", "year", "unknown"];
function toLocalISODate(d) {
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
function shortcutToFields(shortcut, now = /* @__PURE__ */ new Date()) {
  const day = (offset) => {
    const d = new Date(now);
    if (now.getHours() < 4) d.setDate(d.getDate() - 1);
    d.setDate(d.getDate() - offset);
    return toLocalISODate(d);
  };
  switch (shortcut) {
    case "tonight":
      return { dream_date: day(0), dream_date_precision: "night", dream_date_label: null, dream_date_source: "default" };
    case "yesterday":
      return { dream_date: day(1), dream_date_precision: "night", dream_date_label: null, dream_date_source: "user" };
    case "before_yesterday":
      return { dream_date: day(2), dream_date_precision: "night", dream_date_label: null, dream_date_source: "user" };
    case "few_days":
      return { dream_date: day(4), dream_date_precision: "week", dream_date_label: null, dream_date_source: "user" };
    case "this_month":
      return { dream_date: day(15), dream_date_precision: "month", dream_date_label: null, dream_date_source: "user" };
    case "unknown":
    default:
      return { dream_date: null, dream_date_precision: "unknown", dream_date_label: null, dream_date_source: "user" };
  }
}
function normalizeDreamDateInput(body) {
  const out = {};
  if (typeof body?.dream_date_shortcut === "string") {
    const s = body.dream_date_shortcut;
    if (["tonight", "yesterday", "before_yesterday", "few_days", "this_month", "unknown"].includes(s)) {
      return shortcutToFields(s);
    }
  }
  const hasDate = typeof body?.dream_date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(body.dream_date);
  const prec = typeof body?.dream_date_precision === "string" && DREAM_DATE_PRECISIONS.includes(body.dream_date_precision) ? body.dream_date_precision : null;
  if (prec === "unknown") {
    out.dream_date = null;
    out.dream_date_precision = "unknown";
  } else if (hasDate) {
    const d = /* @__PURE__ */ new Date(`${body.dream_date}T12:00:00Z`);
    if (isNaN(d.getTime())) return out;
    const today = /* @__PURE__ */ new Date();
    if (d.getTime() > today.getTime() + 36 * 3600 * 1e3) return out;
    out.dream_date = body.dream_date;
    out.dream_date_precision = prec || "night";
  } else if (prec) {
    out.dream_date_precision = prec;
  }
  if (typeof body?.dream_date_label === "string") {
    out.dream_date_label = body.dream_date_label.trim().slice(0, 120) || null;
  }
  if (out.dream_date !== void 0 || out.dream_date_precision !== void 0) {
    out.dream_date_source = body?.dream_date_source === "default" ? "default" : "user";
  }
  return out;
}
function formatDreamDate(k, locale = "fr-FR") {
  const fr = locale.startsWith("fr");
  const label = k.dream_date_label?.trim();
  const prec = k.dream_date_precision || "night";
  if (prec === "unknown" || !k.dream_date) {
    return {
      when: label || (fr ? "date inconnue" : "date unknown"),
      deposited: k.created_at ? new Date(k.created_at).toLocaleDateString(locale, { day: "numeric", month: "long" }) : null
    };
  }
  const d = /* @__PURE__ */ new Date(`${k.dream_date}T12:00:00Z`);
  let when;
  switch (prec) {
    case "year":
      when = String(d.getUTCFullYear());
      break;
    case "season":
    case "month":
      when = d.toLocaleDateString(locale, { month: "long", year: "numeric", timeZone: "UTC" });
      break;
    case "week":
      when = (fr ? "autour du " : "around ") + d.toLocaleDateString(locale, { day: "numeric", month: "long", timeZone: "UTC" });
      break;
    default:
      when = d.toLocaleDateString(locale, { day: "numeric", month: "long", timeZone: "UTC" });
  }
  if (label) when = label;
  let deposited = null;
  if (k.created_at) {
    const dep = new Date(k.created_at);
    const sameDay = toLocalISODate(dep) === k.dream_date;
    if (!sameDay) deposited = dep.toLocaleDateString(locale, { day: "numeric", month: "long" });
  }
  return { when, deposited };
}
function canAssertDelta(precision) {
  const p = precision || "night";
  return p === "night" || p === "day" || p === "week";
}
var EXTRACT_MODEL = "claude-haiku-4-5-20251001";
var EXTRACT_SYSTEM = `Tu lis la transcription d'un r\xEAve dict\xE9. Beaucoup de ces enregistrements commencent par la date, dite \xE0 voix haute : \xAB R\xEAve du 24 avril \xBB, \xAB Petit enregistrement du 13 avril \xBB, \xAB en ce 2 ao\xFBt 2023 \xBB, \xAB mes petits r\xEAves du 31 \xBB, \xAB Journal de r\xEAve, 13 janvier \xBB.

TA T\xC2CHE : trouver la date \xE0 laquelle ce r\xEAve a eu lieu, SI elle est dite dans le texte. Rien d'autre.

R\xC8GLES DURES
- Tu ne devines JAMAIS. Une date mal devin\xE9e est pire qu'une date absente.
- Tu ne renvoies une date que si elle est DITE. \xAB cette nuit \xBB, \xAB ce matin \xBB, \xAB hier \xBB ne sont PAS des dates : ils ne disent rien de quand l'enregistrement a \xE9t\xE9 fait. Dans ce cas : found=false.
- Le passage cit\xE9 est copi\xE9 EXACTEMENT depuis le texte, mot pour mot.
- Si l'ann\xE9e n'est pas dite (le cas courant), tu laisses year absent. Tu ne la d\xE9duis pas.
- Si la personne h\xE9site elle-m\xEAme (\xAB le 13 avril ou le 13 mai \xBB), tu poses ambiguous=true et tu mets la seconde date dans alt_quote.
- Une date qui appartient au R\xCAVE (\xAB on \xE9tait en 1840 dans le r\xEAve \xBB) n'est pas la date du r\xEAve. Ignore-la.
- Les mois sont des nombres 1\u201312. Les jours 1\u201331.

R\xE9ponds UNIQUEMENT en JSON, rien autour :
{"found":true,"quote":"passage exact","day":24,"month":4,"year":null,"ambiguous":false,"alt_quote":null,"confidence":0.0}
ou {"found":false}`;
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
async function extractDreamDateFromText(opts) {
  const text = (opts.rawText || "").slice(0, 3e3);
  if (text.trim().length < 40) return null;
  let parsed = null;
  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const res = await anthropic.messages.create({
      model: EXTRACT_MODEL,
      max_tokens: 400,
      system: EXTRACT_SYSTEM,
      messages: [{ role: "user", content: `LE TEXTE :

${text}` }]
    });
    const out = res.content[0]?.type === "text" ? res.content[0].text : "";
    parsed = extractJson(out);
  } catch (e) {
    console.error("[dream-date] model failed:", String(e).slice(0, 200));
    return null;
  }
  if (!parsed || parsed.found !== true) return null;
  const quote = typeof parsed.quote === "string" ? parsed.quote.trim() : "";
  if (!quote) return null;
  const quoteStart = (opts.rawText || "").indexOf(quote);
  if (quoteStart === -1) return null;
  const day = Number.isInteger(parsed.day) && parsed.day >= 1 && parsed.day <= 31 ? parsed.day : void 0;
  const month = Number.isInteger(parsed.month) && parsed.month >= 1 && parsed.month <= 12 ? parsed.month : void 0;
  const year = Number.isInteger(parsed.year) && parsed.year >= 1970 && parsed.year <= 2100 ? parsed.year : void 0;
  if (!month && !year) return null;
  const ambiguous = parsed.ambiguous === true;
  const confidence = typeof parsed.confidence === "number" ? Math.max(0, Math.min(1, parsed.confidence)) : 0.5;
  const parts = { day, month, year };
  if (typeof parsed.alt_quote === "string" && parsed.alt_quote.trim()) parts.alt_quote = parsed.alt_quote.trim();
  const deposit = new Date(opts.depositAt);
  let proposed = null;
  let precision = "unknown";
  let yearMissing = !year;
  const pad = (n) => String(n).padStart(2, "0");
  if (year && month) {
    proposed = `${year}-${pad(month)}-${pad(day || 15)}`;
    precision = day ? "day" : "month";
  } else if (month && opts.depositIsReliable) {
    const y = deposit.getUTCFullYear();
    for (const cand of [y, y - 1]) {
      const iso = `${cand}-${pad(month)}-${pad(day || 15)}`;
      const t = (/* @__PURE__ */ new Date(`${iso}T12:00:00Z`)).getTime();
      const delta = deposit.getTime() - t;
      if (delta >= -36 * 3600 * 1e3 && delta < 400 * 24 * 3600 * 1e3) {
        proposed = iso;
        precision = day ? "day" : "month";
        yearMissing = false;
        break;
      }
    }
  }
  if (proposed && (/* @__PURE__ */ new Date(`${proposed}T12:00:00Z`)).getTime() > deposit.getTime() + 36 * 3600 * 1e3) {
    proposed = null;
    precision = "unknown";
    yearMissing = true;
  }
  const reasoning = [
    day ? `jour ${day}` : null,
    month ? `mois ${month}` : null,
    year ? `ann\xE9e ${year}` : "ann\xE9e non dite",
    ambiguous ? "le r\xEAveur h\xE9site lui-m\xEAme" : null,
    !proposed ? "ann\xE9e ind\xE9cidable \u2192 aucune date propos\xE9e" : null
  ].filter(Boolean).join(" \xB7 ");
  return {
    quote: quote.slice(0, 300),
    quote_start: quoteStart,
    proposed_date: proposed,
    proposed_precision: precision,
    year_missing: yearMissing,
    ambiguous,
    confidence: ambiguous ? Math.min(confidence, 0.4) : confidence,
    reasoning,
    parts
  };
}
export {
  DREAM_DATE_PRECISIONS,
  canAssertDelta,
  extractDreamDateFromText,
  formatDreamDate,
  normalizeDreamDateInput,
  shortcutToFields,
  toLocalISODate
};
