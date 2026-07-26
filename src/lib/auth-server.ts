import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * 🔒 TIER 2 — 2026-04-20
 * Server-side auth : vérifie un access_token Supabase depuis le header Authorization.
 * Remplace le pattern "userId query-param/body" par une session cookie / bearer verifiable.
 *
 * Stratégie :
 *   Client envoie `Authorization: Bearer <access_token>` depuis useAuth().session.access_token.
 *   Serveur appelle supabase.auth.getUser(token) avec anon key → user vérifié.
 *   Pendant la migration (Tier 2 transitoire), on accepte encore le fallback userId
 *   query-param pour ne pas casser les clients pas encore refactorisés, mais on LOG
 *   toute utilisation de fallback (CLIENT_LEGACY_AUTH=1) pour traquer le cleanup.
 *
 * À la fin de la migration → supprimer le fallback et retourner 401 si pas de token.
 */

const LEGACY_FALLBACK_ENABLED = true // TODO(Tier 3): flip to false, then delete

type AuthOk = { userId: string; via: 'bearer' | 'legacy' }
type AuthFail = { error: NextResponse }

export async function requireAuth(
  req: NextRequest,
  body?: any
): Promise<AuthOk | AuthFail> {
  // 1️⃣ Préférer le bearer token
  const authHeader = req.headers.get('authorization') || req.headers.get('Authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice('Bearer '.length).trim()
    if (token) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { auth: { persistSession: false, autoRefreshToken: false } }
      )
      const { data, error } = await supabase.auth.getUser(token)
      if (!error && data?.user?.id) {
        return { userId: data.user.id, via: 'bearer' }
      }
      // Token fourni mais invalide/expiré → 401 direct, pas de fallback
      return {
        error: NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        ),
      }
    }
  }

  // 2️⃣ Fallback legacy (en cours de migration)
  if (LEGACY_FALLBACK_ENABLED) {
    const { searchParams } = new URL(req.url)
    const userId =
      searchParams.get('userId') ||
      body?.userId ||
      body?.user_id ||
      null
    if (userId) {
      if (typeof console !== 'undefined') {
        console.warn('[auth-server] LEGACY_AUTH used — migrate client to Bearer', {
          path: new URL(req.url).pathname,
        })
      }
      return { userId, via: 'legacy' }
    }
  }

  return {
    error: NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    ),
  }
}

/**
 * Helper ergonomique pour les routes qui ont déjà parsé le body.
 * Retourne juste userId ou null — routes make their own 401 response if null.
 */
export async function getAuthUserId(
  req: NextRequest,
  body?: any
): Promise<string | null> {
  const result = await requireAuth(req, body)
  if ('error' in result) return null
  return result.userId
}
