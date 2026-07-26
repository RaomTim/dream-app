import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'
import { corsify, corsOptions } from '@/lib/mvp-cors'
import { reqLang, type DreamLang } from '@/lib/req-lang'

/**
 * GET /api/mvp/echo-of-the-day — l'écho proactif de l'accueil (DREAM-MVP-SPEC-ECRANS-A-Z §12bis.B).
 *
 * Quand un écho FORT s'est allumé sur un dépôt récent, l'app peut le PROPOSER d'elle-même —
 * jamais une notification poussée, seulement une carte douce à l'accueil (le client décide de
 * l'afficher au plus une fois par jour, jamais deux jours de suite, toujours écartable).
 *
 * On regarde les tout derniers dépôts et on cherche, en priorité :
 *   1. un écho ancien (prophétique) — un rêve d'il y a longtemps qui semble avoir préparé celui-ci ;
 *   2. sinon une forte résonance (find_kairos_echoes_multilayer, seuil relevé) avec un autre kairos.
 * On renvoie le MEILLEUR écho non-écarté, ou null. Léger : quelques RPC, aucune génération.
 *
 * Réponse : { echo: null } ou
 *   { echo: { kairos_id, echo_kairos_id, register: 'prophetic'|'resonance',
 *             message, deposit_created_at, echo_created_at } }
 *
 * Vocabulaire §0.1 : « prophétique » n'apparaît jamais à l'écran — la copy dit « un rêve ancien ».
 *
 * Yeshua (Opus), 2026-07-11 — vague MAGIE.
 */
export const maxDuration = 30

/* ── La phrase de l'écho, dans la langue du rêveur ─────────────────────────────
 * C'est la seule prose de cette route, et elle s'affiche à l'accueil : elle DOIT
 * suivre la langue du rêveur, jamais celle du rêve. Écrite à la main dans les deux
 * langues (pas de traduction machine à l'exécution — c'est de la copy, pas de la data).
 * Vocabulaire §0.1 : « prophétique » n'apparaît jamais — on dit « un rêve ancien ».
 */
const MONTHS: Record<DreamLang, string[]> = {
  fr: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  en: ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'],
}

function relativeDay(iso: string, lang: DreamLang): string {
  const d = Math.round((Date.now() - new Date(iso).getTime()) / 86400000)
  if (lang === 'en') {
    if (d <= 0) return 'today'
    if (d === 1) return 'yesterday'
    if (d <= 6) return 'these past few days'
    return 'recently'
  }
  if (d <= 0) return "aujourd'hui"
  if (d === 1) return 'hier'
  if (d <= 6) return 'ces derniers jours'
  return 'récemment'
}

/** « un rêve de mars semble avoir préparé ce que tu as écrit hier » */
function propheticLine(lang: DreamLang, month: string | null, when: string): string {
  if (lang === 'en') {
    return month
      ? `a dream from ${month} seems to have prepared what you wrote ${when}`
      : `an older dream seems to have prepared what you wrote ${when}`
  }
  return month
    ? `un rêve de ${month} semble avoir préparé ce que tu as écrit ${when}`
    : `un rêve ancien semble avoir préparé ce que tu as écrit ${when}`
}

/** « un rêve de mars résonne avec ce que tu as écrit hier » */
function resonanceLine(lang: DreamLang, month: string, when: string, isDay: boolean): string {
  if (lang === 'en') {
    return isDay
      ? `a moment from ${month} resonates with what you wrote ${when}`
      : `a dream from ${month} resonates with what you wrote ${when}`
  }
  return isDay
    ? `un moment de ${month} résonne avec ce que tu as écrit ${when}`
    : `un rêve de ${month} résonne avec ce que tu as écrit ${when}`
}

