#!/usr/bin/env node
/**
 * IMPORT LOCAL DREAMS — Script à lancer sur ton Mac
 *
 * Usage:
 *   cd dream-alpha-app
 *   node scripts/import-local-dreams.mjs
 *
 * Pré-requis:
 *   - npm install openai (dans le projet)
 *   - OPENAI_API_KEY dans .env.local
 *   - Les fichiers audio dans le dossier DREAMS_DIR ci-dessous
 *
 * Ce script :
 * 1. Lit chaque fichier m4a
 * 2. L'envoie à Whisper pour transcription
 * 3. Insère le rêve en DB via Supabase REST API
 * 4. Déclenche le pipeline 3 passes (extract → extract-deep → embed)
 */

import fs from 'fs'
import path from 'path'
import OpenAI from 'openai'

// ═══ CONFIG ═══════════════════════════════════════════
const DREAMS_DIR = '/Users/timote/Desktop/THE DREAMING/MY DREAMS AUDIO & CO/reves'
const SUPABASE_URL = 'https://rtrkxzcyblgonwgfzovj.supabase.co'
// B6 2026-07-26 — la clé service_role était ÉCRITE EN DUR ici. Le projet passe
// sous git : une clé de service dans un dépôt, même privé, est une fuite qui ne
// se reprend pas. Elle se lit maintenant dans l'environnement.
//   export SUPABASE_SERVICE_ROLE_KEY='...'   (ou dans .env.local, non committé)
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_KEY) {
  console.error('SUPABASE_SERVICE_ROLE_KEY manquante — export SUPABASE_SERVICE_ROLE_KEY=… avant de lancer ce script.')
  process.exit(1)
}
const DREAM_APP_URL = 'https://dream-alpha-bice.vercel.app'
const USER_ID = '342cf663-eed3-40c9-9327-4bf1c3c998b9' // Tim's user ID from JWT
// ═════════════════════════════════════════════════════

const openai = new OpenAI() // uses OPENAI_API_KEY from env

const AUDIO_EXT = ['.m4a', '.mp3', '.wav', '.webm', '.ogg', '.mp4']

// Extract date from filename
function extractDate(filename) {
  // Pattern: MyRec_MMDD_HHMM or DJ_MMDD_HHMM etc.
  const match = filename.match(/(\d{4})_(\d{4})/)
  if (match) {
    const mmdd = match[1]
    const hhmm = match[2]
    const mm = mmdd.substring(0, 2)
    const dd = mmdd.substring(2, 4)
    const hh = hhmm.substring(0, 2)
    const min = hhmm.substring(2, 4)
    // Assume 2024 for these recordings
    const year = 2024
    const d = new Date(`${year}-${mm}-${dd}T${hh}:${min}:00Z`)
    if (!isNaN(d.getTime()) && d.getMonth() + 1 === parseInt(mm)) {
      return d.toISOString()
    }
  }
  return new Date().toISOString()
}

async function transcribe(filePath) {
  const file = fs.createReadStream(filePath)
  const transcription = await openai.audio.transcriptions.create({
    file,
    model: 'gpt-4o-transcribe',
    language: 'fr',
    response_format: 'text',
  })
  return typeof transcription === 'string' ? transcription : transcription.text || String(transcription)
}

async function insertDream(text, filename, createdAt) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/dreams`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer': 'return=representation',
    },
    body: JSON.stringify({
      user_id: USER_ID,
      raw_text: text,
      entry_type: 'dream',
      source: 'import-audio',
      source_filename: filename,
      created_at: createdAt,
      updated_at: new Date().toISOString(),
    }),
  })
  if (!res.ok) {
    throw new Error(`DB insert failed: ${res.status} ${await res.text()}`)
  }
  const [dream] = await res.json()
  return dream.id
}

async function triggerPipeline(dreamId) {
  try {
    // Passe 1: extract (Haiku)
    await fetch(`${DREAM_APP_URL}/api/dreams/extract`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dreamId, userId: USER_ID }),
    })
    // Passes 2+3 are triggered automatically by extract
  } catch (err) {
    console.log(`  ⚠ Pipeline trigger failed (will retry later): ${err.message}`)
  }
}

async function main() {
  console.log('╔══════════════════════════════════════╗')
  console.log('║   DREAM IMPORT — Whisper + Supabase  ║')
  console.log('╚══════════════════════════════════════╝')
  console.log()

  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY manquante. Lance avec :')
    console.error('   OPENAI_API_KEY=sk-... node scripts/import-local-dreams.mjs')
    console.error('   ou assure-toi que .env.local contient la clé')
    process.exit(1)
  }

  const files = fs.readdirSync(DREAMS_DIR)
    .filter(f => AUDIO_EXT.some(ext => f.toLowerCase().endsWith(ext)))
    .filter(f => !f.includes('(1)')) // skip duplicates
    .sort()

  console.log(`📁 ${files.length} fichiers audio trouvés dans ${DREAMS_DIR}`)
  console.log()

  let success = 0
  let failed = 0
  const errors = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const filePath = path.join(DREAMS_DIR, file)
    const size = (fs.statSync(filePath).size / 1024 / 1024).toFixed(1)
    const createdAt = extractDate(file)

    console.log(`[${i + 1}/${files.length}] 🎙 ${file} (${size}MB)`)

    try {
      // Step 1: Transcribe
      process.stdout.write('  → Whisper... ')
      const transcript = await transcribe(filePath)
      console.log(`✓ (${transcript.length} chars)`)

      if (transcript.trim().length < 10) {
        console.log('  → ⚠ Transcription trop courte, skip')
        failed++
        continue
      }

      // Step 2: Insert in DB
      process.stdout.write('  → Supabase... ')
      const dreamId = await insertDream(transcript, file, createdAt)
      console.log(`✓ (${dreamId})`)

      // Step 3: Trigger pipeline (fire & forget)
      process.stdout.write('  → Pipeline... ')
      await triggerPipeline(dreamId)
      console.log('✓')

      success++
      console.log()
    } catch (err) {
      console.log(`✗ ${err.message}`)
      failed++
      errors.push({ file, error: err.message })
      console.log()
    }

    // Small delay to avoid rate limiting
    if (i < files.length - 1) {
      await new Promise(r => setTimeout(r, 1000))
    }
  }

  console.log('═══════════════════════════════════════')
  console.log(`✅ ${success} rêves importés`)
  if (failed > 0) {
    console.log(`❌ ${failed} échecs`)
    errors.forEach(e => console.log(`   - ${e.file}: ${e.error}`))
  }
  console.log(`💰 Coût estimé Whisper: ~$${(success * 0.006 * 5).toFixed(2)}`) // ~5min avg
  console.log(`💰 Coût estimé pipeline: ~$${(success * 0.01).toFixed(2)}`)
}

main().catch(console.error)
