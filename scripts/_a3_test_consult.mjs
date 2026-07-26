/**
 * TEST RÉEL de /api/great-dreams/consult — agent A3, 2026-07-26.
 * Rejoue exactement la logique de la route (embedding -> RPC -> re-rank LLM)
 * hors HTTP/auth/cadence, sur le compte de Tim.
 * Fichier de test — à supprimer après le rapport.
 */
import fs from 'node:fs'
import path from 'node:path'
import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const root = path.resolve(process.argv[2] || '.')
for (const line of fs.readFileSync(path.join(root, '.env.local'), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/)
  if (m) process.env[m[1]] = m[2].trim()
}

const USER = '342cf663-eed3-40c9-9327-4bf1c3c998b9'
const MODEL_RERANK = 'claude-sonnet-4-6'
const RECALL_LIMIT = 10, MIN_SIM = 0.05, KEEP_THRESHOLD = 3, MAX_KEPT = 3, DREAM_CHARS = 2500

const RERANK_SYSTEM = `Tu tries des rêves. Tu ne les interprètes JAMAIS.

Un rêveur traverse une difficulté. On te donne sa situation, puis une liste de ses propres rêves et moments notés. Tu dis lesquels valent d'être relus MAINTENANT, à côté de cette situation — et lesquels ne valent pas.

## Ta seule question pour chaque rêve
« Si cette personne relisait ce rêve ce soir avec sa difficulté en tête, est-ce que quelque chose se passerait ? »
Pas « est-ce que le sujet est proche ». Un rêve peut parler du même sujet et n'apporter rien ; un rêve sans rapport apparent peut porter exactement la même tension.

## La barre est HAUTE
Le rêveur a dit : ne me ramène pas du bruit, ramène-moi du contenu de très haute qualité qui me soutienne.
- Mieux vaut rendre 1 rêve juste que 4 rêves plausibles.
- **Rendre une liste VIDE est une bonne réponse** quand rien ne touche vraiment. C'est attendu, ce n'est pas un échec. Ne remplis jamais pour remplir.
- Ne retiens jamais un rêve juste parce qu'il est le « moins pire » du lot.

## Le corpus est du brut de dictée — attention
Ces textes sont des transcriptions vocales au réveil. Ils contiennent :
- du cadrage à ignorer : « Journal de rêve, 13 janvier », « j'ai pas pris le réflexe de les enregistrer », « je viens de passer dix minutes à raconter mon rêve mais ça n'a pas enregistré », « bon déjà j'ai bien dormi » ;
- de la transcription fautive (mots déformés, phrases coupées) ;
- parfois PLUSIEURS rêves différents dans une même entrée.
Juge uniquement la MATIÈRE ONIRIQUE. Ne compte jamais le bavardage de cadrage comme du contenu. Si une entrée contient plusieurs rêves, juge celui qui touche, et cite-le lui.

## Interdits absolus dans ta raison
- Dire ce que le rêve VEUT DIRE, ou ce qu'il dit de la situation.
- Faire le lien à la place du rêveur : pas de « ce qui fait écho à », « cela symbolise », « ton inconscient », « c'est-à-dire », « comme ta relation ».
- Parler du rêveur : pas de « tu es en évitement », « tu as peur de », « tu cherches ».
- Rassurer, prédire, conseiller, poser une question.

## Ce que ta raison DOIT être
Une phrase courte et FACTUELLE : ce qu'il y a DANS le rêve. Rien de plus. Le rêveur fait le rapprochement lui-même — c'est tout l'intérêt.
- BIEN : « Une école, une course contre la montre pour retrouver quelqu'un, et la porte reste fermée. »
- BIEN : « Un maître aveugle qui guide quand même le bateau. »
- MAL : « Ce rêve montre que tu cherches ta place. » (interprétation)
- MAL : « L'école fait écho à ton sentiment de ne pas être à la hauteur. » (rapprochement énoncé)

## Notation
5 = touche la situation en plein, le rêveur va le sentir immédiatement
4 = touche vraiment
3 = touche assez pour valoir la relecture (la barre)
2 = thème voisin, mais rien ne se passerait
1 = aucun rapport réel

Ne rends QUE les rêves à 3 ou plus. Maximum 3.

Réponds STRICTEMENT en JSON, sans texte autour :
{"kept":[{"id":"<uuid exact>","score":<1-5>,"reason":"<une phrase factuelle>"}]}
Aucun rêve à la hauteur → {"kept":[]}`

