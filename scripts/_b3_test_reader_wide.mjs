/** Le lecteur voit-il plus large ? — B3. Shortlist élargie, plancher désactivé. */
import fs from 'node:fs'; import path from 'node:path'
import { createClient } from '@supabase/supabase-js'
import { scoreCorpus } from '../src/lib/kairos/great-dream-detect.ts'
import { readCandidates } from '../src/lib/kairos/great-dream-reader.ts'
const root=path.resolve(process.argv[2]||'.')
for(const l of fs.readFileSync(path.join(root,'.env.local'),'utf8').split('\n')){const m=l.match(/^([A-Z_]+)=(.*)$/);if(m)process.env[m[1]]=m[2].trim()}
const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY)
const {data:rows}=await sb.from('kairos').select('id, created_at, title, raw_text, kairos_type, user_marked_numinous, numinosity_score, affective_intensity, motif_tags, archetypal_tags, life_themes, root_dream_patterns, somatic_markers, sensorial_qualities, temporal_signature, thresholds_passages, paradoxes_unresolved, narrative_dynamics').eq('user_id','342cf663-eed3-40c9-9327-4bf1c3c998b9').limit(1000)
const {scored}=scoreCorpus(rows)
const N=Number(process.argv[3]||12)
// pas de plancher, pas d'exclusion de marqué : on veut savoir ce que le LECTEUR fait
const pool=scored.filter(s=>!s.row.user_marked_numinous).slice(0,N)
console.log(`Pool de ${pool.length} (plancher de relief DÉSACTIVÉ) :`)
pool.forEach((c,i)=>console.log(` ${String(i+1).padStart(2)}. ${c.relief.toFixed(2)} ${c.row.title}`))
const kept=await readCandidates(pool)
console.log(`\ngardés : ${kept?.length} / ${pool.length}\n`)
for(const k of kept||[]){const c=pool.find(x=>x.row.id===k.id)
  console.log(`✓ [relief ${c.relief.toFixed(2)}] ${c.row.title} — ${c.lengthChars} car.\n  « ${k.image} »\n`)}
