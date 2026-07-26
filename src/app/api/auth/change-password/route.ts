import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

/**
 * POST /api/auth/change-password
 * Body: { newPassword: string }
 *
 * Updates user password via the `update_user_password` RPC (bcrypt côté SQL).
 *
 * 🔒 2026-04-20 FIX BRECHE :
 *   - Le fallback plaintext (password_hash = newPassword) est SUPPRIMÉ.
 *     Si le RPC manque, on refuse l'opération plutôt que de stocker un
 *     password en clair.
 *   - Le userId vient toujours d'un cookie "dream_user_id" côté app,
 *     qui est à migrer vers une session Supabase Auth signée (P2 structurel).
 *     En attendant, on exige au moins que le cookie soit présent.
 */
export async function POST(req: NextRequest) {
  try {
    const { newPassword } = await req.json()

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    const supabase = createServerClient()

    const cookies = req.cookies
    const userId = cookies.get('dream_user_id')?.value

    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { error } = await supabase.rpc('update_user_password', {
      p_user_id: userId,
      p_new_password: newPassword,
    })

    if (error) {
      // 🔒 Plus de fallback plaintext. Si l'RPC manque, c'est un incident infra — on refuse.
      console.error('[change-password] RPC update_user_password failed:', error.message)
      return NextResponse.json(
        {
          error: 'Password change temporairement indisponible (RPC manquant). Contacte le support.',
          code: 'RPC_MISSING',
        },
        { status: 503 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 })
  }
}
