#!/usr/bin/env node
/**
 * BACKFILL EMBEDDINGS + EXTRACT-DEEP — Dream App
 *
 * Usage:
 *   cd dream-alpha-app
 *   node scripts/backfill-embeddings.mjs
 *
 * Ce script :
 * 1. Trouve tous les dreams (entry_type in dream|reve|reentry) sans embedding
 * 2. Pour chacun : si archetypal_process manque → appelle /api/dreams/extract-deep
 * 3. Puis : appelle /api/dreams/embed pour générer le vecteur 1536 dims
 * 4. Séquentiel avec 800ms entre chaque rêve pour pas étrangler Supabase / Anthropic
 *
 * Sûr à relancer : skippe les rêves qui ont déjà embedding.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Charger .env.local
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z_]+)=(.*)$/)
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rtrkxzcyblgonwgfzovj.supabase.co'
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const DREAM_APP_URL = process.env.DREAM_APP_URL || 'https://dream-alpha-bice.vercel.app'

if (!SUPABASE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY manquante dans .env.local')
  process.exit(1)
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms))

// ─────────────────────────────────────────────────────────
// 1. Récupérer les rêves à backfiller
// ─────────────────────────────────────────────────────────
async function fetchDreamsToBackfill() {
  const url = `${SUPABASE_URL}/rest/v1/dreams?select=id,user_id,entry_type,archetypal_process,raw_text,title&embedding=is.null&entry_type=in.(dream,reve,reentry)&order=created_at.desc`
  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  })
  if (!res.ok) throw new Error(`Supabase fetch failed: ${res.status} ${await res.text()}`)
  return res.json()
}

// ─────────────────────────────────────────────────────────
// 2. Pipeline par rêve
// ─────────────────────────────────────────────────────────
async function extractDeep(dreamId) {
  const res = await fetch(`${DREAM_APP_URL}/api/dreams/extract-deep`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dreamId }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`extract-deep ${res.status}: ${body.substring(0, 200)}`)
  }
  return res.json()
}

async function embed(dreamId) {
  const res = await fetch(`${DREAM_APP_URL}/api/dreams/embed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dreamId }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`embed ${res.status}: ${body.substring(0, 200)}`)
  }
  return res.json()
}

// ─────────────────────────────────────────────────────────
// 3. Main
// ─────────────────────────────────────────────────────────
async function main() {
  console.log('🌙 BACKFILL EMBEDDINGS — Dream App')
  console.log(`📡 ${DREAM_APP_URL}`)
  console.log('')

  const dreams = await fetchDreamsToBackfill()
  console.log(`📊 ${dreams.length} rêves sans embedding à traiter`)
  console.log('')

  if (dreams.length === 0) {
    console.log('✅ Rien à faire — tous les rêves ont déjà un embedding.')
    return
  }

  let ok = 0, skipped = 0, errors = 0
  for (let i = 0; i < dreams.length; i++) {
    const d = dreams[i]
    const preview = (d.title || d.raw_text || '').substring(0, 50)
    const needsDeep = !d.archetypal_process
    const textLen = (d.raw_text || '').length

    console.log(`[${i + 1}/${dreams.length}] ${d.id.substring(0, 8)} — ${preview}`)
    console.log(`         entry_type=${d.entry_type}, text_len=${textLen}, needs_deep=${needsDeep}`)

    // Skip textes trop courts (< 40 char) — pas assez de substrat pour extract-deep
    if (textLen < 40) {
      console.log('         ⏭️  text trop court, embed direct...')
      try {
        await embed(d.id)
        console.log('         ✅ embedded')
        ok++
      } catch (e) {
        console.log(`         ❌ ${e.message}`)
        errors++
      }
      await sleep(800)
      continue
    }

    try {
      if (needsDeep) {
        console.log('         🧠 extract-deep (Sonnet)...')
        await extractDeep(d.id)
      }
      console.log('         🧬 embed (OpenAI 1536d)...')
      await embed(d.id)
      console.log('         ✅ done')
      ok++
    } catch (e) {
      console.log(`         ❌ ${e.message}`)
      errors++
    }

    await sleep(800) // pacing pour pas surcharger
  }

  console.log('')
  console.log('─'.repeat(50))
  console.log(`✅ Done : ${ok} / ${dreams.length}  ·  ❌ ${errors}  ·  ⏭️ ${skipped}`)
}

main().catch(err => {
  console.error('❌ FATAL:', err)
  process.exit(1)
})