function buildCandidateBlock(rows) {
  return rows.map((r, i) => {
    const date = r.created_at ? new Date(r.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '?'
    const bodyTxt = (r.raw_text || '').replace(/\s+/g, ' ').trim()
    const lines = [`### ${i + 1}. id=${r.id}`, `Type : ${r.kairos_type || 'reve'} · Rêvé le ${date}`]
    if (r.title) lines.push(`Titre : ${r.title}`)
    if (r.great_dream_note) lines.push(`>> Ce que le rêveur en dit lui-même : « ${r.great_dream_note} »`)
    if (Array.isArray(r.great_dream_facets) && r.great_dream_facets.length) {
      const lbl = { change: "ça l'a changé", force: 'ça lui donne de la force', ouvert: "il n'a pas fini de le comprendre" }
      lines.push(`>> Il a marqué ce rêve : ${r.great_dream_facets.map(f => lbl[f] || f).join(' · ')}`)
    }
    lines.push(`Texte : ${bodyTxt.slice(0, DREAM_CHARS)}${bodyTxt.length > DREAM_CHARS ? ' […]' : ''}`)
    return lines.join('\n')
  }).join('\n\n')
}

async function rerank(anthropic, situation, rows, label) {
  if (!rows.length) return []
  const userMsg = `## La situation que traverse le rêveur, dans ses mots
« ${situation} »

## ${label} (${rows.length})

${buildCandidateBlock(rows)}

Lesquels valent d'être relus ce soir à côté de cette situation ? Rappelle-toi : la liste vide est une bonne réponse.`
  const res = await anthropic.messages.create({
    model: MODEL_RERANK, max_tokens: 1200, temperature: 0.2,
    system: RERANK_SYSTEM, messages: [{ role: 'user', content: userMsg }],
  })
  const blk = res.content.find(c => c.type === 'text')
  const text = blk ? blk.text : ''
  const m = text.match(/\{[\s\S]*\}/)
  if (!m) { console.log('  !! pas de JSON:', text.slice(0, 200)); return [] }
  let parsed; try { parsed = JSON.parse(m[0]) } catch { console.log('  !! JSON illisible'); return [] }
  const valid = new Set(rows.map(r => r.id))
  return (parsed.kept || [])
    .filter(k => k && valid.has(k.id) && typeof k.score === 'number' && k.score >= KEEP_THRESHOLD)
    .sort((a, b) => b.score - a.score).slice(0, MAX_KEPT)
}

const SITUATIONS = [
  'je me sens jamais assez dans ma relation',
  'je ne sais plus où je vais professionnellement',
  "j'ai peur de décevoir",
]

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

for (const situation of SITUATIONS) {
  console.log('\n' + '═'.repeat(78))
  console.log('SITUATION : « ' + situation + ' »')
  console.log('═'.repeat(78))
  const emb = await openai.embeddings.create({ model: 'text-embedding-3-small', input: situation })
  const vec = emb.data[0].embedding

  const [g, a] = await Promise.all([
    sb.rpc('find_great_dreams_for_situation', { p_user_id: USER, p_embedding: vec, p_scope: 'great', p_limit: RECALL_LIMIT, p_min_sim: MIN_SIM, p_exclude_great: false }),
    sb.rpc('find_great_dreams_for_situation', { p_user_id: USER, p_embedding: vec, p_scope: 'all', p_limit: RECALL_LIMIT, p_min_sim: MIN_SIM, p_exclude_great: true }),
  ])
  if (g.error || a.error) { console.log('RPC ERROR', g.error || a.error); continue }

  console.log(`\n-- rappel brut par cosinus (ce que l'embedding SEUL proposerait) --`)
  console.log('   [A grands rêves] ' + (g.data || []).map(r => `${(r.title || 'sans titre').slice(0, 34)} (${r.similarity.toFixed(3)})`).join(' | '))
  console.log('   [B corpus]       ' + (a.data || []).slice(0, 6).map(r => `${(r.title || 'sans titre').slice(0, 34)} (${r.similarity.toFixed(3)})`).join(' | '))

  const [kg, ka] = await Promise.all([
    rerank(anthropic, situation, g.data || [], 'Les rêves que le rêveur a lui-même marqués comme grands'),
    rerank(anthropic, situation, a.data || [], 'Ses autres rêves et moments notés'),
  ])
  const byId = new Map([...(g.data || []), ...(a.data || [])].map(r => [r.id, r]))
  const show = (kept, label) => {
    console.log(`\n>> ${label} — ${kept.length} retenu(s) sur ${label.includes('A') ? (g.data || []).length : (a.data || []).length} examinés`)
    if (!kept.length) { console.log('   (silence)'); return }
    for (const k of kept) {
      const r = byId.get(k.id)
      console.log(`   • [${k.score}/5] ${r?.title || 'sans titre'} — ${new Date(r?.created_at).toLocaleDateString('fr-FR')} (cos ${r?.similarity.toFixed(3)})`)
      console.log(`     « ${k.reason} »`)
    }
  }
  show(kg, 'LECTURE A · grands rêves')
  show(ka, 'LECTURE B · corpus entier')
}
console.log('\n[fin]')
