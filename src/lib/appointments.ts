/**
 * appointments.ts — Rendez-vous & notifications locales de Dream
 * ────────────────────────────────────────────────────────────────
 * Source de vérité : DREAM-MVP-SPEC-ECRANS-A-Z.md §8 (O1-O4) + §9 (tableau notifications).
 *
 * Toute la LOGIQUE vit ici (pas dans les écrans) :
 *  - get/set des réglages rendez-vous (matin / soir + heures)  → utilisé par O3, la
 *    re-proposition in-app, la carte « Ta première semaine » ET l'écran Réglages R1
 *    (construit par un autre agent — il consomme cette API, il ne réimplémente rien).
 *  - planification quotidienne des 2 notifs via @capacitor/local-notifications (import
 *    dynamique, fallback silencieux sur le web).
 *  - drapeaux persistants : onboarding vu, re-proposition refusée, carte 1re semaine vue.
 *
 * ══════════════════════════════════════════════════════════════════
 * 🔴 INTERDITS À VIE (§9) — CÂBLÉS EN DUR, NE JAMAIS AJOUTER ICI :
 *   · aucune notification de RE-ENGAGEMENT ;
 *   · jamais « Tu n'as pas déposé depuis X jours » ;
 *   · jamais « Ta série va se briser » / « Reviens ! » ;
 *   · le MUR ne notifie JAMAIS rien, par principe (0 notif, aucune exception).
 * Ce fichier ne planifie QUE ce que l'utilisateur a explicitement choisi, aperçu réel
 * montré au moment du choix. Toute PR qui ajoute une notif non choisie enfreint la Loi §9.
 * ══════════════════════════════════════════════════════════════════
 */

/* ───────── Contenus EXACTS (§9 — ne pas reformuler) ─────────
 *
 * i18n 2026-07-11 : le TEXTE des 2 notifs vit désormais dans
 *   src/lib/i18n/mvp/content.{fr,en}.json → content.appointments.{morning,evening}
 * Le FR est repris MOT POUR MOT du §9 (rien de reformulé — c'est une red line).
 * L'anglais est une ré-écriture, même brièveté, même ton.
 *
 * Ce fichier n'est PAS un composant React : il ne peut pas appeler useT().
 * Il lit donc la langue via currentLocale() (localStorage → navigator), au moment
 * où la notif est PLANIFIÉE. Conséquence assumée et honnête : si le rêveur change
 * de langue, les notifs déjà planifiées gardent l'ancienne — jusqu'à la prochaine
 * sauvegarde des réglages (saveSettings → reschedule). Voir relocalizeNotifications().
 */
import { currentLocale, type Locale } from './i18n'
import contentFr from './i18n/mvp/content.fr.json'
import contentEn from './i18n/mvp/content.en.json'

const APPT_CONTENT: Record<Locale, { title: string; morning: string; evening: string }> = {
  fr: (contentFr as any).appointments,
  en: (contentEn as any).appointments,
}

/** Le corps de la notif du matin, dans la langue du rêveur (défaut : la sienne). */
export function apptMorningBody(locale: Locale = currentLocale()): string {
  return APPT_CONTENT[locale]?.morning || APPT_CONTENT.fr.morning
}
/** Le corps de la notif du soir, dans la langue du rêveur. */
export function apptEveningBody(locale: Locale = currentLocale()): string {
  return APPT_CONTENT[locale]?.evening || APPT_CONTENT.fr.evening
}
function apptTitle(locale: Locale): string {
  return APPT_CONTENT[locale]?.title || 'Dream'
}

/**
 * Aperçus FR — conservés pour compatibilité (un écran non encore i18n affiche le FR,
 * jamais une clé nue). Un écran traduit doit utiliser apptMorningBody() / apptEveningBody(),
 * ou t('content.appointments.morning') directement.
 */
export const APPT_MORNING_BODY: string = APPT_CONTENT.fr.morning
export const APPT_EVENING_BODY: string = APPT_CONTENT.fr.evening

/* IDs de notif réservés (le réveil doux utilise 7 — cf. page.tsx ReveilScreen) */
const ID_MORNING = 101
const ID_EVENING = 102

/* ───────── Types & réglages ───────── */
export interface AppointmentSettings {
  morning: boolean
  evening: boolean
  morningTime: string // 'HH:MM'
  eveningTime: string // 'HH:MM'
}

