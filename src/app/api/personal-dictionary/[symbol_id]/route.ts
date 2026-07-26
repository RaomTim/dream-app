/**
 * /api/personal-dictionary/[symbol_id] — Feature 2 (2026-04-29)
 *
 * DELETE → soft-archive (set archived_at = now). N'efface pas les kairos liés.
 *          Le job /refresh peut le réveiller si le symbole continue d'apparaître.
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-server'
import { createServerClient } from '@/lib/supabase'

export const maxDuration = 30

export async function DELETE(req: NextRequest, ctx: { params: { symbol_id: string } }) {
  const symbolId = ctx?.params?.symbol_id
  if (!symbolId || typeof symbolId !== 'string') {
    return NextResponse.json({ error: 'symbol_id requis' }, { status: 400 })
  }

  const auth = await requireAuth(req)
  if ('error' in auth) return auth.error
  const { userId } = auth

  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('personal_dictionary_symbols')
      .update({ archived_at: new Date().toISOString() })
      .eq('id', symbolId)
      .eq('user_id', userId)
      .select('id, archived_at')
      .maybeSingle()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    if (!data) {
      return NextResponse.json({ error: 'symbole introuvable' }, { status: 404 })
    }
    return NextResponse.json({ archived: true, symbol: data })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
