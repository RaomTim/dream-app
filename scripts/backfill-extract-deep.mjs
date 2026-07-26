#!/usr/bin/env node
/**
 * BACKFILL EXTRACT-DEEP — Dream App (Chemin B appliqué à TOUT le journal)
 *
 * Contexte 2026-04-20 :
 *   Le prompt DEEP_EXTRACTION_SYSTEM est passé en voix absorbée (plus de
 *   "selon Hillman", plus de pages, plus de bibliographie scholaire).
 *   Les anciennes analyses portent encore des champs avec noms d'auteur.
 *   Ce script RELIT tout le journal pour régénérer body_symbolism, amplification,
 *   figure_types, archetypal_process avec la nouvelle voix + la nouvelle
 *   Forêt pgvector (41 livres dream-pertinents scopés).
 *
 * Usage :
 *   cd dream-alpha-app
 *   node scripts/backfill-extract-deep.mjs
 *
 * Options :
 *   --dry-run          : liste mais n'appelle pas (preview)
 *   --limit=N          : max N entrées (défaut : aucune limite)
 *   --entry-types=X,Y  : filtre (défaut : dream,reve,reentry,day)
 *   --user-id=XYZ      : filtre user (défaut : tous)
 *   --min-text=40      : ignore textes < N chars (défaut 40)
 *   --pacing-ms=3000   : délai entre appels (défaut 3000ms — Sonnet est lent)
 *
 * Sûr à relancer : pas de side-effect destructif, extract-deep UPDATE
 * les champs (ne supprime pas).
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// ── Charger .env.local ──
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

// ── Parse CLI ──
const args = process.argv.slice(2).reduce((acc, a) => {
  if (a === '--dry-run') acc.dryRun = true
  else if (a.startsWith('--limit=')) acc.limit = parseInt(a.split('=')[1], 10)
  else if (a.startsWith('--entry-types=')) acc.entryTypes = a.split('=')[1].split(',')
  else if (a.startsWith('--user-id=')) acc.userId = a.split('=')[1]
  else if (a.startsWith('--min-text=')) acc.minText = parseInt(a.split('=')[1], 10)
  else if (a.startsWith('--pacing-ms=')) acc.pacingMs = parseInt(a.split('=')[1], 10)
  return acc
}, { dryRun: false, entryTypes: ['dream', 'reve', 'reentry', 'day'], minText: 40, pacingMs: 3000 })

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// ── Fetch dreams ──
async function fetchDreams() {
  const types = args.entryTypes.map((t) => `"${t}"`).join(',')
  let url = `${SUPABASE_URL}/rest/v1/dreams?select=id,user_id,entry_type,raw_text,title,archetypal_process,updated_at,created_at&entry_type=in.(${types})&order=created_at.desc`
  if (args.userId) url += `&user_id=eq.${encodeURIComponent(args.userId)}`
  if (args.limit) url += `&limit=${args.limit}`
  const res = await fetch(url, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  })
  if (!res.ok) throw new Error(`Supabase fetch failed: ${res.status} ${await res.text()}`)
  return res.json()
}

async function extractDeep(dreamId, entryType) {
  const res = await fetch(`${DREAM_APP_URL}/api/dreams/extract-deep`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dreamId, entryType }),
  })
  const body = await res.text()
  if (!res.ok) throw new Error(`extract-deep ${res.status}: ${body.substring(0, 200)}`)
  try { return JSON.parse(body) } catch { return { ok: false } }
}

// ── Main ──
async function main() {
  console.log('🌲 BACKFILL EXTRACT-DEEP — Dream App (voix absorbée)')
  console.log(`📡 ${DREAM_APP_URL}`)
  console.log(`🎯 types=${args.entryTypes.join(',')} min_text=${args.minText} pacing=${args.pacingMs}ms${args.userId ? ' user=' + args.userId : ''}`)
  console.log(args.dryRun ? '🔬 DRY RUN — aucun appel API' : '🔴 LIVE — appels réels')
  console.log('')

  const dreams = await fetchDreams()
  console.log(`📊 ${dreams.length} entrées trouvées`)
  const eligible = dreams.filter((d) => (d.raw_text || '').length >= args.minText)
  console.log(`📊 ${eligible.length} éligibles (texte >= ${args.minText} chars)`)
  console.log('')

  if (args.dryRun) {
    eligible.slice(0, 10).forEach((d, i) => {
      console.log(`[${i + 1}] ${d.id.substring(0, 8)} ${d.entry_type} ${(d.title || d.raw_text || '').substring(0, 60)}`)
    })
    if (eligible.length > 10) console.log(`… + ${eligible.length - 10} autres`)
    return
  }

  const estimatedMin = Math.round((eligible.length * (args.pacingMs + 6000)) / 60000)
  console.log(`⏱️  Durée estimée : ~${estimatedMin} min (Sonnet ~6s/rêve + pacing)`)
  console.log('')

  let ok = 0, errors = 0
  const startedAt = Date.now()

  for (let i = 0; i < eligible.length; i++) {
    const d = eligible[i]
    const preview = (d.title || d.raw_text || '').substring(0, 50).replace(/\n/g, ' ')
    const elapsed = Math.round((Date.now() - startedAt) / 1000)
    console.log(`[${i + 1}/${eligible.length}] ${d.id.substring(0, 8)} ${d.entry_type} — ${preview}  (elapsed ${elapsed}s)`)

    try {
      const result = await extractDeep(d.id, d.entry_type)
      const chunks = result.forest?.chunks_used ?? 0
      const tokens = result.tokens?.output ?? 0
      console.log(`         ✅ forest_chunks=${chunks} output_tokens=${tokens}`)
      ok++
    } catch (e) {
      console.log(`         ❌ ${e.message}`)
      errors++
    }

    if (i < eligible.length - 1) await sleep(args.pacingMs)
  }

  console.log('')
  console.log('─'.repeat(60))
  console.log(`✅ Done : ${ok} / ${eligible.length}  ·  ❌ ${errors}`)
  console.log(`⏱️  Total : ${Math.round((Date.now() - startedAt) / 1000)}s`)
}

main().catch((err) => {
  console.error('❌ FATAL:', err)
  process.exit(1)
})
