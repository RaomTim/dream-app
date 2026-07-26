/** TEST RÉEL du lecteur — agent B3. Aucune écriture en base. Supprimable. */
import fs from 'node:fs'; import path from 'node:path'
import { createClient } from '@supabase/supabase-js'
import { scoreCorpus, selectCandidates, SHORTLIST } from '../src/lib/kairos/great-dream-detect.ts'
import { readCandidates } from '../src/lib/kairos/great-dream-reader.ts'
const root = path.resolve(process.argv[2] || '.')
for (const l of fs.readFileSync(path.join(root,'.env.local'),'utf8').split('\n')) { const m=l.match(/^([A-Z_]+)=(.*)$/); if(m) process.env[m[1]]=m[2].trim() }
const USER='342cf663-eed3-40c9-9327-4bf1c3c998b9'
const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
const {data:rows}=await sb.from('kairos').select('id, created_at, title, raw_text, kairos_type, user_marked_numinous, numinosity_score, affective_intensity, motif_tags, archetypal_tags, life_themes, root_dream_patterns, somatic_markers, sensorial_qualities, temporal_signature, thresholds_passages, paradoxes_unresolved, narrative_dynamics').eq('user_id',USER).limit(1000)
const {scored}=scoreCorpus(rows)
const cands=selectCandidates(scored,{limit:SHORTLIST})
console.log(`SHORTLIST envoyée au lecteur : ${cands.length}`)
cands.forEach((c,i)=>console.log(` ${i+1}. relief ${c.relief.toFixed(2)} · ${c.row.title} (${c.lengthChars} car.)`))
const kept=await readCandidates(cands)
console.log(`\n══════ VERDICT DU LECTEUR ══════`)
if(kept===null){console.log('PANNE → rien proposé (comportement sûr)');process.exit(0)}
console.log(`gardés : ${kept.length} / ${cands.length}\n`)
for(const k of kept){ const c=cands.find(x=>x.row.id===k.id)
  console.log(`✓ ${c.row.title} — ${c.row.created_at.slice(0,10)} · relief ${c.relief.toFixed(2)} · ${c.lengthChars} car.`)
  console.log(`  IMAGE RENDUE : « ${k.image} »\n`) }
const rej=cands.filter(c=>!kept.find(k=>k.id===c.row.id))
console.log(`écartés par le lecteur : ${rej.map(r=>r.row.title).join(' · ')||'(aucun)'}`)
