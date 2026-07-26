/**
 * b4-layers-experiment.mjs — test du découpage récit / lecture du rêveur / cadre
 * sur 10 rêves RÉELS de Tim, puis mesure de l'effet sur la séparation des résonances.
 *
 * Rien n'est écrit dans la production : les embeddings de test vivent dans une table
 * de travail `_b4_layer_embeddings`, comme l'a fait A2 avant moi (`_a2_clean_embeddings`).
 *
 * Usage :
 *   node scripts/b4-layers-experiment.mjs layers   # découpage sur 10 rêves, sortie lisible
 *   node scripts/b4-layers-experiment.mjs embed    # ré-embed des 64 rêves, 3 variantes
 *   node scripts/b4-layers-experiment.mjs measure  # séparation vraie paire / bruit
 *
 * Yeshua (Opus), 2026-07-26.
 */
import fs from 'node:fs'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
import { detectTextLayers, buildProjections } from './_b4/text-layers.mjs'
import { extractDreamDateFromText } from './_b4/dream-date.mjs'

const root = path.resolve(process.cwd())
for (const line of fs.readFileSync(path.join(root, '.env.local'), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
  if (m) process.env[m[1]] = m[2].trim()
}

const USER = '342cf663-eed3-40c9-9327-4bf1c3c998b9'
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

/** Les 10 rêves du test — choisis pour couvrir les cas, pas pour flatter le résultat. */
const TEN = [
  '952cbe43-2e6a-4ffc-a86e-6f1686d6141c', // « Rêve du 24 avril. Bon déjà j'ai bien dormi… il est 11 heures. »
  '13a8cce5-5452-47eb-9ada-198f8351ce0a', // « Bon, rêve du 4 avril, parce que c'est important que je prenne le temps… »
  'bc6671a9-ce08-4723-a617-1fe6c79f2c7d', // « Petit enregistrement du rêve du 1er juillet… »
  '34d34a9c-2d68-43c7-8460-f67fd19ba53e', // « Reprise de l'enregistrement… en ce 2 août 2023 »
  '1df61b80-7f1c-4b24-8968-85bf8048fe87', // « J'ai fait une super grasse mat'… Il est 11h »
  '5b32b168-a6de-4310-9b1e-e516e0774318', // « Rêve du 8 août… » (le plus long)
  'fb3a9ec1-531f-4077-b81f-ebeadd1d6a6a', // rêve lucide, plein de lectures du rêveur
  '60b53989-6ffb-4dfc-940a-ecc2997412c9', // récit dense (« les années 1840 » DANS le rêve)
  'a2240f4b-6b15-420a-bf50-11997954ec7a', // presque tout est réflexion → doit déclencher le garde-fou
  'eb570de6-98ce-41a1-8cbb-ed29d78ff1f5', // récit long, peu de méta
]

async function cmdLayers() {
  const a = parseInt(process.argv[3] ?? '0', 10)
  const b = parseInt(process.argv[4] ?? String(TEN.length), 10)
  const slice = TEN.slice(a, b)
  const { data } = await sb.from('kairos').select('id, title, raw_text').in('id', slice)
  const byId = Object.fromEntries((data || []).map((k) => [k.id, k]))
  const out = []
  for (const id of slice) {
    const k = byId[id]
    if (!k) { console.log(`!! ${id} introuvable`); continue }
    const det = await detectTextLayers({ rawText: k.raw_text, lang: 'fr' })
    const proj = buildProjections(k.raw_text, det.spans)
    const L = k.raw_text.length
    out.push({ id, title: k.title, len: L, status: det.status, reason: det.reason || null,
      confidence: det.confidence,
      spans: det.spans.map((s) => ({ kind: s.kind, start: s.start, end: s.end, text: k.raw_text.slice(s.start, s.end) })),
      ratio_cadre: +(det.spans.filter(s => s.kind === 'cadre').reduce((n, s) => n + s.end - s.start, 0) / L).toFixed(3),
      ratio_lecture: +(det.spans.filter(s => s.kind === 'lecture').reduce((n, s) => n + s.end - s.start, 0) / L).toFixed(3),
      recit_len: proj.recit_text.length,
      recit_only_len: proj.recit_only_text.length,
    })
    console.log(`\n${'═'.repeat(78)}\n${k.title}  [${id.slice(0, 8)}]  ${L} car.  status=${det.status}${det.reason ? ' (' + det.reason + ')' : ''}  conf=${det.confidence}`)
    for (const s of det.spans) {
      console.log(`  ── ${s.kind.toUpperCase().padEnd(7)} [${s.start}–${s.end}] «${k.raw_text.slice(s.start, s.end).replace(/\n/g, ' ')}»`)
    }
  }
  const acc = fs.existsSync('/tmp/b4/layers.json') ? JSON.parse(fs.readFileSync('/tmp/b4/layers.json','utf8')) : []
  fs.writeFileSync('/tmp/b4/layers.json', JSON.stringify(acc.concat(out), null, 2))
  console.log(`\n→ /tmp/b4/layers.json (${acc.length + out.length} au total)`)
}

async function embedOne(text) {
  const t = (text || '').trim().slice(0, 8000)
  if (t.length < 3) return null
  const r = await openai.embeddings.create({ model: 'text-embedding-3-small', input: t })
  return r.data[0].embedding
}

/** Ré-embed les 64 rêves en 3 variantes, dans une TABLE DE TRAVAIL. Prod intouchée. */
async function cmdEmbed() {
  const a = parseInt(process.argv[3] ?? '0', 10)
  const b = parseInt(process.argv[4] ?? '999', 10)
  const { data: all } = await sb
    .from('kairos').select('id, raw_text').eq('user_id', USER).order('created_at')
  const slice = all.slice(a, b)
  console.log(`${slice.length} kairos (sur ${all.length}), fenetre ${a}-${b}`)
  const CONC = 8
  let done = 0
  async function one(k) {
    const det = await detectTextLayers({ rawText: k.raw_text, lang: 'fr' })
    const proj = buildProjections(k.raw_text, det.spans)
    const [eRaw, eMinusCadre, eRecitOnly] = await Promise.all([
      embedOne(k.raw_text), embedOne(proj.recit_text), embedOne(proj.recit_only_text),
    ])
    const L = Math.max(1, k.raw_text.length)
    await sb.from('_b4_layer_embeddings').upsert({
      kairos_id: k.id, status: det.status,
      ratio_cadre: det.spans.filter(s => s.kind === 'cadre').reduce((n, s) => n + s.end - s.start, 0) / L,
      ratio_lecture: det.spans.filter(s => s.kind === 'lecture').reduce((n, s) => n + s.end - s.start, 0) / L,
      recit_text: proj.recit_text, recit_only_text: proj.recit_only_text,
      lecture_text: proj.lecture_text || null,
      emb_raw: eRaw, emb_minus_cadre: eMinusCadre, emb_recit_only: eRecitOnly,
    }, { onConflict: 'kairos_id' })
    done++
  }
  for (let i = 0; i < slice.length; i += CONC) {
    await Promise.all(slice.slice(i, i + CONC).map((k) => one(k).catch((e) => console.log('  !!', k.id.slice(0,8), String(e).slice(0,90)))))
    console.log(`  ${done}/${slice.length}`)
  }
  console.log('done')
}

/** Extraction RÉTROACTIVE des dates dites dans le texte → PROPOSITIONS seulement. */
async function cmdDates() {
  const a = parseInt(process.argv[3] ?? '0', 10)
  const b = parseInt(process.argv[4] ?? '999', 10)
  const { data: all } = await sb
    .from('kairos').select('id, title, raw_text, created_at, dream_date_precision')
    .eq('user_id', USER).is('dream_date', null).order('created_at')
  const slice = all.slice(a, b)
  console.log(`${slice.length} kairos sans date de reve (sur ${all.length}), fenetre ${a}-${b}`)
  const CONC = 8
  let found = 0
  async function one(k) {
    const prop = await extractDreamDateFromText({
      rawText: k.raw_text, depositAt: k.created_at,
      depositIsReliable: k.dream_date_precision !== 'unknown', lang: 'fr',
    })
    if (!prop) return
    found++
    await sb.from('kairos_dream_date_proposals').upsert({
      kairos_id: k.id, user_id: USER, quote: prop.quote, quote_start: prop.quote_start,
      proposed_date: prop.proposed_date, proposed_precision: prop.proposed_precision,
      year_missing: prop.year_missing, ambiguous: prop.ambiguous,
      confidence: prop.confidence, reasoning: prop.reasoning, parts: prop.parts, status: 'pending',
    }, { onConflict: 'kairos_id' })
    console.log(`  ${k.title?.slice(0,42).padEnd(44)} «${prop.quote.slice(0,52)}» → ${prop.proposed_date || 'AUCUNE'} (${prop.reasoning})`)
  }
  for (let i = 0; i < slice.length; i += CONC) {
    await Promise.all(slice.slice(i, i + CONC).map((k) => one(k).catch((e) => console.log('  !!', String(e).slice(0,80)))))
  }
  console.log(`dates dites trouvees : ${found}/${slice.length} — AUCUNE appliquee`)
}

/** Pose la COUCHE sur les rêves déjà en base (prod). raw_text n'est jamais touché.
 *  Idempotent : on efface la couche existante non confirmée puis on la repose.
 *  N'écrit AUCUN embedding — la production de vecteurs reste inchangée. */
async function cmdBackfillLayers() {
  const a = parseInt(process.argv[3] ?? '0', 10)
  const b = parseInt(process.argv[4] ?? '999', 10)
  const { data: all } = await sb.from('kairos')
    .select('id, raw_text, text_layers_status').eq('user_id', USER).order('created_at')
  const slice = all.slice(a, b).filter(k => k.text_layers_status !== 'confirmed')
  console.log(`${slice.length} kairos a traiter (fenetre ${a}-${b})`)
  const CONC = 8
  let n = 0, marked = 0
  async function one(k) {
    const det = await detectTextLayers({ rawText: k.raw_text, lang: 'fr' })
    const proj = buildProjections(k.raw_text, det.spans)
    await sb.from('kairos_text_layers').delete().eq('kairos_id', k.id).eq('user_id', USER)
    if (det.spans.length) {
      await sb.from('kairos_text_layers').insert(det.spans.map(s => ({
        kairos_id: k.id, user_id: USER, kind: s.kind,
        start_char: s.start, end_char: s.end, quote: k.raw_text.slice(s.start, s.end),
        source: s.source, confidence: s.confidence ?? null,
      })))
      marked++
    }
    await sb.from('kairos').update({
      text_layers_status: det.spans.length ? 'proposed' : det.status,
      text_layers_at: new Date().toISOString(),
      recit_text: proj.recit_text || null,
      recit_only_text: proj.recit_only_text || null,
      lecture_text: proj.lecture_text || null,
    }).eq('id', k.id).eq('user_id', USER)
    n++
  }
  for (let i = 0; i < slice.length; i += CONC) {
    await Promise.all(slice.slice(i, i + CONC).map(k => one(k).catch(e => console.log('  !!', String(e).slice(0,90)))))
  }
  console.log(`${n} traites, ${marked} avec au moins un passage marque`)
}

const CMD = process.argv[2] || 'layers'
if (CMD === 'layers') await cmdLayers()
else if (CMD === 'embed') await cmdEmbed()
else if (CMD === 'dates') await cmdDates()
else if (CMD === 'backfill-layers') await cmdBackfillLayers()
else console.log('commandes : layers | embed')