const DEFAULTS: AppointmentSettings = {
  morning: false,
  evening: false,
  morningTime: '07:30',
  eveningTime: '22:00',
}

/* clés localStorage (namespacées dream_appt_*) */
const K_SETTINGS = 'dream_appt_settings'
const K_ONBOARD_DONE = 'dream_onboarding_done'
const K_REPROPOSE_DISMISSED = 'dream_appt_repropose_dismissed'
const K_FIRSTWEEK_SHOWN = 'dream_firstweek_shown'
const K_FIRST_KAIROS_AT = 'dream_first_kairos_at'

function readLS(key: string): string | null {
  try { return localStorage.getItem(key) } catch { return null }
}
function writeLS(key: string, val: string) {
  try { localStorage.setItem(key, val) } catch {}
}

/* ───────── Réglages : get / set ───────── */
export function getSettings(): AppointmentSettings {
  const raw = readLS(K_SETTINGS)
  if (!raw) return { ...DEFAULTS }
  try {
    const p = JSON.parse(raw)
    return {
      morning: !!p.morning,
      evening: !!p.evening,
      morningTime: typeof p.morningTime === 'string' ? p.morningTime : DEFAULTS.morningTime,
      eveningTime: typeof p.eveningTime === 'string' ? p.eveningTime : DEFAULTS.eveningTime,
    }
  } catch { return { ...DEFAULTS } }
}

/** Écrit les réglages ET (re)planifie les notifs natives. Fallback silencieux web. */
export async function saveSettings(next: AppointmentSettings): Promise<void> {
  writeLS(K_SETTINGS, JSON.stringify(next))
  await reschedule(next)
}

/** true si un rendez-vous (matin OU soir) est actif — pilote la re-proposition. */
export function hasActiveAppointment(): boolean {
  const s = getSettings()
  return s.morning || s.evening
}

/* ───────── Planification (Capacitor local-notifications, import dynamique) ───────── */
function parseHM(hm: string): { hour: number; minute: number } | null {
  const [h, m] = (hm || '').split(':').map(Number)
  if (!Number.isFinite(h) || !Number.isFinite(m)) return null
  return { hour: h, minute: m }
}

/**
 * (Re)planifie les 2 notifs quotidiennes selon les réglages.
 * - Natif (iOS/Android via Capacitor) : notif système répétée chaque jour à l'heure choisie.
 * - Web / pas de plugin : ne fait rien (fallback silencieux — aucune notif fantôme).
 * Aucune notif de re-engagement n'est jamais planifiée ici (cf. INTERDITS §9).
 */
export async function reschedule(settings?: AppointmentSettings): Promise<void> {
  const s = settings || getSettings()
  const LN = await loadLocalNotifications()
  if (!LN) return // web / non-natif → silencieux

  const locale = currentLocale()

  try {
    await LN.requestPermissions()
    // on annule d'abord les 2 rendez-vous (toggle OFF = disparition immédiate)
    await LN.cancel({ notifications: [{ id: ID_MORNING }, { id: ID_EVENING }] })

    const notifications: any[] = []
    if (s.morning) {
      const hm = parseHM(s.morningTime)
      if (hm) notifications.push({
        id: ID_MORNING,
        title: apptTitle(locale),
        body: apptMorningBody(locale),
        schedule: { on: { hour: hm.hour, minute: hm.minute }, allowWhileIdle: true },
        extra: { appt: 'morning' }, // tap → capture voix directe (A3)
      })
    }
    if (s.evening) {
      const hm = parseHM(s.eveningTime)
      if (hm) notifications.push({
        id: ID_EVENING,
        title: apptTitle(locale),
        body: apptEveningBody(locale),
        schedule: { on: { hour: hm.hour, minute: hm.minute }, allowWhileIdle: true },
        extra: { appt: 'evening' }, // tap → guide Intention
      })
    }
    if (notifications.length) await LN.schedule({ notifications })
  } catch {
    // permission refusée ou plugin indispo → silencieux, aucun blocage UI
  }
}

/**
 * À appeler quand le rêveur CHANGE de langue (Réglages > Langue) : re-planifie les
 * notifs déjà actives dans la nouvelle langue. Ne crée AUCUNE notif : si aucun
 * rendez-vous n'est actif, reschedule() ne planifie rien (INTERDITS §9 tenus).
 */
