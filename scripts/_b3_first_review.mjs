/** PREMIÈRE REVIEW telle que Tim la recevrait — B3. AUCUNE écriture en base. */
import fs from 'node:fs'; import path from 'node:path'
import { createClient } from '@supabase/supabase-js'
import { scoreCorpus, selectCandidates, SHORTLIST, FIRST_REVIEW_MAX, MIN_RELIEF } from '../src/lib/kairos/great-dream-detect.ts'
import { nameCandidates } from '../src/lib/kairos/great-dream-reader.ts'
const root=path.resolve(process.argv[2]||'.')
for(const l of fs.readFileSync(path.join(root,'.env.local'),'utf8').split('\n')){const m=l.match(/^([A-Z_]+)=(.*)$/);if(m)process.env[m[1]]=m[2].trim()}
const U='342cf663-eed3-40c9-9327-4bf1c3c998b9'
const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY)
const {data:rows}=await sb.from('kairos').select('id, created_at, title, raw_text, kairos_type, user_marked_numinous, numinosity_score, affective_intensity, motif_tags, archetypal_tags, life_themes, root_dream_patterns, somatic_markers, sensorial_qualities, temporal_signature, thresholds_passages, paradoxes_unresolved, narrative_dynamics, protocol_completed_at').eq('user_id',U).limit(2000)
const {data:it}=await sb.from('kairos_interpretations').select('kairos_id').eq('user_id',U)
const ic=new Map(); for(const i of it||[]) ic.set(i.kairos_id,(ic.get(i.kairos_id)??0)+1)
for(const r of rows){r.interpretation_count=ic.get(r.id)??0; r.protocol_done=!!r.protocol_completed_at}
const {scored,diagnostics}=scoreCorpus(rows)
const short=selectCandidates(scored,{limit:SHORTLIST})
console.log(`corpus ${diagnostics.corpus} → ${diagnostics.eligible} éligibles (${diagnostics.duplicatesDropped} doublons/fragments écartés)`)
console.log(`corr(longueur, relief) : ${diagnostics.corrLengthBefore.toFixed(3)} AVANT résidualisation → ${diagnostics.corrLengthAfter.toFixed(3)} APRÈS`)
console.log(`shortlist (relief ≥ ${MIN_RELIEF}σ, âge ≥ 30j, non marqué) : ${short.length}\n`)
const named=await nameCandidates(short)
const by=new Map(short.map(s=>[s.row.id,s]))
const chosen=(named||[]).filter(v=>by.has(v.id)).sort((a,b)=>by.get(b.id).relief-by.get(a.id).relief).slice(0,FIRST_REVIEW_MAX)
console.log('═'.repeat(78)); console.log(`CE QUE TIM VERRAIT : ${chosen.length} propositions`); console.log('═'.repeat(78))
for(const v of chosen){const s=by.get(v.id)
 console.log(`\n▸ ${s.row.title||'(sans titre)'} — ${s.row.created_at.slice(0,10)}`)
 console.log(`  IMAGE MONTRÉE : « ${v.image} »`)
 console.log(`  [interne, jamais affiché] relief ${s.relief.toFixed(2)}σ · ${s.lengthChars} car. · numinosité IA ${(s.row.numinosity_score??0).toFixed(2)} · proto ${s.prototypes.join(',')}`)
 console.log(`  EXTRAIT : ${(s.row.raw_text||'').replace(/\s+/g,' ').slice(0,420)}…`)}
const rej=short.filter(s=>!chosen.find(c=>c.id===s.row.id))
console.log(`\nécartés par le lecteur (pas des rêves relisables) : ${rej.map(r=>r.row.title).join(' · ')||'(aucun)'}`)
