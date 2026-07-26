/**
 * scripts/mirror-said-preview.mjs
 * ────────────────────────────────
 * Fait tourner le VRAI moteur de montage (`src/lib/mirror/what-i-said.ts`) sur
 * le VRAI corpus, et écrit `_mirror-said-threads.json` — la matière de
 * `APERCU-MIROIR-CE-QUE-JEN-AI-DIT.html`.
 *
 * L'aperçu n'a AUCUN texte fabriqué : ce qu'il montre est ce que la route
 * rendrait. Si le moteur change, l'aperçu change. C'est le seul moyen de faire
 * juger Tim sur pièce et non sur une maquette.
 *
 *   node scripts/mirror-said-preview.mjs
 *
 * Yeshua (Opus, G2), 2026-07-26.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const USER = '342cf663-eed3-40c9-9327-4bf1c3c998b9'

/* ── .env.local ── */
const env = {}
for (const line of fs.readFileSync(path.join(ROOT, '.env.local'), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/)
  if (m) env[m[1]] = m[2].trim()
}
const URL_ = env.NEXT_PUBLIC_SUPABASE_URL
const KEY = env.SUPABASE_SERVICE_ROLE_KEY

/* ── on transpile le moteur à la volée : une seule source de vérité ── */
const src = fs.readFileSync(path.join(ROOT, 'src/lib/mirror/what-i-said.ts'), 'utf8')
const js = ts.transpileModule(src, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
}).outputText
const tmp = path.join(ROOT, 'scripts', '_what-i-said.mjs')
fs.writeFileSync(tmp, js)
const mod = await import(tmp + '?t=' + Date.now())
const { buildThreads } = mod
const ALL_ANCHORS = mod.ANCHORS

async function rest(table, query) {
  const r = await fetch(`${URL_}/rest/v1/${table}?${query}`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
  })
  if (!r.ok) throw new Error(`${table}: ${r.status} ${await r.text()}`)
  return r.json()
}

const dreams = await rest('kairos', `select=id,title,raw_text,occurred_at,occurred_at_reliable,created_at&user_id=eq.${USER}&limit=2000`)
const layers = await rest('kairos_text_layers', `select=id,kairos_id,quote&user_id=eq.${USER}&kind=eq.lecture&limit=2000`)

/* Même déduplication de rêves que la route. */
const seen = new Set()
const kept = []
for (const d of [...dreams].sort((a, b) => a.created_at.localeCompare(b.created_at))) {
  const h = d.raw_text ? `${d.raw_text.length}:${d.raw_text.slice(0, 160)}` : null
  if (h && seen.has(h)) continue
  if (h) seen.add(h)
  kept.push(d)
}
const byId = new Map(kept.map((d) => [d.id, d]))

const readings = []
for (const l of layers) {
  const d = byId.get(l.kairos_id)
  if (!d) continue
  readings.push({
    id: l.id, kairosId: l.kairos_id, dreamTitle: d.title ?? null,
    quote: l.quote || '', occurredAt: d.occurred_at,
    dated: d.occurred_at_reliable === true, depositedAt: d.created_at ?? null,
    source: 'dictee', match: null,
  })
}

const threads = buildThreads({ readings })

/* Les VARIANTES. Ce sont de vrais fils, produits par le même moteur sur la même
   matière, mais que la règle de dispersion n'a pas retenus ce soir (leurs rêves
   étaient déjà pris par un fil précédent). On les sort ici pour que Tim puisse
   voir à quoi ressemblent d'autres axes — pas pour les faire passer pour ce que
   l'écran affiche. L'aperçu les étiquette comme telles. */
const altSlugs = ['puissance', 'intégrité', 'peur', 'école']
const alternates = []
for (const slug of altSlugs) {
  const one = buildThreads({ readings, anchors: ALL_ANCHORS.filter((a) => a.slug === slug) })
  if (one.length) alternates.push(one[0])
}

const out = {
  generatedAt: new Date().toISOString(),
  dreamsTotal: dreams.length,
  dreamsAfterDedup: kept.length,
  readingsTotal: layers.length,
  readingsUsable: readings.length,
  undatedDreams: kept.filter((d) => d.occurred_at_reliable !== true).length,
  threads,
  alternates,
}
fs.writeFileSync(path.join(ROOT, 'scripts', '_mirror-said-threads.json'), JSON.stringify(out, null, 2))
fs.unlinkSync(tmp)

console.log(`rêves ${dreams.length} → ${kept.length} après dédup · lectures ${layers.length} → ${readings.length} rattachées`)
console.log(`rêves sans date fiable : ${out.undatedDreams}`)
console.log(`\n${threads.length} fils :`)
for (const th of threads) {
  const span = th.span ? ` ${th.span.from.slice(0, 7)} → ${th.span.to.slice(0, 7)} (${th.span.months} mois)` : ''
  console.log(`  · « ${th.anchor} » [${th.grammar}] ${th.readings.length}/${th.totalReadings} lectures · ${th.dreamCount} rêves${span}`)
}