export async function relocalizeNotifications(): Promise<void> {
  if (!hasActiveAppointment()) return
  await reschedule()
}

/** Coupe les 2 rendez-vous (utilisé par R1 « Jamais » ou déconnexion). */
export async function cancelAll(): Promise<void> {
  const LN = await loadLocalNotifications()
  if (!LN) return
  try { await LN.cancel({ notifications: [{ id: ID_MORNING }, { id: ID_EVENING }] }) } catch {}
}

let _listenerBound = false
/**
 * Branche UNE fois le listener de tap sur notif. Le tap re-dispatch un CustomEvent
 * `dream-appt-tap` (detail.appt = 'morning' | 'evening') que la racine écoute pour
 * router : matin → capture voix directe, soir → guide Intention.
 */
export async function initTapListener(): Promise<void> {
  if (_listenerBound) return
  const LN = await loadLocalNotifications()
  if (!LN || typeof LN.addListener !== 'function') return
  try {
    LN.addListener('localNotificationActionPerformed', (evt: any) => {
      const appt = evt?.notification?.extra?.appt
      if (appt === 'morning' || appt === 'evening') {
        try { window.dispatchEvent(new CustomEvent('dream-appt-tap', { detail: { appt } })) } catch {}
      }
    })
    _listenerBound = true
  } catch {}
}

async function loadLocalNotifications(): Promise<any | null> {
  if (typeof window === 'undefined') return null
  try {
    const core = await import('@capacitor/core')
    // @ts-ignore — Capacitor est présent, isNativePlatform() dispo
    if (!core?.Capacitor?.isNativePlatform?.()) return null
    const mod = await import('@capacitor/local-notifications')
    return (mod as any).LocalNotifications || null
  } catch {
    return null
  }
}

/* ───────── Drapeaux onboarding / re-proposition / 1re semaine ───────── */

export function onboardingDone(): boolean {
  return readLS(K_ONBOARD_DONE) === '1'
}
export function markOnboardingDone(): void {
  writeLS(K_ONBOARD_DONE, '1')
}

/**
 * Note la date du 1er dépôt (une seule fois). Sert de point zéro à la carte
 * « Ta première semaine » (7e jour). Idempotent : n'écrase jamais la 1re valeur.
 */
export function recordFirstKairos(iso?: string | null): void {
  if (readLS(K_FIRST_KAIROS_AT)) return
  const when = iso && !isNaN(Date.parse(iso)) ? new Date(iso).toISOString() : new Date().toISOString()
  writeLS(K_FIRST_KAIROS_AT, when)
}
export function firstKairosAt(): string | null {
  return readLS(K_FIRST_KAIROS_AT)
}

/* Re-proposition #1 — ligne douce in-app sous l'accueil (§8, acté 10/07) */
export function reproposeDismissed(): boolean {
  return readLS(K_REPROPOSE_DISMISSED) === '1'
}
export function dismissRepropose(): void {
  writeLS(K_REPROPOSE_DISMISSED, '1') // refusée = plus JAMAIS affichée
}
/**
 * true ssi : ≥ 3 dépôts ET aucun rendez-vous actif ET pas déjà refusée.
 * (déclencheur EXACT §8 : « après le 3e dépôt »)
 */
export function shouldShowRepropose(totalDeposits: number): boolean {
  return totalDeposits >= 3 && !hasActiveAppointment() && !reproposeDismissed()
}

/* Carte « Ta première semaine » — re-proposition #2 et DERNIÈRE (§9), in-app SEULEMENT */
export function firstWeekShown(): boolean {
  return readLS(K_FIRSTWEEK_SHOWN) === '1'
}
export function markFirstWeekShown(): void {
  writeLS(K_FIRSTWEEK_SHOWN, '1')
}
export function daysSince(iso: string | null): number {
  if (!iso || isNaN(Date.parse(iso))) return 0
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
}
/**
 * true ssi : 1er dépôt connu ET ≥ 7 jours écoulés ET jamais montrée.
 * (déclencheur EXACT §9 : « carte dans le Journal au 7e jour », 1 fois à vie)
 */
export function shouldShowFirstWeek(): boolean {
  const first = firstKairosAt()
  return !!first && daysSince(first) >= 7 && !firstWeekShown()
}
