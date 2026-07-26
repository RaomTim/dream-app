import { NextResponse } from 'next/server'

/**
 * GET /api/v12-env
 *
 * Sert un script JS qui injecte window.SUPABASE_URL + window.SUPABASE_ANON_KEY
 * dans le contexte iframe /v12/index.html. Permet à l'iframe vanilla d'utiliser
 * les NEXT_PUBLIC_* vars sans rebuild.
 *
 * Sécurité : ANON_KEY est public par design (RLS protège la DB).
 *
 * Auteur : Yeshua, 2026-04-25.
 */
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  // JSON-encode to safely escape any chars (just in case)
  const body = `/* Dream V1.2 — public env injection */
window.SUPABASE_URL = ${JSON.stringify(url)};
window.SUPABASE_ANON_KEY = ${JSON.stringify(anonKey)};
window.DREAM_BUILD_TIME = ${JSON.stringify(new Date().toISOString())};
`

  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'public, max-age=60, s-maxage=60',
    },
  })
}
