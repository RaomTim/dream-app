import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { requireAuth } from '@/lib/auth-server'
import { reqLang } from '@/lib/req-lang'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

/**
 * ⚠️ Route de FIDÉLITÉ — elle ne traduit JAMAIS.
 * On restitue ce qui a été DIT, dans la langue où ça a été dit. Un rêveur qui a
 * choisi l'anglais dans l'app mais qui raconte son rêve en français doit récupérer
 * son rêve en français : c'est SON texte, pas une sortie de Dream.
 * La langue de l'UI (`X-Dream-Lang`) ne sert que d'INDICE de désambiguïsation
 * quand la voix est pâteuse et que le modèle hésite entre deux langues.
 */

/**
 * ⚠️ A1/B2 2026-07-26 — LA LIMITE QUI A COÛTÉ UN RÊVE DE 8 MIN.
 * **Vercel refuse tout corps de requête > 4,5 Mo**, à l'entrée, avant que cette
 * fonction ne s'exécute. Le `MAX_SIZE = 10 Mo` ci-dessous n'est donc JAMAIS
 * atteint depuis un navigateur : la plateforme a déjà renvoyé 413.
 *
 * DURÉE MAXIMALE PAR CETTE ROUTE (au débit d'archive de `capture-safety`) :
 *   · Opus 64 kbps mono (8 ko/s)  → 4,5 Mo ≈ **9 min 20**
 *   · AAC 128 kbps mono (16 ko/s) → 4,5 Mo ≈ **4 min 40**
 * Ces chiffres ne sont PAS une limite du produit : au-delà, l'enregistrement
 * change de ROUTE, pas de qualité. Le chemin d'archive est
 *   `/api/kairos/audio/signed-upload` (upload client→Storage direct, hors Vercel)
 *   puis `/api/transcribe-from-storage`, qui découpe dans le conteneur et n'a
 *   **aucune limite de durée**.
 * ⚠️ Ne JAMAIS baisser le débit d'enregistrement pour faire tenir un rêve ici :
 * c'est l'erreur du 26/07 au matin. On change de route, pas de voix.
 */
export const maxDuration = 300

// 🔒 2026-04-20 FIX BRECHE : minimum auth gate.
// 🔒 2026-04-23 TIER 2 : Bearer auth migration
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const audioFile = formData.get('audio') as File

    // 🔒 2026-04-23 TIER 2 : Bearer auth migration
    // formData doesn't carry a parseable body for requireAuth, pass userId from formData as fallback
    const legacyBody = { userId: formData.get('userId') as string | null }
    const auth = await requireAuth(req, legacyBody)
    if ('error' in auth) return auth.error

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file' }, { status: 400 })
    }

    // Bound audio size (Whisper cap = 25MB, on tranche à 10MB pour l'input live)
    const MAX_SIZE = 10 * 1024 * 1024
    if (audioFile.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `Audio trop gros (${Math.round(audioFile.size / 1024 / 1024)}MB, max 10MB) — ce n'est pas une perte : passe par /api/kairos/audio/signed-upload puis /api/transcribe-from-storage (capture live, aucune limite de durée), ou /api/dreams/import-from-storage (import).` },
        { status: 413 }
      )
    }

    // Indice (jamais une contrainte) : la langue dans laquelle le rêveur utilise l'app.
    const lang = reqLang(req)
    const hint = lang === 'en'
      ? 'Dream told on waking, voice sometimes slurred. English or French — detect the language actually spoken and transcribe it faithfully, never translate. Do not fix the style. If unsure between two languages, lean English.'
      : 'Récit de rêve au réveil, voix parfois pâteuse. Français ou anglais — détecte la langue réellement parlée et transcris-la fidèlement, jamais de traduction. Ne corrige pas le style. Dans le doute entre deux langues, penche pour le français.'

    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'gpt-4o-transcribe',
      // Contexte bilingue : oriente le modèle sans forcer la langue. La détection
      // reste automatique — on ne traduit jamais le rêve du rêveur.
      prompt: hint,
      response_format: 'text',
    })

    return NextResponse.json({ text: transcription })
  } catch (error: any) {
    console.error('Transcription error:', error)
    return NextResponse.json(
      { error: error.message || 'Transcription failed' },
      { status: 500 }
    )
  }
}
