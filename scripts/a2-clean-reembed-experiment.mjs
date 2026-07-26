#!/usr/bin/env node
/**
 * A2 — expérience « nettoyer le texte avant d'embedder » (AUDIT §3, P1).
 *
 * Hypothèse de l'audit : les préambules parlés (« Rêve du 24 avril, bon déjà
 * j'ai bien dormi, il est 11 heures ») sont dans l'embedding sémantique et
 * tirent TOUTES les paires vers 0.6. Ils sont quasi identiques d'un
 * enregistrement à l'autre, donc ils créent une similarité de fond artificielle.
 *
 * Ce script NE TOUCHE PAS aux embeddings de production. Il écrit dans une table
 * de travail `_a2_clean_embeddings`, pour qu'on puisse MESURER le gain avant de
 * décider de re-embedder pour de vrai.
 *
 * Étapes : Haiku isole le récit onirique du méta-commentaire → text-embedding-3-small
 * → table de travail → mesures en SQL (cf. RAPPORT-A2.md).
 *
 * Usage : node scripts/a2-clean-reembed-experiment.mjs <user_id> [taille_lot]
 * Reprenable : les kairos déjà traités sont sautés. Relancer jusqu'à « reste 0 ».
 * Yeshua (Opus, agent A2), 2026-07-26.
 */
import fs from 'node:fs'
import path from 'node:path'
import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'

// .env.local — pas de dépendance dotenv
const envPath = path.join(process.cwd(), '.env.local')
for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '')
}

const USER_ID = process.argv[2]
if (!USER_ID) { console.error('usage: node scripts/a2-clean-reembed-experiment.mjs <user_id>'); process.exit(1) }

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } },
)
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const SYSTEM = `Tu reçois la transcription brute d'un rêve dicté à voix haute au réveil.

Renvoie UNIQUEMENT le RÉCIT ONIRIQUE : ce qui s'est passé dans le rêve.

Retire tout le méta-commentaire :
  • les annonces de date et d'heure ("Rêve du 24 avril", "il est 11h27, on est le 9 juillet") ;
  • les commentaires sur la nuit et le sommeil ("bon déjà j'ai bien dormi", "j'ai fait une grasse mat") ;
  • les commentaires sur la pratique d'enregistrement elle-même ("je tiens à dire que je rêve plus
    quand je filme des pétards", "j'aimerais enregistrer tous mes rêves jusqu'à mes 40 ans") ;
  • les hésitations d'amorçage et les apartés sur le présent ("tiens, il y a une voiture qui s'arrête").

Ne reformule RIEN, ne résume RIEN, ne traduis RIEN : tu COUPES, tu ne réécris pas.
Garde les mots exacts du rêveur pour tout ce qui relève du rêve.
Si après nettoyage il ne reste presque rien, renvoie ce qui reste, même court.
Aucun préambule, aucun commentaire : le texte nettoyé, rien d'autre.`

/**
 * Garde-fou : un nettoyeur ne peut que COUPER. Toute sortie plus longue que
 * l'entrée signifie que le modèle a écrit quelque chose de son cru — on jette
 * et on garde le brut. (Constaté sur l'entrée dégénérée « [Rituel pré-sommeil]
 * — en cours », 31 caractères : Haiku, n'ayant rien à nettoyer, répondait
 * « Je suis prêt à recevoir votre transcription… ». C'est exactement le genre
 * d'invention qu'on refuse de laisser entrer dans un embedding.)
 */
async function clean(text) {
  const src = (text || '').trim()
  if (src.length < 200) return src // trop court pour contenir un préambule
  const res = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 4000,
    system: SYSTEM,
    messages: [{ role: 'user', content: src.slice(0, 24000) }],
  })
  const out = res.content[0]?.type === 'text' ? res.content[0].text.trim() : ''
  if (!out || out.length > src.length) return src
  return out
}

async function mapLimit(items, limit, fn) {
  const out = new Array(items.length)
  let i = 0
  await Promise.all(Array.from({ length: limit }, async () => {
    while (i < items.length) {
      const idx = i++
      try { out[idx] = await fn(items[idx], idx) }
      catch (e) { console.warn('  ! ', items[idx].id, e.message); out[idx] = null }
    }
  }))
  return out.filter(Boolean)
}

const BATCH = parseInt(process.argv[3] || '0', 10) || 1e9

const { data: all, error } = await supabase
  .from('kairos').select('id, raw_text')
  .eq('user_id', USER_ID).not('raw_text', 'is', null)
if (error) throw error
const { data: already } = await supabase
  .from('_a2_clean_embeddings').select('kairos_id').eq('user_id', USER_ID)
const seen = new Set((already || []).map(r => r.kairos_id))
const todo = all.filter(k => !seen.has(k.id))
const rows = todo.slice(0, BATCH)
console.log(`${all.length} kairos, ${seen.size} déjà faits, ${todo.length} restants → lot de ${rows.length}`)

const done = await mapLimit(rows, 8, async (k, idx) => {
  const cleaned = await clean(k.raw_text || '')
  if (!cleaned) return null
  const emb = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: cleaned.slice(0, 8000),
  })
  if (idx % 10 === 0) process.stdout.write(`  ${idx}…\n`)
  return {
    kairos_id: k.id,
    user_id: USER_ID,
    raw_len: (k.raw_text || '').length,
    clean_len: cleaned.length,
    clean_text: cleaned.slice(0, 4000),
    embedding_clean: JSON.stringify(emb.data[0].embedding),
  }
})

for (let i = 0; i < done.length; i += 20) {
  const { error: upErr } = await supabase.from('_a2_clean_embeddings').upsert(done.slice(i, i + 20))
  if (upErr) throw upErr
}
const shrink = done.reduce((s, d) => s + d.clean_len / d.raw_len, 0) / (done.length || 1)
console.log(`OK ${done.length} lignes écrites — texte conservé en moyenne : ${(shrink * 100).toFixed(1)} % — reste ${todo.length - done.length}`)