export async function OPTIONS() { return corsOptions() }

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth
    const lang = reqLang(req)
    const supabase = createServerClient()

    // Dépôts très récents (7 j), les plus neufs d'abord. On borne fort : c'est une carte douce, pas un scan.
    const since = new Date(Date.now() - 7 * 86400000).toISOString()
    const { data: recent } = await supabase
      .from('kairos')
      .select('id, kairos_type, created_at')
      .eq('user_id', userId)
      .gte('created_at', since)
      .order('created_at', { ascending: false })
      .limit(4)
    if (!recent || recent.length === 0) return corsify(NextResponse.json({ echo: null }))

    // Liens déjà écartés → jamais reproposés (table optionnelle)
    const dismissed = new Set<string>()
    try {
      const { data: fb } = await supabase
        .from('resonance_feedback')
        .select('source_kairos_id, other_kairos_id, verdict')
        .eq('user_id', userId)
        .eq('verdict', 'dismissed')
      for (const r of (fb || []) as any[]) if (r.source_kairos_id && r.other_kairos_id) dismissed.add(`${r.source_kairos_id}:${r.other_kairos_id}`)
    } catch { /* pas encore migrée */ }

    const monthOf = (iso: string) => MONTHS[lang][new Date(iso).getMonth()]

    for (const dep of recent as any[]) {
      // 1) écho ancien (prophétique) — le signal le plus fort
      try {
        const { data: proph } = await supabase.rpc('find_kairos_prophetic', {
          p_user_id: userId,
          p_kairos_id: dep.id,
          p_min_days_back: 30,
          p_min_combined: 0.78,
          p_min_numinosity_past: 0.4,
          p_limit: 1,
        })
        const p = (proph || [])[0] as any
        const pid = p?.past_id || p?.id
        if (pid && !dismissed.has(`${dep.id}:${pid}`)) {
          const { data: pk } = await supabase.from('kairos').select('created_at').eq('id', pid).maybeSingle()
          const echoMonth = pk?.created_at ? monthOf(pk.created_at) : null
          return corsify(NextResponse.json({
            echo: {
              kairos_id: dep.id,
              echo_kairos_id: pid,
              register: 'prophetic',
              message: propheticLine(lang, echoMonth, relativeDay(dep.created_at, lang)),
              deposit_created_at: dep.created_at,
              echo_created_at: pk?.created_at || null,
            },
          }))
        }
      } catch { /* moteur indisponible → on tente la résonance forte */ }

      // 2) forte résonance (seuil relevé) avec un autre kairos
      try {
        const { data: echoes } = await supabase.rpc('find_kairos_echoes_multilayer', {
          p_user_id: userId,
          p_kairos_id: dep.id,
          p_w_sem: 0.30, p_w_con: 0.30, p_w_som: 0.20, p_w_arc: 0.20,
          p_min_combined: 0.72,
          p_limit: 3,
        })
        for (const e of (echoes || []) as any[]) {
          const oid = e.other_id || e.id
          if (!oid || oid === dep.id || dismissed.has(`${dep.id}:${oid}`)) continue
          const { data: ok } = await supabase.from('kairos').select('created_at, kairos_type').eq('id', oid).maybeSingle()
          if (!ok?.created_at) continue
          const isDay = (ok.kairos_type || 'reve') === 'note_jour'
          return corsify(NextResponse.json({
            echo: {
              kairos_id: dep.id,
              echo_kairos_id: oid,
              register: 'resonance',
              message: resonanceLine(lang, monthOf(ok.created_at), relativeDay(dep.created_at, lang), isDay),
              deposit_created_at: dep.created_at,
              echo_created_at: ok.created_at,
            },
          }))
        }
      } catch { /* rien de fort → on passe au dépôt suivant */ }
    }

    return corsify(NextResponse.json({ echo: null }))
  } catch (e: any) {
    console.error('[mvp.echo-of-the-day]', e)
    // Jamais bloquant pour l'accueil : en cas d'erreur, pas d'écho.
    return corsify(NextResponse.json({ echo: null }))
  }
}
