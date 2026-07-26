/** Effet du KEEP_THRESHOLD de la consultation — B3. Aucune écriture en base. */
import fs from 'node:fs'; import path from 'node:path'
import OpenAI from 'openai'; import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'
const root=path.resolve(process.argv[2]||'.')
for(const l of fs.readFileSync(path.join(root,'.env.local'),'utf8').split('\n')){const m=l.match(/^([A-Z_]+)=(.*)$/);if(m)process.env[m[1]]=m[2].trim()}
const USER='342cf663-eed3-40c9-9327-4bf1c3c998b9'
const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY)
const oa=new OpenAI({apiKey:process.env.OPENAI_API_KEY}); const an=new Anthropic({apiKey:process.env.ANTHROPIC_API_KEY})

// Le prompt de PRODUCTION (consult/route.ts), avec la seule ligne de coupe modifiée
// pour que le modèle NOTE tout au lieu de filtrer lui-même. Le reste est identique.
const base = fs.readFileSync('src/app/api/great-dreams/consult/route.ts','utf8')
const m = base.match(/const RERANK_SYSTEM = `([\s\S]*?)`\n\nfunction/)
let SYS = m[1]
SYS = SYS.replace('Ne rends QUE les rêves à 3 ou plus. Maximum 3.',
  'Note CHAQUE rêve de la liste, de 1 à 5. Ne filtre pas toi-même, ne te limite pas en nombre : je fais la coupe ensuite.')
SYS = SYS.replace('Aucun rêve à la hauteur → {"kept":[]}','Note tous les rêves proposés, sans exception.')

const SITUATIONS=(process.env.B3_SIT||'').split('~~').filter(Boolean)
const DREAM_CHARS=2500

function block(rows){return rows.map((r,i)=>{
 const d=r.created_at?new Date(r.created_at).toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'}):'?'
 const b=(r.raw_text||'').replace(/\s+/g,' ').trim()
 const L=[`### ${i+1}. id=${r.id}`,`Type : ${r.kairos_type||'reve'} · Rêvé le ${d}`]
 if(r.title)L.push(`Titre : ${r.title}`)
 L.push(`Texte : ${b.slice(0,DREAM_CHARS)}${b.length>DREAM_CHARS?' […]':''}`)
 return L.join('\n')}).join('\n\n')}

for(const situation of SITUATIONS){
 console.log('\n'+'═'.repeat(78)+`\nSITUATION : « ${situation} »\n`+'═'.repeat(78))
 const e=await oa.embeddings.create({model:'text-embedding-3-small',input:situation})
 const {data:rows,error}=await sb.rpc('find_great_dreams_for_situation',{p_user_id:USER,p_embedding:e.data[0].embedding,p_scope:'all',p_limit:10,p_min_sim:0.05,p_exclude_great:true})
 if(error){console.log('RPC ERR',error.message);continue}
 const res=await an.messages.create({model:'claude-sonnet-4-6',max_tokens:2000,temperature:0.2,system:SYS,
  messages:[{role:'user',content:`## La situation que traverse le rêveur, dans ses mots\n« ${situation} »\n\n## Ses autres rêves et moments notés (${rows.length})\n\n${block(rows)}\n\nNote chacun.`}]})
 const txt=res.content.find(c=>c.type==='text').text
 const kept=JSON.parse(txt.match(/\{[\s\S]*\}/)[0]).kept
 const byId=new Map(rows.map(r=>[r.id,r]))
 kept.sort((a,b)=>b.score-a.score)
 console.log('\n-- NOTES ATTRIBUÉES (tous les candidats examinés) --')
 for(const k of kept){const r=byId.get(k.id); if(!r)continue
  console.log(` [${k.score}/5] ${(r.title||'?').slice(0,50)}  (cos ${Number(r.similarity).toFixed(3)})`)
  console.log(`       « ${k.reason} »`)}
 for(const th of [2,3,4]){
  const n=kept.filter(k=>k.score>=th).slice(0,3)
  console.log(`\n  SEUIL ${th} → ${n.length} servi(s) : ${n.map(k=>(byId.get(k.id)?.title||'?').slice(0,40)+` [${k.score}]`).join(' | ')||'(silence)'}`)}
}
