import { NextResponse } from 'next/server'

/**
 * CORS ouvert sur les routes /api/mvp/* — l'auth reste le Bearer (CORS ≠ sécurité).
 * Posé pour permettre les tests automatisés cross-origin (harnais Yeshua) et,
 * plus tard, le wrapper Capacitor en mode dev. Retirable sans impact.
 * Yeshua, 2026-06-10.
 */
export const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
  'Access-Control-Max-Age': '86400',
}

export function corsify(res: Response): Response {
  for (const [k, v] of Object.entries(CORS_HEADERS)) res.headers.set(k, v)
  return res
}

export function corsOptions(): NextResponse {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS })
}
