/**
 * MESURE du détecteur de grands rêves — agent B3, 2026-07-26.
 * Importe la MÊME librairie que la route (pas de copie) et la fait tourner sur
 * le corpus réel de Tim. Aucune écriture en base.
 * Fichier de mesure — supprimable après le rapport.
 */
import fs from 'node:fs'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'
import {
  scoreCorpus, selectCandidates, corr, MIN_RELIEF, SHORTLIST,
} from '../src/lib/kairos/great-dream-detect.ts'

const root = path.resolve(process.argv[2] || '.')
for (const line of fs.readFileSync(path.join(root, '.env.local'), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/)
  if (m) process.env[m[1]] = m[2].trim()
}
const USER = process.env.B3_USER || '342cf663-eed3-40c9-9327-4bf1c3c998b9'

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

const { data: rows, error } = await sb.from('kairos')
  .select('id, created_at, title, raw_text, kairos_type, user_marked_numinous, numinosity_score, affective_intensity, motif_tags, archetypal_tags, life_themes, root_dream_patterns, somatic_markers, sensorial_qualities, temporal_signature, thresholds_passages, paradoxes_unresolved, narrative_dynamics')
  .eq('user_id', USER).limit(1000)
if (error) throw error

const { data: interps } = await sb.from('kairos_interpretations').select('kairos_id').eq('user_id', USER)
const icount = new Map()
for (const i of interps || []) icount.set(i.kairos_id, (icount.get(i.kairos_id) ?? 0) + 1)
for (const r of rows) r.interpretation_count = icount.get(r.id) ?? 0

const { scored, diagnostics } = scoreCorpus(rows)

console.log('\n══════ DIAGNOSTICS ══════')
console.log(JSON.stringify(diagnostics, null, 2))

console.log('\n══════ CORRÉLATIONS DE CONTRÔLE ══════')
const L = scored.map(s => Math.log(s.lengthChars))
console.log('corr(log len, relief)          =', corr(L, scored.map(s => s.relief)).toFixed(3))
console.log('corr(log len, numinosity IA)   =', corr(L, scored.map(s => s.row.numinosity_score ?? 0)).toFixed(3))
console.log('corr(relief, numinosity IA)    =', corr(scored.map(s => s.relief), scored.map(s => s.row.numinosity_score ?? 0)).toFixed(3))

console.log('\n══════ CLASSEMENT COMPLET (relief décroissant) ══════')
scored.forEach((s, i) => {
  const z = Object.entries(s.z).map(([k, v]) => `${k.slice(0, 4)}=${v >= 0 ? '+' : ''}${v.toFixed(1)}`).join(' ')
  console.log(
    `${String(i + 1).padStart(2)}. ${s.relief >= 0 ? '+' : ''}${s.relief.toFixed(2)}  ` +
    `${(s.row.title || '(sans titre)').slice(0, 44).padEnd(45)} ` +
    `${s.row.created_at.slice(0, 10)} len=${String(s.lengthChars).padStart(5)} ` +
    `ns=${(s.row.numinosity_score ?? 0).toFixed(2)}${s.row.user_marked_numinous ? ' ★MARQUÉ' : ''}\n` +
    `      ${z}  proto=[${s.prototypes.join(',')}]`
  )
})

console.log('\n══════ SI ON AVAIT CLASSÉ PAR LONGUEUR (contre-épreuve) ══════')
const byLen = [...scored].sort((a, b) => b.lengthChars - a.lengthChars).slice(0, 8).map(s => s.row.id)
const byRelief = selectCandidates(scored, { limit: 8 }).map(s => s.row.id)
const byNum = [...scored].sort((a, b) => (b.row.numinosity_score ?? 0) - (a.row.numinosity_score ?? 0)).slice(0, 8).map(s => s.row.id)
const inter = (a, b) => a.filter(x => b.includes(x)).length
console.log(`top8 relief ∩ top8 longueur     = ${inter(byRelief, byLen)}/8`)
console.log(`top8 relief ∩ top8 numinosité IA = ${inter(byRelief, byNum)}/8`)
console.log(`top8 numinosité ∩ top8 longueur = ${inter(byNum, byLen)}/8`)

const cands = selectCandidates(scored, { limit: SHORTLIST })
console.log(`\n══════ SHORTLIST (relief ≥ ${MIN_RELIEF}, âge ≥ 30j, non marqué) : ${cands.length} ══════`)
for (const c of cands) {
  console.log(`\n• ${c.row.title} — ${c.row.created_at.slice(0, 10)} · relief ${c.relief.toFixed(2)} · ${c.lengthChars} car.`)
  console.log(`  ${(c.row.raw_text || '').replace(/\s+/g, ' ').slice(0, 300)}…`)
}

fs.writeFileSync('/tmp/b3_scored.json', JSON.stringify(
  scored.map(s => ({ id: s.row.id, title: s.row.title, date: s.row.created_at.slice(0, 10), relief: +s.relief.toFixed(3), len: s.lengthChars, ns: s.row.numinosity_score, marked: s.row.user_marked_numinous, z: s.z, proto: s.prototypes })), null, 1))
console.log('\n→ /tmp/b3_scored.json')
