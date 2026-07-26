/**
 * 🔒 TIER 2 — Client helper pour fetch authentifié.
 * Injecte automatiquement Authorization: Bearer <access_token> depuis la session Supabase.
 *
 * Usage :
 *   import { authFetch } from '@/lib/api-client'
 *   const res = await authFetch('/api/dreams', { method: 'POST', body: JSON.stringify(...) })
 *
 * Préserve un fallback `?userId=<id>` dans l'URL si le caller en passe un (migration progressive).
 * Une fois Tier 3 actif, on pourra supprimer tous les appels qui passent userId.
 */

import { createBrowserClient } from '@/lib/auth'
import { currentLocale } from '@/lib/i18n'

let cachedClient: ReturnType<typeof createBrowserClient> | null = null

function getClient() {
  if (!cachedClient) cachedClient = createBrowserClient()
  return cachedClient
}

export async function authFetch(
  input: string,
  init: RequestInit = {}
): Promise<Response> {
  const client = getClient()
  const { data: { session } } = await client.auth.getSession()

  const headers = new Headers(init.headers || {})
  if (session?.access_token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${session.access_token}`)
  }
  // §12bis.F — la langue du rêveur voyage avec CHAQUE appel. En header (pas dans
  // le body) : ça marche aussi pour les uploads audio en FormData. Côté serveur,
  // les routes IA lisent `x-dream-lang` et répondent dans cette langue.
  if (!headers.has('X-Dream-Lang')) {
    headers.set('X-Dream-Lang', currentLocale())
  }
  if (init.body && !headers.has('Content-Type')) {
    // Default JSON quand on envoie un body objet
    if (typeof init.body === 'string') {
      headers.set('Content-Type', 'application/json')
    }
  }

  return fetch(input, { ...init, headers })
}

/**
 * Variante ergonomique pour les appels GET simples qui renvoient du JSON.
 * Throw si status >= 400, pour coller aux callers qui attendaient res.ok.
 */
export async function authFetchJSON<T = any>(
  input: string,
  init: RequestInit = {}
): Promise<T> {
  const res = await authFetch(input, init)
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || `HTTP ${res.status}`)
  }
  return res.json()
}
