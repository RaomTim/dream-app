'use client'

/**
 * Dream MVP V2 — la MVP complète du 23/05 (Vague 1.5, 2026-06-11)
 * ANIMA (orbe vidéo + anneau H2) ↔ swipe ↔ ANIMUS (notes de jour + résonances)
 * · post-dépôt 2 voies (protocole | interprétation) · mythes réels · felt-shift
 * · univers onirique 7 AXES · cercles (créer/rejoindre/feed/partage) · réveil · import hub
 * Design : H1 LUEUR + anneau H2 (directions-hybrid Claude Design) + orbes vidéo Tim.
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient, type SupabaseClient, type Session } from '@supabase/supabase-js'
import { useT, currentLocale } from '@/lib/i18n'
import GroupScreen from '@/components/GroupScreen'
import ScanScreen from '@/components/ScanScreen'
import KeptInterpretation from '@/components/KeptInterpretation'
/* A3 2026-07-26 — les grands rêves (TAXONOMIE-GRANDS-REVES.md). */
import GreatDreamFlag from '@/components/GreatDreamFlag'
import GreatDreamsJournal from '@/components/GreatDreamsJournal'
import ResonanceSection from '@/components/ResonanceSection'
import CareCard from '@/components/CareCard'
import ShareSheet from '@/components/ShareSheet'
import ExportSheet from '@/components/ExportSheet'
import TranscriptCheck from '@/components/TranscriptCheck'
import WallScreen from '@/components/WallScreen'
import Onboarding, { ReproposeLine, FirstWeekCard } from '@/components/Onboarding'
import ImportHub from '@/components/ImportHub'
import * as Appointments from '@/lib/appointments'
import GuideSession from '@/components/GuideSession'
import { GuidesSheet, GuidesLibrary } from '@/components/GuidesPanel'
import { type Guide, GUIDES_BY_ID } from '@/lib/guides'
import SettingsScreen from '@/components/SettingsScreen'
import { InfoDot } from '@/components/InfoSystem'
// C1 2026-07-26 — la traîne du mot devient la porte du périmètre (bulle → page → guides).
import { ScopeTrail } from '@/components/DepositScope'
import { KGLYPH } from '@/lib/kairos-glyphs'
import { AMBIANCES, previewAmbiance, startAlarm, startVibration, type AmbianceId, type AlarmHandle } from '@/lib/alarm-sounds'
/* Offline-first : file d'attente des dépôts (IndexedDB) + auto-flush au retour réseau. */
import { enqueueDeposit } from '@/lib/offline-queue'
/* A1/B2 2026-07-26 — le rêve est mis à l'abri AVANT le moindre appel réseau.
   `createVoiceRecorder` fixe le débit d'ARCHIVE (jamais moins que le défaut du
   navigateur) · `safeguardRecording` ne throw jamais · `transcribeSafely` choisit
   la ROUTE selon la taille — le seuil de 4 Mo est un aiguillage, il n'influence
   jamais la qualité de ce qui est enregistré. Voir src/lib/capture-safety.ts. */
import { safeguardRecording, markTranscribed, markFailed, transcribeSafely, linkCaptureAudio, createVoiceRecorder } from '@/lib/capture-safety'
/* B4/B6 2026-07-26 — la date du RÊVE, distincte de celle du dépôt. Importé depuis
   `dream-date-view`, la moitié client de `dream-date.ts` : celui-ci charge le SDK
   Anthropic et n'a rien à faire dans le bundle du navigateur. */
import { formatDreamDate, canAssertDelta, type DreamDateShortcut } from '@/lib/kairos/dream-date-view'
import { useDraft, saveDraft } from '@/lib/draft-store'
import PendingDeposits from '@/components/PendingDeposits'
/* ───────── DESIGN « NUIT ULTRA SIMPLE » — source de vérité unique (src/lib/dream-design.ts) ─────────
   T (nuit) · DT (jour) · SCALE (échelle) · MOTION (mouvement) · grainOverlay · moonStyle · keyframes.
   Les clés reprennent l'ancienne API T/DT — l'import remplace les objets locaux, zéro valeur recréée ici. */
import { T, DT, SCALE, MOTION, grainOverlay, moonStyle, haloStyle, DREAM_KEYFRAMES, GRAIN_HOME } from '@/lib/dream-design'

/* tempi nommés (V1.2 §D) — hérités, conservés pour référence de voix (« instrument »), non structurants */
const TEMPO = { instant: '100ms', tisse: '380ms', ceremoniel: '920ms', souffle: '6000ms', braise: '3500ms', derive: '12000ms' }
const EASE = { respire: 'cubic-bezier(0.32,0.04,0.25,1)', tenue: 'cubic-bezier(0.45,0,0.15,1)', rituel: 'cubic-bezier(0.7,0,0.3,1)', souffle: 'cubic-bezier(0.45,0,0.55,1)', braise: 'cubic-bezier(0.4,0.1,0.6,0.9)' }
void TEMPO; void EASE;

/* ───────── icons (trait, zéro emoji) ───────── */
const I = {
  moon: (c: string, s = 21) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.5 6.5 0 0 0 9.8 9.8z" stroke={c} strokeWidth="1.5" strokeLinejoin="round" /></svg>
  ),
  sun: (c: string, s = 21) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4.2" stroke={c} strokeWidth="1.5" /><path d="M12 3v2.4M12 18.6V21M21 12h-2.4M5.4 12H3M18.4 5.6l-1.7 1.7M7.3 16.7l-1.7 1.7M18.4 18.4l-1.7-1.7M7.3 7.3 5.6 5.6" stroke={c} strokeWidth="1.4" strokeLinecap="round" /></svg>
  ),
  journal: (c: string, s = 21) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15.5H6.5A1.5 1.5 0 0 0 5 20V4.5z" stroke={c} strokeWidth="1.5" strokeLinejoin="round" /><path d="M8.5 8h7M8.5 11.5h7" stroke={c} strokeWidth="1.5" strokeLinecap="round" /></svg>
  ),
  universe: (c: string, s = 21) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="2.4" stroke={c} strokeWidth="1.5" /><circle cx="5" cy="6" r="1" fill={c} /><circle cx="19" cy="7" r="1" fill={c} /><circle cx="18" cy="17" r="1" fill={c} /><circle cx="6" cy="18" r="1" fill={c} /><path d="M6.6 6.9 10 10.6M14.2 10.4 17.8 7.6M14.4 13.6 17.4 16.3M9.8 13.8 6.7 17" stroke={c} strokeWidth="1.1" opacity="0.55" /></svg>
  ),
  circle3: (c: string, s = 21) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="7.5" r="2.2" stroke={c} strokeWidth="1.4" /><circle cx="7" cy="15.5" r="2.2" stroke={c} strokeWidth="1.4" /><circle cx="17" cy="15.5" r="2.2" stroke={c} strokeWidth="1.4" /><circle cx="12" cy="13" r="0.9" fill={c} opacity="0.7" /></svg>
  ),
  bell: (c: string, s = 20) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M18 16H6c1.2-1.2 1.8-2.2 1.8-4.8 0-3 1.6-5.2 4.2-5.2s4.2 2.2 4.2 5.2c0 2.6.6 3.6 1.8 4.8z" stroke={c} strokeWidth="1.5" strokeLinejoin="round" /><path d="M10.3 18.6a1.8 1.8 0 0 0 3.4 0" stroke={c} strokeWidth="1.5" strokeLinecap="round" /></svg>
  ),
  account: (c: string, s = 20) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8.5" r="3.3" stroke={c} strokeWidth="1.5" /><path d="M5.5 19.5a6.5 6.5 0 0 1 13 0" stroke={c} strokeWidth="1.5" strokeLinecap="round" /></svg>
  ),
  mic: (c: string, s = 17) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><rect x="9" y="3" width="6" height="11" rx="3" fill={c} /><path d="M6 11a6 6 0 0 0 12 0M12 17v3" stroke={c} strokeWidth="1.8" strokeLinecap="round" /></svg>
  ),
  forge: (c: string, s = 21) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M12 3l1.4 4.2L17 8l-3.6 1.4L12 14l-1.4-4.6L7 8l3.6-.8z" stroke={c} strokeWidth="1.3" strokeLinejoin="round" /><path d="M5 17h14M7 20h10" stroke={c} strokeWidth="1.5" strokeLinecap="round" /></svg>
  ),
  back: (c: string, s = 20) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
  ),
  // 2026-07-11 — écran A5 Scanner (icône trait, zéro emoji)
  camera: (c: string, s = 20) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2l1-1.6A1.5 1.5 0 0 1 9.8 4.7h4.4a1.5 1.5 0 0 1 1.3.7L16.5 7h2A1.5 1.5 0 0 1 20 8.5v9A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5v-9z" stroke={c} strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="12" cy="13" r="3.4" stroke={c} strokeWidth="1.5" />
    </svg>
  ),
}

const Ring = ({ s = 26, c = T.gold }: { s?: number; c?: string }) => (
  <svg width={s} height={s} viewBox="0 0 26 26" style={{ flexShrink: 0 }}><circle cx="13" cy="13" r="9" fill="none" stroke={c} strokeWidth="0.8" opacity="0.7" /><circle cx="13" cy="13" r="1.6" fill={c} /></svg>
)
const RingDivider = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', margin: '21px 0' }}>
    <div style={{ height: 1, width: 55, background: `linear-gradient(90deg, transparent, ${T.gold}55)` }} />
    <svg width="11" height="11" viewBox="0 0 11 11"><circle cx="5.5" cy="5.5" r="4" fill="none" stroke={T.gold} strokeWidth="0.6" /><circle cx="5.5" cy="5.5" r="1" fill={T.gold} /></svg>
    <div style={{ height: 1, width: 55, background: `linear-gradient(270deg, transparent, ${T.gold}55)` }} />
  </div>
)

/* ═══════════ §14 — PRIMITIVES D'ÉPURE (passe design CD, 2026-07-26) ═══════════
 * Tim, 26/07 : « il me semble qu'on était encore loin du vrai design CD, j'ai une
 * grosse orbe en plein milieu qui y ressemble et c'est à peu près tout. Et le
 * double écran cœur ? » — trois manques nommés, corrigés ICI (au niveau des
 * primitives) pour que l'Orbe et le Cœur en héritent sans duplication.
 *
 *  1. COMPOSITION φ — « en plein milieu » était le diagnostic exact. Le foyer
 *     vivait au centre mort d'une boîte résiduelle. Il se pose désormais sur la
 *     ligne d'or (38,2 % de la hauteur), AU MÊME point que l'ancre du dégradé de
 *     fond (`T.bg` : `at 50% 38%`). Le token disait déjà d'où vient la lumière —
 *     c'est la mise en page qui l'ignorait. La lueur sort maintenant de la
 *     matière au lieu d'être posée derrière elle. (DESIGN-DNA §4.1 + §4.6)
 *  2. AFFORDANCE — « le foyer EST le bouton » (§14.3) était vrai dans le code et
 *     muet à l'écran. Un anneau de maintien se dessine pendant les 180 ms du
 *     seuil : le geste devient visible sans qu'aucun CTA en pilule ne revienne.
 *  3. LE SEUIL — les deux faces existaient (swipe G/D) mais rien ne les laissait
 *     deviner : un lien texte de 13,5 px en bas d'écran. Le bord porte désormais
 *     la lumière de l'autre face. On SENT la seconde face avant de la lire.
 *     (DESIGN-DNA §4.9 « le céleste & le seuil »)
 */

/** 1/φ² ≈ 0,382 — la ligne d'or où se pose le foyer. Jamais le centre mort. */
const PHI_FOCUS = 0.382

/**
 * Marge haute qui pose le CENTRE du foyer sur la ligne φ de l'écran.
 * `headerH` = hauteur réelle du bandeau méta au-dessus (date + icône).
 * `max()` garde une respiration minimale sur les très petits écrans.
 */
const phiFocusTop = (orbSize: number, headerH: number) =>
  `max(21px, calc(${(PHI_FOCUS * 100).toFixed(1)}dvh - ${Math.round(orbSize / 2 + headerH)}px))`

/**
 * §14.1 — UNE SEULE voix ambiante à la fois.
 * Avant cette passe, quatre blocs conditionnels (mot de passe · file offline ·
 * re-proposition · écho du jour) pouvaient s'empiler entre le bandeau et le
 * foyer : rien ne plafonnait le budget d'éléments, et rien ne le repoussait hors
 * de la ligne φ. Le budget est maintenant tenu PAR CONSTRUCTION.
 * Mécanique : chaque enfant est enveloppé ; un composant qui rend `null` laisse
 * son enveloppe vide (`:not(:has(*))` → masquée), et toute enveloppe qui suit
 * une enveloppe pleine est masquée à son tour. Ordre = priorité.
 */
function AmbientSlot({ children }: { children: React.ReactNode }) {
  return <div className="ambientSlot">{children}</div>
}

/**
 * LE SEUIL — le bord de l'écran porte la lumière de l'autre face.
 * Décoratif et inerte : le geste reste le swipe (déjà là) et le lien texte
 * (déjà là). Ce liseré ne fait qu'une chose — rendre la seconde face DEVINABLE.
 * Il respire sur 6765 ms (φ⁴ × 1000, incommensurable avec les 5000 ms du foyer :
 * les deux souffles ne se re-synchronisent jamais, comme deux respirations).
 */
function ThresholdEdge({ side, day = false }: { side: 'left' | 'right'; day?: boolean }) {
  // nuit → on devine l'ambre du jour ; jour → on devine la NUIT.
  // Alphas relevés le 26/07 APRÈS rendu : la première version (13 px, alpha 0,55
  // × opacité 0,144-0,377) était littéralement invisible à l'écran — un liseré
  // qu'on ne voit pas ne signale rien. Élargi à 21 px (Fibonacci) et remonté à
  // une alpha utile, il se lit sans jamais devenir une barre.
  //
  // 🔴 CORRECTION B5 (26/07, vue au rendu et pas au code) — le côté JOUR restait
  // invisible, et pour exactement la raison qu'on venait de corriger de l'autre
  // côté : il portait de la crème (#f1e8d7 à 0,92) sur du parchemin (#f4ead1).
  // Deux clairs quasi identiques : aucun bord ne se détache, donc la face jour
  // n'annonçait rien du tout. On avait réparé une moitié du seuil et laissé
  // l'autre cassée.
  // La crème venait d'une bonne intention — « la lune est crème » — mais ce
  // qu'on devine par le bord, ce n'est pas l'astre de l'autre face, c'est son
  // MONDE. Côté nuit on devine l'ambre du jour ; côté jour on doit deviner
  // l'obscur de la nuit. On y met donc le sol même du fond nocturne (#2b2534,
  // le premier stop de T.bg), qui tranche sur le papier — et redit au passage
  // que le fond de nuit et ce liseré sont la même matière.
  const light = day ? 'rgba(25,21,33,0.55)' : 'rgba(233,170,64,0.85)'
  return (
    <div
      aria-hidden
      className="gSeuil"
      style={{
        position: 'absolute', top: 0, bottom: 0, [side]: 0, width: 21, zIndex: 2,
        pointerEvents: 'none',
        background: `linear-gradient(${side === 'right' ? 270 : 90}deg, ${light}, transparent 100%)`,
        maskImage: 'linear-gradient(180deg, transparent, #000 21%, #000 79%, transparent)',
        WebkitMaskImage: 'linear-gradient(180deg, transparent, #000 21%, #000 79%, transparent)',
      }}
    />
  )
}

/* ───────── date relative discrète — « aujourd'hui · hier · il y a 3 jours » (Intl, FR/EN natif, zéro clé i18n) ───────── */
function relDay(iso: string, locale: string): string {
  try {
    const then = new Date(iso); then.setHours(0, 0, 0, 0)
    const now = new Date(); now.setHours(0, 0, 0, 0)
    const days = Math.round((then.getTime() - now.getTime()) / 86400000)
    if (days <= -7) return new Date(iso).toLocaleDateString(locale, { day: 'numeric', month: 'short' })
    return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(days, 'day')
  } catch { return new Date(iso).toLocaleDateString(locale, { day: 'numeric', month: 'short' }) }
}

/* 🔴 2026-07-26 — QUATRIÈME COMPOSANT PEINT EN NUIT EN DUR, TROUVÉ EN CHERCHANT
   LES TROIS PREMIERS. `ReservedToast` est monté sur les DEUX faces (l.~1162 côté
   Rêve, l.~1388 côté Cœur) et ne prenait aucune prop `day` : il posait une gélule
   noire sur du parchemin. Même cause que la nav et que le liseré de seuil — un
   composant écrit en pensant à une seule face, monté sur les deux.
   La règle qui en sort, et elle vaut pour tout ce qui suit : SI ÇA PEUT S'AFFICHER
   SUR LES DEUX FACES, ÇA PREND `day`. Sans exception. */
function ReservedToast({ day }: { day?: boolean }) {
  const { t } = useT()
  return (
    <div style={{ position: 'fixed', bottom: 132, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 30, pointerEvents: 'none', animation: 'lFadeUp .3s ease' }}>
      <div style={{ padding: '9px 18px', borderRadius: 999, background: day ? 'rgba(244,234,209,0.92)' : 'rgba(25,21,33,0.86)', border: day ? DT.cardBorder : '0.5px solid rgba(202,191,206,0.12)', fontFamily: T.sans, fontWeight: 500, fontSize: SCALE.small, color: day ? DT.inkSoft : T.dim, transition: `background ${MOTION.swap}ms ${MOTION.ease}` }}>{t('core.common.reserved')}</div>
    </div>
  )
}

/* ───────── supabase + api ───────── */
let _sb: SupabaseClient | null = null
function sb(): SupabaseClient {
  if (!_sb) _sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  return _sb
}

/* ───────── harnais de preview DEV-ONLY — no-auth, données fictives (mort en prod via NODE_ENV) ───────── */
const PREVIEW: { on: boolean; screen: string } = (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined')
  ? { on: new URLSearchParams(window.location.search).has('preview'), screen: new URLSearchParams(window.location.search).get('screen') || 'home' }
  : { on: false, screen: 'home' }
const MOCK_SESSION = { access_token: 'preview', token_type: 'bearer', expires_in: 3600, expires_at: 9999999999, refresh_token: 'preview', user: { id: 'preview-user', email: 'aperçu@dream.earth', user_metadata: { has_password: true }, app_metadata: {}, aud: 'authenticated', created_at: '2026-01-01T00:00:00Z' } } as unknown as Session

async function api(path: string, opts: RequestInit = {}, session: Session | null = null) {
  if (PREVIEW.on) {
    const { mockFixture } = await import('./_preview-fixtures')
    const data = mockFixture(path, opts)
    if (data && data.__sse !== undefined) { // interpret = SSE → on rejoue des frames data:{t} + [DONE]
      const text: string = data.__sse || ''
      const enc = new TextEncoder()
      let i = 0
      const stream = new ReadableStream<Uint8Array>({
        pull(controller) {
          if (i < text.length) { const chunk = text.slice(i, i + 18); i += 18; controller.enqueue(enc.encode(`data: ${JSON.stringify({ t: chunk })}\n\n`)) }
          else { controller.enqueue(enc.encode('data: [DONE]\n\n')); controller.close() }
        },
      })
      return { ok: true, status: 200, body: stream, json: async () => data } as unknown as Response
    }
    return { ok: true, status: 200, json: async () => data } as unknown as Response
  }
  const headers: Record<string, string> = { ...(opts.headers as any) }
  if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`
  if (opts.body && typeof opts.body === 'string') headers['Content-Type'] = 'application/json'
  // §12bis.F — la langue du rêveur voyage avec chaque appel (voir api-client.ts).
  if (!headers['X-Dream-Lang']) headers['X-Dream-Lang'] = currentLocale()
  const res = await fetch(path, { ...opts, headers })
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || `${res.status}`) }
  return res
}

/* Lit un flux SSE d'interprétation (frames data:{t}, data:{stop_reason}, [DONE]).
   Appelle onText pour chaque fragment, onErr pour une erreur, et RENVOIE le stop_reason
   (ex. 'max_tokens' → l'UI proposera « Continuer »). §12ter.B */
async function readSSE(res: Response, onText: (t: string) => void, onErr: (e: string) => void): Promise<string | null> {
  const reader = res.body!.getReader()
  const dec = new TextDecoder()
  let buf = ''
  let stop: string | null = null
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buf += dec.decode(value, { stream: true })
    const lines = buf.split('\n\n'); buf = lines.pop() || ''
    for (const l of lines) {
      if (!l.startsWith('data: ')) continue
      const payload = l.slice(6)
      if (payload === '[DONE]') continue
      try { const j = JSON.parse(payload); if (j.t) onText(j.t); if (j.error) onErr(j.error); if (j.stop_reason) stop = j.stop_reason } catch {}
    }
  }
  return stop
}

/* ───────── crisis filet — FR + EN ─────────
   Le filet ne dépend PAS de la langue de l'UI : on teste TOUJOURS les deux jeux de
   motifs (on peut écrire en anglais dans une app en français, et inversement).
   La couverture FR est inchangée, mot pour mot. */
const CRISIS_RE_FR = /suicid|me tuer|en finir|plus envie de vivre|envie de dispara[iî]tre|me faire du mal|m'?automutil|me mutiler|scarifi|plus la force de vivre|tout arr[eê]ter pour de bon/i
const CRISIS_RE_EN = /suicid|kill(?:ing)? myself|end(?:ing)? my life|end it all|take my own life|don'?t want to (?:live|be here|wake up|exist)|do(?:es)? not want to live|no reason to live|nothing to live for|no point (?:in )?living|better off dead|wish i (?:was|were) dead|wanna die|want to die|want to disappear|hurt(?:ing)? myself|harm(?:ing)? myself|self[-\s]?harm|cut(?:ting)? myself|can'?t go on|can'?t take it any\s?more|end the pain/i
function isCrisis(text: string): boolean {
  return CRISIS_RE_FR.test(text) || CRISIS_RE_EN.test(text)
}
function CrisisCard({ onClose }: { onClose: () => void }) {
  const { t } = useT()
  const h2 = t('core.crisis.line2Href')
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(20,17,26,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 360, padding: 26, borderRadius: 24, background: '#2b2534', border: T.cardBorder, fontFamily: T.sans, color: T.ink }}>
        <div style={{ fontFamily: T.serif, fontSize: 21, fontStyle: 'italic', color: T.cream, lineHeight: 1.3 }}>{t('core.crisis.title')}</div>
        <div style={{ marginTop: 14, fontSize: 17, lineHeight: 1.5, color: T.dim }}>{t('core.crisis.body')}</div>
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <a href={t('core.crisis.line1Href')} style={{ padding: '13px 16px', borderRadius: 14, background: 'rgba(255,255,255,0.12)', border: `1px solid ${T.gold}55`, color: T.cream, textDecoration: 'none', fontSize: 17, fontWeight: 600 }}>{t('core.crisis.line1Label')}</a>
          <a href={h2} {...(h2.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})} style={{ padding: '13px 16px', borderRadius: 14, background: T.card, border: T.cardBorder, color: T.ink, textDecoration: 'none', fontSize: 17 }}>{t('core.crisis.line2Label')}</a>
        </div>
        {/* ⚠️ SÉCURITÉ RÉELLE — ces lignes sont FRANÇAISES. On ne suppose JAMAIS le pays
            du rêveur : pas de numéro étranger inventé, on dit d'où viennent ces lignes et
            on renvoie vers un annuaire international réel. Ne "localise" pas ça à la légère. */}
        <div style={{ marginTop: 12, fontSize: 12.5, lineHeight: 1.45, color: T.faint, textAlign: 'center' }}>{t('core.crisis.elsewhere')}</div>
        <button onClick={onClose} style={{ marginTop: 18, width: '100%', padding: 12, borderRadius: 999, background: 'transparent', border: '1px solid rgba(202,191,206,0.18)', color: T.dim, fontSize: 13.5, cursor: 'pointer', fontFamily: T.sans }}>{t('core.crisis.close')}</button>
      </div>
    </div>
  )
}

/* ───────── LA LUNE / LE SOLEIL — le foyer unique (remplace la fleur de vie, demande Tim) ─────────
 * Un simple disque lumineux qui respire : nuit = lune crème, jour = soleil ambré (moonStyle du lib).
 * `rec` (on raconte) = respiration plus marquée (scale 1.03, cycle 2.5s) + halo intensifié.
 * AUCUN pétale, aucun anneau, aucune géométrie — la présence nue. API inchangée (rec/size/day).
 */
/**
 * LE FOYER — la lune (nuit) / la braise (jour). C'est le bouton (§14.3).
 *
 * Passe 2026-07-26, trois corrections :
 *  · `holding` — l'anneau de maintien se dessine sur les 180 ms du seuil de
 *    maintien réellement implémenté plus bas. Le geste devient VISIBLE : on voit
 *    qu'on est en train d'appuyer, et on voit à quel moment la voix s'ouvre.
 *    C'est la réponse à « le foyer est le bouton mais personne ne le devine » —
 *    on travaille l'affordance du foyer, on ne rajoute pas de CTA.
 *  · halo à deux souffles — le cœur respire sur 5000 ms (`moonStyle`), l'auréole
 *    externe sur 6765 ms. Les deux périodes ne se re-synchronisent jamais : la
 *    lumière ne boucle pas, elle vit. (DESIGN-DNA §6)
 *  · à l'enregistrement, le halo ne se contente plus de grossir : il se RÉCHAUFFE
 *    (l'or monte, la crème recule) — « la nuit d'un feu qui s'éteint » qu'on
 *    ranime en parlant.
 */
/* 2026-07-26 (mégapasse CD) — LE FOYER RÉTRÉCIT DE MOITIÉ.
 * L'étalum « nuit bleue vivante » pose une lune de 96 px avec un halo de 236,
 * là où on en était à 196 px de disque nu. Le rapport 89/233 = φ², c'est
 * exactement la proportion de l'étalon exprimée en Fibonacci.
 * Ce que ça change, et c'est le point : une lune qui occupe la moitié de la
 * largeur EST l'écran ; une lune de 89 px est une PRÉSENCE dans du vide. Le
 * halo, lui, tient les 233 px — donc la lumière garde toute sa place, seule
 * la matière recule. C'est ça, « rien ne crie ».
 * La zone tapable, elle, ne rétrécit pas : elle reste à 144 px (l'ancienne
 * auréole), très au-dessus des 44 px de la loi. On perd du disque, pas le geste. */
function Orb({ rec, size = SCALE.moon, day = false, holding = false }: { rec: boolean; size?: number; day?: boolean; holding?: boolean }) {
  const base = moonStyle(size, day)
  const recHalo = day
    ? `0 0 ${size * 0.618}px ${size * 0.18}px ${DT.sunGlow}, 0 0 ${size * 1.272}px ${size * 0.34}px rgba(230,166,54,0.20)`
    : `0 0 ${size * 0.618}px ${size * 0.2}px rgba(240,224,182,0.55), 0 0 ${size * 1.272}px ${size * 0.36}px rgba(255,255,255,0.21)`
  // l'anneau de maintien : périmètre exact → le tracé se referme pile à 180 ms.
  const r = size / 2 + 13
  const circ = 2 * Math.PI * r
  const ringColor = day ? DT.gold : T.gold
  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* LE HALO — φ² au-dessus du disque (89 → 233), et il respire en OPACITÉ,
          pas en échelle : le disque grossit de 1,5 %, la lumière va de 46 % à
          60 %. Deux souffles de même durée mais de nature différente — c'est ce
          décalage qui fait « vivante » plutôt que « qui pulse ». */}
      <div
        aria-hidden
        className="oAura"
        style={{
          ...haloStyle(SCALE.moonHalo, day),
          position: 'absolute', top: '50%', left: '50%',
        }}
      />
      {/* anneau de maintien — se referme sur les 180 ms du seuil, puis s'efface */}
      <svg
        aria-hidden
        width={size + 34} height={size + 34}
        viewBox={`0 0 ${size + 34} ${size + 34}`}
        style={{ position: 'absolute', pointerEvents: 'none', opacity: holding ? 1 : 0, transition: `opacity ${MOTION.fade}ms ${MOTION.ease}` }}
      >
        <circle
          className={holding ? 'oHold' : undefined}
          cx={(size + 34) / 2} cy={(size + 34) / 2} r={r}
          fill="none" stroke={ringColor} strokeWidth="1.3" strokeLinecap="round"
          transform={`rotate(-90 ${(size + 34) / 2} ${(size + 34) / 2})`}
          style={{ strokeDasharray: circ, strokeDashoffset: holding ? 0 : circ, ['--circ' as string]: `${circ}` }}
        />
      </svg>
      <div
        style={{
          ...base,
          boxShadow: rec ? recHalo : base.boxShadow,
          animation: rec ? 'dream-breathe-rec 2.5s ease-in-out infinite' : base.animation,
          transition: `box-shadow ${MOTION.swap}ms ${MOTION.ease}`,
        }}
      />
    </div>
  )
}

/* ───────── nav ───────── */
function QuietNav({ active, face = 'night', go }: { active: string; face?: 'night' | 'day'; go: (s: string) => void }) {
  const { t } = useT()
  // §1 nav (2026-07-11) : 4 onglets « Accueil · Groupes · Mur · Journal ».
  // « Accueil » ramène TOUJOURS à la home de capture (fin du cul-de-sac).
  // « Journal » = un seul espace, 2 vues (Liste | Univers) via segmented interne.
  //
  // ═══ 2026-07-26 — LA NAV NOMME LA FACE SUR LAQUELLE ELLE SE TIENT ═══
  // Tim : « le nouveau double écran c'est Rêve et Cœur […] faut que ce soit clair. »
  // Le premier onglet était « Accueil » avec une lune, et il restait « Accueil »
  // avec une lune quand on était sur le Cœur : les deux faces n'étaient nommées
  // NULLE PART dans la chrome de l'app. Elles le sont maintenant, dans le MÊME
  // emplacement — l'onglet ne se dédouble pas, il se retourne : lune/« Rêve »
  // côté nuit, soleil/« Cœur » côté jour. Zéro élément ajouté (§15.1 tenu), et
  // la bascule devient lisible depuis n'importe quel écran.
  //
  // 🔴 Et un vrai défaut vu au rendu, pas au code : la nav était peinte en NUIT
  // en dur (dégradé brun + texte crème). Sur la face jour — du parchemin clair —
  // elle posait une barre sombre en bas d'un écran de papier. Les deux faces
  // partagent maintenant l'anatomie, pas la lumière.
  const day = face === 'day'
  const items = [
    { k: 'home', icon: day ? I.sun : I.moon, l: day ? t('core.nav.heart') : t('core.nav.dream') },
    { k: 'circles', icon: (c: string, s = 21) => (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="9" cy="10" r="4.2" stroke={c} strokeWidth="1.5" /><circle cx="15.5" cy="13.5" r="4.2" stroke={c} strokeWidth="1.5" /></svg>
    ), l: t('core.nav.circles') },
    { k: 'wall', icon: (c: string, s = 21) => (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><rect x="3.5" y="4.5" width="17" height="15" rx="1.5" stroke={c} strokeWidth="1.5" /><path d="M3.5 9.5h17M3.5 14.5h17M9 4.5v5M15 9.5v5M9 14.5v5" stroke={c} strokeWidth="1.3" strokeLinecap="round" /></svg>
    ), l: t('core.nav.wall') },
    { k: 'journal', icon: I.journal, l: t('core.nav.journal') },
  ]
  return (
    <div style={{ position: 'fixed', left: 0, right: 0, bottom: 0, height: 89, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 26, paddingBottom: 'max(21px, env(safe-area-inset-bottom))', background: day ? 'linear-gradient(180deg, transparent, rgba(244,234,209,0.94) 55%)' : 'linear-gradient(180deg, transparent, rgba(25,21,33,0.9) 55%)', transition: `background ${MOTION.swap}ms ${MOTION.ease}`, zIndex: 20 }}>
      {items.map(it => {
        const on = it.k === active
        const c = on ? (day ? DT.ink : T.cream) : (day ? 'rgba(43,33,21,0.34)' : '#a49aad')
        return (
          <button key={it.k} onClick={() => go(it.k)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}>
            {it.icon(c, 21)}
            <span style={{ fontFamily: T.sans, fontSize: 9.5, fontWeight: on ? 600 : 500, letterSpacing: '0.02em', color: c }}>{it.l}</span>
          </button>
        )
      })}
    </div>
  )
}

/* ───────── recorder ─────────
   B2 2026-07-26 — LE DÉBIT DE CAPTURE A DÉMÉNAGÉ dans `src/lib/capture-safety.ts`
   (`CAPTURE_BITRATE_OPUS` / `CAPTURE_BITRATE_AAC`), pour deux raisons.

   1. UN SEUL CHIFFRE NE SUFFIT PAS. Chrome/Android écrit de l'**Opus**,
      Safari/iOS (notre WKWebView) écrit de l'**AAC-LC** — et sous 64 kbps, AAC a
      besoin d'environ DEUX FOIS le débit d'Opus pour la même qualité de parole.
      « 32 kbps » donnait de l'Opus correct sur Android et de l'AAC pâteux sur
      iPhone, c'est-à-dire exactement là où les rêves sont dits.
   2. LE MOTIF DU 32 kbps ÉTAIT FAUX. Il servait à faire tenir 8 min sous les
      4,5 Mo de corps de requête Vercel. Or au-delà de 4 Mo on ne passe plus par
      Vercel du tout (upload direct → Storage), et l'IA plafonne en DURÉE
      (1400 s mesurés le 26/07), pas en taille. Le débit ne repoussait rien.

   L'A/B de A8 reste vrai et utile : 128 / 48 / 32 kbps donnent la MÊME
   transcription. Mais il mesurait la transcription, pas la valeur d'ARCHIVE :
   cet audio sera réécouté dans dix ans et remontera dans le ciel de prières
   (VISION-CHANT-DU-COEUR §3). On n'archive pas une voix au débit minimum qui
   permet à une machine de la lire.

   `createVoiceRecorder` mesure d'abord ce que le navigateur ferait seul et ne
   descend JAMAIS en dessous. Un réglage ne peut que relever la qualité. */

function useRecorder() {
  const [state, setState] = useState<'idle' | 'held' | 'locked' | 'processing'>('idle')
  const [seconds, setSeconds] = useState(0)
  // §12bis.D — marqueurs « rêve suivant » : secondes écoulées à chaque tap, SANS
  // arrêter l'enregistrement. Passés (en nombre) à /api/mvp/split-night comme
  // signal fort d'intention (gpt-4o-transcribe ne rend pas d'horodatage par mot,
  // donc on ne peut pas mapper un marqueur à une position texte — voir la route).
  const [markers, setMarkers] = useState<number[]>([])
  const mediaRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const startedAt = useRef(0)
  const tick = useRef<any>(null)
  const resolveRef = useRef<((b: Blob | null) => void) | null>(null)
  const begin = useCallback(async () => {
    try {
      // Mono demandé côté capture : la parole n'a pas besoin de stéréo.
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true } })
      // B2 — débit d'ARCHIVE, choisi selon le codec réellement écrit par ce
      // navigateur, et jamais inférieur à son défaut. Voir capture-safety.ts.
      const mr = createVoiceRecorder(stream)
      const mime = mr.mimeType || 'audio/webm'
      chunksRef.current = []
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      mr.onstop = () => { stream.getTracks().forEach(t => t.stop()); const blob = new Blob(chunksRef.current, { type: mime }); resolveRef.current?.(blob.size > 800 ? blob : null) }
      mr.start(250); mediaRef.current = mr; startedAt.current = Date.now(); setSeconds(0); setMarkers([])
      tick.current = setInterval(() => setSeconds(s => s + 1), 1000)
      return true
    } catch { return false }
  }, [])
  // Un tap « rêve suivant » = un marqueur (multi-tap = multi-marqueurs). Ne coupe rien.
  const mark = useCallback(() => {
    const mr = mediaRef.current
    if (!mr || mr.state !== 'recording') return
    const t = Math.max(0, (Date.now() - startedAt.current) / 1000)
    setMarkers(m => (m.length >= 20 ? m : [...m, Math.round(t * 10) / 10]))
    try { if (typeof navigator !== 'undefined' && (navigator as any).vibrate) (navigator as any).vibrate(8) } catch {}
  }, [])
  const press = useCallback(async () => { if (state !== 'idle') return; if (await begin()) setState('held') }, [state, begin])
  const release = useCallback((): Promise<Blob | null> | null => {
    if (state === 'held') {
      if (Date.now() - startedAt.current < 900) { setState('locked'); return null }
      clearInterval(tick.current); setState('processing')
      return new Promise(res => { resolveRef.current = res; mediaRef.current?.stop() })
    }
    return null
  }, [state])
  const stopLocked = useCallback((): Promise<Blob | null> => {
    clearInterval(tick.current); setState('processing')
    return new Promise(res => { resolveRef.current = res; mediaRef.current?.stop() })
  }, [])
  const reset = useCallback(() => { clearInterval(tick.current); setState('idle'); setSeconds(0); setMarkers([]) }, [])
  useEffect(() => () => { clearInterval(tick.current); try { mediaRef.current?.stream?.getTracks().forEach(t => t.stop()) } catch {} try { if (mediaRef.current && mediaRef.current.state !== 'inactive') mediaRef.current.stop() } catch {} }, [])
  return { state, seconds, markers, mark, press, release, stopLocked, reset }
}
const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
// blob → base64 nu (sans préfixe data:) — pour uploader l'audio de la note de résonance (§C1bis)
const blobToB64 = (blob: Blob): Promise<string> => new Promise((resolve, reject) => {
  const r = new FileReader()
  r.onloadend = () => { const s = String(r.result || ''); resolve(s.slice(s.indexOf(',') + 1)) }
  r.onerror = reject
  r.readAsDataURL(blob)
})

/* ═════════ Plusieurs rêves par nuit (§12bis.D) — helpers ═════════ */
// uuid pour night_group_id (crypto.randomUUID sinon repli manuel).
function uuid(): string {
  try { if (typeof crypto !== 'undefined' && (crypto as any).randomUUID) return (crypto as any).randomUUID() } catch {}
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}
// Frontière DURE écrite : ligne de tirets seuls, ou « autre/nouveau rêve » isolé.
// Sert à décider s'il faut interroger /api/mvp/split-night (le vrai découpage y est fait).
const HARD_SEP_RE = /(^|\n)[ \t>*·.-]*(?:[-–—_*]{3,}|\(?(?:autre|nouveau)\s+r[êe]ve\)?|\(?another\s+dream\)?)[ \t]*[:.\-–—]?[ \t]*(?=\n|$)/i
// Repli LOCAL quand la route est injoignable (hors-ligne) mais que des frontières
// DURES existent dans le texte : on découpe au moins là-dessus, jamais un mot perdu.
function naiveSplitNight(text: string): string[] {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/(^|\n)[ \t>*·.-]*(?:[-–—_*]{3,}|\(?(?:autre|nouveau)\s+r[êe]ve\)?|\(?another\s+dream\)?)[ \t]*[:.\-–—]?[ \t]*(?=\n|$)/gi, '\n⁂\n')
    .split('⁂')
    .map(s => s.trim())
    .filter(s => s.length >= 2)
}

/* ═════════ ROOT ═════════ */
type Screen = 'home' | 'animus' | 'journal' | 'universe' | 'circles' | 'forge' | 'postdepot' | 'protocol' | 'interpret' | 'read' | 'import' | 'reveil' | 'scan' | 'wall' | 'guide' | 'guides' | 'settings' | 'greatdreams'

/* ───────── seuil jour↔nuit — un sceau d'or qui s'ouvre au passage (Van Gennep) ───────── */
function ThresholdVeil({ to }: { to: 'day' | 'night' }) {
  return (
    <div className="gVeil" style={{ position: 'fixed', inset: 0, zIndex: 50, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, background: to === 'day' ? 'radial-gradient(circle at 50% 45%, rgba(216,184,94,0.12), transparent 62%)' : 'radial-gradient(circle at 50% 45%, rgba(255,255,255,0.09), transparent 62%)', animation: 'gGlow 780ms ease-out' }} />
      <svg width="220" height="220" viewBox="0 0 200 200" style={{ animation: 'gThreshold 780ms cubic-bezier(.22,.61,.36,1) forwards' }}>
        <circle cx="100" cy="100" r="60" fill="none" stroke="#e0c087" strokeWidth="1" />
        <circle cx="100" cy="100" r="42" fill="none" stroke="#e0c087" strokeWidth="0.6" opacity="0.55" />
      </svg>
    </div>
  )
}

/* ───────── chargement-constellation — remplace les spinners (des points qui se relient) ───────── */
function Constellation({ size = 56 }: { size?: number }) {
  const { t } = useT()
  const pts = [[12, 18], [31, 9], [49, 20], [41, 40], [19, 44], [31, 28]]
  const lines = [[0, 5], [5, 1], [1, 2], [2, 3], [3, 5], [5, 4], [4, 0]]
  return (
    <svg width={size} height={size} viewBox="0 0 60 54" role="img" aria-label={t('core.common.loading')} style={{ display: 'block', margin: '0 auto', filter: `drop-shadow(0 0 6px ${T.gold}55)` }}>
      <g fill="none" stroke={T.gold} strokeWidth="0.6" opacity="0.55">
        {lines.map((l, i) => { const a = pts[l[0]], b = pts[l[1]]; const len = Math.hypot(b[0] - a[0], b[1] - a[1]); return <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} className="cLine" style={{ ['--len' as string]: len.toFixed(1), animationDelay: `${i * 110}ms` } as React.CSSProperties} /> })}
      </g>
      {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="1.7" fill={T.goldLit} className="cDot" style={{ animationDelay: `${i * 200}ms` }} />)}
    </svg>
  )
}

/* ───────── felt-shift — silhouette + points somatiques qui pulsent (gorge · poitrine · plexus · ventre) ───────── */
function BodyPoints() {
  const { t } = useT()
  return (
    <svg width="80" height="146" viewBox="0 0 84 150" role="img" aria-label={t('core.common.bodyFelt')} style={{ display: 'block', margin: '6px auto 0' }}>
      <g fill="none" stroke={`${T.gold}4d`} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="42" cy="19" r="11" />
        <path d="M42 30 L42 92 M42 41 L21 64 M42 41 L63 64 M42 92 L29 138 M42 92 L55 138" />
      </g>
      {[[42, 41], [42, 58], [42, 75], [42, 88]].map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="3.6" fill={T.goldLit} className="bPt" style={{ animationDelay: `${i * 520}ms` }} />)}
    </svg>
  )
}

/**
 * Racine /mvp (§12bis.F — vague internationale, 2026-07-11).
 *
 * Le `I18nProvider` n'est PAS monté ici : il l'est une seule fois, dans
 * `src/app/layout.tsx`. Un second provider imbriqué masquerait le premier —
 * `setLocale()` depuis Réglages ne mettrait à jour que le sous-arbre /mvp, et
 * tout ce qui serait rendu au-dessus resterait figé dans l'ancienne langue.
 * Un provider = une source de vérité. Ne le remonte pas ici.
 */
export default function MvpApp() {
  return <MvpAppInner />
}

function MvpAppInner() {
  const { t, tp } = useT()
  const [session, setSession] = useState<Session | null>(null)
  const [authReady, setAuthReady] = useState(false)
  const [screen, setScreen] = useState<Screen>('home')
  // A3 — les grands rêves : `greatFrom` retient d'où l'on vient (Journal ou Cœur)
  // pour que le retour soit juste ; `greatView` choisit journal ou consultation.
  const [greatView, setGreatView] = useState<'journal' | 'consult'>('journal')
  const [greatFrom, setGreatFrom] = useState<Screen>('journal')
  const [draft, setDraft] = useState<{ text: string; kairosId: string | null; kairosType?: string; captureMethod?: string; scanDate?: string | null; scanStoragePaths?: string[]; dayDeposit?: boolean; presentContext?: boolean; markers?: number[]; durationSec?: number; localId?: string | null }>(PREVIEW.on ? { text: "je marchais le long d'un fleuve très lent, presque immobile. une femme voilée se tenait sur l'autre rive et me tendait une clé sans rien dire. je savais que je devais traverser mais l'eau était noire et je n'osais pas.", kairosId: 'k-001' } : { text: '', kairosId: null })
  // 2026-07-11 — écran A5 Scanner : d'où on est entré (pour le retour ← et « nouveau rêve »)
  const [scanFrom, setScanFrom] = useState<'home' | 'import'>('home')
  const [readId, setReadId] = useState<string | null>(PREVIEW.on ? 'k-001' : null)
  const [readFrom, setReadFrom] = useState<Screen>('journal')
  const [interpretFrom, setInterpretFrom] = useState<'home' | 'read'>('home')
  // 2026-07-11 — Réglages atteignables depuis l'accueil (icône compte) ET le journal : on retient l'origine.
  const [settingsFrom, setSettingsFrom] = useState<Screen>('journal')
  // §1 — Journal = UN espace, 2 vues (Liste = Atlas · Univers). Persiste hors de la fiche.
  const [journalView, setJournalView] = useState<'liste' | 'univers'>('liste')
  // toast discret « Gardé. » (A4 « Garder pour moi »)
  const [toast, setToast] = useState<string | null>(null)
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(null), 1500) }
  // 2026-07-11 — Chantier D : les guides (C2 sheet · C3 session · C4 bibliothèque)
  const [guidesSheet, setGuidesSheet] = useState<null | { kairosId: string | null; dreamText: string; type?: string; radiant?: boolean }>(null)
  const [guideRun, setGuideRun] = useState<null | { guide: Guide; kairosId: string | null; dreamText: string; resume?: { step: number; answers: Record<string, string> } }>(null)
  const openGuides = (kairosId: string | null, dreamText: string, type?: string, radiant?: boolean) => setGuidesSheet({ kairosId, dreamText, type, radiant })
  const launchGuide = (guide: Guide, kairosId: string | null, dreamText: string) => { setGuidesSheet(null); if (kairosId) { setReadId(kairosId) }; setGuideRun({ guide, kairosId, dreamText }); setScreen('guide') }
  // « Reprendre » un guide en pause depuis la fiche rêve (J3) : relance au pas gardé, réponses restaurées.
  const resumeGuide = (guideId: string, kairosId: string, dreamText: string, resume: { step: number; answers: Record<string, string> }) => {
    const g = GUIDES_BY_ID[guideId]
    if (!g) return
    setReadId(kairosId); setGuideRun({ guide: g, kairosId, dreamText, resume }); setScreen('guide')
  }
  // « Refaire » un guide déjà fait (fiche rêve → section « Guides faits », §12bis C) : relance à neuf.
  const redoGuide = (guideId: string, kairosId: string, dreamText: string) => {
    const g = GUIDES_BY_ID[guideId]
    if (!g) return
    setGuidesSheet(null); setReadId(kairosId); setGuideRun({ guide: g, kairosId, dreamText }); setScreen('guide')
  }
  const exitGuide = () => { const kid = guideRun?.kairosId; setGuideRun(null); setGuidesSheet(null); setScreen(kid ? 'read' : 'journal') }
  /* C1 2026-07-26 — la bibliothèque des guides est désormais atteignable depuis la
     page « ce qu'on dépose ici », c'est-à-dire depuis l'accueil et depuis le Cœur.
     Sans mémoire d'origine, `onBack` renvoyait au Journal — on serait entré par la
     porte du Rêve pour ressortir ailleurs. Une seule variable règle ça, et le
     comportement historique (retour fiche / journal) reste le défaut. */
  const [guidesBack, setGuidesBack] = useState<Screen | null>(null)
  const openGuideLibrary = (from: Screen) => { setGuidesBack(from); setScreen('guides') }
  const [crisis, setCrisis] = useState(false)
  const [cross, setCross] = useState<null | 'day' | 'night'>(null)
  // onboarding O1-O4 — 'checking' seulement pour un compte encore non-onboarde (pas de flash home)
  const [onboard, setOnboard] = useState<'checking' | 'show' | 'hide'>(() => {
    if (typeof window === 'undefined') return 'hide'
    if (PREVIEW.on) return PREVIEW.screen === 'onboarding' ? 'show' : 'hide'
    try { return Appointments.onboardingDone() ? 'hide' : 'checking' } catch { return 'hide' }
  })

  useEffect(() => {
    if (PREVIEW.on) { setSession(MOCK_SESSION); setAuthReady(true); setScreen(PREVIEW.screen as Screen); return }
    sb().auth.getSession().then(({ data }) => { setSession(data.session); setAuthReady(true) })
    const { data: sub } = sb().auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  // Declenchement O1-O4 : premier login SANS kairos -> onboarding ; sinon marque vu en silence.
  useEffect(() => {
    if (PREVIEW.on || !session || onboard !== 'checking') return
    api('/api/kairos?limit=1', {}, session).then(r => r.json()).then(j => {
      const total = j.total ?? (j.kairos?.length || 0)
      if (total > 0) { Appointments.markOnboardingDone(); setOnboard('hide') }
      else setOnboard('show')
    }).catch(() => setOnboard('hide'))
  }, [session, onboard])

  // Tap sur une notif de rendez-vous : matin -> capture voix directe (l'accueil EST la voix) ; soir -> accueil.
  useEffect(() => {
    Appointments.initTapListener()
    const onTap = () => setScreen('home')
    window.addEventListener('dream-appt-tap', onTap)
    return () => window.removeEventListener('dream-appt-tap', onTap)
  }, [])

  const checkCrisis = (text: string) => { if (isCrisis(text)) setCrisis(true) }
  const crossTo = (s: Screen) => { setCross(s === 'animus' ? 'day' : 'night'); setScreen(s); setTimeout(() => setCross(null), 780) }
  useEffect(() => { const f = () => setScreen('forge'); window.addEventListener('go-forge', f); return () => window.removeEventListener('go-forge', f) }, [])

  if (!authReady) return <Shell><Centered><Orb rec={false} size={120} /></Centered></Shell>
  if (!session) return <Shell><AuthScreen /></Shell>
  if (onboard === 'checking') return <Shell><Centered><Orb rec={false} size={120} /></Centered></Shell>
  if (onboard === 'show') return <Shell><Onboarding onFinish={() => setOnboard('hide')} onStartCapture={() => { setScreen('home'); setOnboard('hide') }} onImport={() => { setScreen('import'); setOnboard('hide') }} /></Shell>

  return (
    <Shell day={screen === 'animus'} alive={screen === 'home' || screen === 'animus'}>
      {crisis && <CrisisCard onClose={() => setCrisis(false)} />}
      {screen === 'home' && <HomeScreen session={session} onCaptured={(text, meta) => { checkCrisis(text); setDraft({ text, kairosId: null, markers: meta?.markers, durationSec: meta?.durationSec, localId: meta?.localId ?? null }); setScreen('postdepot') }} goAnimus={() => crossTo('animus')} goScan={() => { setScanFrom('home'); setScreen('scan') }} openDream={(id: string) => { setReadId(id); setReadFrom('home'); setScreen('read') }} onSettings={() => { setSettingsFrom('home'); setScreen('settings') }} onGuides={() => openGuideLibrary('home')} />}
      {screen === 'animus' && <AnimusScreen session={session} goAnima={() => crossTo('home')} onCaptured={(text, type) => { checkCrisis(text); setDraft({ text, kairosId: null, kairosType: type, dayDeposit: true }); setScreen('postdepot') }} openDream={id => { setReadId(id); setReadFrom('animus'); setScreen('read') }}
        onGreatConsult={() => { setGreatFrom('animus'); setGreatView('consult'); setScreen('greatdreams') }} onGuides={() => openGuideLibrary('animus')} />}
      {screen === 'scan' && <ScanScreen session={session} onBack={() => setScreen(scanFrom === 'import' ? 'import' : 'home')} onDone={(text, meta) => {
        checkCrisis(text)
        setDraft(d => {
          const continuing = d.captureMethod === 'scan'
          const mergedText = continuing && d.text ? `${d.text}\n\n${text}` : text
          const paths = continuing ? [...(d.scanStoragePaths || [])] : []
          if (meta.storagePath) paths.push(meta.storagePath)
          return { text: mergedText, kairosId: null, captureMethod: 'scan', scanDate: continuing ? d.scanDate : null, scanStoragePaths: paths }
        })
        setScreen('postdepot')
      }} />}
      {screen === 'postdepot' && <PostDepotScreen session={session} draft={draft} setDraft={setDraft}
        onInterpret={(id: string, type?: string) => { setDraft(d => ({ ...d, kairosId: id, kairosType: type, presentContext: false })); setInterpretFrom('home'); setScreen('interpret') }}
        onCreate={(id: string, title: string | null, text: string) => { try { sessionStorage.setItem('forge_kairos', JSON.stringify({ id, title, text: (text || '').slice(0, 120) })) } catch {}; setScreen('forge') }}
        onKeep={() => { showToast(t('core.common.kept')); setScreen(draft.dayDeposit ? 'animus' : 'home') }}
        onKeepMany={(n: number) => { showToast(tp('core.postDepot.keptMany', n)); setDraft({ text: '', kairosId: null }); setScreen('home') }}
        onBack={() => setScreen(draft.dayDeposit ? 'animus' : 'home')} onScanAnotherPage={() => setScreen('scan')} onScanNewDream={() => { setDraft({ text: '', kairosId: null }); setScreen('scan') }} />}
      {screen === 'interpret' && draft.kairosId && <InterpretScreen session={session} kairosId={draft.kairosId} dreamText={draft.text} kairosType={draft.kairosType} presentContext={draft.presentContext} onGuides={(id, text, type) => openGuides(id, text, type)} onClose={() => { const day = !!draft.dayDeposit; if (interpretFrom !== 'read') setDraft({ text: '', kairosId: null }); setScreen(interpretFrom === 'read' ? 'read' : (day ? 'animus' : 'home')) }} />}
      {screen === 'journal' && <JournalScreen session={session} view={journalView} setView={setJournalView}
        onOpen={(id: string) => { setReadId(id); setReadFrom('journal'); setScreen('read') }}
        onImport={() => setScreen('import')} onSettings={() => { setSettingsFrom('journal'); setScreen('settings') }} onGallery={() => setScreen('forge')}
        onGreatDreams={() => { setGreatFrom('journal'); setGreatView('journal'); setScreen('greatdreams') }} />}
      {/* A3 — les grands rêves : journal à part + consultation à double lecture.
          Plein écran avec sa flèche retour, comme `read` — volontairement hors QuietNav
          (la nav reste à 4 onglets, §0.5 « une idée par écran »). */}
      {screen === 'greatdreams' && (
        <GreatDreamsJournal
          session={session}
          initialView={greatView}
          onOpenDream={(id: string) => { setReadId(id); setReadFrom('greatdreams'); setScreen('read') }}
          onBack={() => setScreen(greatFrom)}
        />
      )}
      {screen === 'read' && readId && <ReadScreen session={session} kairosId={readId} onBack={() => setScreen(readFrom)} onInterpret={(id, text, type, present) => { setDraft({ text, kairosId: id, kairosType: type, presentContext: !!present }); setInterpretFrom('read'); setScreen('interpret') }} onGuides={(id, text, type, radiant) => openGuides(id, text, type, radiant)} onResumeGuide={resumeGuide} onRedoGuide={redoGuide} onCreate={(id, title, text) => { try { sessionStorage.setItem('forge_kairos', JSON.stringify({ id, title, text: (text || '').slice(0, 120) })) } catch {}; setScreen('forge') }} onOpenDream={(id: string) => setReadId(id)} onDeleted={() => setScreen(readFrom)} />}
      {screen === 'guide' && guideRun && <GuideSession session={session} guide={guideRun.guide} kairosId={guideRun.kairosId} dreamText={guideRun.dreamText} resume={guideRun.resume} onExit={exitGuide} />}
      {screen === 'guides' && <GuidesLibrary onPick={(g) => { const ctx = guidesSheet; setGuidesBack(null); launchGuide(g, ctx?.kairosId ?? null, ctx?.dreamText ?? '') }} onBack={() => { const kid = guidesSheet?.kairosId; setGuidesSheet(null); if (guidesBack) { const b = guidesBack; setGuidesBack(null); setScreen(b) } else setScreen(kid ? 'read' : 'journal') }} />}
      {screen === 'import' && <ImportScreen session={session} onDone={() => setScreen('journal')} onScan={() => { setScanFrom('import'); setScreen('scan') }} />}
      {screen === 'forge' && <ForgeScreen session={session} onBack={() => setScreen('journal')} />}
      {screen === 'circles' && <CirclesScreen session={session} />}
      {screen === 'reveil' && <ReveilScreen onBack={() => setScreen('home')} />}
      {screen === 'settings' && <SettingsScreen
        session={session}
        onBack={() => setScreen(settingsFrom)}
        onGoReveil={() => setScreen('reveil')}
        onGoForge={() => setScreen('forge')}
        onChangePassword={async (pw: string) => { const { error } = await sb().auth.updateUser({ password: pw, data: { has_password: true } }); return error ? error.message : null }}
        onSignOut={async () => { try { localStorage.removeItem('dream_pw_nudge_dismissed') } catch {} await sb().auth.signOut() }}
      />}
      {screen === 'wall' && <WallScreen session={session} />}
      {['home', 'animus', 'journal', 'forge', 'wall', 'circles'].includes(screen) && <QuietNav active={screen === 'animus' ? 'home' : screen} face={screen === 'animus' ? 'day' : 'night'} go={s => setScreen(s as Screen)} />}
      {guidesSheet && screen !== 'guides' && screen !== 'guide' && <GuidesSheet open type={guidesSheet.type} text={guidesSheet.dreamText} radiant={guidesSheet.radiant} onPick={(g) => launchGuide(g, guidesSheet.kairosId, guidesSheet.dreamText)} onAll={() => setScreen('guides')} onClose={() => setGuidesSheet(null)} />}
      {toast && (
        <div style={{ position: 'fixed', bottom: 132, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 60, pointerEvents: 'none', animation: 'lFadeUp .3s ease' }}>
          <div style={{ padding: '10px 20px', borderRadius: 999, background: 'rgba(25,21,33,0.9)', border: '0.5px solid rgba(202,191,206,0.16)', fontFamily: T.sans, fontWeight: 500, fontSize: 17, color: T.cream }}>{toast}</div>
        </div>
      )}
      {cross && <ThresholdVeil to={cross} />}
    </Shell>
  )
}

function Shell({ children, day, alive }: { children: React.ReactNode; day?: boolean; alive?: boolean }) {
  return (
    <div style={{ minHeight: '100dvh', background: day ? DT.paper : T.bg, fontFamily: T.sans, color: day ? DT.ink : T.ink, position: 'relative', overflow: 'hidden', maxWidth: 560, margin: '0 auto', transition: `background ${MOTION.swap}ms ${MOTION.ease}` }}>
      {/* grain global — la matière, une seule fois pour toute l'app (§3).
          2026-07-26 : l'étalon fait DEUX grains, et la différence est le sujet.
          2,5 % QUI DÉRIVE (89 s) sur les deux faces d'accueil — c'est le seul
          endroit de l'app où quelque chose vit tout seul, sans qu'on ait rien
          demandé. 2 % IMMOBILE partout ailleurs : sur un écran de lecture, une
          matière qui bouge sous le texte, c'est du bruit. */}
      <div data-dream-grain style={grainOverlay(alive ? GRAIN_HOME : undefined, alive)} />
      <style>{DREAM_KEYFRAMES}</style>
      <style>{`
        @keyframes dream-breathe-rec { 0%,100% { transform: scale(1); } 50% { transform: scale(1.03); } }
        @keyframes lBreath { 0%,100% { opacity:0.7; transform:scale(1);} 50% { opacity:1; transform:scale(1.07);} }
        @keyframes lCore { 0%,100% { filter:brightness(1);} 50% { filter:brightness(1.08);} }
        @keyframes lRing { 0% { transform:scale(1); opacity:0.7;} 100% { transform:scale(1.4); opacity:0;} }
        @keyframes lBlink { 0%,100% { opacity:1;} 50% { opacity:0.3;} }
        @keyframes lFadeUp { from { opacity:0; transform:translateY(8px);} to { opacity:1; transform:translateY(0);} }
        /* B mandala — tracé, respiration, battement de cœur */
        @keyframes mDraw { to { stroke-dashoffset: 0; } }
        @keyframes mBreath { 0%,100% { opacity:0.55; } 50% { opacity:1; } }
        @keyframes mBeat { 0%,100% { opacity:0.55; r:5px; } 50% { opacity:1; r:7px; } }
        .mDraw { stroke-dasharray: var(--len); stroke-dashoffset: var(--len); animation: mDraw 3000ms cubic-bezier(.382,0,.618,1) forwards, mBreath 6765ms cubic-bezier(.382,0,.618,1) infinite 3200ms; }
        .mCore { animation: mBeat 4181ms cubic-bezier(.382,0,.618,1) infinite; }
        .mCore.rec { animation-duration: 2200ms; }
        @media (prefers-reduced-motion: reduce) { .mDraw, .mCore { animation: none !important; } .mDraw { stroke-dashoffset: 0; } }
        /* god-design : revelations lentes, fil dore qui se tire, anneaux de capture, seuil jour-nuit */
        @keyframes gReveal { from { opacity:0; transform:translateY(14px);} to { opacity:1; transform:translateY(0);} }
        @keyframes gThread { from { transform:scaleX(0); opacity:0;} to { transform:scaleX(1); opacity:1;} }
        @keyframes gRing { 0% { transform:scale(0.62); opacity:0.45;} 100% { transform:scale(2.3); opacity:0;} }
        @keyframes gGlow { 0%,100% { opacity:0.45;} 50% { opacity:0.9;} }
        @keyframes gThreshold { 0% { opacity:0; transform:scale(0.6);} 35% { opacity:0.8;} 100% { opacity:0; transform:scale(2.4);} }
        .gReveal { animation: gReveal 560ms cubic-bezier(.22,.61,.36,1) both; }
        .gThread { transform-origin:left center; animation: gThread 640ms cubic-bezier(.22,.61,.36,1) both; }
        @keyframes gThreadV { from { transform: scaleY(0); opacity: 0; } to { transform: scaleY(1); opacity: 1; } }
        @keyframes cDraw { from { stroke-dashoffset: var(--len); } to { stroke-dashoffset: 0; } }
        @keyframes cTwinkle { 0%,100% { opacity: 0.35; } 50% { opacity: 1; } }
        @keyframes bPulse { 0%,100% { opacity: 0.35; transform: scale(1); } 50% { opacity: 0.95; transform: scale(1.25); } }
        .gThreadV { transform-origin: top center; animation: gThreadV 600ms cubic-bezier(.22,.61,.36,1) both; }
        .cLine { stroke-dasharray: var(--len); stroke-dashoffset: var(--len); animation: cDraw 1500ms cubic-bezier(.22,.61,.36,1) infinite alternate; }
        .cDot { transform-box: fill-box; transform-origin: center; animation: cTwinkle 1900ms ease-in-out infinite; }
        .bPt { transform-box: fill-box; transform-origin: center; animation: bPulse 2600ms ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .gReveal, .gThread, .gThreadV, .cLine, .cDot, .bPt { animation: none !important; opacity:1 !important; transform:none !important; } .cLine { stroke-dashoffset: 0 !important; } .gVeil { display: none !important; } }
        /* ═══ §14 passe d'épure 2026-07-26 — foyer, seuil, voix ambiante ═══ */
        /* l'anneau de maintien : se referme en 180 ms, exactement le seuil de
           maintien implémenté dans onOrbDown. Le geste devient visible. */
        @keyframes oHoldDraw { from { stroke-dashoffset: var(--circ); } to { stroke-dashoffset: 0; } }
        .oHold { animation: oHoldDraw 180ms cubic-bezier(.382,0,.618,1) forwards; }
        /* le second souffle du foyer — 6765 ms (φ⁴), incommensurable avec les
           5000 ms du cœur : les deux respirations ne se re-synchronisent jamais. */
        @keyframes oAura { 0%,100% { opacity:0.55; transform:scale(1); } 50% { opacity:0.89; transform:scale(1.034); } }
        .oAura { animation: oAura 6765ms cubic-bezier(.382,0,.618,1) infinite; }
        /* le seuil — le bord porte la lumière de l'autre face, et il respire. */
        @keyframes gSeuil { 0%,100% { opacity:0.377; } 50% { opacity:0.618; } }
        .gSeuil { animation: gSeuil 6765ms cubic-bezier(.382,0,.618,1) infinite; }
        /* une seule voix ambiante à la fois — budget §14 tenu par construction :
           enveloppe vide (composant qui a rendu null) → masquée ; toute enveloppe
           qui suit une enveloppe pleine → masquée. L'ordre du JSX = la priorité. */
        .ambientSlot > div:not(:has(*)) { display: none; }
        .ambientSlot > div:has(*) ~ div { display: none; }
        @media (prefers-reduced-motion: reduce) { .oAura, .gSeuil { animation: none !important; } .oHold { animation-duration: 1ms !important; } }
        textarea:focus, input:focus { outline: none; border-color: ${T.gold}66 !important; }
        button:focus-visible, a:focus-visible { outline: 2px solid ${T.gold}; outline-offset: 3px; border-radius: 5px; }
        * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }
        body { margin: 0; background: #191521; }
      `}</style>
      {children}
    </div>
  )
}
const Centered = ({ children }: { children: React.ReactNode }) => (
  <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{children}</div>
)
const BackHeader = ({ onBack, title }: { onBack: () => void; title: string }) => (
  <div style={{ paddingTop: 60, paddingLeft: 20, paddingRight: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
    <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>{I.back('#ddd4de')}</button>
    <div style={{ fontFamily: T.serif, fontSize: 19, fontStyle: 'italic', color: T.cream }}>{title}</div>
  </div>
)
/* ═══ 2026-07-26 — LES BOUTONS SORTENT DE LA PILULE ═══
   L'étalon « nuit bleue vivante » n'a pas une seule pilule. Il a deux boutons,
   et deux seulement :
     · le plein — aplat d'OR #e0c087, texte #241f18 (9,39:1), coins 13
     · le fantôme — blanc à 5,5 %, liseré blanc à 11 %, texte #ece3d4
   Ce que ça règle, au-delà du goût : l'ancien bouton principal était un
   DÉGRADÉ DE CRÈME (#fbeeda → #ecd4b4). Sur la nuit brune il passait pour de
   la lumière ; sur la nuit bleue, un aplat crème à côté d'une lune crème, ce
   sont deux astres qui se disputent l'écran. L'or, lui, n'est jamais un foyer :
   c'est l'accent. Le rôle redevient lisible — la lune est la seule lumière,
   l'or est le seul geste.
   `transition: all .25s` est repassé en 233 ms (Fibonacci), et sur les seules
   propriétés qui bougent : `all` faisait aussi traîner la couleur du texte. */
const PillBtn = ({ onClick, children, primary, disabled, flex }: any) => (
  <button onClick={onClick} disabled={disabled} style={{ flex: flex ?? 1, minHeight: 55, padding: '15px 18px', borderRadius: SCALE.radius, cursor: 'pointer', fontFamily: T.sans, fontSize: SCALE.body, fontWeight: 600, lineHeight: 1.2, opacity: disabled ? 0.45 : 1, transition: `background 233ms ${MOTION.ease}, opacity 233ms ${MOTION.ease}`, ...(primary ? { border: 'none', background: T.gold, color: T.onGold } : { background: 'rgba(255,255,255,0.055)', border: T.cardBorderLit, color: T.text }) }}>{children}</button>
)
const GhostBtn = ({ onClick, children }: any) => (
  <button onClick={onClick} style={{ flex: 1, minHeight: 55, padding: '15px 18px', borderRadius: SCALE.radius, cursor: 'pointer', background: 'rgba(255,255,255,0.055)', border: T.cardBorderLit, color: T.text, fontSize: SCALE.body, fontWeight: 600, lineHeight: 1.2, fontFamily: T.sans, transition: `background 233ms ${MOTION.ease}` }}>{children}</button>
)

/* ═════════ AUTH — mot de passe (défaut) · code email en secours ═════════ */
function AuthScreen() {
  const { t } = useT()
  const [mode, setMode] = useState<'password' | 'code'>('password')
  const [sent, setSent] = useState(false) // mode code : email envoyé → saisie du code
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const okEmail = () => /.+@.+\..+/.test(email)
  const signIn = async () => {
    if (!okEmail()) { setErr(t('core.auth.errEmail')); return }
    if (password.length < 6) { setErr(t('core.auth.errPasswordShort')); return }
    setBusy(true); setErr('')
    const { error } = await sb().auth.signInWithPassword({ email: email.trim().toLowerCase(), password })
    setBusy(false)
    if (error) {
      const m = (error.message || '').toLowerCase()
      if (m.includes('not confirmed') || m.includes('confirm')) setErr(t('core.auth.errNotConfirmed'))
      else setErr(t('core.auth.errBadCredentials'))
    }
  }
  const sendCode = async () => {
    if (!okEmail()) { setErr(t('core.auth.errEmail')); return }
    setBusy(true); setErr('')
    const { error } = await sb().auth.signInWithOtp({ email: email.trim().toLowerCase() })
    setBusy(false)
    if (error) setErr(error.message); else setSent(true)
  }
  const verify = async (token: string) => {
    setBusy(true); setErr('')
    const { error } = await sb().auth.verifyOtp({ email: email.trim().toLowerCase(), token, type: 'email' })
    setBusy(false)
    if (error) setErr(t('core.auth.errBadCode'))
  }
  const inCode = mode === 'code' && sent
  const inputBase: React.CSSProperties = { width: '100%', padding: '15px 18px', borderRadius: 16, background: T.card, border: T.cardBorder, color: T.cream, fontSize: 17, fontFamily: T.sans, textAlign: 'center' }
  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 28 }}>
      <div style={{ fontFamily: T.display, fontSize: 12, fontWeight: 500, letterSpacing: '0.52em', color: T.gold, marginBottom: 32, paddingLeft: '0.52em' }}>DREAM</div>
      <Orb rec={false} size={130} />
      <div style={{ marginTop: 36, textAlign: 'center', animation: 'lFadeUp .5s ease' }}>
        <div style={{ fontFamily: T.serif, fontSize: 30, fontStyle: 'italic', color: T.cream, lineHeight: 1.15 }}>{inCode ? t('core.auth.titleCodeSent') : t('core.auth.title')}</div>
        <div style={{ marginTop: 10, fontSize: 13.5, color: T.dim }}>{inCode ? t('core.auth.subCodeSent', { email }) : mode === 'password' ? t('core.auth.subPassword') : t('core.auth.subCode')}</div>
      </div>
      <div style={{ marginTop: 30, width: '100%', maxWidth: 340 }}>
        {inCode ? (
          <>
            <input type="text" inputMode="numeric" autoComplete="one-time-code" placeholder="········" value={code} maxLength={8} onChange={e => { const v = e.target.value.replace(/\D/g, '').slice(0, 8); setCode(v); if (v.length === 8) verify(v) }} style={{ ...inputBase, color: T.gold, fontSize: 28, fontFamily: 'ui-monospace, monospace', letterSpacing: '0.4em' }} />
            <div style={{ marginTop: 12, display: 'flex' }}><PillBtn primary onClick={() => verify(code)} disabled={busy || code.length < 4}>{busy ? t('core.auth.verifying') : t('core.auth.validateCode')}</PillBtn></div>
            <button onClick={() => { setSent(false); setCode('') }} style={{ marginTop: 14, width: '100%', background: 'none', border: 'none', color: T.faint, fontSize: 13, cursor: 'pointer', fontFamily: T.sans }}>{t('core.auth.changeEmail')}</button>
          </>
        ) : mode === 'password' ? (
          <>
            <input type="email" inputMode="email" autoComplete="email" placeholder={t('core.auth.placeholderEmail')} value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && signIn()} style={inputBase} />
            <input type="password" autoComplete="current-password" placeholder={t('core.auth.placeholderPassword')} value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && signIn()} style={{ ...inputBase, marginTop: 10 }} />
            <div style={{ marginTop: 12, display: 'flex' }}><PillBtn primary onClick={signIn} disabled={busy}>{busy ? t('core.auth.signingIn') : t('core.auth.signIn')}</PillBtn></div>
            <button onClick={() => { setMode('code'); setErr('') }} style={{ marginTop: 14, width: '100%', background: 'none', border: 'none', color: T.faint, fontSize: 13, cursor: 'pointer', fontFamily: T.sans }}>{t('core.auth.noPasswordYet')}</button>
          </>
        ) : (
          <>
            <input type="email" inputMode="email" autoComplete="email" placeholder={t('core.auth.placeholderEmail')} value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendCode()} style={inputBase} />
            <div style={{ marginTop: 12, display: 'flex' }}><PillBtn primary onClick={sendCode} disabled={busy}>{busy ? t('core.auth.sending') : t('core.auth.getCode')}</PillBtn></div>
            <button onClick={() => { setMode('password'); setErr('') }} style={{ marginTop: 14, width: '100%', background: 'none', border: 'none', color: T.faint, fontSize: 13, cursor: 'pointer', fontFamily: T.sans }}>{t('core.auth.havePassword')}</button>
          </>
        )}
        {err && <div style={{ marginTop: 12, textAlign: 'center', fontSize: 13, color: T.emberLive }}>{err}</div>}
      </div>
    </div>
  )
}

/* ═════════ NUDGE mot de passe — une fois, après login code (updateUser : session propre) ═════════ */
function PasswordNudge({ session }: { session: Session }) {
  const { t } = useT()
  const hasPw = !!(session.user?.user_metadata as Record<string, unknown> | undefined)?.has_password
  const [dismissed, setDismissed] = useState(() => { try { return localStorage.getItem('dream_pw_nudge_dismissed') === '1' } catch { return false } })
  const dismiss = () => { try { localStorage.setItem('dream_pw_nudge_dismissed', '1') } catch {} setDismissed(true) }
  const [open, setOpen] = useState(false)
  const [pw, setPw] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [done, setDone] = useState(false)
  useEffect(() => { if (!done) return; const id = setTimeout(() => dismiss(), 1800); return () => clearTimeout(id) }, [done])
  if (hasPw || dismissed) return null
  const save = async () => {
    if (pw.length < 6) { setErr(t('core.passwordNudge.errShort')); return }
    setBusy(true); setErr('')
    const { error } = await sb().auth.updateUser({ password: pw, data: { has_password: true } })
    setBusy(false)
    if (error) setErr(error.message); else setDone(true)
  }
  return (
    <div style={{ margin: '14px 20px 0', padding: 16, borderRadius: 20, background: 'rgba(255,255,255,0.07)', border: `0.5px solid ${T.gold}3a`, animation: 'lFadeUp .4s ease' }}>
      {done ? (
        <div style={{ fontFamily: T.sans, fontWeight: 500, fontSize: 17, color: T.cream, textAlign: 'center' }}>{t('core.passwordNudge.done')}</div>
      ) : !open ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: T.sans, fontWeight: 600, fontSize: 17, color: T.cream }}>{t('core.passwordNudge.title')}</div>
            <div style={{ marginTop: 3, fontSize: 12.5, color: T.dim }}>{t('core.passwordNudge.sub')}</div>
          </div>
          <button onClick={() => setOpen(true)} style={{ padding: '9px 15px', borderRadius: 999, background: 'rgba(255,255,255,0.14)', border: `1px solid ${T.gold}66`, color: T.cream, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: T.sans, whiteSpace: 'nowrap' }}>{t('core.passwordNudge.set')}</button>
          <button onClick={() => dismiss()} aria-label={t('core.passwordNudge.later')} style={{ background: 'none', border: 'none', color: T.faint, fontSize: 20, cursor: 'pointer', padding: '2px 4px', lineHeight: 1 }}>×</button>
        </div>
      ) : (
        <div>
          <input type="password" autoComplete="new-password" placeholder={t('core.passwordNudge.placeholder')} value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === 'Enter' && save()} style={{ width: '100%', padding: '13px 16px', borderRadius: 14, background: T.card, border: T.cardBorder, color: T.cream, fontSize: 17, fontFamily: T.sans, textAlign: 'center' }} />
          <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
            <button onClick={() => { setOpen(false); setPw(''); setErr('') }} style={{ flex: 1, padding: 11, borderRadius: 999, background: 'transparent', border: '1px solid rgba(202,191,206,0.18)', color: T.dim, fontSize: 13, cursor: 'pointer', fontFamily: T.sans }}>{t('core.common.cancel')}</button>
            <button onClick={save} disabled={busy} style={{ flex: 1.4, padding: 11, borderRadius: 999, background: 'linear-gradient(180deg, #f2e6c6, #d8c39a)', border: 'none', color: '#241a09', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: T.sans }}>{busy ? t('core.passwordNudge.saving') : t('core.passwordNudge.save')}</button>
          </div>
          {err && <div style={{ marginTop: 8, fontSize: 12.5, color: T.emberLive, textAlign: 'center' }}>{err}</div>}
        </div>
      )}
    </div>
  )
}

/* ═════════ ACCOUNT — retiré 2026-07-11 (SPEC §12bis I) : la gestion du compte vit
   désormais entièrement dans SettingsScreen (screen 'settings'). L'icône compte 👤
   de l'accueil pointe sur les Réglages complets. Le vieux panneau AccountSheet est
   supprimé (orphelin). PasswordNudge (le rappel doux) reste, lui. ═════════ */

/* ═════════ swipe hook ═════════ */
function useSwipe(onLeft: () => void, onRight: () => void, onDown?: () => void) {
  const start = useRef<{ x: number; y: number } | null>(null)
  return {
    onTouchStart: (e: React.TouchEvent) => { start.current = { x: e.touches[0].clientX, y: e.touches[0].clientY } },
    onTouchEnd: (e: React.TouchEvent) => {
      if (!start.current) return
      const dx = e.changedTouches[0].clientX - start.current.x
      const dy = e.changedTouches[0].clientY - start.current.y
      // swipe-bas = geste RÉSERVÉ (collectif futur) : non-event doux, jamais navigation
      if (onDown && dy > 80 && Math.abs(dx) < 55) onDown()
      else if (Math.abs(dx) > 70 && Math.abs(dy) < 60) { if (dx < 0) onLeft(); else onRight() }
      start.current = null
    },
  }
}

/* ═════════ ANIMA (home, nuit) — DEMO skin nuit-chaude (chantier H, HomeScreen uniquement) ═════════ */
/* §12bis.B — écho proactif à l'accueil nuit. L'app PROPOSE (jamais ne pousse) quand un écho fort
   s'est allumé sur un dépôt récent. Garde-fous côté client : au plus 1 carte, jamais 2 jours de suite
   (localStorage `dream_echo_last_shown`), écartable une fois pour toutes (`dream_echo_dismissed`). */
function todayLocalStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
function EchoOfTheDayCard({ session, onOpen }: { session: Session; onOpen: (id: string) => void }) {
  const { t } = useT()
  const [echo, setEcho] = useState<{ kairos_id: string; message: string; key: string } | null>(null)
  const [hidden, setHidden] = useState(false)
  useEffect(() => {
    let lastShown = ''
    let dismissed: string[] = []
    try { lastShown = localStorage.getItem('dream_echo_last_shown') || '' } catch {}
    try { dismissed = JSON.parse(localStorage.getItem('dream_echo_dismissed') || '[]') } catch {}
    // ne considérer un écho que si le dernier affichage remonte à ≥ 2 jours (jamais 2 jours de suite)
    const gapOk = (() => {
      if (!lastShown) return true
      const [y, m, d] = lastShown.split('-').map(Number)
      if (!y) return true
      const last = new Date(y, (m || 1) - 1, d || 1); last.setHours(0, 0, 0, 0)
      const now = new Date(); now.setHours(0, 0, 0, 0)
      return Math.round((now.getTime() - last.getTime()) / 86400000) >= 2
    })()
    if (!gapOk) return
    let alive = true
    api('/api/mvp/echo-of-the-day', {}, session).then(r => r.json()).then(j => {
      if (!alive) return
      const e = j.echo
      if (!e || !e.kairos_id) return
      const key = `${e.kairos_id}:${e.echo_kairos_id}`
      if (dismissed.includes(key)) return
      setEcho({ kairos_id: e.kairos_id, message: e.message, key })
      try { localStorage.setItem('dream_echo_last_shown', todayLocalStr()) } catch {}
    }).catch(() => {})
    return () => { alive = false }
  }, [session])
  if (!echo || hidden) return null
  const dismiss = () => {
    setHidden(true)
    try {
      const cur: string[] = JSON.parse(localStorage.getItem('dream_echo_dismissed') || '[]')
      if (!cur.includes(echo.key)) { cur.push(echo.key); localStorage.setItem('dream_echo_dismissed', JSON.stringify(cur.slice(-50))) }
    } catch {}
  }
  return (
    <div style={{ margin: '14px 20px 0', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 12px 12px 15px', borderRadius: 16, background: 'rgba(255,255,255,0.07)', border: '0.5px solid rgba(255,255,255,0.22)', animation: 'lFadeUp .5s ease' }}>
      <button onClick={() => onOpen(echo.kairos_id)} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 9, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
        <span style={{ color: T.gold, fontSize: 17, flexShrink: 0 }}>✶</span>
        <span style={{ fontFamily: T.serif, fontSize: 17, fontStyle: 'italic', color: '#f1e8d7', lineHeight: 1.4 }}>{echo.message}</span>
      </button>
      <button onClick={dismiss} aria-label={t('core.common.hide')} style={{ width: 24, height: 24, borderRadius: '50%', border: 'none', background: 'rgba(202,191,206,0.08)', color: T.dim, fontSize: 17, lineHeight: 1, cursor: 'pointer', flexShrink: 0 }}>×</button>
    </div>
  )
}
/* ───────── offline — remplacé le 26/07 par <PendingDeposits> (src/components/PendingDeposits.tsx).
   L'ancienne `PendingSyncLine` affichait un compteur NON CLIQUABLE : si la file butait,
   le rêveur regardait un chiffre sans pouvoir rien en faire. `PendingDeposits` garde la
   même discrétion (rien à l'écran quand la file est vide) mais devient une porte :
   réécouter la voix · réessayer · l'écrire soi-même en écoutant · supprimer. */

function HomeScreen({ session, onCaptured, goAnimus, goScan, openDream, onSettings, onGuides }: { session: Session; onCaptured: (text: string, meta?: { markers?: number[]; durationSec?: number; localId?: string | null }) => void; goAnimus: () => void; goScan: () => void; openDream: (id: string) => void; onSettings: () => void; onGuides: () => void }) {
  const { t, locale } = useT()
  const rec = useRecorder()
  const [recent, setRecent] = useState<any[]>([])
  // §14 fil ≤ 2 items — les 2 derniers dépôts, cliquables → fiche
  useEffect(() => { api('/api/kairos?limit=2', {}, session).then(r => r.json()).then(j => setRecent((j.kairos || []).slice(0, 2))).catch(() => {}) }, [session])
  const [mode, setMode] = useState<'voice' | 'write'>('voice')
  // A1 — `useState('')` nu = tout perdu si l'OS tue la WebView. `useDraft` restaure au
  // montage, sauvegarde en debounce 400 ms, et flush sur `pagehide`/`visibilitychange`.
  const [text, setText, clearDraftText] = useDraft('orbe')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  // Offline-first : confirmation calme « Gardé sur le téléphone — il partira tout seul ».
  const [savedOffline, setSavedOffline] = useState(false)
  const recording = rec.state === 'held' || rec.state === 'locked'
  const [reserved, setReserved] = useState(false)
  const swipe = useSwipe(goAnimus, () => {}, () => { setReserved(true); setTimeout(() => setReserved(false), 1700) })
  const dateStr = new Date().toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' })

  const processBlob = async (blob: Blob | null) => {
    if (!blob) { rec.reset(); return }
    setBusy(true); setErr(''); setSavedOffline(false)
    // §12bis.D — on capte les marqueurs « rêve suivant » AVANT reset (la détection
    // multi-rêves se fait ensuite sur l'écran de vérification A4 via split-night).
    const markers = rec.markers.slice()
    const durationSec = rec.seconds

    // ══ A1 2026-07-26 · LE PREMIER GESTE ══════════════════════════════════════
    // Le rêve est mis à l'abri (IndexedDB) et sa voix commence à monter vers le
    // Storage AVANT le moindre appel d'IA. Cette ligne ne throw jamais et ne
    // bloque rien : à partir d'ici, quoi qu'il arrive ensuite, rien n'est perdu.
    const localId = await safeguardRecording(blob, {
      kind: 'dream', kairosType: 'reve',
      captureMethod: markers.length ? 'mvp_voice' : 'mvp',
      fallbackText: t('core.offline.voiceFallback'),
      markers, durationSec,
    })

    try {
      // `transcribeSafely` choisit la ROUTE, jamais la qualité : ≤ 4 Mo → /api/transcribe
      // (raccourci de confort) ; au-delà → Storage puis /api/transcribe-from-storage, qui
      // découpe dans le conteneur et n'a AUCUNE limite de durée. C'est exactement ici que
      // l'ancien code postait 7,7 Mo à Vercel, qui refuse tout corps > 4,5 Mo.
      const transcribed = await transcribeSafely(localId, blob, durationSec)
      rec.reset(); setBusy(false)
      if (transcribed && transcribed.trim().length > 2) {
        // Le chemin rapide a gagné : la file cesse de vouloir créer un rêve en double,
        // elle finit juste de mettre la voix en lieu sûr.
        await markTranscribed(localId, transcribed.trim())
        onCaptured(transcribed.trim(), { markers, durationSec, localId })
      } else {
        // Rien de transcrit : on NE laisse PAS le dépôt en suspens, la file reprend.
        await markFailed(localId, 'transcription vide')
        setErr(t('core.capture.errNothing'))
      }
    } catch (e: any) {
      rec.reset(); setBusy(false)
      // ══ PLUS DE TEST `networkDown` ══════════════════════════════════════════
      // C'était LE bug : `e instanceof TypeError` n'est vrai que si `fetch` rejette.
      // Un 413/500/504 lève un `Error` ordinaire → le filet ne se déclenchait jamais
      // sur panne serveur, et c'est précisément ce qui est arrivé le 26/07.
      // Désormais : TOUTE exception mène à la file, sans exception.
      await markFailed(localId, String(e?.message || e))
      if (localId) {
        setSavedOffline(true); setTimeout(() => setSavedOffline(false), 4500)
      } else {
        // même IndexedDB est indisponible — dernier recours : l'ancien chemin
        try {
          await enqueueDeposit({
            kind: 'dream', audioBlob: blob, mime: blob.type,
            kairosType: 'reve', captureMethod: markers.length ? 'mvp_voice' : 'mvp',
            markers, durationSec, fallbackText: t('core.offline.voiceFallback'),
          })
          setSavedOffline(true); setTimeout(() => setSavedOffline(false), 4500)
        } catch { setErr(t('core.capture.errTranscribeSafe')) }
      }
    }
  }
  // §14.3 — LA LUNE EST LE BOUTON : maintiens = voix · tap court = écrire.
  // On n'ouvre le micro qu'après un court seuil de maintien (180 ms) ; un tap pur
  // n'allume jamais le micro et bascule en écriture. Le maintien bref→relâché
  // conserve le mode mains-libres (locked) hérité de useRecorder.
  const holdTimer = useRef<any>(null)
  const holdStarted = useRef(false)
  // §14.3 affordance — `holding` n'entre pas dans la logique de capture : il ne
  // sert QU'À dessiner l'anneau de maintien. La mécanique audio est inchangée.
  const [holding, setHolding] = useState(false)
  const onOrbDown = () => {
    if (busy || rec.state === 'locked') return
    holdStarted.current = false
    setHolding(true)
    clearTimeout(holdTimer.current)
    holdTimer.current = setTimeout(() => { holdStarted.current = true; if (rec.state === 'idle') rec.press() }, 180)
  }
  const onOrbUp = async () => {
    clearTimeout(holdTimer.current)
    setHolding(false)
    if (rec.state === 'held') { const p = rec.release(); if (p) processBlob(await p); return }
    if (!holdStarted.current && rec.state === 'idle') setMode('write')
  }
  const onOrbLeave = async () => {
    clearTimeout(holdTimer.current)
    setHolding(false)
    if (rec.state === 'held') { const p = rec.release(); if (p) processBlob(await p) }
  }
  const onOrbClick = async () => { if (rec.state === 'locked') processBlob(await rec.stopLocked()) }
  const submitText = () => { const v = text.trim(); if (v.length >= 3) { onCaptured(v); clearDraftText() } }

  return (
    // skin nuit-chaude — fond brun-nuit chaud porté par le conteneur, grain + lueur en overlays translucides.
    <div style={{ minHeight: '100dvh', position: 'relative', paddingBottom: 89, background: T.bg, transition: `background ${MOTION.swap}ms ${MOTION.ease}` }} {...swipe}>
      {/* LA LUEUR — ancrée sur la ligne φ, au point EXACT où se pose le foyer :
          la lumière sort de la matière, elle n'est plus posée derrière. */}
      {/* 2026-07-26 — LA LUEUR D'ÉCRAN EST RETIRÉE (face Rêve).
          Elle datait du fond RADIAL brun : une nappe de 70 % × 50 % posée sur la
          ligne φ pour que « la lumière sorte de la matière ». Le fond est
          maintenant un dégradé LINÉAIRE bleu-violet, et l'étalon ne pose plus
          qu'une seule source : le halo de 233 px autour de la lune. Garder la
          nappe revenait à éclaircir tout le haut de l'écran — le dégradé
          disparaissait, et la lune cessait d'être la seule chose qui rayonne.
          Elle reste sur le CŒUR (l.~1400), où le foyer est une braise dans du
          papier et a besoin d'être creusé par son ambiance. */}
      {/* LE SEUIL — l'ambre du jour transparaît au bord droit : la seconde face
          se devine avant de se lire. (réponse à « et le double écran cœur ? ») */}
      {!recording && !busy && mode === 'voice' && <ThresholdEdge side="right" />}
      {reserved && <ReservedToast />}
      {/* §14.1-2 — méta unique (date discrète) · 1 seule icône header (👤 → Réglages). Le réveil vit dans Réglages. */}
      <div style={{ paddingTop: 55, paddingLeft: 26, paddingRight: 21, display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 34 }}>
        <div style={{ fontFamily: T.sans, fontSize: 12.5, color: T.faint, letterSpacing: '0.01em' }}>{dateStr}</div>
        <button onClick={onSettings} aria-label={t('core.common.settingsAria')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}>{I.account('#b9b0bd')}</button>
      </div>
      {mode === 'voice' ? (
        <>
          {/* ═══ LE FOYER — posé sur la ligne φ (38,2 %), jamais au centre mort ═══ */}
          <div style={{ marginTop: phiFocusTop(SCALE.moon, 89), display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* La zone tapable (144) est plus large que le disque (89) : le geste
                ne rétrécit pas avec la lune. */}
            <div onPointerDown={onOrbDown} onPointerUp={onOrbUp} onPointerLeave={onOrbLeave} onClick={onOrbClick} style={{ width: 144, height: 144, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', touchAction: 'none', userSelect: 'none' }}>
              <Orb rec={recording} holding={holding} />
            </div>
            <div style={{ marginTop: 34, padding: '0 34px', textAlign: 'center' }}>
              {/* §14 — le mot. 2026-07-26 : l'étalon le pose en Cormorant Garamond
                  300 ROMAIN, pas en italique. L'italique disait « je te murmure
                  quelque chose » ; le romain léger dit « voici le lieu ». Sur le
                  seul mot que porte l'écran, c'est la deuxième chose qui est vraie.
                  L'italique reste, plus bas, pour la traîne — donc la phrase se
                  lit encore d'un trait, mais elle a maintenant un appui et une
                  suite au lieu de deux souffles identiques. */}
              <div style={{ fontFamily: T.display, fontSize: SCALE.display, fontWeight: 300, color: T.cream, lineHeight: 1.05, transition: `opacity ${MOTION.fade}ms ${MOTION.ease}` }}>{busy ? t('core.capture.writing') : recording ? t('core.capture.listening') : t('core.home.word')}</div>
              {/* ═══ LA TRAÎNE DU MOT — le périmètre, sans un élément de plus ═══
                  Tim, 26/07 : « le nouveau double écran c'est Rêve et Cœur, mais
                  Rêve c'est donc aussi Kaïros etc… faut que ce soit clair. Sans
                  pour autant alourdir l'écran. »
                  Le budget §15.1 était plein (9/9). La traîne n'ouvre PAS un
                  dixième emplacement : elle reste DANS l'emplacement n°3 (« 1 mot »)
                  — même famille typographique, même italique, collée au mot (5 px),
                  et elle descend d'un cran sur l'échelle φ (40 → 17, soit ≈ φ²).
                  Le mot et sa traîne se lisent comme UNE seule phrase — « rêve, ou
                  un signe, un frisson… » — pas comme un titre + un sous-titre (que
                  §15.1 bannit nommément).
                  Deux nourritures : le mot « rêve » reste seul en gros, donc §1.6
                  (« la porte d'entrée reste le RÊVE ») est tenu au pixel ; et le
                  périmètre de 1_BIBLE §1.5 (« ce que la vie nous chante ») devient
                  lisible en une respiration, sans liste et sans chips.
                  Elle se retire pendant la capture : sous « je t'écoute », nommer
                  le périmètre n'a plus de sens — c'est déjà déposé.

                  ── C1, 26/07 : LES TROIS POINTS DEVIENNENT UNE PORTE ──
                  Tim : « la solution comme d'hab est cette petite bulle qui permet
                  d'avoir + d'info → présente les kaïros direct, et "lire +" emmène
                  sur une vraie page en profondeur ».
                  La traîne ne change ni de mot, ni de taille, ni de place : elle
                  devient TAPABLE, et gagne un ⓘ terminal. Les « … » promettaient
                  déjà une suite ; ils la tiennent enfin. Budget §15.1 inchangé —
                  toujours l'emplacement n°3, toujours 9/9 sur les deux faces.
                  La copie reste `core.home.also` : une clé, un mot de Tim. */}
              {!busy && !recording && (
                <ScopeTrail face="dream" onGuides={onGuides} />
              )}
              {/* §14 — UNE micro-ligne, et une seule. Le scan (📷) est un troisième
                  chemin de dépôt : il vit SUR cette ligne, en glyphe terminal, au
                  lieu de flotter en icône orpheline sous la poésie. Un élément de
                  moins à l'écran, une façon de déposer de plus au même endroit. */}
              <div style={{ marginTop: 13, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: SCALE.meta, color: T.dim, lineHeight: 1.4 }}>
                <span>{busy ? t('core.common.oneMoment') : rec.state === 'locked' ? t('core.home.lockedHint', { t: fmt(rec.seconds) }) : recording ? t('core.capture.listeningTimer', { t: fmt(rec.seconds) }) : t('core.home.micro')}</span>
                {/* cible tactile : 34 px, le minimum que la loi tolère pour une
                    puce secondaire. Elle était à 27 (17 px d'icône + 5 de padding). */}
                {!recording && !busy && (
                  <button onClick={goScan} aria-label={t('core.home.scanAria')} style={{ background: 'none', border: 'none', cursor: 'pointer', minWidth: 34, minHeight: 34, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', opacity: 0.62, lineHeight: 0 }}>{I.camera(T.dim, 21)}</button>
                )}
              </div>
              {err && <div style={{ marginTop: 13, fontSize: 13, color: T.emberLive }}>{err}</div>}
              {savedOffline && <div style={{ marginTop: 13, fontSize: 13, color: T.gold, lineHeight: 1.4 }}>{t('core.capture.savedOffline')}</div>}
              {/* §12bis.D — « rêve suivant » : pose un marqueur pendant l'enregistrement, sans l'arrêter. */}
              {recording && (
                <button onClick={rec.mark} aria-label={t('core.home.markerAria')} style={{ marginTop: 21, minHeight: 44, padding: '11px 21px', borderRadius: 999, background: 'rgba(255,255,255,0.09)', border: '0.5px solid rgba(255,255,255,0.3)', color: '#ddd4de', fontSize: 13.5, fontWeight: 500, fontFamily: T.sans, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <span style={{ fontSize: 17, color: T.gold, lineHeight: 1 }}>⁂</span>
                  {rec.markers.length > 0 ? t('core.home.nextDreamN', { n: rec.markers.length }) : t('core.home.nextDream')}
                </button>
              )}
            </div>
          </div>
          {/* ═══ LA ZONE BASSE (les 61,8 % restants) ═══
              Tout ce qui n'est pas le foyer vit ICI, sous lui. Avant cette passe,
              quatre blocs conditionnels s'intercalaient entre le bandeau et
              l'orbe : ils poussaient le foyer hors de sa ligne et faisaient
              exploser le budget §14 dès que deux d'entre eux s'allumaient. */}
          {!recording && !busy && (
            <div style={{ padding: '34px 24px 0' }}>
              {/* A1 — la promesse offline, devenue une PORTE : réécouter, réessayer,
                  écrire soi-même, supprimer. Même discrétion : rien quand la file est vide. */}
              <PendingDeposits />
              {/* §14.1 — UNE seule voix ambiante, par ordre de priorité. */}
              <AmbientSlot>
                {/* §12bis.B — écho proactif : l'app PROPOSE (jamais ne pousse). */}
                <div><EchoOfTheDayCard session={session} onOpen={openDream} /></div>
                <div><PasswordNudge session={session} /></div>
                <div><ReproposeLine fetchTotal={async () => { try { const r = await api('/api/kairos?limit=1', {}, session); const j = await r.json(); return j.total ?? (j.kairos?.length || 0) } catch { return 0 } }} /></div>
              </AmbientSlot>
              {/* §14 — fil ≤ 2 (glyphe · titre · date relative). Rayon asymétrique :
                  la carte n'est pas un composant SaaS, elle a une main. */}
              {recent.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 440, margin: '13px auto 0' }}>
                  {recent.map((k: any) => {
                    const kt = KTYPES[k.kairos_type] || KTYPES.reve
                    return (
                      <button key={k.id} onClick={() => openDream(k.id)} style={{ display: 'flex', alignItems: 'center', gap: 11, width: '100%', padding: '11px 13px', borderRadius: '13px 21px 13px 21px', background: T.card, border: T.cardBorder, cursor: 'pointer', textAlign: 'left' }}>
                        {kt.glyph(T.gold)}
                        <span style={{ flex: 1, fontSize: 15, fontFamily: T.sans, fontWeight: 500, color: T.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{k.title || (k.raw_text || '').slice(0, 40)}</span>
                        {/* B4 — le temps du RÊVE, pas celui du dépôt. Et on n'affirme une
                            distance (« il y a 3 jours ») que si la date est assez sûre. */}
                        <span style={{ fontSize: 12.5, fontFamily: T.sans, color: T.faint, flexShrink: 0 }}>{k.occurred_at_reliable === false || !canAssertDelta(k.dream_date_precision) ? formatDreamDate(k, locale).when : relDay(k.occurred_at ?? k.created_at, locale)}</span>
                      </button>
                    )
                  })}
                </div>
              )}
              {/* LE PASSAGE vers la seconde face — le SEUL lien secondaire (§14).
                  Le liseré de bord l'a déjà annoncé ; ici on le nomme. */}
              <div style={{ marginTop: 21, textAlign: 'center' }}>
                <button onClick={goAnimus} style={{ background: 'none', border: 'none', color: T.gold, fontWeight: 500, fontSize: 13.5, cursor: 'pointer', fontFamily: T.sans, padding: '8px 13px', display: 'inline-flex', alignItems: 'center', gap: 8, letterSpacing: '0.02em' }}>
                  <span aria-hidden style={{ display: 'inline-block', width: 21, height: 1, background: `linear-gradient(90deg, transparent, ${T.gold})` }} />
                  {t('core.home.heart')}
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div style={{ padding: '40px 24px 0' }}>
          <textarea autoFocus value={text} onChange={e => setText(e.target.value)} placeholder={t('core.home.writePlaceholder')} style={{ marginTop: 22, width: '100%', minHeight: 220, padding: 20, borderRadius: 22, background: T.card, border: T.cardBorder, color: T.cream, fontSize: 17, lineHeight: 1.55, fontFamily: T.serif, fontStyle: 'italic', resize: 'vertical' }} />
          <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
            <GhostBtn onClick={() => setMode('voice')}>{t('core.common.back')}</GhostBtn>
            <PillBtn primary flex={2} onClick={submitText} disabled={text.trim().length < 3}>{t('core.capture.deposit')}</PillBtn>
          </div>
        </div>
      )}
    </div>
  )
}

/* ═════════ LE CŒUR (Écran 2 — la voix consciente, palette papier chaud) ═════════ */
/* §12ter.H (GO Tim) — bascule Orbe/Cœur : les kaïros vivent désormais sur l'Orbe.
   Ici, dépôt LIBRE de la vérité du moment ; même épure §14 que l'Orbe. */
function AnimusScreen({ session, goAnima, onCaptured, openDream, onGreatConsult, onGuides }: { session: Session; goAnima: () => void; onCaptured: (text: string, kairosType?: string) => void; openDream: (id: string) => void; onGreatConsult: () => void; onGuides: () => void }) {
  const { t, locale } = useT()
  const rec = useRecorder()
  const recording = rec.state === 'held' || rec.state === 'locked'
  const [mode, setMode] = useState<'voice' | 'write'>('voice')
  // A1 — même filet que l'Orbe : le texte du Cœur survit à la mort de la WebView.
  const [text, setText, clearDraftText] = useDraft('coeur')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [savedOffline, setSavedOffline] = useState(false)
  const [recent, setRecent] = useState<any[]>([])
  const [reserved, setReserved] = useState(false)
  const swipe = useSwipe(() => {}, goAnima, () => { setReserved(true); setTimeout(() => setReserved(false), 1700) })

  // §14 — fil ≤ 2 : les 2 derniers dépôts CŒUR (les « dits » = note_jour)
  useEffect(() => {
    api('/api/kairos?limit=24', {}, session).then(r => r.json())
      .then(j => setRecent((j.kairos || []).filter((k: any) => k.kairos_type === 'note_jour').slice(0, 2)))
      .catch(() => {})
  }, [session])

  // dépôt LIBRE (maintenir/taper la braise) = voix du cœur, sans catégorie → même flux post-dépôt que la nuit
  const processBlob = async (blob: Blob | null) => {
    if (!blob) { rec.reset(); return }
    setBusy(true); setErr(''); setSavedOffline(false)
    // A1 — la voix du cœur est mise à l'abri avant tout appel réseau (cf. l'Orbe).
    const localId = await safeguardRecording(blob, {
      kind: 'day', kairosType: 'note_jour', captureMethod: 'mvp_jour',
      fallbackText: t('core.offline.voiceFallback'),
      durationSec: rec.seconds,
    })
    try {
      const tx = await transcribeSafely(localId, blob, rec.seconds)
      rec.reset(); setBusy(false)
      if (tx && tx.trim().length > 2) {
        await markTranscribed(localId, tx.trim())
        onCaptured(tx.trim())
      } else {
        await markFailed(localId, 'transcription vide')
        setErr(t('core.capture.errNothing'))
      }
    } catch (e: any) {
      rec.reset(); setBusy(false)
      // Toute exception mène à la file — plus de distinction réseau/serveur.
      await markFailed(localId, String(e?.message || e))
      if (localId) {
        setSavedOffline(true); setTimeout(() => setSavedOffline(false), 4500)
      } else {
        try {
          await enqueueDeposit({
            kind: 'day', audioBlob: blob, mime: blob.type,
            kairosType: 'note_jour', captureMethod: 'mvp_jour',
            fallbackText: t('core.offline.voiceFallback'),
          })
          setSavedOffline(true); setTimeout(() => setSavedOffline(false), 4500)
        } catch { setErr(t('core.capture.errTranscribeSafe')) }
      }
    }
  }
  // §14.3 — LA BRAISE EST LE BOUTON : maintiens = voix · tap court = écrire (mêmes gestes que l'Orbe).
  const holdTimer = useRef<any>(null)
  const holdStarted = useRef(false)
  // affordance seule (cf. HomeScreen) — n'entre pas dans la mécanique de capture.
  const [holding, setHolding] = useState(false)
  const onOrbDown = () => {
    if (busy || rec.state === 'locked') return
    holdStarted.current = false
    setHolding(true)
    clearTimeout(holdTimer.current)
    holdTimer.current = setTimeout(() => { holdStarted.current = true; if (rec.state === 'idle') rec.press() }, 180)
  }
  const onOrbUp = async () => {
    clearTimeout(holdTimer.current)
    setHolding(false)
    if (rec.state === 'held') { const p = rec.release(); if (p) processBlob(await p); return }
    if (!holdStarted.current && rec.state === 'idle') setMode('write')
  }
  const onOrbLeave = async () => {
    clearTimeout(holdTimer.current)
    setHolding(false)
    if (rec.state === 'held') { const p = rec.release(); if (p) processBlob(await p) }
  }
  const onOrbClick = async () => { if (rec.state === 'locked') processBlob(await rec.stopLocked()) }
  const submitText = () => { const v = text.trim(); if (v.length >= 3) { onCaptured(v); clearDraftText() } }
  const dateStr = new Date().toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div style={{ minHeight: '100dvh', position: 'relative', paddingBottom: 89 }} {...swipe}>
      {/* le papier chaud — fond opaque, la lumière inversée de la nuit (jamais blanc pur) */}
      <div style={{ position: 'absolute', inset: 0, background: DT.paper, zIndex: 0 }} />
      {/* la lueur s'ancre sur la MÊME ligne φ que la braise — miroir exact de la nuit */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(66% 46% at 50% 38.2%, rgba(230,166,54,0.16), transparent 70%)', zIndex: 0, pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* LE SEUIL, en miroir — la crème de la nuit transparaît au bord GAUCHE.
            Les deux faces se signalent l'une l'autre, chacune par son bord. */}
        {!recording && !busy && mode === 'voice' && <ThresholdEdge side="left" day />}
        {reserved && <ReservedToast day />}
        {/* §14.1 — méta unique : date discrète. Pas d'icône header (Réglages vivent côté Orbe). */}
        <div style={{ paddingTop: 55, paddingLeft: 26, paddingRight: 21, minHeight: 34, display: 'flex', alignItems: 'center' }}>
          <div style={{ fontFamily: T.sans, fontSize: 12.5, color: DT.faint, letterSpacing: '0.01em' }}>{dateStr}</div>
        </div>

        {mode === 'voice' ? (
          <>
            {/* ═══ LE FOYER — même ligne φ que l'Orbe : en basculant d'une face à
                l'autre, le foyer ne bouge pas d'un pixel. Seule la lumière change
                de camp. C'est ça, « deux faces d'une même chose ». ═══ */}
            <div style={{ marginTop: phiFocusTop(168, 89), display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* la braise — disque ambre chaud, plus petit que la lune */}
              <div onPointerDown={onOrbDown} onPointerUp={onOrbUp} onPointerLeave={onOrbLeave} onClick={onOrbClick} style={{ width: 168, cursor: 'pointer', touchAction: 'none', userSelect: 'none' }}>
                <Orb rec={recording} day size={168} holding={holding} />
              </div>
              <div style={{ marginTop: 34, padding: '0 34px', textAlign: 'center' }}>
                {/* §14 — le mot « le cœur » + sa traîne, structure IDENTIQUE au Rêve.
                    C'est le point : les deux faces ne se ressemblent pas, elles ont
                    la MÊME anatomie — mot · traîne · geste — et seule la lumière
                    change de camp. La traîne est l'endroit où chaque face dit ce qui
                    lui appartient : côté Rêve le périmètre de ce qui est REÇU, côté
                    Cœur la question de ce qui est CHANTÉ (1_BIBLE §1.5).
                    ⚠️ Ceci répond à la question ouverte §15.6 n°5, option (b) de Tim :
                    la question remonte DANS le mot, la micro-ligne redevient le geste
                    nu (« maintiens · ou écris ») — la même sur les deux faces. La face
                    jour cesse d'être plus lourde que la face nuit. Copie inchangée :
                    ce sont les mots de Tim, seulement déplacés d'un cran. */}
                <div style={{ fontFamily: T.serif, fontSize: SCALE.display, fontStyle: 'italic', color: DT.ink, lineHeight: 1.05 }}>{busy ? t('core.capture.writing') : recording ? t('core.capture.listening') : t('core.animus.word')}</div>
                {/* ⚠️ `DT.inkSoft` et NON `DT.dim` : mesuré, la traîne en `dim`
                    (rgba(43,33,21,0.58)) sur le parchemin donne 3,79:1 — sous la
                    barre AA de 4,5:1 pour du 17 px. `inkSoft` donne 9,0:1.
                    La hiérarchie ne se fait donc PAS par le contraste (elle se
                    ferait au prix de la lisibilité) mais par la typo et l'échelle :
                    serif italique 17 pour la traîne, sans 13 pour le geste.
                    Côté nuit `T.dim` passe (5,27:1) et reste. */}
                {/* C1, 26/07 — « Idem dans Cœur, même principe » (Tim). Même geste,
                    même coquille, en lumière de jour : la bulle et la page prennent le
                    parchemin, pas le panneau de nuit. Poser la peau nocturne ici aurait
                    refait à l'identique le défaut de la nav corrigé ce matin (§3.1 B5).
                    Le contraste AA de la traîne est tenu par `ScopeTrail` lui-même. */}
                {!busy && !recording && (
                  <ScopeTrail face="heart" day onGuides={onGuides} />
                )}
                <div style={{ marginTop: 13, fontSize: SCALE.meta, color: DT.inkSoft, lineHeight: 1.4 }}>{busy ? t('core.common.oneMoment') : rec.state === 'locked' ? t('core.animus.lockedHint', { t: fmt(rec.seconds) }) : recording ? t('core.capture.listeningTimer', { t: fmt(rec.seconds) }) : t('core.animus.micro')}</div>
                {err && <div style={{ marginTop: 13, fontSize: 13, color: T.emberLive }}>{err}</div>}
                {savedOffline && <div style={{ marginTop: 13, fontSize: 13, color: DT.gold, lineHeight: 1.4 }}>{t('core.capture.savedOffline')}</div>}
              </div>
            </div>

            {/* ═══ ZONE BASSE — fil ≤ 2 (dits cœur) puis le passage vers l'Orbe ═══
                ⚠️ C'EST ICI que viendront les 4 verbes du Chant du Cœur
                (soutenir · amplifier · challenger · inspirer) + le free-flow,
                spécifiés dans VISION-CHANT-DU-COEUR §3 et à ce jour SANS UNE
                LIGNE DE CODE. La place leur est réservée : ils s'ouvriront APRÈS
                un dépôt (jamais à vide), en feuille montante depuis le fil, à
                l'endroit exact où se trouve aujourd'hui le fil des « dits ».
                Rien n'est stubbé — pas de bouton mort en attendant. Chantier
                fonctionnel, hors passe design (cf. AUDIT-DESIGN-CD-2026-07-26 §5). */}
            {!recording && !busy && (
              <div style={{ padding: '34px 24px 0' }}>
                {recent.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 440, margin: '0 auto' }}>
                    {recent.map((k: any) => {
                      const kt = KTYPES[k.kairos_type] || KTYPES.note_jour
                      return (
                        <button key={k.id} onClick={() => openDream(k.id)} style={{ display: 'flex', alignItems: 'center', gap: 11, width: '100%', padding: '11px 13px', borderRadius: '21px 13px 21px 13px', background: DT.card, border: DT.cardBorder, cursor: 'pointer', textAlign: 'left' }}>
                          {kt.glyph(DT.gold)}
                          <span style={{ flex: 1, fontSize: 15, fontFamily: T.sans, fontWeight: 500, color: DT.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{k.title || (k.raw_text || '').slice(0, 40)}</span>
                          {/* B4 — idem côté Cœur : le temps du kairos, et pas de distance affirmée sans date sûre. */}
                          <span style={{ fontSize: 12.5, fontFamily: T.sans, color: DT.faint, flexShrink: 0 }}>{k.occurred_at_reliable === false || !canAssertDelta(k.dream_date_precision) ? formatDreamDate(k, locale).when : relDay(k.occurred_at ?? k.created_at, locale)}</span>
                        </button>
                      )
                    })}
                  </div>
                )}
                {/* A3×A4 — fusion des deux intentions (RAPPORT-A4 §3bis) : l'entrée A3 vers
                    les grands rêves + le filet du seuil d'A4. `justifyContent: 'center'` est
                    NÉCESSAIRE sur le second bouton (en colonne flex, un `inline-flex` ne se
                    centre plus tout seul — sans lui le filet et le libellé partent à gauche).
                    §14.1 : le Cœur passe à 2 liens secondaires = la limite exacte. Élément 9/9.
                    Le prochain ajout sur cet écran devra en retirer un. */}
                <div style={{ marginTop: 21, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <button onClick={onGreatConsult} style={{ background: 'none', border: 'none', color: DT.inkSoft, fontWeight: 600, fontSize: 13.5, cursor: 'pointer', fontFamily: T.sans, padding: '8px 13px' }}>{t('screens.great.entryFromHeart')} →</button>
                  <button onClick={goAnima} style={{ background: 'none', border: 'none', color: DT.gold, fontWeight: 600, fontSize: 13.5, cursor: 'pointer', fontFamily: T.sans, padding: '8px 13px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, letterSpacing: '0.02em' }}>
                    <span aria-hidden style={{ display: 'inline-block', width: 21, height: 1, background: `linear-gradient(270deg, transparent, ${DT.gold})` }} />
                    {t('core.animus.orb')}
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div style={{ padding: '40px 24px 0' }}>
            <textarea autoFocus value={text} onChange={e => setText(e.target.value)} placeholder={t('core.animus.writePlaceholder')} style={{ marginTop: 22, width: '100%', minHeight: 220, padding: 20, borderRadius: 22, background: 'rgba(255,255,255,0.35)', border: DT.cardBorder, color: DT.ink, fontSize: 17, lineHeight: 1.55, fontFamily: T.serif, fontStyle: 'italic', resize: 'vertical' }} />
            <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
              <button onClick={() => setMode('voice')} style={{ flex: 1, padding: 14, borderRadius: 999, cursor: 'pointer', background: 'transparent', border: '1px solid rgba(138,106,36,0.28)', color: DT.inkSoft, fontSize: 17, fontWeight: 500, fontFamily: T.sans }}>{t('core.common.back')}</button>
              <button onClick={submitText} disabled={text.trim().length < 3} style={{ flex: 2, padding: 14, borderRadius: 999, cursor: 'pointer', border: 'none', background: 'linear-gradient(180deg, #f2d79a, #e0b968)', color: '#2a1a06', fontSize: 17, fontWeight: 600, fontFamily: T.sans, opacity: text.trim().length < 3 ? 0.45 : 1 }}>{t('core.capture.deposit')}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ═════════ POST-DÉPÔT (2 voies) ═════════ */
function PostDepotScreen({ session, draft, setDraft, onInterpret, onCreate, onKeep, onKeepMany, onBack, onScanAnotherPage, onScanNewDream }: any) {
  const { t, tp, locale } = useT()
  const [editing, setEditing] = useState(false)
  // A1 — le texte relu/corrigé avant dépôt est lui aussi un brouillon à ne pas perdre.
  const [text, setText, clearDraftText] = useDraft('postDepot', draft.text)
  const [busy, setBusy] = useState(false)
  const [addMode, setAddMode] = useState(false)
  const [addText, setAddText] = useState('')
  const [err, setErr] = useState('')
  const [savedId, setSavedId] = useState<string | null>(null)
  const [phase, setPhase] = useState<'review' | 'ways'>('review')
  // A2 miroir : un dépôt de jour arrive pré-typé (puce kaïros) ou libre (note_jour) — jamais 'reve' par défaut.
  const isDay = !!draft.dayDeposit
  const [ktype, setKtype] = useState<string>(draft.kairosType || (isDay ? 'note_jour' : 'reve'))
  const [shareOpen, setShareOpen] = useState(false)
  // 2026-07-11 — écran A5 Scanner : question de date (défaut = date du scan, pas d'override)
  const isScan = draft.captureMethod === 'scan'
  const [dateChoice, setDateChoice] = useState<'today' | 'pick' | 'unknown'>('today')
  /* B4 2026-07-26 — LE RÊVE À REBOURS. « cette nuit » est DÉJÀ sélectionné : le rêveur
     qui ne touche à rien obtient exactement le comportement d'avant. Un tap suffit pour
     dire autre chose — et jamais de sélecteur de date en plein réveil. */
  const [whenDreamt, setWhenDreamt] = useState<DreamDateShortcut>('tonight')
  /* B5 → B6 — LA puce du post-dépôt, une seule définition. Les deux rangées de cet
     écran (« quand » en phase review, « c'était… » en phase ways) vivent à dix
     secondes d'intervalle : elles doivent être le même objet, pas deux objets qui
     se ressemblent. Valeurs Fibonacci (gap 5/8, padding 8/13, cible 34 px), et
     surtout PAS d'overflowX — c'est le défilement horizontal qui rendait la moitié
     des types invisibles (cf. passe B5 §1.3). */
  const chip = (on: boolean): React.CSSProperties => ({
    display: 'inline-flex', alignItems: 'center', gap: 5,
    minHeight: 34, padding: '8px 13px', borderRadius: 999,
    fontSize: SCALE.meta, fontFamily: T.sans, cursor: 'pointer',
    background: on ? 'rgba(255,255,255,0.16)' : 'transparent',
    border: on ? `1px solid ${T.gold}66` : '1px solid rgba(202,191,206,0.14)',
    color: on ? T.cream : T.dim,
  })

  // ═══ §12bis.D — PLUSIEURS RÊVES PAR NUIT ═══
  // Actif UNIQUEMENT la nuit (le jour = un moment ; le scan sépare déjà via « nouveau
  // rêve »). Le cas 1-rêve (90 %) ne subit AUCUNE friction : aucun écran en plus, pas
  // de loader, split-night n'est même pas appelé pour un texte court sans signal.
  const canSplit = !isDay && !isScan
  const hardSignal = (Array.isArray(draft.markers) && draft.markers.length > 0) || HARD_SEP_RE.test(draft.text || '')
  const [nightPhase, setNightPhase] = useState<'checking' | 'ask' | 'off'>(canSplit && hardSignal ? 'checking' : 'off')
  const [nightDreams, setNightDreams] = useState<string[]>([])
  const [proposal, setProposal] = useState<string[] | null>(null) // détection de fond (texte long, sans signal fort) → bannière douce
  const [nightBusy, setNightBusy] = useState(false)
  const [nightErr, setNightErr] = useState('')
  const splitDone = useRef(false)
  // Idempotence du multi-POST : même night_group_id + même created_at à chaque essai,
  // et on reprend là où le réseau a lâché (pas de doublon si un envoi a réussi avant l'échec).
  const nightGidRef = useRef<string | null>(null)
  const nightCreatedRef = useRef<string | null>(null)
  const postedRef = useRef(0)

  useEffect(() => {
    if (!canSplit || splitDone.current) return
    const raw = (draft.text || '').trim()
    // On n'interroge l'IA que s'il y a un signal fort (marqueurs voix / séparateur écrit)
    // OU un texte assez long pour cacher plusieurs rêves. Sinon : rien, flux normal.
    if (!hardSignal && raw.length <= 320) { splitDone.current = true; return }
    splitDone.current = true
    ;(async () => {
      try {
        const res = await api('/api/mvp/split-night', { method: 'POST', body: JSON.stringify({ text: raw, markers: draft.markers || [] }) }, session)
        const j = await res.json()
        const dreams: string[] = Array.isArray(j.dreams) ? j.dreams.map((d: any) => (d?.text || '').trim()).filter(Boolean) : []
        if (dreams.length >= 2) {
          if (hardSignal) { setNightDreams(dreams); setNightPhase('ask') }
          else setProposal(dreams) // fond : on ne prend pas l'écran, on propose doucement
        } else setNightPhase('off')
      } catch {
        // hors-ligne : au moins découper sur les frontières DURES écrites, jamais un mot perdu
        const local = naiveSplitNight(raw)
        if (hardSignal && local.length >= 2) { setNightDreams(local); setNightPhase('ask') }
        else setNightPhase('off')
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // « ⌃ recoller » : fusionne la carte i avec la précédente (frontière de trop).
  const mergeUp = (i: number) => setNightDreams(list => {
    if (i <= 0) return list
    const copy = list.slice()
    copy[i - 1] = `${copy[i - 1]}\n\n${copy[i]}`.trim()
    copy.splice(i, 1)
    return copy
  })
  const editNightCard = (i: number, v: string) => setNightDreams(list => list.map((s, idx) => (idx === i ? v : s)))

  // « Oui, sépare » : chaque carte devient un kaïros distinct — même night_group_id,
  // même created_at de nuit. Le 1er porte l'audio de la nuit (§12bis.D — pas de découpe
  // audio en MVP : les suivants sont reliés au 1er par night_group_id).
  const separateNight = async () => {
    if (nightBusy) return
    const dreams = nightDreams.map(s => s.trim()).filter(s => s.length >= 2)
    if (dreams.length < 2) { setNightPhase('off'); return }
    setNightBusy(true); setNightErr('')
    if (!nightGidRef.current) nightGidRef.current = uuid()
    if (!nightCreatedRef.current) nightCreatedRef.current = new Date().toISOString()
    const gid = nightGidRef.current
    const createdAt = nightCreatedRef.current
    const firstMethod = draft.captureMethod || (Array.isArray(draft.markers) && draft.markers.length ? 'mvp_voice' : 'mvp')
    try {
      for (let i = postedRef.current; i < dreams.length; i++) {
        const payload: any = {
          raw_text: dreams[i],
          kairos_type: 'reve',
          capture_method: i === 0 ? firstMethod : 'mvp_night_split',
          created_at: createdAt,
          night_group_id: gid,
        }
        const res = await api('/api/kairos', { method: 'POST', body: JSON.stringify(payload) }, session)
        if (!res.ok) throw new Error('post failed')
        postedRef.current = i + 1
      }
      setNightBusy(false)
      onKeepMany(dreams.length)
    } catch {
      // Réseau tombé en séparant la nuit : les rêves NON encore postés partent dans la
      // file locale (même night_group_id + même created_at → cohérence de la nuit + idempotence).
      try {
        for (let i = postedRef.current; i < dreams.length; i++) {
          await enqueueDeposit({
            kind: 'dream',
            text: dreams[i],
            kairosType: 'reve',
            captureMethod: i === 0 ? firstMethod : 'mvp_night_split',
            createdAtOverride: createdAt,
            nightGroupId: gid,
          })
          postedRef.current = i + 1
        }
        setNightBusy(false)
        onKeepMany(dreams.length) // tout est sauf (posté ou en file) — rien n'est perdu
      } catch {
        setNightBusy(false)
        setNightErr(t('core.postDepot.nightErr'))
      }
    }
  }
  // « Non, garde ensemble » : flux actuel, 1 seul dépôt (texte recollé propre).
  const keepTogether = () => {
    const joined = nightDreams.length ? nightDreams.join('\n\n') : text
    setText(joined); setDraft({ ...draft, text: joined })
    setProposal(null); setNightDreams([]); setNightPhase('off')
  }

  const finalize = async (): Promise<string | null> => {
    if (busy) return null
    setBusy(true); setErr('')
    try {
      const payload: any = { raw_text: text, kairos_type: ktype || 'reve', capture_method: draft.captureMethod || (isDay ? 'mvp_jour' : 'mvp') }
      // B4 — la date du RÊVE. Le scan a déjà sa propre question de date (plus haut),
      // et un moment de jour a lieu le jour même : le raccourci ne concerne que la nuit.
      if (!isScan && !isDay) payload.dream_date_shortcut = whenDreamt
      if (isScan) {
        if (draft.scanDate) payload.created_at = draft.scanDate
        if (draft.scanStoragePaths && draft.scanStoragePaths.length) payload.attachment_storage_paths = draft.scanStoragePaths
      }
      const res = await api('/api/kairos', { method: 'POST', body: JSON.stringify(payload) }, session)
      const j = await res.json()
      const id = j.id || j.kairos?.id
      if (!id) throw new Error('no id')
      setSavedId(id); setBusy(false); setPhase('ways')
      // A1 — la voix rejoint le rêve (kairos_attachments kind='audio'). Best-effort :
      // si ça rate, l'audio reste retrouvable par client_dedup_id côté serveur.
      void linkCaptureAudio(draft.localId || null, id)
      clearDraftText()
      setDraft({ text, kairosId: id })
      try { Appointments.recordFirstKairos(j.kairos?.created_at) } catch {}
      return id
    } catch {
      setBusy(false)
      // Réseau tombé au moment de garder : le dépôt (texte) part dans la file locale —
      // il sera posté tout seul au retour du réseau. Le message errNetwork est donc VRAI.
      try {
        await enqueueDeposit({
          kind: isDay ? 'day' : 'dream',
          text,
          kairosType: ktype || 'reve',
          captureMethod: draft.captureMethod || (isDay ? 'mvp_jour' : 'mvp'),
          createdAtOverride: isScan && draft.scanDate ? draft.scanDate : null,
          attachmentStoragePaths: isScan && draft.scanStoragePaths?.length ? draft.scanStoragePaths : undefined,
        })
      } catch {
        // A1 — écrit dans un emplacement RELU au montage (`draft-store`). L'ancienne
        // clé `dream_pending_*` n'était relue par aucune ligne du code : les textes
        // y dormaient, inaccessibles. `draft-store` les récupère aussi.
        try { saveDraft('postDepot', text) } catch {}
      }
      setErr(t('core.postDepot.errNetwork'))
      return null
    }
  }
  // « + une autre page » — repart au scanner en gardant le texte déjà lu (concaténation côté racine)
  const goAnotherPage = () => { setDraft((d: any) => ({ ...d, text })); onScanAnotherPage() }
  // « nouveau rêve » — garde ce qui est là (silencieux, comme le retour ←) avant de repartir à zéro
  const goNewDream = async () => {
    if (text.trim().length >= 3 && !savedId) {
      const id = await finalize()
      if (!id) return // le réseau a flanché — on reste, l'erreur est déjà affichée, rien n'est perdu (localStorage)
    }
    onScanNewDream()
  }
  const appendAdd = () => {
    if (addText.trim().length > 1) { const merged = text + '\n\n' + addText.trim(); setText(merged); setDraft({ ...draft, text: merged }) }
    setAddMode(false); setAddText('')
  }

  // §12bis.D — écran « Ta nuit », étape de démêlage (signal fort seulement — bloquant assumé,
  // la personne a explicitement marqué des ruptures). Le cas 1-rêve ne passe jamais ici.
  if (nightPhase === 'checking') return (
    <div style={{ minHeight: '100dvh' }}>
      <BackHeader onBack={onBack} title={t('core.postDepot.nightTitle')} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: '0 30px', textAlign: 'center' }}>
        <Constellation />
        <div style={{ marginTop: 20, fontFamily: T.serif, fontSize: 18, fontStyle: 'italic', color: T.dim }}>{t('core.postDepot.untangling')}</div>
      </div>
    </div>
  )
  if (nightPhase === 'ask') return (
    <div style={{ minHeight: '100dvh', paddingBottom: 48 }}>
      <BackHeader onBack={onBack} title={t('core.postDepot.nightTitle')} />
      <div style={{ margin: '18px 18px 0', textAlign: 'center' }}>
        <div style={{ fontFamily: T.serif, fontSize: 21, fontStyle: 'italic', color: T.cream, lineHeight: 1.3 }}>{tp('core.postDepot.nightAsk', nightDreams.length)}</div>
        <div style={{ marginTop: 8, fontSize: 12.5, color: T.faint }}>{t('core.postDepot.nightHint')}</div>
      </div>
      <div style={{ margin: '20px 14px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {nightDreams.map((d, i) => (
          <div key={i} style={{ position: 'relative', padding: '16px 16px 14px', borderRadius: 20, background: T.card, border: T.cardBorder, animation: 'lFadeUp .3s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontFamily: T.sans, fontSize: SCALE.kicker, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(224,192,135,0.7)' }}>{t('core.postDepot.dreamN', { n: i + 1 })}</span>
              <span style={{ flex: 1 }} />
              {i > 0 && (
                <button onClick={() => mergeUp(i)} aria-label={t('core.postDepot.mergeUpAria')} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, minHeight: 32, padding: '5px 12px', borderRadius: 999, background: 'transparent', border: '1px solid rgba(202,191,206,0.18)', color: T.dim, fontSize: 12, fontFamily: T.sans, cursor: 'pointer' }}>{t('core.postDepot.mergeUp')}</button>
              )}
            </div>
            <textarea value={d} onChange={e => editNightCard(i, e.target.value)} style={{ width: '100%', minHeight: 92, background: 'transparent', border: 'none', color: '#f1e8d7', fontFamily: T.serif, fontSize: 17, fontStyle: 'italic', lineHeight: 1.5, resize: 'vertical' }} />
          </div>
        ))}
      </div>
      {nightErr && <div style={{ margin: '14px 18px 0', textAlign: 'center', fontSize: 13, color: T.emberLive, lineHeight: 1.4 }}>{nightErr}</div>}
      <div style={{ margin: '22px 18px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button onClick={separateNight} disabled={nightBusy} style={{ minHeight: 44, padding: '16px 20px', borderRadius: 20, background: 'rgba(255,255,255,0.12)', border: `1px solid ${T.gold}66`, cursor: 'pointer', color: T.cream, fontFamily: T.sans, fontSize: 17, fontWeight: 600, opacity: nightBusy ? 0.6 : 1 }}>{nightBusy ? t('core.postDepot.keepingThem') : t('core.postDepot.separate')}</button>
        <button onClick={keepTogether} disabled={nightBusy} style={{ minHeight: 44, padding: '16px 20px', borderRadius: 20, background: 'transparent', border: '1px solid rgba(202,191,206,0.16)', cursor: 'pointer', color: T.dim, fontFamily: T.sans, fontSize: 17, fontWeight: 600 }}>{t('core.postDepot.keepTogetherCap')}</button>
      </div>
      <div style={{ margin: '14px 30px 0', textAlign: 'center', fontSize: 11.5, color: T.faint, lineHeight: 1.5 }}>{t('core.postDepot.nightFoot')}</div>
    </div>
  )

  return (
    <div style={{ minHeight: '100dvh', paddingBottom: 40 }}>
      <BackHeader onBack={onBack} title={t(isDay ? 'core.postDepot.titleDay' : 'core.postDepot.titleNight')} />
      <div style={{ margin: '20px 18px 0', padding: 22, borderRadius: 24, background: T.card, border: T.cardBorder, animation: 'lFadeUp .4s ease' }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: T.gold, opacity: 0.8, marginBottom: 12 }}>{`${new Date().toLocaleDateString(locale, { day: 'numeric', month: 'long' })} · ${new Date().toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}${draft.durationSec ? ` · ${Math.floor(draft.durationSec / 60)}:${String(Math.round(draft.durationSec % 60)).padStart(2, '0')}` : ''}`}</div>
        {editing ? (
          <textarea value={text} onChange={e => setText(e.target.value)} onBlur={() => { setEditing(false); setDraft({ ...draft, text }) }} autoFocus style={{ width: '100%', minHeight: 180, background: 'transparent', border: 'none', color: '#f1e8d7', fontFamily: T.serif, fontSize: SCALE.bodyLg, fontStyle: 'italic', lineHeight: 1.55, resize: 'vertical' }} />
        ) : (
          <div onClick={() => phase === 'review' && setEditing(true)} style={{ fontFamily: T.serif, fontSize: SCALE.bodyLg, fontStyle: 'italic', lineHeight: 1.55, color: '#f1e8d7', whiteSpace: 'pre-wrap', cursor: phase === 'review' ? 'text' : 'default', maxHeight: phase === 'ways' ? 140 : undefined, overflow: phase === 'ways' ? 'hidden' : undefined, maskImage: phase === 'ways' ? 'linear-gradient(180deg, black 60%, transparent)' : undefined }}>{text}</div>
        )}
        {phase === 'review' && <div style={{ marginTop: 12, fontSize: 11.5, color: T.faint }}>{t(editing ? 'core.postDepot.editingHint' : 'core.postDepot.editHint')}</div>}
      </div>

      {/* §12bis.D — détection de fond (texte long, sans marqueur ni séparateur) : proposition
          DOUCE, jamais un écran qui s'impose. Ignorer = flux normal, zéro friction. */}
      {proposal && phase === 'review' && (
        <div style={{ margin: '14px 18px 0', padding: '15px 16px', borderRadius: 18, background: 'rgba(255,255,255,0.08)', border: `0.5px solid ${T.gold}44`, animation: 'lFadeUp .3s ease' }}>
          <div style={{ fontFamily: T.serif, fontSize: 17, fontStyle: 'italic', color: T.cream, lineHeight: 1.35 }}>{tp('core.postDepot.proposalHeard', proposal.length)}</div>
          <div style={{ marginTop: 11, display: 'flex', gap: 10 }}>
            <PillBtn onClick={() => { setNightDreams(proposal); setProposal(null); setNightPhase('ask') }}>{t('core.postDepot.separateThem')}</PillBtn>
            <GhostBtn onClick={() => setProposal(null)}>{t('core.postDepot.keepTogether')}</GhostBtn>
          </div>
        </div>
      )}

      {isScan && phase === 'review' && !addMode && (
        <div style={{ margin: '18px 18px 0' }}>
          <div style={{ fontFamily: T.serif, fontSize: 17, fontStyle: 'italic', color: T.dim, textAlign: 'center', lineHeight: 1.45 }}>
            {t('core.postDepot.scanCheck')}
          </div>
          <div style={{ marginTop: 18, textAlign: 'center' }}>
            <div style={{ fontFamily: T.serif, fontSize: 17, fontStyle: 'italic', color: T.cream, marginBottom: 10 }}>{t('core.postDepot.scanWhen')}</div>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
              {([['today', 'core.postDepot.scanToday'], ['pick', 'core.postDepot.scanPick'], ['unknown', 'core.postDepot.scanUnknown']] as const).map(([k, l]) => (
                <button key={k} onClick={() => { setDateChoice(k); if (k !== 'pick') setDraft((d: any) => ({ ...d, scanDate: null })) }}
                  style={{ padding: '7px 13px', borderRadius: 999, fontSize: 12.5, fontFamily: T.sans, cursor: 'pointer', background: dateChoice === k ? 'rgba(255,255,255,0.16)' : 'transparent', border: dateChoice === k ? `1px solid ${T.gold}66` : '1px solid rgba(202,191,206,0.14)', color: dateChoice === k ? T.cream : T.dim }}>
                  {t(l)}
                </button>
              ))}
            </div>
            {dateChoice === 'pick' && (
              <input
                type="date"
                max={new Date().toISOString().slice(0, 10)}
                onChange={e => { if (e.target.value) setDraft((d: any) => ({ ...d, scanDate: new Date(e.target.value).toISOString() })) }}
                style={{ marginTop: 12, padding: '10px 14px', borderRadius: 12, background: T.card, border: T.cardBorder, color: T.cream, fontSize: 17, fontFamily: T.sans }}
              />
            )}
          </div>
          <div style={{ marginTop: 18, display: 'flex', gap: 10 }}>
            <GhostBtn onClick={goAnotherPage}>{t('core.postDepot.anotherPage')}</GhostBtn>
            <GhostBtn onClick={goNewDream}>{t('core.postDepot.newDream')}</GhostBtn>
          </div>
        </div>
      )}

      {phase === 'review' && (addMode ? (
        <div style={{ margin: '20px 18px 0' }}>
          <textarea autoFocus value={addText} onChange={e => setAddText(e.target.value)} placeholder={t('core.postDepot.addPlaceholder')} style={{ width: '100%', minHeight: 100, padding: 18, borderRadius: 20, background: T.card, border: T.cardBorder, color: T.cream, fontFamily: T.serif, fontSize: 17, fontStyle: 'italic', lineHeight: 1.5, resize: 'vertical' }} />
          <div style={{ marginTop: 10, display: 'flex', gap: 10 }}>
            <GhostBtn onClick={() => setAddMode(false)}>{t('core.common.cancel')}</GhostBtn>
            <PillBtn onClick={appendAdd}>{t('core.postDepot.add')}</PillBtn>
          </div>
        </div>
      ) : (
        <div style={{ margin: '30px 18px 0' }}>
          {/* ═══ B4 — LE RÊVE À REBOURS ═══
              « j'enregistre aujourd'hui mon rêve d'avant-hier. » Une ligne de puces,
              « cette nuit » déjà cochée : qui ne touche à rien ne perd rien.
              Le kicker prend le registre de l'app (serif italique), pas celui d'un
              formulaire — même règle typographique que « c'était… » en phase ways.
              Absent du scan (qui a déjà sa question de date) et du jour (qui a lieu
              le jour même). */}
          {!isScan && !isDay && (
            <div style={{ marginBottom: 21, textAlign: 'center' }}>
              <div style={{ fontFamily: T.serif, fontSize: SCALE.body, fontStyle: 'italic', color: T.dim, marginBottom: 13 }}>{t('core.capture.whenTitle')}</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                {([
                  ['tonight', 'core.capture.whenTonight'],
                  ['yesterday', 'core.capture.whenYesterday'],
                  ['before_yesterday', 'core.capture.whenBeforeYesterday'],
                  ['few_days', 'core.capture.whenFewDays'],
                  ['unknown', 'core.capture.whenUnknown'],
                ] as const).map(([k, l]) => (
                  <button key={k} onClick={() => setWhenDreamt(k)} style={chip(whenDreamt === k)}>{t(l)}</button>
                ))}
              </div>
            </div>
          )}
          <div style={{ textAlign: 'center', marginBottom: 18 }}>
            <div style={{ fontFamily: T.serif, fontSize: 18, fontStyle: 'italic', color: T.dim, lineHeight: 1.3 }}>{t('core.postDepot.lastThingQ')}</div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <PillBtn onClick={() => setAddMode(true)}>{t('core.postDepot.iAdd')}</PillBtn>
            <GhostBtn onClick={finalize}>{busy ? t('core.postDepot.keepingIt') : t('core.postDepot.thatsAll')}</GhostBtn>
          </div>
          {err && <div style={{ marginTop: 14, textAlign: 'center', fontSize: 13, color: T.emberLive, lineHeight: 1.4 }}>{err}</div>}
        </div>
      ))}

      {phase === 'ways' && savedId && (
        <div style={{ margin: '30px 18px 0', animation: 'lFadeUp .4s ease' }}>
          {/* ═══ LE MOMENT QUI ENSEIGNE LE PÉRIMÈTRE (passe B5, 26/07) ═══
              C'est ICI qu'un rêveur apprend que sous « Rêve » vivent aussi le signe,
              la rêverie, l'hypnagogie, le frisson, la synchronicité. Pas dans un
              tutoriel, pas dans un carrousel de chips sur l'accueil (§15.1 les
              bannit) : au seul instant où l'information sert — juste après avoir
              déposé, quand l'app demande « c'était… ».
              Ce moment était traité comme un CHAMP DE FORMULAIRE : un kicker mono
              10,5 px en capitales espacées (le registre « code », adressé à personne)
              et des puces de 12 px dans une rangée à DÉFILEMENT HORIZONTAL — donc
              des types qu'on ne voyait jamais. Un périmètre à moitié hors de l'écran
              ne s'enseigne pas.
              Trois gestes, zéro élément ajouté : le kicker reprend la voix de l'app
              (serif italique 17, le MÊME registre que la traîne du mot sur l'accueil
              — « ce qui appartient à cet endroit » a une seule typographie dans toute
              l'app) · les puces passent au plancher de lisibilité (13 px, cible 34)
              · le défilement horizontal saute : tout se voit, rien ne se cache. */}
          <div style={{ textAlign: 'center', marginBottom: 13, display: 'inline-flex', width: '100%', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: T.serif, fontSize: SCALE.body, fontStyle: 'italic', color: T.dim }}>{t('core.postDepot.waysKicker')}</span>
            <InfoDot id="kairos" size={14} color="#a49aad" />
          </div>
          <div style={{ display: 'flex', gap: 8, paddingBottom: 5, justifyContent: 'center', flexWrap: 'wrap' }}>
            {Object.entries(KTYPES).filter(([k]) => !['intuition'].includes(k)).map(([k, v]) => (
              <button key={k} onClick={() => { setKtype(k); api(`/api/kairos/${savedId}`, { method: 'PATCH', body: JSON.stringify({ kairos_type: k }) }, session).catch(() => {}) }}
                style={chip(ktype === k)}>
                {v.glyph(ktype === k ? T.gold : '#a49aad')}{t(v.labelKey)}
              </button>
            ))}
          </div>
          <RingDivider />
          {/* §A4 — les 4 sorties exactes (nuit & jour, même composant).
              Passe 26/07 : elles existaient en QUATRE DALLES IDENTIQUES — quatre
              centres qui se disputaient l'écran, exactement ce que DESIGN-DNA §7.4
              interdit (« un centre fort par section »). Aucune sortie n'est
              supprimée : c'est la HIÉRARCHIE qui est rétablie, en trois étages —
                · Comprendre  → le centre fort (carte or, seule à avoir un fond)
                · Créer / Partager → satellites (lignes nues, liseré fin)
                · Garder pour moi → la sortie silencieuse (un lien, pas une dalle)
              Le carrefour reste un carrefour ; il cesse d'être un mur. */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <button onClick={() => onInterpret(savedId, ktype)} style={{ minHeight: 44, padding: '21px 21px', borderRadius: '21px 34px 21px 34px', background: 'rgba(255,255,255,0.1)', border: `1px solid ${T.gold}55`, cursor: 'pointer', textAlign: 'left' }}>
              <div style={{ fontFamily: T.sans, fontSize: 19, fontWeight: 600, color: T.cream }}>{t(isDay ? 'core.postDepot.talkWithDream' : 'core.postDepot.understand')}</div>
              <div style={{ marginTop: 5, fontSize: 13, color: T.dim, fontFamily: T.sans, lineHeight: 1.45 }}>{t(isDay ? 'core.postDepot.talkWithDreamSub' : 'core.postDepot.understandSub')}</div>
            </button>
            <div style={{ marginTop: 13, borderTop: `0.5px solid ${T.line}` }}>
              <button onClick={() => onCreate(savedId, null, text)} style={{ display: 'block', width: '100%', minHeight: 44, padding: '15px 13px', background: 'none', border: 'none', borderBottom: `0.5px solid ${T.line}`, cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ fontFamily: T.sans, fontSize: 17, fontWeight: 500, color: T.ink }}>{t('core.postDepot.create')}</div>
                <div style={{ marginTop: 3, fontSize: 12.5, color: T.faint, fontFamily: T.sans }}>{t('core.postDepot.createSub')}</div>
              </button>
              <button onClick={() => setShareOpen(true)} style={{ display: 'block', width: '100%', minHeight: 44, padding: '15px 13px', background: 'none', border: 'none', borderBottom: `0.5px solid ${T.line}`, cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ fontFamily: T.sans, fontSize: 17, fontWeight: 500, color: T.ink }}>{t('core.postDepot.share')}</div>
                <div style={{ marginTop: 3, fontSize: 12.5, color: T.faint, fontFamily: T.sans }}>{t('core.postDepot.shareSub')}</div>
              </button>
            </div>
            {/* la sortie silencieuse — ne rien faire de plus est un choix légitime,
                pas un bouton de rattrapage. Il pèse ce qu'il doit peser : rien. */}
            <div style={{ marginTop: 21, textAlign: 'center' }}>
              <button onClick={() => onKeep()} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px 13px', minHeight: 44, fontFamily: T.sans, fontSize: 13.5, fontWeight: 500, color: T.dim }}>{t('core.postDepot.keepForMe')}</button>
            </div>
          </div>
        </div>
      )}
      {savedId && <ShareSheet session={session} kairosId={savedId} kairosType={ktype} open={shareOpen} onClose={() => setShareOpen(false)} />}
    </div>
  )
}

/* ═════════ PROTOCOLE — SUPPRIMÉ le 2026-07-26 (demande A5, appliquée par A8) ═════════
   252 lignes de code mort retirées : `PROTO_CATALOG` (10 protocoles nommés par auteur),
   `ProtocolRunner` et `ProtocolScreen`. `ProtocolScreen` n'était instancié NULLE PART
   (vérifié par grep sur tout `src/` : zéro `<ProtocolScreen`), et il était le seul lecteur
   des deux autres. Aucune route, aucun écran, aucun bouton du parcours n'y menait.
   Le vocabulaire (« protocole », catalogue figé de pratiques nommées par auteur) est
   précisément celui que la refonte MVP a remplacé par les 4 sorties Comprendre / Créer /
   Partager / Garder. L'union `Screen` garde `'protocol'` : cette valeur n'est jamais
   atteinte, mais la retirer toucherait `QuietNav` et la persistance d'écran — hors
   périmètre, sans gain. Code récupérable dans `_snapshot_pre_fleet_2026-07-26/`. */

/* ═════════ INTERPRÉTATION (+ mythe) ═════════ */
function InterpretScreen({ session, kairosId, dreamText, kairosType, presentContext, onGuides, onClose }: { session: Session; kairosId: string; dreamText: string; kairosType?: string; presentContext?: boolean; onGuides: (id: string, text: string, type?: string) => void; onClose: () => void }) {
  const { t, locale } = useT()
  const isDay = kairosType === 'note_jour'
  const present = !!presentContext // §12bis.B — relecture « à la lumière du présent »
  const [phase, setPhase] = useState<'yours' | 'dream' | 'name'>('yours')
  const [showFullDream, setShowFullDream] = useState(false)
  const [userReading, setUserReading] = useState('')
  const [dreamReading, setDreamReading] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [names, setNames] = useState<string[]>([])
  const [feltLoc, setFeltLoc] = useState('')
  const [err, setErr] = useState('')
  const [tale, setTale] = useState<any | null>(null)
  const [taleBusy, setTaleBusy] = useState(false)
  const [feedbackSent, setFeedbackSent] = useState(false)
  const [deeperReading, setDeeperReading] = useState('')
  const [deepStreaming, setDeepStreaming] = useState(false)
  const [deepAsked, setDeepAsked] = useState(false)
  // §12ter.B — « lecture coupée » : vrai quand la génération a atteint max_tokens → bouton « Continuer »
  const [dreamTruncated, setDreamTruncated] = useState(false)
  const [deeperTruncated, setDeeperTruncated] = useState(false)
  const [revisedTruncated, setRevisedTruncated] = useState(false)
  // ── C1bis : garder / résonance / corriger (DREAM-MVP-SPEC §C1bis) ──
  const [keptId, setKeptId] = useState<string | null>(null)
  const [loopStage, setLoopStage] = useState<'buttons' | 'resonance' | 'correct'>('buttons')
  const [resonanceText, setResonanceText] = useState('')
  const [resonanceBusy, setResonanceBusy] = useState(false)
  const [correctionText, setCorrectionText] = useState('')
  const [correctionBusy, setCorrectionBusy] = useState(false)
  const [revisedText, setRevisedText] = useState('')
  const correctionsLog = useRef<{ at: string; user_correction: string; revised_body: string }[]>([])
  const [recording, setRecording] = useState<null | 'resonance' | 'correct'>(null)
  const [recBusy, setRecBusy] = useState(false)
  const mrRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const resonanceAudio = useRef<{ b64: string; mime: string } | null>(null)
  const currentBody = revisedText || dreamReading
  const continueBtnStyle: React.CSSProperties = { marginTop: 2, padding: '10px 18px', borderRadius: 999, background: 'rgba(255,255,255,0.14)', border: `1px solid ${T.gold}66`, color: T.cream, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: T.sans }

  const startRec = async (which: 'resonance' | 'correct') => {
    if (recording) return
    try {
      // B2 2026-07-26 — même magnétophone que l'Orbe et le Cœur, par construction :
      // un seul helper, donc aucune capture ne peut être moins bien traitée qu'une autre.
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true } })
      const mr = createVoiceRecorder(stream)
      const mime = mr.mimeType || 'audio/webm'
      chunksRef.current = []
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      mr.onstop = async () => {
        stream.getTracks().forEach(t => t.stop())
        const blob = new Blob(chunksRef.current, { type: mime })
        setRecording(null)
        if (blob.size < 800) return
        setRecBusy(true)
        // A1 — la voix d'abord, l'IA ensuite. Le commentaire « la voix reste gardée »
        // était faux pour `which === 'correct'` : elle n'était gardée nulle part.
        const localId = await safeguardRecording(blob, {
          kind: 'day', kairosType: 'note_jour', captureMethod: `mvp_${which}`,
          fallbackText: t('core.offline.voiceFallback'),
        })
        try {
          const tx = await transcribeSafely(localId, blob)
          if (tx && tx.trim()) {
            if (which === 'resonance') setResonanceText(p => (p ? `${p} ${tx.trim()}` : tx.trim()))
            else setCorrectionText(p => (p ? `${p} ${tx.trim()}` : tx.trim()))
            await markTranscribed(localId, tx.trim())
          } else {
            await markFailed(localId, 'transcription vide')
          }
        } catch (e: any) {
          // La voix est réellement gardée, cette fois : elle est dans la file et
          // réécoutable depuis « en attente ».
          await markFailed(localId, String(e?.message || e))
        }
        if (which === 'resonance') { try { resonanceAudio.current = { b64: await blobToB64(blob), mime } } catch {} }
        setRecBusy(false)
      }
      mr.start(250); mrRef.current = mr; setRecording(which)
    } catch { setRecording(null) }
  }
  const stopRec = () => { try { if (mrRef.current && mrRef.current.state !== 'inactive') mrRef.current.stop() } catch {} }

  const proceedToName = async () => {
    setFeedbackSent(true); setPhase('name')
    try {
      const res = await api('/api/mvp/interpret', { method: 'POST', body: JSON.stringify({ kairos_id: kairosId, mode: 'name' }) }, session)
      setNames((await res.json()).names || [])
    } catch { setNames([]) }
  }

  // garde l'interprétation courante (crée la ligne kept si besoin) → renvoie l'id
  const ensureKept = async (): Promise<string | null> => {
    if (keptId) return keptId
    const corrections = correctionsLog.current.slice()
    try {
      const res = await api('/api/mvp/interpretations', { method: 'POST', body: JSON.stringify({ kairos_id: kairosId, body: currentBody, status: 'kept', corrections }) }, session)
      const id = (await res.json())?.interpretation?.id || null
      setKeptId(id)
      return id
    } catch { return null }
  }

  const startInterpretation = async (reading: string) => {
    setPhase('dream'); setStreaming(true); setDreamReading(''); setErr(''); setDreamTruncated(false)
    try {
      const res = await api('/api/mvp/interpret', { method: 'POST', body: JSON.stringify({ kairos_id: kairosId, user_reading: reading || undefined, present_context: present || undefined }) }, session)
      const stop = await readSSE(res, tx => setDreamReading(p => p + tx), setErr)
      setDreamTruncated(stop === 'max_tokens')
    } catch (e: any) { const m = e?.message || ''; setErr(m.startsWith('Reviens') ? m : t('core.errors.reading')) }
    setStreaming(false)
  }
  // §12ter.B — reprend la première lecture là où elle s'est arrêtée (le texte déjà reçu est renvoyé en continue_text)
  const continueDream = async () => {
    setStreaming(true); setDreamTruncated(false); setErr('')
    try {
      const res = await api('/api/mvp/interpret', { method: 'POST', body: JSON.stringify({ kairos_id: kairosId, user_reading: userReading.trim() || undefined, present_context: present || undefined, continue_text: dreamReading }) }, session)
      const stop = await readSSE(res, tx => setDreamReading(p => p + tx), setErr)
      setDreamTruncated(stop === 'max_tokens')
    } catch { setErr(t('core.errors.reading')) }
    setStreaming(false)
  }
  const goDeeper = async () => {
    setDeepAsked(true); setDeepStreaming(true); setDeeperReading(''); setErr(''); setDeeperTruncated(false)
    try {
      const res = await api('/api/mvp/interpret', { method: 'POST', body: JSON.stringify({ kairos_id: kairosId, user_reading: userReading.trim() || undefined, depth: 'deeper', present_context: present || undefined }) }, session)
      const stop = await readSSE(res, tx => setDeeperReading(p => p + tx), setErr)
      setDeeperTruncated(stop === 'max_tokens')
    } catch (e: any) { const m = e?.message || ''; setErr(m.startsWith('Reviens') ? m : t('core.errors.deeper')) }
    setDeepStreaming(false)
  }
  const continueDeeper = async () => {
    setDeepStreaming(true); setDeeperTruncated(false); setErr('')
    try {
      const res = await api('/api/mvp/interpret', { method: 'POST', body: JSON.stringify({ kairos_id: kairosId, user_reading: userReading.trim() || undefined, depth: 'deeper', present_context: present || undefined, continue_text: deeperReading }) }, session)
      const stop = await readSSE(res, tx => setDeeperReading(p => p + tx), setErr)
      setDeeperTruncated(stop === 'max_tokens')
    } catch { setErr(t('core.errors.deeper')) }
    setDeepStreaming(false)
  }
  const fetchTale = async () => {
    setTaleBusy(true)
    try {
      const res = await api('/api/tales/match', { method: 'POST', body: JSON.stringify({ dreamId: kairosId, top_k: 1 }) }, session)
      const j = await res.json()
      const first = (j.tales || j.taleCards || [])[0]
      setTale(first || { none: true })
    } catch { setTale({ none: true }) }
    setTaleBusy(false)
  }
  // 1-clic « ça me parle / moyen / pas vraiment » — nourrit l'apprentissage existant (felt-shift),
  // puis ouvre la boucle C1bis selon la réponse.
  const onOneClick = (validation: 'resonates' | 'partial' | 'rejected') => {
    api('/api/mvp/feedback', { method: 'POST', body: JSON.stringify({ kairos_id: kairosId, validation, felt: validation === 'resonates', felt_location: feltLoc || undefined }) }, session).catch(() => {})
    if (validation === 'resonates') {
      // garde AUTO + apprentissage (la lecture endossée) + invitation à la résonance
      ensureKept().then(() => {}).catch(() => {})
      api('/api/mvp/learn-deep', { method: 'POST', body: JSON.stringify({ kairos_id: kairosId, text: currentBody, source: 'kept_interpretation' }) }, session).catch(() => {})
      setLoopStage('resonance')
    } else {
      setLoopStage('correct')
    }
  }
  // note de résonance (skippable) → PATCH + apprentissage fort (les mots du rêveur)
  const submitResonance = async () => {
    const note = resonanceText.trim()
    const hasAudio = !!resonanceAudio.current
    if (!note && !hasAudio) { proceedToName(); return }
    setResonanceBusy(true)
    try {
      const id = await ensureKept()
      if (id) {
        await api(`/api/mvp/interpretations/${id}`, { method: 'PATCH', body: JSON.stringify({ resonance_note: note || undefined, resonance_audio: resonanceAudio.current?.b64, resonance_audio_mime: resonanceAudio.current?.mime }) }, session)
      }
      if (note.length > 3) api('/api/mvp/learn-deep', { method: 'POST', body: JSON.stringify({ kairos_id: kairosId, text: note, source: 'resonance_note' }) }, session).catch(() => {})
    } catch { /* non bloquant */ }
    setResonanceBusy(false)
    proceedToName()
  }
  // correction (le signal le plus fort) → version révisée courte + apprentissage, puis re-boutons
  const submitCorrection = async () => {
    const corr = correctionText.trim()
    if (corr.length < 2) return
    setCorrectionBusy(true); setErr(''); setRevisedTruncated(false)
    try {
      const res = await api('/api/mvp/interpret-correct', { method: 'POST', body: JSON.stringify({ kairos_id: kairosId, base_text: currentBody, correction: corr }) }, session)
      const j = await res.json()
      const revised = j?.revised || ''
      if (revised) {
        correctionsLog.current = [...correctionsLog.current, { at: new Date().toISOString(), user_correction: corr, revised_body: revised }]
        setRevisedText(revised)
        setRevisedTruncated(!!j.truncated)
        api('/api/mvp/learn-deep', { method: 'POST', body: JSON.stringify({ kairos_id: kairosId, text: corr, source: 'correction' }) }, session).catch(() => {})
        // si déjà gardé, archive la correction sur la ligne existante
        if (keptId) api(`/api/mvp/interpretations/${keptId}`, { method: 'PATCH', body: JSON.stringify({ append_correction: { user_correction: corr, revised_body: revised } }) }, session).catch(() => {})
        setCorrectionText(''); resonanceAudio.current = null; setLoopStage('buttons')
      } else setErr(t('core.errors.revision'))
    } catch { setErr(t('core.errors.revision')) }
    setCorrectionBusy(false)
  }
  // §12ter.B — reprend la version révisée si elle a été coupée (cas rare : révision courte)
  const continueRevised = async () => {
    const last = correctionsLog.current[correctionsLog.current.length - 1]
    const corr = last?.user_correction || ''
    if (!corr || correctionBusy) return
    setCorrectionBusy(true); setRevisedTruncated(false); setErr('')
    try {
      const res = await api('/api/mvp/interpret-correct', { method: 'POST', body: JSON.stringify({ kairos_id: kairosId, base_text: currentBody, correction: corr, continue_text: revisedText }) }, session)
      const j = await res.json()
      const more = j?.revised || ''
      if (more) {
        const full = revisedText + more
        setRevisedText(full)
        setRevisedTruncated(!!j.truncated)
        if (last) last.revised_body = full
      }
    } catch { setErr(t('core.errors.revision')) }
    setCorrectionBusy(false)
  }
  // signet discret « Garder » — garde sans juger, ne force pas la suite
  const bookmarkKeep = () => { ensureKept().catch(() => {}) }

  const saveName = async (name: string | null) => {
    if (name) api('/api/mvp/name', { method: 'POST', body: JSON.stringify({ kairos_id: kairosId, title: name }) }, session).catch(() => {})
    onClose()
  }

  return (
    <div style={{ minHeight: '100dvh', paddingBottom: 40 }}>
      <BackHeader onBack={onClose} title={t(isDay ? 'core.interpret.titleDay' : 'core.interpret.titleNight')} />
      <div style={{ margin: '20px 24px 0' }}>
        <div style={{ fontFamily: T.serif, fontSize: 17, fontStyle: 'italic', lineHeight: 1.5, color: '#ddd4de', whiteSpace: 'pre-wrap', ...(showFullDream ? {} : { display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }) }}>“{dreamText}”</div>
        {dreamText.length > 120 && (
          <button onClick={() => setShowFullDream(v => !v)} style={{ marginTop: 6, background: 'none', border: 'none', padding: 0, color: T.gold, fontSize: 12.5, fontFamily: T.sans, cursor: 'pointer' }}>{t(showFullDream ? 'core.interpret.seeLess' : 'core.interpret.seeAll')}</button>
        )}
      </div>

      {/* §12bis.B — bannière « à la lumière du présent » : relecture d'un rêve avec ce qu'on vit maintenant */}
      {present && (
        <div style={{ margin: '16px 24px 0', padding: '11px 15px', borderRadius: 14, background: 'rgba(255,255,255,0.08)', border: `0.5px solid ${T.gold}33` }}>
          <div style={{ fontFamily: T.serif, fontSize: 17, fontStyle: 'italic', color: T.cream, lineHeight: 1.45 }}>{t('core.interpret.presentTitle')}</div>
          <div style={{ marginTop: 4, fontSize: 12.5, color: T.dim, fontFamily: T.sans, lineHeight: 1.4 }}>{t('core.interpret.presentSub')}</div>
        </div>
      )}

      {phase === 'yours' && (
        <div style={{ margin: '28px 18px 0', animation: 'lFadeUp .4s ease' }}>
          <div style={{ paddingLeft: 14, borderLeft: `1px solid ${T.gold}55` }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#a49aad', marginBottom: 7 }}>{t('core.interpret.yoursKicker')}</div>
            <div style={{ fontFamily: T.serif, fontSize: 18, fontStyle: 'italic', color: T.cream, lineHeight: 1.4 }}>{t(present ? 'core.interpret.yoursQPresent' : 'core.interpret.yoursQ')}</div>
          </div>
          <textarea value={userReading} onChange={e => setUserReading(e.target.value)} placeholder={t('core.interpret.yoursPlaceholder')} style={{ marginTop: 18, width: '100%', minHeight: 130, padding: 18, borderRadius: 20, background: T.card, border: T.cardBorder, color: T.cream, fontFamily: T.serif, fontSize: 17, fontStyle: 'italic', lineHeight: 1.5, resize: 'vertical' }} />
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <PillBtn primary onClick={() => startInterpretation(userReading.trim())} disabled={userReading.trim().length < 3}>{t('core.interpret.yoursSubmit')}</PillBtn>
            <GhostBtn onClick={() => startInterpretation('')}>{t(present ? 'core.interpret.yoursSkipPresent' : 'core.interpret.yoursSkip')}</GhostBtn>
          </div>
        </div>
      )}

      {(phase === 'dream') && (
        <div style={{ margin: '8px 24px 0' }}>
          {userReading.trim() && (
            <div style={{ marginTop: 18, paddingLeft: 14, borderLeft: `1px solid ${T.gold}55` }}>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#a49aad', marginBottom: 7 }}>{t('core.interpret.yoursKicker')}</div>
              <div style={{ fontFamily: T.serif, fontSize: 17, lineHeight: 1.5, color: '#ddd4de' }}>{userReading}</div>
            </div>
          )}
          <RingDivider />
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: T.gold, opacity: 0.8, marginBottom: 12 }}>{t('core.interpret.dreamKicker')}</div>
          <div style={{ fontFamily: T.serif, fontSize: 17, lineHeight: 1.55, color: T.cream, whiteSpace: 'pre-wrap', minHeight: 60 }}>
            {dreamReading}
            {streaming && <span style={{ display: 'inline-block', width: 8, height: 16, marginLeft: 2, background: `${T.gold}88`, animation: 'lBlink 1s ease-in-out infinite', verticalAlign: 'text-bottom' }} />}
          </div>
          {!streaming && dreamTruncated && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 13, color: T.faint, fontFamily: T.serif, fontStyle: 'italic', marginBottom: 8 }}>{t('core.interpret.continueHint')}</div>
              <button onClick={continueDream} style={continueBtnStyle}>{t('core.interpret.continueBtn')}</button>
            </div>
          )}
          {err && <div style={{ marginTop: 10, fontSize: 13, color: T.emberLive }}>{err}</div>}

          {revisedText && (
            <div style={{ marginTop: 18, paddingTop: 14, borderTop: '0.5px solid rgba(255,255,255,0.12)', animation: 'lFadeUp .4s ease' }}>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: T.gold, opacity: 0.8, marginBottom: 10 }}>{t('core.interpret.revisedKicker')}</div>
              <div style={{ fontFamily: T.serif, fontSize: 17, lineHeight: 1.55, color: T.cream, whiteSpace: 'pre-wrap' }}>{revisedText}</div>
              {!correctionBusy && revisedTruncated && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 13, color: T.faint, fontFamily: T.serif, fontStyle: 'italic', marginBottom: 8 }}>{t('core.interpret.continueHint')}</div>
                  <button onClick={continueRevised} style={continueBtnStyle}>{t('core.interpret.continueBtn')}</button>
                </div>
              )}
            </div>
          )}

          {!streaming && dreamReading && (
            <>
              {deepAsked && (
                <div style={{ marginTop: 18, paddingTop: 14, borderTop: '0.5px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#b89a6a', marginBottom: 10 }}>{t('core.interpret.deeperKicker')}</div>
                  <div style={{ fontFamily: T.serif, fontSize: 17, lineHeight: 1.55, color: T.cream, whiteSpace: 'pre-wrap', minHeight: 30 }}>
                    {deeperReading}
                    {deepStreaming && <span style={{ display: 'inline-block', width: 8, height: 16, marginLeft: 2, background: `${T.gold}88`, animation: 'lBlink 1s ease-in-out infinite', verticalAlign: 'text-bottom' }} />}
                  </div>
                  {!deepStreaming && deeperTruncated && (
                    <div style={{ marginTop: 12 }}>
                      <div style={{ fontSize: 13, color: T.faint, fontFamily: T.serif, fontStyle: 'italic', marginBottom: 8 }}>{t('core.interpret.continueHint')}</div>
                      <button onClick={continueDeeper} style={continueBtnStyle}>{t('core.interpret.continueBtn')}</button>
                    </div>
                  )}
                </div>
              )}
              {!deepAsked && (
                <button onClick={goDeeper} style={{ marginTop: 16, padding: '10px 16px', borderRadius: 999, background: 'transparent', border: `1px solid ${T.gold}33`, color: '#b89a6a', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: T.sans }}>{t('core.interpret.deeperBtn')}</button>
              )}
              {!tale && (
                <button onClick={fetchTale} disabled={taleBusy} style={{ marginTop: 18, padding: '11px 18px', borderRadius: 999, background: 'transparent', border: `1px solid ${T.gold}44`, color: T.gold, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: T.sans }}>
                  {taleBusy ? t('core.interpret.taleLoading') : t('core.interpret.taleBtn')}
                </button>
              )}
              {tale && !tale.none && (
                <div style={{ marginTop: 18, padding: 18, borderRadius: 20, background: 'rgba(255,255,255,0.07)', border: `0.5px solid ${T.gold}3a`, animation: 'lFadeUp .4s ease' }}>
                  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: T.gold, marginBottom: 8 }}>{tale.tradition ? t('core.interpret.taleKickerWith', { tradition: tale.tradition }) : t('core.interpret.taleKicker')}</div>
                  <div style={{ fontFamily: T.serif, fontSize: 18, fontStyle: 'italic', color: T.cream }}>{tale.title}</div>
                  <div style={{ marginTop: 8, fontFamily: T.serif, fontSize: 17, lineHeight: 1.55, color: '#ddd4de' }}>{(tale.text || tale.summary || '').slice(0, 600)}</div>
                </div>
              )}
              {tale && tale.none && <div style={{ marginTop: 14, fontSize: 13, color: T.faint, fontFamily: T.sans, fontWeight: 500 }}>{t('core.interpret.taleNone')}</div>}

              <button onClick={() => onGuides(kairosId, dreamText, kairosType)} style={{ marginTop: 18, padding: '11px 18px', borderRadius: 999, background: 'transparent', border: `1px solid ${T.gold}44`, color: T.gold, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: T.sans }}>{t('core.interpret.guidesBtn')}</button>

              {!feedbackSent && loopStage === 'buttons' && (
                <div style={{ marginTop: 26, paddingTop: 18, borderTop: '0.5px solid rgba(255,255,255,0.1)', animation: 'lFadeUp .4s ease' }}>
                  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#a49aad', marginBottom: 6 }}>{t('core.interpret.feltKicker')}</div>
                  <div style={{ fontFamily: T.serif, fontSize: 19, fontStyle: 'italic', color: T.cream, marginBottom: 14 }}>{t('core.interpret.feltQ')}</div>
                  <input value={feltLoc} onChange={e => setFeltLoc(e.target.value)} placeholder={t('core.interpret.feltPlaceholder')} style={{ width: '100%', padding: '12px 16px', borderRadius: 14, background: T.card, border: T.cardBorder, color: T.cream, fontSize: 17, fontFamily: T.sans, marginBottom: 12 }} />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => onOneClick('resonates')} style={{ flex: 1.2, padding: '12px 8px', borderRadius: 999, border: `1px solid ${T.gold}66`, background: 'rgba(255,255,255,0.14)', color: T.cream, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: T.sans }}>{t('core.interpret.fbResonates')}</button>
                    <button onClick={() => onOneClick('partial')} style={{ flex: 1, padding: '12px 8px', borderRadius: 999, border: '1px solid rgba(202,191,206,0.2)', background: 'transparent', color: T.dim, fontSize: 12.5, fontWeight: 500, cursor: 'pointer', fontFamily: T.sans }}>{t('core.interpret.fbPartial')}</button>
                    <button onClick={() => onOneClick('rejected')} style={{ flex: 1, padding: '12px 8px', borderRadius: 999, border: '1px solid rgba(202,191,206,0.2)', background: 'transparent', color: T.dim, fontSize: 12.5, fontWeight: 500, cursor: 'pointer', fontFamily: T.sans }}>{t('core.interpret.fbRejected')}</button>
                  </div>
                  <div style={{ marginTop: 10, fontSize: 11.5, color: T.faint, textAlign: 'center', lineHeight: 1.4 }}>{t('core.interpret.fbHint')}</div>
                  <div style={{ marginTop: 12, textAlign: 'center' }}>
                    <button onClick={bookmarkKeep} disabled={!!keptId} style={{ background: 'none', border: 'none', color: keptId ? T.gold : T.dim, fontSize: 12.5, fontWeight: 500, cursor: keptId ? 'default' : 'pointer', fontFamily: T.sans }}>{t(keptId ? 'core.interpret.keptOnDream' : 'core.interpret.keepThisReading')}</button>
                  </div>
                </div>
              )}

              {!feedbackSent && loopStage === 'resonance' && (
                <div style={{ marginTop: 26, paddingTop: 18, borderTop: '0.5px solid rgba(255,255,255,0.1)', animation: 'lFadeUp .4s ease' }}>
                  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: T.gold, opacity: 0.85, marginBottom: 6 }}>{t('core.interpret.resonanceKicker')}</div>
                  <div style={{ fontFamily: T.serif, fontSize: 18, fontStyle: 'italic', color: T.cream, lineHeight: 1.4, marginBottom: 14 }}>{t('core.interpret.resonanceQ')}</div>
                  <textarea value={resonanceText} onChange={e => setResonanceText(e.target.value)} placeholder={t('core.interpret.resonancePlaceholder')} style={{ width: '100%', minHeight: 90, padding: 14, borderRadius: 16, background: T.card, border: T.cardBorder, color: T.cream, fontFamily: T.serif, fontSize: 17, fontStyle: 'italic', lineHeight: 1.5, resize: 'vertical' }} />
                  <div style={{ marginTop: 10, display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button onMouseDown={() => startRec('resonance')} onMouseUp={stopRec} onMouseLeave={() => recording === 'resonance' && stopRec()} onTouchStart={() => startRec('resonance')} onTouchEnd={stopRec} style={{ padding: '10px 14px', borderRadius: 999, border: recording === 'resonance' ? `1px solid ${T.gold}` : '0.5px solid rgba(202,191,206,0.2)', background: recording === 'resonance' ? 'rgba(255,255,255,0.18)' : 'transparent', color: recording === 'resonance' ? T.cream : T.dim, fontSize: 12.5, fontWeight: 500, cursor: 'pointer', fontFamily: T.sans }}>{recording === 'resonance' ? t('core.interpret.recListening') : (recBusy ? t('core.interpret.recTranscribing') : t('core.interpret.recHold'))}</button>
                    {resonanceAudio.current && <span style={{ fontSize: 11.5, color: T.faint }}>{t('core.interpret.voiceKept')}</span>}
                  </div>
                  <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
                    <button onClick={submitResonance} disabled={resonanceBusy} style={{ flex: 1, padding: '12px 8px', borderRadius: 999, border: `1px solid ${T.gold}66`, background: 'rgba(255,255,255,0.14)', color: T.cream, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: T.sans }}>{resonanceBusy ? t('core.common.dots') : t('core.interpret.keepThis')}</button>
                    <button onClick={proceedToName} style={{ flex: 1, padding: '12px 8px', borderRadius: 999, border: '1px solid rgba(202,191,206,0.2)', background: 'transparent', color: T.dim, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: T.sans }}>{t('core.common.skip')}</button>
                  </div>
                </div>
              )}

              {!feedbackSent && loopStage === 'correct' && (
                <div style={{ marginTop: 26, paddingTop: 18, borderTop: '0.5px solid rgba(255,255,255,0.1)', animation: 'lFadeUp .4s ease' }}>
                  <div style={{ fontFamily: T.serif, fontSize: 18, fontStyle: 'italic', color: T.cream, lineHeight: 1.4, marginBottom: 6 }}>{t('core.interpret.correctQ')}</div>
                  <div style={{ fontSize: 12, color: T.faint, marginBottom: 12 }}>{t('core.interpret.correctSub')}</div>
                  <textarea value={correctionText} onChange={e => setCorrectionText(e.target.value)} placeholder={t('core.interpret.correctPlaceholder')} style={{ width: '100%', minHeight: 90, padding: 14, borderRadius: 16, background: T.card, border: T.cardBorder, color: T.cream, fontFamily: T.serif, fontSize: 17, fontStyle: 'italic', lineHeight: 1.5, resize: 'vertical' }} />
                  <div style={{ marginTop: 10, display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button onMouseDown={() => startRec('correct')} onMouseUp={stopRec} onMouseLeave={() => recording === 'correct' && stopRec()} onTouchStart={() => startRec('correct')} onTouchEnd={stopRec} style={{ padding: '10px 14px', borderRadius: 999, border: recording === 'correct' ? `1px solid ${T.gold}` : '0.5px solid rgba(202,191,206,0.2)', background: recording === 'correct' ? 'rgba(255,255,255,0.18)' : 'transparent', color: recording === 'correct' ? T.cream : T.dim, fontSize: 12.5, fontWeight: 500, cursor: 'pointer', fontFamily: T.sans }}>{recording === 'correct' ? t('core.interpret.recListening') : (recBusy ? t('core.interpret.recTranscribing') : t('core.interpret.recHold'))}</button>
                  </div>
                  <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
                    <button onClick={submitCorrection} disabled={correctionBusy || correctionText.trim().length < 2} style={{ flex: 1, padding: '12px 8px', borderRadius: 999, border: `1px solid ${T.gold}66`, background: 'rgba(255,255,255,0.14)', color: T.cream, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: T.sans, opacity: correctionText.trim().length < 2 ? 0.5 : 1 }}>{correctionBusy ? t('core.interpret.correcting') : t('core.interpret.correct')}</button>
                    <button onClick={proceedToName} style={{ flex: 1, padding: '12px 8px', borderRadius: 999, border: '1px solid rgba(202,191,206,0.2)', background: 'transparent', color: T.dim, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: T.sans }}>{t('core.common.skip')}</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {phase === 'name' && (
        <div style={{ margin: '30px 24px 0', animation: 'lFadeUp .4s ease' }}>
          <RingDivider />
          <div style={{ textAlign: 'center', fontFamily: T.serif, fontSize: 21, fontStyle: 'italic', color: T.cream }}>{t('core.interpret.nameQ')}</div>
          <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {names.map(n => (
              <button key={n} onClick={() => saveName(n)} style={{ padding: '14px 18px', borderRadius: 18, background: T.card, border: T.cardBorder, color: T.cream, fontFamily: T.serif, fontSize: 17, fontStyle: 'italic', cursor: 'pointer', textAlign: 'left' }}>{n}</button>
            ))}
            <button onClick={() => saveName(null)} style={{ marginTop: 6, padding: 12, borderRadius: 999, background: 'transparent', border: '1px solid rgba(202,191,206,0.18)', color: T.dim, fontSize: 13.5, cursor: 'pointer', fontFamily: T.sans }}>{t(isDay ? 'core.interpret.nameDefaultNote' : 'core.interpret.nameDefaultDream', { date: new Date().toLocaleDateString(locale, { day: 'numeric', month: 'long' }) })}</button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ═════════ JOURNAL — un seul espace, 2 vues : Liste (Atlas) | Univers (§1 · §6) ═════════ */
function JournalScreen({ session, view, setView, onOpen, onImport, onSettings, onGallery, onGreatDreams }: {
  session: Session
  view: 'liste' | 'univers'
  setView: (v: 'liste' | 'univers') => void
  onOpen: (id: string) => void
  onImport: () => void
  onSettings: () => void
  onGallery: () => void
  onGreatDreams: () => void
}) {
  const { t, locale } = useT()
  // le segmented « Liste | Univers » — même contrôle monté dans le header de chaque vue
  const seg = (
    <div style={{ marginTop: 16, display: 'flex', gap: 3, padding: 3, borderRadius: SCALE.radius, background: T.card, border: T.cardBorder, width: 'fit-content' }}>
      {(['liste', 'univers'] as const).map(k => (
        <button key={k} onClick={() => setView(k)} style={{ minHeight: SCALE.touch, padding: '9px 21px', borderRadius: SCALE.radiusSm, fontFamily: T.sans, fontSize: SCALE.small, fontWeight: 600, cursor: 'pointer', background: view === k ? 'rgba(255,255,255,0.09)' : 'transparent', border: '1px solid transparent', color: view === k ? T.text : T.dim, transition: `background 233ms ${MOTION.ease}, color 233ms ${MOTION.ease}` }}>
          {t(k === 'liste' ? 'core.journal.viewList' : 'core.journal.viewUniverse')}
        </button>
      ))}
    </div>
  )
  /* B3 — une proposition attend peut-être. Sans ce signe, la proposition
     hebdomadaire de grands rêves ne serait JAMAIS vue : personne ne va
     spontanément dans l'écran des grands rêves. */
  const [pendingGreat, setPendingGreat] = useState(false)
  useEffect(() => {
    let alive = true
    const h: Record<string, string> = {}
    if (session?.access_token) h['Authorization'] = `Bearer ${session.access_token}`
    fetch('/api/great-dreams/candidates', { headers: h })
      .then(r => r.json())
      .then(j => { if (alive) setPendingGreat((j.candidates || []).length > 0) })
      .catch(() => {})
    return () => { alive = false }
  }, [session])
  /* ═══════ 2026-07-26 — LA PLACE DES GRANDS RÊVES ═══════
     Tim, à l'instant : « pas de cinquième onglet mais il faut bien un endroit
     pour pouvoir consulter ses favoris… les rêves qu'on veut garder en mémoire ».

     Il y avait déjà une porte : un lien or de 13 px sous le segmented (A3/B3).
     Elle marchait, et personne ne la voyait — parce qu'un lien de 13 px sous un
     contrôle segmenté, c'est de la barre d'outils, et on ne lit pas les barres
     d'outils. Le brief §4.2 le dit d'ailleurs pour cet écran précis : « la
     première chose qu'on voit en entrant doit être un rêve, pas une barre
     d'outils. »

     Alors la porte DEVIENT un rêve. En tête du Journal, au-dessus des lunes :
     un seul grand rêve — le dernier reconnu — avec sa double date. On ne
     survole pas quarante vignettes : on en revoit un, et si on veut les autres,
     on tape.

     Trois états, et le troisième est le plus important :
       · ≥ 1 marqué → la tête montre le dernier reconnu (+ un point si une
         proposition attend).
       · 0 marqué mais une proposition → la tête apparaît pour la proposition
         seule ; sans ça, la proposition hebdomadaire ne serait jamais vue.
       · 0 et 0 → RIEN. Pas de carte vide, pas de « commence par… », pas de
         porte morte (§2.5). La fonction se découvre en marquant un rêve depuis
         sa fiche, et le Journal se met à avoir une tête. Un état vide qui
         n'affiche rien N'EST PAS un oubli : c'est la seule façon d'être beau
         quand il n'y a rien.

     Vocabulaire : le mot reste « les grands rêves » (D10, tranchée par Tim :
     « déjà ton mot dans tes dictées »). Ni « favoris », ni « honorer » — ce
     dernier est banni de l'écran depuis le 10/07 et le reste. */
  const [lastGreat, setLastGreat] = useState<{ title: string | null; excerpt: string; created_at: string; marked_great_at: string | null } | null>(null)
  useEffect(() => {
    let alive = true
    const h: Record<string, string> = {}
    if (session?.access_token) h['Authorization'] = `Bearer ${session.access_token}`
    fetch('/api/great-dreams?sort=reconnu', { headers: h })
      .then(r => r.json())
      .then(j => { if (alive) setLastGreat((j.dreams || [])[0] || null) })
      .catch(() => {})
    return () => { alive = false }
  }, [session])
  const monthYear = (d?: string | null) => (d ? new Date(d).toLocaleDateString(locale, { month: 'long', year: 'numeric' }) : '')
  const greatHead = (!lastGreat && !pendingGreat) ? null : (
    <button onClick={onGreatDreams} style={{ marginTop: 21, width: '100%', textAlign: 'left', display: 'block', padding: '15px 16px', borderRadius: SCALE.radius, background: T.card, border: T.cardBorder, cursor: 'pointer' }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* le même disque que la marque sur la fiche — un seul signe pour une seule idée */}
        <span aria-hidden style={{ width: 13, height: 13, borderRadius: '50%', flexShrink: 0, background: `radial-gradient(circle at 38% 32%, ${T.goldLit} 0%, ${T.gold} 62%, #a8874e 100%)`, boxShadow: '0 0 8px 2px rgba(224,192,135,0.28)' }} />
        <span style={{ fontFamily: T.sans, fontSize: SCALE.kicker, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: T.faint }}>{t('screens.great.entry')}</span>
        {/* B3 — une proposition attend. Un point, pas un chiffre : §2.4 interdit
            les compteurs, et « 3 » transformerait une invitation en tâche à faire. */}
        {pendingGreat && <span aria-hidden style={{ width: 6, height: 6, borderRadius: '50%', background: T.gold, opacity: 0.7, flexShrink: 0, marginLeft: 'auto' }} />}
      </span>
      {lastGreat ? (
        <>
          <span style={{ display: 'block', marginTop: 10, fontFamily: T.serif, fontSize: SCALE.body, lineHeight: 1.4, color: T.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {lastGreat.title || lastGreat.excerpt || t('screens.great.untitled')}
          </span>
          {/* la double date — le seul fait vraiment intéressant qu'un journal de
              grands rêves puisse raconter (BRIEF §4.6). Elle ne s'affiche que si
              les deux dates existent ET diffèrent : sinon elle ne raconte rien. */}
          {lastGreat.marked_great_at && monthYear(lastGreat.created_at) !== monthYear(lastGreat.marked_great_at) && (
            <span style={{ display: 'block', marginTop: 6, fontFamily: T.sans, fontSize: SCALE.meta, color: T.faint }}>
              {t('screens.great.doubleDate', { dreamed: monthYear(lastGreat.created_at), recognised: monthYear(lastGreat.marked_great_at) })}
            </span>
          )}
        </>
      ) : (
        <span style={{ display: 'block', marginTop: 8, fontFamily: T.serif, fontSize: SCALE.body, lineHeight: 1.4, color: T.dim }}>{t('screens.great.candKickerOne')}</span>
      )}
    </button>
  )
  const seg2 = <>{seg}{greatHead}</>
  return view === 'liste'
    ? <AtlasScreen session={session} onOpen={onOpen} onImport={onImport} onSettings={onSettings} onGallery={onGallery} segmented={seg2} />
    : <UniverseScreen session={session} onOpenDream={onOpen} segmented={seg2} />
}

/* ═════════ L'ATLAS — le journal qui nourrit ═════════ */
/* C1 2026-07-26 — les tracés sont sortis d'ici (`src/lib/kairos-glyphs.tsx`).
   Raison : la bulle « ce qu'on dépose ici » doit montrer EXACTEMENT ces signes-là.
   Les recopier dans le composant aurait garanti la dérive au premier ajustement de
   trait ; ici, une seule source, deux lecteurs. Les libellés n'ont pas bougé. */
const KTYPES: Record<string, { labelKey: string; glyph: (c: string) => JSX.Element }> = {
  reve: { labelKey: 'core.ktypes.reve', glyph: (c) => KGLYPH.reve(c, 14) },
  signe: { labelKey: 'core.ktypes.signe', glyph: (c) => KGLYPH.signe(c, 14) },
  reverie: { labelKey: 'core.ktypes.reverie', glyph: (c) => KGLYPH.reverie(c, 14) },
  hypnagogie: { labelKey: 'core.ktypes.hypnagogie', glyph: (c) => KGLYPH.hypnagogie(c, 14) },
  frisson: { labelKey: 'core.ktypes.frisson', glyph: (c) => KGLYPH.frisson(c, 14) },
  synchronicite: { labelKey: 'core.ktypes.synchronicite', glyph: (c) => KGLYPH.synchronicite(c, 14) },
  intuition: { labelKey: 'core.ktypes.intuition', glyph: (c) => KGLYPH.intuition(c, 14) },
  note_jour: { labelKey: 'core.ktypes.note_jour', glyph: (c) => KGLYPH.note_jour(c, 14) },
}
const emoHalo = (v: number | null | undefined) => {
  if (typeof v !== 'number' || v === 0) return 'transparent'
  return v > 0 ? `rgba(201,168,106,${Math.min(0.5, Math.abs(v) * 0.55)})` : `rgba(150,120,86,${Math.min(0.5, Math.abs(v) * 0.55)})`
}

function AtlasScreen({ session, onOpen, onImport, onSettings, onGallery, segmented }: { session: Session; onOpen: (id: string) => void; onImport: () => void; onSettings?: () => void; onGallery?: () => void; segmented?: React.ReactNode }) {
  const { t, tp, locale } = useT()
  const [items, setItems] = useState<any[] | null>(null)
  const [typeF, setTypeF] = useState<string>('tout')
  const [dayF, setDayF] = useState<'tout' | 'nuit' | 'jour'>('tout')
  const [figF, setFigF] = useState<string>('')
  const [q, setQ] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  // §0.3/§0.4 — appui long sur une carte → suppression (double confirmation)
  const [confirmDel, setConfirmDel] = useState<string | null>(null)
  const [delBusy, setDelBusy] = useState(false)
  const pressTimer = useRef<any>(null)
  const longFired = useRef(false)
  const doDelete = async (id: string) => {
    if (delBusy) return
    setDelBusy(true)
    try { await api(`/api/kairos/${id}`, { method: 'DELETE' }, session); setItems(list => (list || []).filter(x => x.id !== id)); setConfirmDel(null) }
    catch { /* on garde le dialogue ouvert pour réessayer */ }
    setDelBusy(false)
  }

  useEffect(() => {
    (async () => {
      try {
        let all: any[] = []
        let cursor: string | null = null
        for (let page = 0; page < 3; page++) {
          const res = await api(`/api/kairos?limit=100${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`, {}, session)
          const j = await res.json()
          all = all.concat(j.kairos || [])
          cursor = j.next_cursor
          if (!cursor) break
        }
        setItems(all)
        if (all.length) { try { Appointments.recordFirstKairos(all[all.length - 1]?.created_at) } catch {} }
      } catch { setItems([]) }
    })()
  }, [session])

  const figNames = (k: any): string[] => Array.isArray(k.figures) ? k.figures.map((f: any) => f?.name).filter(Boolean) : []
  const allFigs: Record<string, number> = {}
  for (const k of items || []) for (const f of figNames(k)) allFigs[f] = (allFigs[f] || 0) + 1
  const topFigs = Object.entries(allFigs).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([f]) => f)
  // §12bis.D — regroupement visuel : compte les rêves par night_group_id (sur TOUT
  // le corpus, pas seulement le filtre) → badge « nuit du … » quand ≥2 le partagent.
  const nightCounts: Record<string, number> = {}
  for (const k of items || []) { const g = k.night_group_id; if (g) nightCounts[g] = (nightCounts[g] || 0) + 1 }

  const filtered = (items || []).filter((k: any) => {
    if (dayF === 'nuit' && k.kairos_type === 'note_jour') return false
    if (dayF === 'jour' && k.kairos_type !== 'note_jour') return false
    if (typeF !== 'tout' && k.kairos_type !== typeF) return false
    if (figF && !figNames(k).includes(figF)) return false
    if (q.trim()) {
      const needle = q.trim().toLowerCase()
      const hay = `${k.title || ''} ${k.raw_text || ''} ${(k.motif_tags || []).join(' ')} ${figNames(k).join(' ')} ${k.place_label || ''}`.toLowerCase()
      if (!hay.includes(needle)) return false
    }
    return true
  })
  // Le nom du mois vient d'Intl (jamais d'un tableau traduit à la main). L'élision
  // française (« lune d'avril ») se décide sur la 1re lettre — l'anglais ignore la clé élidée.
  const monthName = (d: Date) => new Intl.DateTimeFormat(locale, { month: 'long' }).format(d)
  const groups: Array<{ key: string; label: string; items: any[] }> = []
  for (const k of filtered) {
    const d = new Date(k.created_at)
    const key = `${d.getFullYear()}-${d.getMonth()}`
    let g = groups.find(x => x.key === key)
    if (!g) {
      const month = monthName(d)
      const year = d.getFullYear() !== new Date().getFullYear() ? String(d.getFullYear()) : ''
      const elide = /^[aeiouàâéèêîïôöûü]/i.test(month)
      g = { key, label: t(elide ? 'core.journal.moonOfElided' : 'core.journal.moonOf', { month, year }).trim(), items: [] }
      groups.push(g)
    }
    g.items.push(k)
  }

  const Chip = ({ on, onClick, children }: any) => (
    <button onClick={onClick} style={{ padding: '6px 13px', borderRadius: 999, fontSize: 12, fontWeight: on ? 600 : 500, fontFamily: T.sans, cursor: 'pointer', whiteSpace: 'nowrap', background: on ? 'rgba(255,255,255,0.14)' : 'transparent', border: on ? `1px solid ${T.gold}55` : '1px solid rgba(202,191,206,0.14)', color: on ? T.cream : T.dim }}>{children}</button>
  )

  return (
    <div style={{ minHeight: '100dvh', paddingBottom: 110 }}>
      <div style={{ paddingTop: 62, paddingLeft: 26, paddingRight: 26 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div style={{ fontFamily: T.serif, fontSize: 28, fontStyle: 'italic', color: T.cream }}>{t('core.journal.title')}</div>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <button onClick={() => setSearchOpen(o => !o)} style={{ background: 'none', border: 'none', color: searchOpen ? T.gold : T.dim, fontSize: 12.5, fontWeight: 500, cursor: 'pointer', fontFamily: T.sans, padding: 0 }}>{t('core.journal.search')}</button>
            <button onClick={onImport} style={{ background: 'none', border: 'none', color: T.gold, fontSize: 12.5, fontWeight: 500, cursor: 'pointer', fontFamily: T.sans, padding: 0 }}>{t('core.journal.import')}</button>
            {onGallery && <button onClick={onGallery} aria-label={t('core.journal.myWorksAria')} style={{ background: 'none', border: 'none', color: T.dim, fontSize: 12.5, fontWeight: 500, cursor: 'pointer', fontFamily: T.sans, padding: 0 }}>{t('core.journal.myWorks')}</button>}
            {onSettings && <button onClick={onSettings} aria-label={t('core.common.settingsAriaCap')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
              <svg width={19} height={19} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3.1" stroke={T.dim} strokeWidth="1.5" /><path d="M12 3.5v2M12 18.5v2M4.4 7.5l1.7 1M17.9 15.5l1.7 1M4.4 16.5l1.7-1M17.9 8.5l1.7-1" stroke={T.dim} strokeWidth="1.4" strokeLinecap="round" /></svg>
            </button>}
          </div>
        </div>
        {segmented}
        <div style={{ marginTop: 12, fontSize: 12.5, color: '#b9b0bd' }}>{items === null ? t('core.common.dots') : tp('core.journal.innerWorlds', filtered.length)}</div>
        {searchOpen && (
          <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder={t('core.journal.searchPlaceholder')} style={{ marginTop: 12, width: '100%', padding: '11px 16px', borderRadius: 14, background: T.card, border: T.cardBorder, color: T.cream, fontSize: 17, fontFamily: T.sans, fontWeight: 500 }} />
        )}
        <div style={{ marginTop: 14, display: 'flex', gap: 7, overflowX: 'auto', paddingBottom: 4, WebkitOverflowScrolling: 'touch' }}>
          <Chip on={dayF === 'tout'} onClick={() => setDayF('tout')}>{t('core.journal.filterAll')}</Chip>
          <Chip on={dayF === 'nuit'} onClick={() => setDayF('nuit')}>{t('core.journal.filterNight')}</Chip>
          <Chip on={dayF === 'jour'} onClick={() => setDayF('jour')}>{t('core.journal.filterDay')}</Chip>
          <span style={{ width: 1, background: 'rgba(202,191,206,0.12)', margin: '2px 3px' }} />
          {Object.entries(KTYPES).filter(([k]) => k !== 'note_jour' && k !== 'intuition').map(([k, v]) => (
            <Chip key={k} on={typeF === k} onClick={() => setTypeF(typeF === k ? 'tout' : k)}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>{v.glyph(typeF === k ? T.gold : '#a49aad')}{t(v.labelKey)}</span>
            </Chip>
          ))}
        </div>
        {/* figures explorables dans l'Univers > Figures — l'Atlas reste épuré */}
      </div>

      {items && items.length > 0 && (
        <div style={{ marginTop: 18 }}>
          <FirstWeekCard count={items.length} fetchSymbol={async () => { try { const r = await api('/api/mvp/symbol-book?window=all', {}, session); const j = await r.json(); return j.symbols?.[0]?.text || null } catch { return null } }} />
        </div>
      )}

      <div style={{ margin: '20px 18px 0' }}>
        {items === null ? <div style={{ padding: '56px 0' }}><Constellation /></div> : filtered.length === 0 ? (
          <div style={{ marginTop: 60, textAlign: 'center', padding: '0 30px' }}>
            <Ring s={34} />
            <div style={{ marginTop: 18, fontFamily: T.serif, fontSize: 19, fontStyle: 'italic', color: T.dim, lineHeight: 1.45 }}>{t(q || figF || typeF !== 'tout' ? 'core.journal.emptyFiltered' : 'core.journal.emptyNone')}</div>
          </div>
        ) : (
          groups.map(g => (
            <div key={g.key} style={{ marginBottom: 26 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '0 6px 12px' }}>
                {I.moon('rgba(224,192,135,0.6)', 14)}
                <span style={{ fontFamily: T.sans, fontSize: 17, fontWeight: 500, color: '#b9b0bd' }}>{g.label}</span>
                <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(255,255,255,0.25), transparent)' }} />
                <span style={{ fontSize: 11, color: T.faint }}>{g.items.length}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                {g.items.map((k: any, ki: number) => {
                  const ktype = KTYPES[k.kairos_type] || KTYPES.reve
                  const big = (k.numinosity_score ?? 0) >= 0.7 || k.user_marked_numinous
                  const confirming = confirmDel === k.id
                  const cancelPress = () => { if (pressTimer.current) { clearTimeout(pressTimer.current); pressTimer.current = null } }
                  return (
                    <div key={k.id} style={{ position: 'relative' }}>
                    <button
                      onClick={() => { if (longFired.current) { longFired.current = false; return } onOpen(k.id) }}
                      onPointerDown={() => { longFired.current = false; cancelPress(); pressTimer.current = setTimeout(() => { longFired.current = true; setConfirmDel(k.id) }, 550) }}
                      onPointerUp={cancelPress}
                      onPointerLeave={cancelPress}
                      onPointerCancel={cancelPress}
                      onContextMenu={(e) => e.preventDefault()}
                      className="gReveal" style={{ width: '100%', animationDelay: `${Math.min(ki, 8) * 45}ms`, position: 'relative', padding: '16px 18px 14px', borderRadius: 20, background: T.card, border: big ? `1px solid ${T.gold}66` : T.cardBorder, cursor: 'pointer', textAlign: 'left', overflow: 'hidden', touchAction: 'manipulation' }}>
                      <div style={{ position: 'absolute', top: -30, right: -30, width: 110, height: 110, borderRadius: '50%', background: `radial-gradient(circle, ${emoHalo(k.affective_valence)}, transparent 70%)`, pointerEvents: 'none' }} />
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        {ktype.glyph('rgba(224,192,135,0.75)')}
                        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(224,192,135,0.7)' }}>{t(ktype.labelKey)}</span>
                        {big && <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: T.gold }}>{t('core.journal.radiant')}</span>}
                        <span style={{ flex: 1 }} />
                        {/* B4 — la date affichée est celle du RÊVE. Quand il a été raconté un autre jour,
                            une seconde ligne, discrète, le dit : « déposé le 26 juillet ». */}
                        {(() => {
                          const d = formatDreamDate(k, locale)
                          return (
                            <span style={{ fontSize: 11, color: '#a49aad', textAlign: 'right' }}>
                              {d.when}
                              {d.deposited && (
                                <span style={{ display: 'block', fontSize: 9.5, color: '#a49aad' }}>
                                  {t('core.journal.depositedOn', { date: d.deposited })}
                                </span>
                              )}
                            </span>
                          )
                        })()}
                      </div>
                      {k.night_group_id && nightCounts[k.night_group_id] >= 2 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, margin: '1px 0 7px', fontSize: 10.5, fontWeight: 500, letterSpacing: '0.03em', color: 'rgba(224,192,135,0.72)' }}>
                          {I.moon('rgba(224,192,135,0.55)', 11)} {t('core.journal.nightOf', { date: new Date(k.occurred_at ?? k.created_at).toLocaleDateString(locale, { day: 'numeric', month: 'long' }) })}
                        </div>
                      )}
                      <div style={{ fontFamily: T.serif, fontSize: 18.5, fontStyle: 'italic', color: T.cream, lineHeight: 1.2 }}>{k.title || t(k.kairos_type === 'note_jour' ? 'core.journal.fallbackNote' : 'core.journal.fallbackDream', { date: new Date(k.occurred_at ?? k.created_at).toLocaleDateString(locale, { day: 'numeric', month: 'long' }) })}</div>
                      <div style={{ marginTop: 5, fontSize: 13.5, color: '#b9b0bd', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{(k.raw_text || '').slice(0, 160)}</div>
                      {(k.place_label || k.dominant_emotion) && (
                        <div style={{ marginTop: 9, display: 'flex', flexWrap: 'wrap', gap: 7, alignItems: 'center' }}>
                          {k.dominant_emotion && <span style={{ fontSize: 13, fontFamily: T.sans, fontWeight: 500, color: 'rgba(224,192,135,0.62)' }}>{k.dominant_emotion}</span>}
                          {k.dominant_emotion && k.place_label && <span style={{ color: T.faint, opacity: 0.5 }}>·</span>}
                          {k.place_label && <span style={{ fontSize: 13, color: T.faint, fontFamily: T.sans, fontWeight: 500 }}>{k.place_label}</span>}
                        </div>
                      )}
                    </button>
                    {confirming && (
                      <div style={{ position: 'absolute', inset: 0, borderRadius: 20, background: 'rgba(25,21,33,0.94)', border: '0.5px solid rgba(189,109,74,0.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 16, zIndex: 5, animation: 'lFadeUp .2s ease' }}>
                        <div style={{ fontFamily: T.serif, fontSize: 17, fontStyle: 'italic', color: T.cream, textAlign: 'center' }}>{t('core.common.deleteSure')}</div>
                        <div style={{ display: 'flex', gap: 10 }}>
                          <button onClick={() => setConfirmDel(null)} style={{ padding: '9px 18px', borderRadius: 999, background: 'transparent', border: '1px solid rgba(202,191,206,0.2)', color: T.dim, fontSize: 13.5, cursor: 'pointer', fontFamily: T.sans }}>{t('core.common.cancelCap')}</button>
                          <button onClick={() => doDelete(k.id)} disabled={delBusy} style={{ padding: '9px 18px', borderRadius: 999, background: 'oklch(0.64 0.120 45 / 0.15)', border: '1px solid oklch(0.64 0.120 45 / 0.5)', color: T.emberLive, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: T.sans, opacity: delBusy ? 0.6 : 1 }}>{delBusy ? t('core.common.dots') : t('core.common.deleteCap')}</button>
                        </div>
                      </div>
                    )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

/* ═════════ « Guides faits » — un guide terminé, consultable après coup (§12bis C) ═════════ */
function GuidesFaits({ guide, psd, onRedo }: { guide?: Guide; psd: any; onRedo: () => void }) {
  const { t, locale } = useT()
  const [open, setOpen] = useState(false)
  const name = psd?.guide_name || guide?.name || t('core.guidesDone.defaultName')
  const when = psd?.completed_at ? new Date(psd.completed_at).toLocaleDateString(locale, { day: 'numeric', month: 'long' }) : ''
  const answers: Record<string, string> = psd?.answers || {}
  const qa = guide ? guide.steps.filter(s => (answers[s.id] || '').trim()).map(s => ({ q: s.q, a: answers[s.id].trim() })) : []
  return (
    <div style={{ marginTop: 28 }}>
      <div style={{ fontFamily: T.sans, fontSize: SCALE.kicker, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#a49aad', marginBottom: 10 }}>{t('core.guidesDone.kicker')}</div>
      <button onClick={() => setOpen(o => !o)} style={{ width: '100%', padding: '13px 16px', borderRadius: 16, background: 'rgba(255,255,255,0.06)', border: `0.5px solid ${T.gold}33`, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <span style={{ fontFamily: T.sans, fontSize: 17, fontWeight: 600, color: T.cream }}>{name}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {when && <span style={{ fontSize: 11.5, color: T.faint }}>{when}</span>}
          <span style={{ color: T.gold, fontSize: 12.5 }}>{t(open ? 'core.guidesDone.close' : 'core.guidesDone.review')}</span>
        </span>
      </button>
      {open && (
        <div style={{ marginTop: 8, padding: '15px 16px', borderRadius: 16, background: 'rgba(255,255,255,0.04)', border: T.cardBorder, animation: 'lFadeUp .3s ease' }}>
          {qa.length > 0 ? qa.map((x, i) => (
            <div key={i} style={{ marginBottom: i < qa.length - 1 ? 15 : 0 }}>
              <div style={{ fontFamily: T.sans, fontSize: 13, fontWeight: 500, color: T.faint, lineHeight: 1.4 }}>{x.q}</div>
              <div style={{ marginTop: 4, fontFamily: T.serif, fontSize: 17, fontStyle: 'italic', color: '#f1e8d7', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{x.a}</div>
            </div>
          )) : (
            <div style={{ fontSize: 13.5, color: T.dim, fontStyle: 'italic', fontFamily: T.serif }}>{t('core.guidesDone.noAnswers')}</div>
          )}
          <button onClick={onRedo} style={{ marginTop: 16, padding: '9px 18px', borderRadius: 999, background: 'transparent', border: `1px solid ${T.gold}55`, color: T.cream, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: T.sans }}>{t('core.guidesDone.redo')}</button>
        </div>
      )}
    </div>
  )
}

/* ═════════ Suppression souveraine d'un dépôt (double confirmation, §0.3) ═════════ */
function DeleteDream({ session, kairosId, onDeleted }: { session: Session; kairosId: string; onDeleted: () => void }) {
  const { t } = useT()
  const [confirm, setConfirm] = useState(false)
  const [busy, setBusy] = useState(false)
  const del = async () => {
    if (busy) return
    setBusy(true)
    try { await api(`/api/kairos/${kairosId}`, { method: 'DELETE' }, session); onDeleted() }
    catch { setBusy(false); setConfirm(false) }
  }
  return (
    <div style={{ marginTop: 36, textAlign: 'center' }}>
      {!confirm ? (
        <button onClick={() => setConfirm(true)} style={{ background: 'none', border: 'none', color: 'rgba(189,109,74,0.65)', fontSize: 13, fontFamily: T.sans, fontWeight: 500, cursor: 'pointer', padding: 8 }}>{t('core.common.deleteCap')}</button>
      ) : (
        <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 12, alignItems: 'center', padding: '16px 20px', borderRadius: 18, background: 'rgba(189,109,74,0.06)', border: '0.5px solid rgba(189,109,74,0.4)' }}>
          <div style={{ fontFamily: T.serif, fontSize: 17, fontStyle: 'italic', color: T.cream }}>{t('core.common.deleteSure')}</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setConfirm(false)} style={{ padding: '10px 20px', borderRadius: 999, background: 'transparent', border: '1px solid rgba(202,191,206,0.18)', color: T.dim, fontSize: 13.5, cursor: 'pointer', fontFamily: T.sans }}>{t('core.common.cancelCap')}</button>
            <button onClick={del} disabled={busy} style={{ padding: '10px 20px', borderRadius: 999, background: 'oklch(0.64 0.120 45 / 0.15)', border: '1px solid oklch(0.64 0.120 45 / 0.5)', color: T.emberLive, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: T.sans, opacity: busy ? 0.6 : 1 }}>{busy ? t('core.common.dots') : t('core.common.deleteCap')}</button>
          </div>
        </div>
      )}
    </div>
  )
}

/* B4 2026-07-26 — un intervalle de la couche récit/lecture, vu du client. */
type LayerSpanView = { kind: 'lecture' | 'cadre'; start: number; end: number; quote?: string; source?: string }

/**
 * Rend `raw` en UN SEUL FLUX, dans l'ordre, avec les passages teintés.
 * Le texte n'est ni réordonné ni amputé : `onTap` retire simplement un intervalle
 * (« ça, c'est le rêve »), c'est la correction la plus fréquente — ~10 % de faux
 * positifs mesurés sur 10 rêves réels (RAPPORT-B4 §4).
 */
function renderWithLayers(raw: string, spans: LayerSpanView[], onTap?: (s: LayerSpanView) => void): React.ReactNode[] {
  const sorted = [...spans].sort((a, b) => a.start - b.start)
  const out: React.ReactNode[] = []
  let cursor = 0
  sorted.forEach((s, i) => {
    if (s.start > cursor) out.push(<span key={`r${i}`}>{raw.slice(cursor, s.start)}</span>)
    if (s.end <= cursor) return
    out.push(
      <span
        key={`m${i}`}
        data-kind={s.kind}
        onClick={onTap ? () => onTap(s) : undefined}
        style={{
          display: 'inline',
          boxShadow: s.kind === 'lecture' ? `inset 2px 0 0 ${T.gold}55` : 'inset 2px 0 0 rgba(202,191,206,0.14)',
          paddingLeft: 8,
          cursor: onTap ? 'pointer' : 'default',
        }}
      >
        {raw.slice(Math.max(cursor, s.start), s.end)}
      </span>
    )
    cursor = Math.max(cursor, s.end)
  })
  out.push(<span key="tail">{raw.slice(cursor)}</span>)
  return out
}

/* ═════════ LECTURE + partage cercle ═════════ */
function ReadScreen({ session, kairosId, onBack, onInterpret, onGuides, onResumeGuide, onRedoGuide, onCreate, onOpenDream, onDeleted }: { session: Session; kairosId: string; onBack: () => void; onInterpret: (id: string, text: string, type?: string, present?: boolean) => void; onGuides: (id: string, text: string, type?: string, radiant?: boolean) => void; onResumeGuide: (guideId: string, kairosId: string, dreamText: string, resume: { step: number; answers: Record<string, string> }) => void; onRedoGuide: (guideId: string, kairosId: string, dreamText: string) => void; onCreate: (id: string, title: string | null, text: string) => void; onOpenDream: (id: string) => void; onDeleted: () => void }) {
  const { t, locale } = useT()
  const [k, setK] = useState<any | null>(null)
  // §12bis.A — « CE QUI RÉSONNE » (rêves reliés + moments de jour + écho ancien) remplace les anciennes
  // sections fils dorés/prophétique : tout est agrégé dans <ResonanceSection> (route /resonance).
  const resonanceRef = useRef<HTMLDivElement | null>(null)
  const [shareSheetOpen, setShareSheetOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [dreamAudioUrl, setDreamAudioUrl] = useState<string | null>(null) // §12ter.D — audio persistant du rêve
  const [sharedCircles, setSharedCircles] = useState<{ circle_id: string; name: string }[] | null>(null)
  const [wallShared, setWallShared] = useState(false)
  /* ═══ B4 — RÉCIT ET LECTURE DU RÊVEUR ═══
     Le texte reste ENTIER, INTACT, DANS L'ORDRE. Jamais deux blocs séparés, jamais
     un « vrai rêve » d'un côté et un « commentaire » de l'autre. On teinte, on ne
     découpe pas. Et aucune hiérarchie visuelle : pas de grisé, pas d'opacité
     réduite sur la lecture du rêveur — ce serait dire qu'elle vaut moins.
     Un liseré à gauche, c'est tout. Rien de ceci n'apparaît pendant la capture :
     l'afficher au dépôt apprendrait au rêveur à se surveiller en dictant. */
  const [layers, setLayers] = useState<{ status: string; spans: LayerSpanView[] } | null>(null)
  const [layerBusy, setLayerBusy] = useState(false)
  const saveLayers = async (spans: LayerSpanView[]) => {
    if (layerBusy) return
    setLayerBusy(true)
    const before = layers
    setLayers({ status: 'confirmed', spans }) // optimiste
    try {
      await api('/api/mvp/text-layers', { method: 'PATCH', body: JSON.stringify({ kairos_id: kairosId, spans }) }, session)
    } catch { setLayers(before) }
    setLayerBusy(false)
  }
  const dropLayers = async () => {
    if (layerBusy) return
    setLayerBusy(true)
    const before = layers
    setLayers({ status: 'none', spans: [] }) // optimiste
    try {
      await api('/api/mvp/text-layers', { method: 'DELETE', body: JSON.stringify({ kairos_id: kairosId }) }, session)
    } catch { setLayers(before) }
    setLayerBusy(false)
  }
  const loadShared = useCallback(() => {
    api(`/api/kairos/${kairosId}/circle-share`, {}, session).then(r => r.json()).then(j => setSharedCircles(j.circles || [])).catch(() => setSharedCircles([]))
    // Le Mur (backend en construction en parallèle) : défensif — 404/erreur = on ne sait pas encore, on n'affiche rien.
    api(`/api/wall/mine?kairos_id=${kairosId}`, {}, session).then(r => r.json()).then(j => setWallShared(!!j.posted)).catch(() => setWallShared(false))
  }, [kairosId, session])
  useEffect(() => {
    setK(null); setShareSheetOpen(false); setExportOpen(false); setDreamAudioUrl(null); setSharedCircles(null); setWallShared(false); setLayers(null)
    api(`/api/kairos/${kairosId}`, {}, session).then(r => r.json()).then(j => setK(j.kairos || j)).catch(() => setK({}))
    // B4 — la couche récit/lecture, si elle existe. Best-effort : pas de couche = rien à l'écran.
    api(`/api/mvp/text-layers?kairos_id=${kairosId}`, {}, session).then(r => r.json())
      .then(j => setLayers(Array.isArray(j?.spans) ? { status: j.status || 'none', spans: j.spans } : null))
      .catch(() => setLayers(null))
    // §12ter.D — l'audio d'origine du rêve, si gardé (route best-effort ; 404/vide = on n'affiche rien)
    api(`/api/kairos/${kairosId}/audio`, {}, session).then(r => r.json()).then(j => setDreamAudioUrl(j?.audio_url || null)).catch(() => setDreamAudioUrl(null))
    loadShared()
  }, [kairosId, session]) // eslint-disable-line react-hooks/exhaustive-deps
  const removeCircleShare = async (circleId: string) => {
    setSharedCircles(list => (list || []).filter(s => s.circle_id !== circleId)) // optimiste
    try { await api(`/api/kairos/${kairosId}/circle-share?circle_id=${circleId}`, { method: 'DELETE' }, session) } catch { loadShared() }
  }
  const removeWallShare = async () => {
    setWallShared(false) // optimiste
    try { await api(`/api/wall/mine?kairos_id=${kairosId}`, { method: 'DELETE' }, session) } catch { /* le Mur arrive bientôt */ }
  }
  const tags: string[] = k?.motif_tags || []
  /* ═══════ 2026-07-26 — LA FICHE REDEVIENT UN ÉCRAN DE LECTURE ═══════
     Le diagnostic de B5 était juste et il était grave : « on arrive sur le récit
     de son rêve et on voit une console ». Une vingtaine de sections empilées,
     neuf montées sous condition, deux rangées de deux boutons au milieu, un
     bloc de suppression au bout — et le texte du rêve, la seule chose qui
     compte, noyé au milieu.

     Aucune fonction n'est supprimée (elles servent toutes). Ce qui change,
     c'est qu'il y a maintenant DEUX TEMPS, et un SEUIL entre les deux.

     TEMPS 1 — ce qu'on voit en arrivant : la date, le titre, le texte, la voix.
       Rien d'autre. Pas un bouton. On est venu relire un rêve : on relit un
       rêve. (Seule exception : la vérification de transcription, parce qu'elle
       porte sur CE texte-là et qu'elle disparaît une fois faite.)

     LE SEUIL — un filet et de l'air. Au-dessus, le rêve. En dessous, ce qu'on
       peut en faire. C'est le même geste que le liseré entre les deux faces :
       on ne cache rien, on sépare deux natures.

     TEMPS 2 — les dix gestes, en TROIS RANGS :
       · rang 1, visible et seul en or : COMPRENDRE. C'est pour ça qu'on revient.
       · rang 2, une ligne de trois liens : aller plus loin · partager · créer.
         Trois liens, pas quatre boutons — un lien dit « si tu veux », un bouton
         dit « fais-le ».
       · rang 3, replié derrière « et aussi » : relire au présent, l'export, les
         cercles où c'est partagé, la suppression. Ce sont des gestes qu'on
         cherche quand on en a besoin ; ils n'ont pas à attendre à l'écran tous
         les jours. (§15.5 : un bouton qui ne sert qu'une fois par an coûte un
         emplacement 364 jours sur 365.)

     Et la marque « un grand rêve » remonte dans l'en-tête, en haut à droite :
     c'est un geste SUR le rêve, d'une seule touche, réversible — pas une
     section qui commente le rêve. */
  const [more, setMore] = useState(false)
  /* 🔴 Défaut vu AU RENDU, pas au code. Ces trois liens étaient en `flex: 1` :
     chaque lien occupait un tiers exact et centrait son texte dedans, donc les
     points de séparation tombaient à 33 % et 66 % de la largeur — pendant que
     « Aller plus loin » (14 caractères) et « Créer » (5) donnaient des blancs
     complètement différents de part et d'autre. À l'écran : le premier point
     collé au premier lien, le second flottant seul au milieu de rien.
     `flex: none` + un `gap` unique : les trois liens se dimensionnent sur leur
     texte, et tous les intervalles deviennent égaux. */
  const quietLink: React.CSSProperties = { flex: 'none', minHeight: SCALE.touch, padding: '11px 5px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: T.sans, fontSize: SCALE.small, fontWeight: 500, color: T.dim, whiteSpace: 'nowrap' }
  const presentBtnStyle: React.CSSProperties = { marginTop: 13, width: '100%', minHeight: SCALE.touch, padding: '13px 18px', borderRadius: SCALE.radius, background: 'rgba(255,255,255,0.045)', border: T.cardBorder, cursor: 'pointer', textAlign: 'left', fontFamily: T.sans, fontSize: SCALE.body, fontWeight: 500, color: T.text }
  return (
    <div style={{ minHeight: '100dvh', paddingBottom: 60 }}>
      <div style={{ paddingTop: 55, paddingLeft: 21, paddingRight: 21, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={onBack} aria-label={t('core.common.backAria')} style={{ minHeight: SCALE.touch, minWidth: SCALE.touch, display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>{I.back(T.ink)}</button>
        {/* B4 — la fiche date au RÊVE. La date de dépôt n'apparaît que si elle diffère. */}
        <div style={{ fontFamily: T.sans, fontSize: SCALE.meta, color: T.faint, textAlign: 'center' }}>
          {k?.created_at ? formatDreamDate(k, locale).when : ''}
          {k?.created_at && formatDreamDate(k, locale).deposited && (
            <span style={{ display: 'block', fontSize: SCALE.kicker, color: T.faint }}>{t('core.journal.depositedOn', { date: formatDreamDate(k, locale).deposited as string })}</span>
          )}
        </div>
        {/* la marque « un grand rêve » vit ICI : un geste sur le rêve, pas une section */}
        <div style={{ minWidth: SCALE.touch, display: 'flex', justifyContent: 'flex-end' }}>
          {k && <GreatDreamFlag compact session={session} kairosId={kairosId} marked={!!k.user_marked_numinous} markedAt={k.marked_great_at} facets={k.great_dream_facets} note={k.great_dream_note} radiant={(k.numinosity_score ?? 0) >= 0.7} onChange={(next) => setK((prev: any) => ({ ...(prev || {}), user_marked_numinous: next.marked, great_dream_facets: next.facets, great_dream_note: next.note }))} />}
        </div>
      </div>
      <div style={{ margin: `28px ${SCALE.gutter}px 0` }}>
        {/* ─────────── TEMPS 1 — LE RÊVE, ET RIEN D'AUTRE ─────────── */}
        <div style={{ fontFamily: T.display, fontSize: SCALE.titleLg, fontWeight: 300, color: T.cream, lineHeight: 1.05 }}>{k?.title || (k?.created_at ? t(k?.kairos_type === 'note_jour' ? 'core.journal.fallbackNote' : 'core.journal.fallbackDream', { date: new Date(k.occurred_at ?? k.created_at).toLocaleDateString(locale, { day: 'numeric', month: 'long' }) }) : t('core.common.dots'))}</div>
        <div style={{ marginTop: 22, fontFamily: T.serif, fontSize: SCALE.bodyLg, lineHeight: 1.618, color: T.ink, whiteSpace: 'pre-wrap' }}>
          {layers && layers.spans.length > 0
            ? renderWithLayers(k?.raw_text || '', layers.spans, layers.status === 'proposed' ? (s) => saveLayers(layers.spans.filter(x => !(x.start === s.start && x.end === s.end))) : undefined)
            : (k?.raw_text || '')}
        </div>
        {/* B4 — une SEULE ligne de légende, et seulement tant que la couche est une
            proposition. Les mots employés sont « le rêve » et « ce que tu en dis » —
            jamais « commentaire », « hors-sujet », « méta » ou « bruit ». */}
        {layers?.status === 'proposed' && layers.spans.length > 0 && (
          <div style={{ marginTop: 13 }}>
            <div style={{ fontFamily: T.serif, fontSize: SCALE.body, fontStyle: 'italic', color: T.dim, lineHeight: 1.45 }}>{t('core.read.layersLegend')}</div>
            <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button onClick={() => saveLayers(layers.spans)} disabled={layerBusy} style={{ minHeight: 34, padding: '8px 13px', borderRadius: 999, background: 'rgba(255,255,255,0.16)', border: `1px solid ${T.gold}66`, color: T.cream, fontSize: SCALE.meta, fontFamily: T.sans, cursor: 'pointer', opacity: layerBusy ? 0.6 : 1 }}>{t('core.read.layersConfirm')}</button>
              <button onClick={dropLayers} disabled={layerBusy} style={{ minHeight: 34, padding: '8px 13px', borderRadius: 999, background: 'transparent', border: '1px solid rgba(202,191,206,0.14)', color: T.dim, fontSize: SCALE.meta, fontFamily: T.sans, cursor: 'pointer', opacity: layerBusy ? 0.6 : 1 }}>{t('core.read.layersReset')}</button>
            </div>
          </div>
        )}
        {/* Les motifs appartiennent au rêve : ils restent au-dessus du seuil.
            Mais ils cessent d'être des pilules dorées de 17 px — à côté du texte
            du rêve, elles pesaient autant que lui. Liseré neutre, texte au repos. */}
        {tags.length > 0 && (
          <div style={{ marginTop: 21, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {tags.slice(0, 8).map((s: string) => (
              <span key={s} style={{ padding: '6px 13px', borderRadius: 999, border: T.cardBorder, background: T.card, fontFamily: T.sans, fontSize: SCALE.meta, fontWeight: 500, color: T.dim }}>{s}</span>
            ))}
          </div>
        )}
        {/* §12ter.D — la voix du rêve. Elle fait partie du TEMPS 1 : c'est le rêve
            tel qu'il a été dit, pas une fonction. Plus d'intertitre en capitales —
            un lecteur nu suffit à se nommer. */}
        {dreamAudioUrl && (
          <div style={{ marginTop: 21 }}>
            <audio controls src={dreamAudioUrl} style={{ width: '100%', height: 36 }} />
          </div>
        )}
        {/* §12ter.D — correction transcription AUTO : sur un dépôt VOCAL non encore vérifié,
            une ligne discrète pour relire ensemble ce que la voix a pu mal transcrire.
            L'audio d'origine (ci-dessus, si gardé) reste la référence. */}
        {k && !k.transcript_verified && (['mvp_voice', 'mvp_night_split'].includes(k.capture_method) || !!dreamAudioUrl) && (
          <TranscriptCheck
            session={session}
            kairosId={kairosId}
            rawText={k.raw_text || ''}
            onVerified={(newText) => setK((prev: any) => ({ ...(prev || {}), transcript_verified: true, ...(newText != null ? { raw_text: newText } : {}) }))}
          />
        )}

        {/* ═══════════════ LE SEUIL ═══════════════
            Au-dessus : le rêve. En dessous : ce qu'on peut en faire.
            Un filet, et 55 px d'air de chaque côté. C'est le même geste que le
            liseré entre les deux faces — on ne cache rien, on sépare deux natures. */}
        <div aria-hidden style={{ marginTop: 55, height: 1, background: T.line }} />

        {/* ─── RANG 1 — le seul geste en or ─── */}
        <div style={{ marginTop: 34, display: 'flex' }}>
          <PillBtn primary onClick={() => onInterpret(kairosId, k?.raw_text || '', k?.kairos_type)}>{t('core.read.understand')}</PillBtn>
        </div>

        {/* ─── RANG 2 — trois liens, pas quatre boutons ───
            Un lien dit « si tu veux », un bouton dit « fais-le ». Sur un rêve
            qu'on relit trois ans après, c'est « si tu veux » qui est vrai. */}
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 13, flexWrap: 'wrap' }}>
          <button onClick={() => onGuides(kairosId, k?.raw_text || '', k?.kairos_type, (k?.numinosity_score ?? 0) >= 0.7 || !!k?.user_marked_numinous)} style={quietLink}>{t('core.read.goFurther')}</button>
          <span aria-hidden style={{ color: T.mute, lineHeight: 1 }}>·</span>
          <button onClick={() => setShareSheetOpen(true)} style={quietLink}>{t('core.read.share')}</button>
          <span aria-hidden style={{ color: T.mute, lineHeight: 1 }}>·</span>
          <button onClick={() => onCreate(kairosId, k?.title || null, k?.raw_text || '')} style={quietLink}>{t('core.read.create')}</button>
        </div>

        {/* ─── CE QUE L'APP A À DIRE SUR CE RÊVE ───
            Ces sections ne sont pas des fonctions, ce sont des réponses. Elles
            gardent leur ordre de priorité : d'abord réparer le texte, puis le
            soin, puis ce qu'on a gardé, puis ce qui résonne, puis les traversées.
            Aucune n'a plus son propre intertitre en capitales — c'est
            l'empilement de kickers identiques qui faisait « console ». */}
        {/* §12ter.D — correction transcription AUTO : elle porte sur CE texte-là,
            et elle disparaît une fois faite. */}
        {k && !k.transcript_verified && (['mvp_voice', 'mvp_night_split'].includes(k.capture_method) || !!dreamAudioUrl) && (
          <TranscriptCheck
            session={session}
            kairosId={kairosId}
            rawText={k.raw_text || ''}
            onVerified={(newText) => setK((prev: any) => ({ ...(prev || {}), transcript_verified: true, ...(newText != null ? { raw_text: newText } : {}) }))}
          />
        )}
        {/* §12bis.E — la carte de soin : ce sur quoi le rêve INSISTE. Seuil haut + cap ~1/semaine tenus
            en amont (lib/kairos/warning.ts → setting_metadata.warning_signal.card_eligible) ; si détresse
            réelle, la carte s'efface au profit de ressources humaines. Jamais prédictif, toujours écartable. */}
        <CareCard kairosId={kairosId} signal={k?.setting_metadata?.warning_signal} />
        {/* A3 — l'APRÈS de la marque : la double date (« rêvé en mars 2019 ·
            reconnu en juillet 2026 ») et « pourquoi celui-là ». Le GESTE, lui,
            est dans l'en-tête (`compact`). Ces deux choses-ci sont des mots du
            rêveur : leur famille, c'est « ce que j'ai gardé », juste en dessous. */}
        {k && <GreatDreamFlag mark={false} session={session} kairosId={kairosId} marked={!!k.user_marked_numinous} markedAt={k.marked_great_at} facets={k.great_dream_facets} note={k.great_dream_note} onChange={(next) => setK((prev: any) => ({ ...(prev || {}), user_marked_numinous: next.marked, great_dream_facets: next.facets, great_dream_note: next.note }))} />}
        <KeptInterpretation session={session} kairosId={kairosId} />
        {/* §12bis.A — CE QUI RÉSONNE : rêves reliés + moments de jour + écho ancien, mêlés, chacun avec sa raison + le 1-clic « résonne / pas vraiment ». */}
        <div ref={resonanceRef}>
          {/* A2 2026-07-26 — `emptyHint` toujours vrai : depuis la réécriture du moteur de
              résonance (z-score par source), 14 rêves sur 64 n'ont plus AUCUNE résonance,
              et c'est le comportement voulu. Sans ce `true`, `ResonanceSection` renvoie
              `null` et le rêveur voit un trou muet au lieu de la phrase douce exigée par
              1_BIBLE §SILENCE_AS_FEATURE : « si aucun ne résonne sérieusement, la
              polyphonie le dit doucement ». Le silence doit être DIT, pas subi. */}
          <ResonanceSection session={session} kairosId={kairosId} kairosType={k?.kairos_type} onOpenDream={onOpenDream} emptyHint />
        </div>
        {/* §C3 — un guide en pause se reprend ici (au pas gardé, réponses restaurées) */}
        {(() => {
          const psd = k?.protocol_session_data
          if (!psd || !psd.paused || psd.completed || !psd.guide_id) return null
          return (
            <button onClick={() => onResumeGuide(psd.guide_id, kairosId, k?.raw_text || '', { step: psd.step ?? 0, answers: psd.answers || {} })} style={{ ...presentBtnStyle, marginTop: 21, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
              <span style={{ fontFamily: T.sans, fontSize: SCALE.body, fontWeight: 600, color: T.text }}>{t('core.read.resume', { name: psd.guide_name || t('core.read.resumeDefault') })}</span>
              <span style={{ color: T.gold, fontSize: SCALE.body }}>→</span>
            </button>
          )
        })()}
        {/* §12bis C — « Guides faits » : un guide terminé sur ce rêve reste consultable (compte-rendu + Refaire). */}
        {(() => {
          const psd = k?.protocol_session_data
          if (!psd || !psd.completed || !psd.guide_id) return null
          return <GuidesFaits guide={GUIDES_BY_ID[psd.guide_id]} psd={psd} onRedo={() => onRedoGuide(psd.guide_id, kairosId, k?.raw_text || '')} />
        })()}

        {/* ─── RANG 3 — ce qui mérite d'être trouvé ───
            Replié par défaut. Ce sont des gestes qu'on vient chercher : relire au
            présent, exporter, retirer d'un cercle, supprimer. Déplié, ils
            n'ajoutent rien de neuf — ils étaient juste là tous les jours pour
            rien. Le mot est « et aussi », pas « plus d'options » : on n'ouvre pas
            un panneau de réglages, on continue une phrase. */}
        <div style={{ marginTop: 34 }}>
          <button onClick={() => setMore(v => !v)} aria-expanded={more} style={{ width: '100%', minHeight: SCALE.touch, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', fontFamily: T.sans, fontSize: SCALE.small, fontWeight: 500, color: T.faint }}>
            {t('core.read.more')}
            <span aria-hidden style={{ display: 'inline-block', transition: `transform ${MOTION.fade}ms ${MOTION.ease}`, transform: more ? 'rotate(180deg)' : 'none' }}>⌄</span>
          </button>
        </div>
        {more && (
        <div style={{ animation: `dream-fade-in ${MOTION.fade}ms ${MOTION.easeOut} both` }}>
        {/* §12bis.B — « à la lumière du présent » : relire un rêve avec ce qu'on vit maintenant · sur une note, faire remonter les rêves qui en parlent. */}
        {k && (k.kairos_type === 'note_jour'
          ? <button onClick={() => resonanceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })} style={presentBtnStyle}>{t('core.read.whatDreamsSay')}</button>
          : <button onClick={() => onInterpret(kairosId, k?.raw_text || '', k?.kairos_type, true)} style={presentBtnStyle}>{t('core.read.rereadNow')}</button>
        )}
        {/* §12ter.D — export / partage EXTERNE → ExportSheet (texte · voix · rêve+lecture) */}
        <button onClick={() => setExportOpen(true)} style={{ ...presentBtnStyle, marginTop: 10 }}>{t('core.read.export')}</button>
        {((sharedCircles && sharedCircles.length > 0) || wallShared) && (
          <div style={{ marginTop: 21 }}>
            <div style={{ fontFamily: T.sans, fontSize: SCALE.kicker, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: T.faint, marginBottom: 10 }}>{t('core.read.sharedIn')}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {(sharedCircles || []).map(s => (
                <span key={s.circle_id} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 6px 6px 13px', borderRadius: 999, border: T.cardBorder, background: T.card, fontFamily: T.sans, fontSize: SCALE.meta, fontWeight: 500, color: T.dim }}>
                  {s.name}
                  <button onClick={() => removeCircleShare(s.circle_id)} aria-label={t('core.read.removeFromAria', { name: s.name })} style={{ width: 21, height: 21, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.08)', color: T.dim, fontSize: SCALE.meta, lineHeight: 1, cursor: 'pointer' }}>×</button>
                </span>
              ))}
              {wallShared && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 6px 6px 13px', borderRadius: 999, border: T.cardBorder, background: T.card, fontFamily: T.sans, fontSize: SCALE.meta, fontWeight: 500, color: T.dim }}>
                  {t('core.read.wall')}
                  <button onClick={removeWallShare} aria-label={t('core.read.removeWallAria')} style={{ width: 21, height: 21, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.08)', color: T.dim, fontSize: SCALE.meta, lineHeight: 1, cursor: 'pointer' }}>×</button>
                </span>
              )}
            </div>
          </div>
        )}
        {/* §0.3 — suppression souveraine : double confirmation ; retrait cercle/Mur automatique côté serveur */}
        <DeleteDream session={session} kairosId={kairosId} onDeleted={onDeleted} />
        </div>
        )}
      </div>
      <ShareSheet session={session} kairosId={kairosId} kairosType={k?.kairos_type} open={shareSheetOpen} onClose={() => setShareSheetOpen(false)} onShared={loadShared} />
      <ExportSheet session={session} kairos={k} audioUrl={dreamAudioUrl} open={exportOpen} onClose={() => setExportOpen(false)} />
    </div>
  )
}

/* ═════════ IMPORT HUB ═════════ */
/* §12bis.G — l'Import Hub rebranché : audio + texte, plusieurs fichiers d'un coup,
   gros audios découpés côté navigateur, file de fond visible. Le moteur vit dans
   ImportHub.tsx (scope module) → la file continue quand on navigue ailleurs. */
function ImportScreen({ session, onDone, onScan }: { session: Session; onDone: () => void; onScan: () => void }) {
  const { t } = useT()
  return (
    <div style={{ minHeight: '100dvh', paddingBottom: 60 }}>
      <BackHeader onBack={onDone} title={t('core.import.title')} />
      <div style={{ margin: '20px 18px 0' }}>
        <button onClick={onScan} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '15px 17px', borderRadius: 18, background: T.card, border: T.cardBorder, cursor: 'pointer', textAlign: 'left' }}>
          {I.camera(T.gold, 20)}
          <div>
            <div style={{ fontFamily: T.sans, fontSize: 17, fontWeight: 600, color: T.cream }}>{t('core.import.scanTitle')}</div>
            <div style={{ marginTop: 2, fontSize: 12.5, color: T.dim }}>{t('core.import.scanSub')}</div>
          </div>
        </button>
      </div>
      <RingDivider />
      <ImportHub session={session} />
    </div>
  )
}

/* ═════════ UNIVERS — 7 AXES ═════════ */
const AXES: Array<{ kind: string; labelKey: string; subKey: string }> = [
  { kind: 'motif', labelKey: 'core.axes.motifLabel', subKey: 'core.axes.motifSub' },
  { kind: 'figure', labelKey: 'core.axes.figureLabel', subKey: 'core.axes.figureSub' },
  { kind: 'emotion', labelKey: 'core.axes.emotionLabel', subKey: 'core.axes.emotionSub' },
  { kind: 'lieu', labelKey: 'core.axes.lieuLabel', subKey: 'core.axes.lieuSub' },
  { kind: 'dream_ego', labelKey: 'core.axes.dreamEgoLabel', subKey: 'core.axes.dreamEgoSub' },
  { kind: 'theme', labelKey: 'core.axes.themeLabel', subKey: 'core.axes.themeSub' },
  { kind: 'sensation', labelKey: 'core.axes.sensationLabel', subKey: 'core.axes.sensationSub' },
]

/* grandes familles d'émotions — regrouper en gardant tout le détail (Tim 2026-06-17) */
/* ⚠️ Les `kw` sont matchés contre du contenu GÉNÉRÉ (symboles, émotions, lieux
   renvoyés par l'extraction) — pas contre l'UI. Or l'extraction rend ces champs
   dans la langue du TEXTE du rêve (choix assumé : ce sont les mots du rêveur, et
   les traduire fracturerait son lexique perso en « eau » / « water »).
   Donc : un rêve écrit en anglais produit des étiquettes anglaises. Sans mots-clés
   EN ici, tout tomberait dans « autres » et l'écran Univers s'effondrerait.
   Les listes EN sont AJOUTÉES aux FR — la couverture française est intacte.
   Yeshua, 2026-07-11 (vague internationale). */
const EMO_FAMILIES: Fam[] = [
  { key: 'joie', labelKey: 'core.emotions.joie', kw: ['joie','joyeu','euphori','émerveil','emerveil','enthousias','exalt','ravisse','allégres','allegres','gratitude','plaisir','contentement','jubil','légèreté','legerete','soulagement','stupéfaction','stupefaction','joy','joyful','elation','euphor','wonder','awe','delight','enthusias','gratitude','pleasure','relief','lightness','amazement'] },
  { key: 'amour', labelKey: 'core.emotions.amour', kw: ['amour','tendre','douceur','affection','compassion','intimité','intimite','connexion','love','tender','affection','compassion','intimacy','closeness','warmth','connection'] },
  { key: 'puissance', labelKey: 'core.emotions.puissance', kw: ['puissance','force','souverain','confiance','maîtrise','maitrise','élan','vitalité','vitalite','créatric','creatric','audace','détermination','determination','espoir','espér','esper','power','strength','confidence','mastery','vitality','creative','boldness','courage','determination','hope','momentum'] },
  { key: 'colere', labelKey: 'core.emotions.colere', kw: ['colère','colere','rage','fureur','frustrat','injustice','indignation','agace','irrit','révolte','revolte','anger','angry','rage','fury','frustrat','injustice','indignation','irritat','resentment','revolt'] },
  { key: 'peur', labelKey: 'core.emotions.peur', kw: ['peur','angois','inquiét','inquiet','anxiété','anxiete','terreur','effroi','panique','appréhens','apprehens','incertitude','doute','urgence','impuissance','menace','fear','afraid','scared','anxi','dread','terror','panic','apprehens','uncertainty','helpless','threat','worry'] },
  { key: 'tristesse', labelKey: 'core.emotions.tristesse', kw: ['tristesse','deuil','mélancol','melancol','chagrin','perte','abandon','solitude','désespoir','desespoir','nostalgie','manque','sad','sorrow','grief','mourning','melanchol','heartbreak','loss','abandon','loneliness','despair','nostalgia','longing'] },
  { key: 'trouble', labelKey: 'core.emotions.trouble', kw: ['saturation','confusion','trouble','dissonance','tension','ambival','malaise','culpabilité','culpabilite','honte','perte de soi','confusion','dissonance','tension','ambivalen','unease','guilt','shame','overwhelm'] },
  { key: 'paix', labelKey: 'core.emotions.paix', kw: ['paix','calme','sérénit','serenit','présence','presence','acceptation','lâcher','lacher','guérison','guerison','plénitude','plenitude','mystique','peace','calm','seren','stillness','presence','acceptance','letting go','healing','wholeness','mystic'] },
]
type Fam = { key: string; labelKey: string; kw: string[] }
const LIEU_FAMILIES: Fam[] = [
  { key: 'maison', labelKey: 'core.families.lieuMaison', kw: ['maison','chambre','appartement','intérieur','interieur','salon','cuisine','couloir','escalier','pièce','piece','demeure','foyer','immeuble','bâtiment','batiment','atelier','bureau','house','home','bedroom','apartment','flat','living room','kitchen','hallway','corridor','stair','room','building','attic','basement','office'] },
  { key: 'nature', labelKey: 'core.families.lieuNature', kw: ['forêt','foret','bois','montagne','jardin','champ','arbre','prairie','nature','colline','vallée','vallee','désert','desert','grotte','caverne','sentier','forest','wood','mountain','garden','field','tree','meadow','nature','hill','valley','desert','cave','path','trail'] },
  { key: 'eau', labelKey: 'core.families.lieuEau', kw: ['mer','océan','ocean','rivière','riviere','lac','eau','plage','rive','fleuve','étang','etang','bassin','piscine','cascade','marée','maree','sea','ocean','river','lake','water','beach','shore','pond','pool','waterfall','tide','flood','wave'] },
  { key: 'ville', labelKey: 'core.families.lieuVille', kw: ['ville','rue','route','quartier','métro','metro','gare','place','magasin','marché','marche','école','ecole','hôpital','hopital','aéroport','aeroport','centre','salle','stade','city','town','street','road','subway','underground','station','shop','store','market','school','hospital','airport','square','stadium'] },
  { key: 'seuil', labelKey: 'core.families.lieuSeuil', kw: ['porte','seuil','pont','frontière','frontiere','tunnel','passage','ascenseur','entrée','entree','sortie','door','doorway','gate','bridge','border','tunnel','passage','elevator','lift','entrance','exit','crossing'] },
]
const EGO_FAMILIES: Fam[] = [
  { key: 'ose', labelKey: 'core.families.egoOse', kw: ['ose','avance','agis','prends le devant','sauve','protège','protege','guide','élance','elance','fonce','interviens','brille','déclare','declare','laisse guider','prends soin','maintiens','dare','act','advance','lead','rescue','save','protect','guide','leap','charge','intervene','shine','speak up','care for'] },
  { key: 'fuis', labelKey: 'core.families.egoFuis', kw: ['fuis','fuir','évite','evite','cache','échappe','echappe','recule','coincé','coince','retenu','perds','sabote','trébuch','trebuch','tombe','flee','run away','escape','avoid','hide','retreat','stuck','trapped','held back','lose','sabotage','stumble','fall'] },
  { key: 'observe', labelKey: 'core.families.egoObserve', kw: ['observe','vérifie','verifie','interroge','cherche','guette','doute','hésite','hesite','attends','prêt','pret','résiste','resiste','observe','watch','check','question','search','look for','doubt','hesitate','wait','resist'] },
  { key: 'transforme', labelKey: 'core.families.egoTransforme', kw: ['change','transforme','trouve','négocie','negocie','transgresse','retrouve','explose','dépasse','depasse','survive','survis','état intérieur','etat interieur','change','transform','find','negotiate','cross the line','recover','burst','surpass','outgrow','survive'] },
]
function famClassify(label: string, families: Fam[]): string {
  const t = (label || '').toLowerCase()
  let best = 'autres', bestIdx = Infinity
  for (const f of families) for (const k of f.kw) { const idx = t.indexOf(k); if (idx >= 0 && idx < bestIdx) { bestIdx = idx; best = f.key } }
  return best
}
function famGroups(list: any[], families: Fam[]): { key: string; labelKey: string; items: any[] }[] {
  const groups = families.map(f => ({ key: f.key, labelKey: f.labelKey, items: list.filter((s: any) => famClassify(s.text, families) === f.key) })).filter(g => g.items.length > 0)
  const autres = list.filter((s: any) => famClassify(s.text, families) === 'autres')
  if (autres.length) groups.push({ key: 'autres', labelKey: 'core.families.other', items: autres })
  return groups
}
/* DAY_FAMILIES — la taxonomie des « thèmes de vie » (axe `theme` de l'Univers :
   « les grandes dynamiques qui te traversent »). Deux bugs corrigés le 26/07 :
    · la constante était déclarée et JAMAIS branchée dans FAM_BY_KIND (ci-dessous)
      → l'axe Thèmes de vie retombait sur la liste plate, sans aucun regroupement ;
    · seule famille à n'avoir que des mots-clés FRANÇAIS — un rêveur EN ne voyait
      rien se classer. Les 7 familles portent désormais FR + EN, comme les autres. */
const DAY_FAMILIES: Fam[] = [
  { key: 'metier', labelKey: 'core.families.jourMetier', kw: ['travail','boulot','métier','metier','job','projet','carrière','carriere','vocation','business','client','collègue','collegue','patron','entreprise','festival','atelier','création','creation','œuvre','oeuvre','bureau','work','career','craft','colleague','coworker','boss','company','workshop','studio','office','deadline'] },
  { key: 'relations', labelKey: 'core.families.jourRelations', kw: ['ami','amie','amour','couple','famille','mère','mere','père','pere','frère','frere','sœur','soeur','enfant','relation','rencontre','partenaire','conflit','dispute','proche','friend','love','family','mother','father','brother','sister','child','partner','meeting','conflict','argument','close one'] },
  { key: 'corps', labelKey: 'core.families.jourCorps', kw: ['corps','santé','sante','fatigue','sommeil','dormir','douleur','sport','énergie','energie','maladie','manger','nourriture','repos','forme','tête','tete','ventre','body','health','tired','tiredness','sleep','pain','illness','sick','eat','food','rest','belly','head'] },
  { key: 'passions', labelKey: 'core.families.jourPassions', kw: ['passion','musique','art','créer','creer','danse','écrire','ecrire','jeu','voyage','nature','plaisir','beauté','beaute','envie de faire','music','create','dance','write','writing','play','game','travel','joy','pleasure','beauty'] },
  { key: 'argent', labelKey: 'core.families.jourArgent', kw: ['argent','finance','payer','prix','dette','budget','acheter','vendre','revenu','salaire','facture','matériel','materiel','money','pay','price','debt','buy','sell','income','salary','invoice','bill','rent'] },
  { key: 'sens', labelKey: 'core.families.jourSens', kw: ['sens','spirituel','méditation','meditation','prière','priere','âme','ame','dieu','sacré','sacre','rituel','intuition','conscience','présence','presence','mission','meaning','spiritual','prayer','soul','god','sacred','ritual','awareness','purpose'] },
  { key: 'transitions', labelKey: 'core.families.jourTransitions', kw: ['changement','décision','decision','choix','partir','quitter','commencer','finir','transition','tournant','seuil','hésit','hesit','sais pas quoi','change','choice','leave','quit','begin','start','end','turning point','threshold','hesitat','crossroads'] },
]
const FAM_BY_KIND: Record<string, Fam[]> = { emotion: EMO_FAMILIES, lieu: LIEU_FAMILIES, dream_ego: EGO_FAMILIES, theme: DAY_FAMILIES }

function UniverseScreen({ session, onOpenDream, segmented }: { session: Session; onOpenDream: (id: string) => void; segmented?: React.ReactNode }) {
  const { t, tp } = useT()
  const [win, setWin] = useState<'season' | 'year' | 'all'>('all')
  const [data, setData] = useState<any | null>(null)
  const [tab, setTab] = useState(0)
  const [symModal, setSymModal] = useState<any | null>(null)
  const swipe = useSwipe(() => setTab(t => Math.min(AXES.length - 1, t + 1)), () => setTab(t => Math.max(0, t - 1)))
  useEffect(() => {
    setData(null)
    api(`/api/mvp/symbol-book?window=${win}`, {}, session).then(r => r.json()).then(setData).catch(() => setData({ symbols: [], emotions: [] }))
  }, [win, session])
  const byKind: Record<string, any[]> = {}
  for (const s of data?.symbols || []) { if (!byKind[s.kind]) byKind[s.kind] = []; byKind[s.kind].push(s) }
  const empty = data && (data.symbols || []).length === 0 && (data.emotions || []).length === 0
  const ax = AXES[tab]
  const list = ax.kind === 'emotion' ? (data?.emotions || []).map((e: any) => ({ text: e.label, count: e.count, valence: e.valence_avg, kind: 'emotion' })) : (byKind[ax.kind] || [])

  return (
    <div style={{ minHeight: '100dvh', paddingBottom: 110 }} {...swipe}>
      {symModal && <SymbolPage session={session} sym={symModal} onClose={() => setSymModal(null)} onOpenDream={(id) => { setSymModal(null); onOpenDream(id) }} />}
      <div style={{ paddingTop: 62, paddingLeft: 26, paddingRight: 26 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div style={{ fontFamily: T.serif, fontSize: 28, fontStyle: 'italic', color: T.cream }}>{t('core.journal.title')}</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {([['season', 'core.universe.winSeason'], ['year', 'core.universe.winYear'], ['all', 'core.universe.winAll']] as const).map(([k, l]) => (
              <button key={k} onClick={() => setWin(k)} style={{ padding: '5px 11px', borderRadius: 999, fontSize: 11, fontWeight: win === k ? 600 : 500, fontFamily: T.sans, cursor: 'pointer', background: win === k ? 'rgba(255,255,255,0.14)' : 'transparent', border: win === k ? `1px solid ${T.gold}55` : '1px solid rgba(202,191,206,0.12)', color: win === k ? T.cream : T.faint }}>{t(l)}</button>
            ))}
          </div>
        </div>
        {segmented}
      </div>
      <div style={{ marginTop: 18, display: 'flex', gap: 4, overflowX: 'auto', padding: '0 18px 6px', WebkitOverflowScrolling: 'touch' }}>
        {AXES.map((a, i) => (
          <button key={a.kind} onClick={() => setTab(i)} style={{ padding: '9px 15px', borderRadius: 14, whiteSpace: 'nowrap', cursor: 'pointer', fontFamily: T.sans, fontWeight: 600, fontSize: 17, background: i === tab ? 'rgba(255,255,255,0.13)' : 'transparent', border: i === tab ? `1px solid ${T.gold}55` : '1px solid transparent', color: i === tab ? T.cream : '#b9b0bd', transition: 'all .25s ease' }}>
            {t(a.labelKey)}
          </button>
        ))}
      </div>
      <div style={{ margin: '4px 26px 14px', fontSize: 13, color: T.faint, fontFamily: T.sans, fontWeight: 500 }}>{t('core.universe.axisHint', { sub: t(ax.subKey) })}</div>

      {empty ? (
        <div style={{ marginTop: 60, textAlign: 'center', padding: '0 36px' }}>
          <Ring s={34} />
          <div style={{ marginTop: 18, fontFamily: T.serif, fontSize: 19, fontStyle: 'italic', color: T.dim, lineHeight: 1.45 }}>{t('core.universe.emptyL1')}<br />{t('core.universe.emptyL2')}</div>
        </div>
      ) : list.length === 0 ? (
        <div style={{ marginTop: 50, textAlign: 'center', padding: '0 36px' }}>
          <div style={{ fontFamily: T.serif, fontSize: 17, fontStyle: 'italic', color: T.dim, lineHeight: 1.5 }}>{t('core.universe.emptyAxis')}</div>
        </div>
      ) : (
        <div style={{ margin: '6px 18px 0', animation: 'lFadeUp .3s ease' }} key={tab}>
          {ax.kind === 'figure' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {list.slice(0, 16).map((s: any, i: number) => {
                const awake = (s.count || 0) >= 3
                return (
                <button key={i} onClick={() => setSymModal(s)} style={{ padding: '18px 14px', borderRadius: 20, background: awake ? 'rgba(255,255,255,0.08)' : T.card, border: awake ? `0.5px solid ${T.gold}55` : T.cardBorder, boxShadow: awake ? '0 0 22px -8px rgba(224,192,135,0.4)' : 'none', cursor: 'pointer', textAlign: 'center' }}>
                  <Ring s={30} />
                  <div style={{ marginTop: 10, fontFamily: T.serif, fontSize: 17, fontStyle: 'italic', color: T.cream, lineHeight: 1.2 }}>{s.text}</div>
                  <div style={{ marginTop: 5, fontSize: 11, color: awake ? T.gold : T.faint }}>{tp(awake ? 'core.universe.recurring' : 'core.universe.visits', s.count || 0)}</div>
                </button>
                )
              })}
            </div>
          ) : FAM_BY_KIND[ax.kind] ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {famGroups(list, FAM_BY_KIND[ax.kind]).map(g => (
                <div key={g.key}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 9 }}>
                    <span style={{ fontFamily: T.sans, fontSize: 17, fontWeight: 600, color: T.cream }}>{t(g.labelKey)}</span>
                    <span style={{ fontSize: 11, color: T.faint }}>{g.items.reduce((n: number, s: any) => n + (s.count || 1), 0)}×</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {g.items.map((s: any, i: number) => (
                      <button key={i} onClick={() => setSymModal(s)} style={{ padding: '8px 14px', borderRadius: 999, border: `0.5px solid ${T.gold}33`, background: `rgba(201,168,106,${0.04 + Math.min(0.1, (s.count || 1) * 0.013)})`, fontFamily: T.sans, fontSize: 17, fontWeight: 500, color: '#ddd4de', cursor: 'pointer' }}>
                        {s.text} <span style={{ fontFamily: T.sans, fontSize: 10.5, fontStyle: 'normal', color: '#a49aad' }}>{s.count}×</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : ['theme'].includes(ax.kind) ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
              {list.slice(0, 20).map((s: any, i: number) => (
                <button key={i} onClick={() => setSymModal(s)} style={{ padding: '10px 16px', borderRadius: 999, border: `0.5px solid ${T.gold}3a`, background: `rgba(201,168,106,${0.04 + Math.min(0.12, (s.count || 1) * 0.015)})`, fontFamily: T.serif, fontSize: 17 + Math.min(4, (s.count || 1) * 0.4), fontStyle: 'italic', color: '#f1e8d7', cursor: 'pointer' }}>
                  {s.text} <span style={{ fontFamily: T.sans, fontSize: 11, fontStyle: 'normal', color: '#b9b0bd' }}>{s.count}×</span>
                </button>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {list.slice(0, 12).map((s: any, i: number) => {
                const awake = (s.count || 0) >= 3
                return (
                <button key={i} onClick={() => setSymModal(s)} className="gReveal" style={{ animationDelay: `${Math.min(i, 9) * 55}ms`, padding: '15px 17px', borderRadius: 20, background: awake ? 'rgba(255,255,255,0.08)' : T.card, border: awake ? `0.5px solid ${T.gold}55` : T.cardBorder, boxShadow: awake ? '0 0 22px -8px rgba(224,192,135,0.4)' : 'none', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10 }}>
                    <div style={{ fontFamily: T.serif, fontSize: 19, fontStyle: 'italic', color: T.cream }}>{s.text}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#a49aad', whiteSpace: 'nowrap' }}>{s.count}×</div>
                  </div>
                  {awake && <div style={{ marginTop: 6, fontSize: 13, fontWeight: 500, fontFamily: T.sans, color: T.gold }}>{t('core.universe.awakened')}</div>}
                  {s.user_meaning && <div style={{ marginTop: 6, fontFamily: T.serif, fontSize: 17, fontStyle: 'italic', color: '#ddd4de', lineHeight: 1.35 }}>« {s.user_meaning} »</div>}
                  {typeof s.valence === 'number' && s.valence !== 0 && (
                    <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#a49aad' }}>{t('core.universe.charge')}</span>
                      <div style={{ flex: 1, height: 2, borderRadius: 2, background: 'rgba(202,191,206,0.1)', position: 'relative' }}>
                        <div style={{ position: 'absolute', left: 0, top: 0, height: 2, borderRadius: 2, width: `${Math.min(100, Math.abs(s.valence) * 100)}%`, background: `linear-gradient(90deg, transparent, ${s.valence < 0 ? '#8c7250' : T.gold})` }} />
                      </div>
                    </div>
                  )}
                </button>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ═════════ PAGE DE SYMBOLE — « pour toi, c'est quoi ? » ═════════ */
function SymbolPage({ session, sym, onClose, onOpenDream }: { session: Session; sym: any; onClose: () => void; onOpenDream: (id: string) => void }) {
  const { t, tp, locale } = useT()
  const [dreams, setDreams] = useState<any[] | null>(null)
  const [meaning, setMeaning] = useState(sym.user_meaning || '')
  const [editing, setEditing] = useState(!sym.user_meaning)
  const [saved, setSaved] = useState(false)
  useEffect(() => {
    api('/api/kairos?limit=100', {}, session).then(r => r.json()).then(j => {
      const needle = (sym.text || '').toLowerCase()
      const hits = (j.kairos || []).filter((k: any) =>
        (k.motif_tags || []).some((t: string) => (t || '').toLowerCase() === needle) ||
        (Array.isArray(k.figures) && k.figures.some((f: any) => (f?.name || '').toLowerCase() === needle)) ||
        (k.place_label || '').toLowerCase() === needle ||
        (k.dominant_emotion || '').toLowerCase() === needle ||
        (k.dream_ego_stance || '').toLowerCase() === needle ||
        (k.life_themes || []).some((t: string) => (t || '').toLowerCase() === needle)
      ).slice(0, 8)
      setDreams(hits)
    }).catch(() => setDreams([]))
  }, [sym, session])
  const save = async () => {
    const m = meaning.trim()
    if (m.length < 2) return
    setEditing(false); setSaved(true)
    api('/api/mvp/meaning', { method: 'POST', body: JSON.stringify({ symbol: sym.text, meaning: m }) }, session).catch(() => {})
    setTimeout(() => setSaved(false), 2400)
  }
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(14,8,6,0.96)', overflowY: 'auto' }} onClick={onClose}>
      <div style={{ maxWidth: 560, margin: '0 auto', padding: '60px 24px 60px' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>{I.back('#ddd4de')}</button>
          <Ring s={22} />
        </div>
        <div style={{ marginTop: 22, fontFamily: T.serif, fontSize: 32, fontStyle: 'italic', color: T.cream, lineHeight: 1.1 }}>{sym.text}</div>
        <div style={{ marginTop: 8, fontSize: 13, color: T.dim }}>
          {tp('core.symbol.appearances', sym.count || 0)}
          {sym.first_seen && <> · {t('core.symbol.since', { date: new Date(sym.first_seen).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' }) })}</>}
        </div>
        <div style={{ marginTop: 26, padding: 18, borderRadius: 20, background: 'rgba(255,255,255,0.07)', border: `0.5px solid ${T.gold}3a` }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: T.gold, marginBottom: 8 }}>{t('core.symbol.kicker')}</div>
          {editing ? (
            <>
              <div style={{ fontFamily: T.serif, fontSize: 17, fontStyle: 'italic', color: T.cream, marginBottom: 10 }}>{t('core.symbol.question', { text: sym.text })}</div>
              <textarea value={meaning} onChange={e => setMeaning(e.target.value)} placeholder={t('core.symbol.placeholder')} style={{ width: '100%', minHeight: 80, padding: 14, borderRadius: 14, background: 'rgba(0,0,0,0.25)', border: T.cardBorder, color: T.cream, fontFamily: T.serif, fontSize: 17, fontStyle: 'italic', lineHeight: 1.5, resize: 'vertical' }} />
              <div style={{ marginTop: 10, display: 'flex' }}><PillBtn primary onClick={save} disabled={meaning.trim().length < 2}>{t('core.symbol.save')}</PillBtn></div>
              <div style={{ marginTop: 8, fontSize: 11, color: T.faint, textAlign: 'center' }}>{t('core.symbol.hint')}</div>
            </>
          ) : (
            <>
              <div style={{ fontFamily: T.serif, fontSize: 17, fontStyle: 'italic', color: T.cream, lineHeight: 1.5 }}>« {meaning} »</div>
              <button onClick={() => setEditing(true)} style={{ marginTop: 10, background: 'none', border: 'none', color: T.gold, fontSize: 12.5, cursor: 'pointer', fontFamily: T.sans, padding: 0 }}>{t(saved ? 'core.symbol.saved' : 'core.symbol.edit')}</button>
            </>
          )}
        </div>
        <div style={{ marginTop: 26 }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#a49aad', marginBottom: 12 }}>{t('core.symbol.dreamsKicker')}</div>
          {dreams === null ? <div style={{ padding: '24px 0' }}><Constellation size={50} /></div>
          : dreams.length === 0 ? <div style={{ fontFamily: T.sans, fontSize: 17, fontWeight: 500, color: T.faint }}>{t('core.symbol.dreamsEmpty')}</div>
          : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {dreams.map((k: any) => (
                <button key={k.id} onClick={() => onOpenDream(k.id)} style={{ padding: '13px 15px', borderRadius: 16, background: T.card, border: T.cardBorder, cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center' }}>
                    <span style={{ fontFamily: T.sans, fontSize: 17, fontWeight: 500, color: T.cream, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{k.title || (k.raw_text || '').slice(0, 50)}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                      <span style={{ fontSize: 10.5, color: T.faint, whiteSpace: 'nowrap' }}>{new Date(k.created_at).toLocaleDateString(locale, { day: 'numeric', month: 'short' })}</span>
                      <span style={{ color: T.gold, fontSize: 13 }}>→</span>
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ═════════ LA FORGE — transmutation des rêves ═════════ */
const KINDKEY: Record<string, string> = { image: 'core.forge.kindImage', game: 'core.forge.kindGame', video: 'core.forge.kindVideo' }
function ForgeScreen({ session, onBack }: { session: Session; onBack?: () => void }) {
  const { t, tp, locale } = useT()
  const [works, setWorks] = useState<any[] | null>(null)
  const [balance, setBalance] = useState<number | null>(null)
  const [step, setStep] = useState<'gallery' | 'pick' | 'visions' | 'forging' | 'done' | 'credits'>('gallery')
  const [dreams, setDreams] = useState<any[] | null>(null)
  const [chosen, setChosen] = useState<any | null>(null)
  const [visions, setVisions] = useState<any[] | null>(null)
  const [videoOk, setVideoOk] = useState(false)
  const [result, setResult] = useState<any | null>(null)
  const [err, setErr] = useState('')
  const [copied, setCopied] = useState('')

  const load = useCallback(() => {
    api('/api/mvp/forge/works', {}, session).then(r => r.json()).then(j => { setWorks(j.works || []); setBalance(j.balance ?? 0) }).catch(() => { setWorks([]); setBalance(0) })
  }, [session])
  useEffect(() => { load() }, [load])
  useEffect(() => {
    try {
      const pre = sessionStorage.getItem('forge_kairos')
      if (pre) { sessionStorage.removeItem('forge_kairos'); const k = JSON.parse(pre); startPropose({ id: k.id, title: k.title, raw_text: k.text }) }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const pickDream = async () => {
    setStep('pick')
    if (dreams === null) {
      try { const r = await api('/api/kairos?limit=40', {}, session); setDreams(((await r.json()).kairos || []).filter((k: any) => k.kairos_type !== 'note_jour')) } catch { setDreams([]) }
    }
  }
  const startPropose = async (k: any) => {
    setChosen(k); setStep('visions'); setVisions(null); setErr('')
    try {
      const r = await api('/api/mvp/forge/propose', { method: 'POST', body: JSON.stringify({ kairos_id: k.id }) }, session)
      const j = await r.json()
      setVisions(j.visions || []); setBalance(j.balance ?? balance); setVideoOk(!!j.video_available)
    } catch { setErr(t('core.forge.errPropose')); setVisions([]) }
  }
  const generate = async (v: any) => {
    setStep('forging'); setErr('')
    try {
      const r = await api('/api/mvp/forge/generate', { method: 'POST', body: JSON.stringify({ kairos_id: chosen.id, kind: v.kind, vision_title: v.title, vision_brief: v.brief }) }, session)
      const j = await r.json()
      setResult(j.work); setBalance(j.balance ?? balance); setStep('done'); load()
    } catch (e: any) {
      setErr(String(e.message || t('core.forge.errGenerate')))
      setStep('visions')
    }
  }
  const togglePublic = async (w: any) => {
    setWorks(ws => (ws || []).map(x => x.id === w.id ? { ...x, is_public: !w.is_public } : x))
    api('/api/mvp/forge/works', { method: 'POST', body: JSON.stringify({ work_id: w.id, is_public: !w.is_public }) }, session).catch(() => {})
  }
  const copyLink = (w: any) => {
    const url = `${location.origin}/oeuvre/${w.share_slug}`
    try { navigator.clipboard.writeText(url); setCopied(w.id); setTimeout(() => setCopied(''), 2000) } catch {}
  }

  return (
    <div style={{ minHeight: '100dvh', paddingBottom: 110 }}>
      <div style={{ paddingTop: 62, paddingLeft: 20, paddingRight: 26, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          {onBack && <button onClick={onBack} aria-label={t('core.common.backAria')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, alignSelf: 'center' }}>{I.back('#ddd4de')}</button>}
          <div>
            <div style={{ fontFamily: T.serif, fontSize: 28, fontStyle: 'italic', color: T.cream }}>{t('core.forge.title')}</div>
            <div style={{ marginTop: 3, fontSize: 12.5, color: '#b9b0bd' }}>{t('core.forge.sub')}</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <button onClick={() => setStep('credits')} aria-label={t('core.forge.creditsOpen')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <div style={{ fontSize: 22, fontWeight: 600, color: T.gold, fontFamily: T.sans }}>{balance ?? t('core.common.dots')}</div>
          </button>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: T.faint }}>{t('core.forge.credits')}</span>
            <InfoDot id="credits" size={13} color="#a49aad" />
          </div>
        </div>
      </div>

      {step === 'gallery' && (
        <div style={{ margin: '22px 18px 0' }}>
          <div style={{ display: 'flex', marginBottom: 18 }}><PillBtn primary onClick={pickDream}>{t('core.forge.createFromDream')}</PillBtn></div>
          {works === null ? null : works.length === 0 ? (
            <div style={{ marginTop: 40, textAlign: 'center', padding: '0 30px' }}>
              <Ring s={34} />
              <div style={{ marginTop: 18, fontFamily: T.serif, fontSize: 18, fontStyle: 'italic', color: T.dim, lineHeight: 1.5 }}>{t('core.forge.emptyL1')}<br />{t('core.forge.emptyL2')}</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {works.map((w: any) => (
                <div key={w.id} style={{ borderRadius: 20, background: T.card, border: T.cardBorder, overflow: 'hidden' }}>
                  {w.kind === 'image' && w.asset_url && <img src={w.asset_url} alt={w.vision_title || ''} style={{ width: '100%', display: 'block' }} />}
                  <div style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10 }}>
                      <div style={{ fontFamily: T.sans, fontSize: 17.5, fontWeight: 600, color: T.cream }}>{w.vision_title || t(KINDKEY[w.kind])}</div>
                      <span style={{ fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: T.gold }}>{t(KINDKEY[w.kind])}</span>
                    </div>
                    <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {w.kind === 'game' && w.asset_url && <a href={w.asset_url} target="_blank" rel="noreferrer" style={{ padding: '9px 16px', borderRadius: 999, background: 'rgba(255,255,255,0.12)', border: `1px solid ${T.gold}55`, color: T.cream, fontSize: 12.5, fontWeight: 600, textDecoration: 'none', fontFamily: T.sans }}>{t('core.forge.play')}</a>}
                      <button onClick={() => togglePublic(w)} style={{ padding: '9px 16px', borderRadius: 999, background: 'transparent', border: '1px solid rgba(202,191,206,0.18)', color: w.is_public ? T.gold : T.dim, fontSize: 12.5, cursor: 'pointer', fontFamily: T.sans }}>{t(w.is_public ? 'core.forge.publicByLink' : 'core.forge.private')}</button>
                      {w.is_public && <button onClick={() => copyLink(w)} style={{ padding: '9px 16px', borderRadius: 999, background: 'transparent', border: `1px solid ${T.gold}44`, color: T.gold, fontSize: 12.5, cursor: 'pointer', fontFamily: T.sans }}>{t(copied === w.id ? 'core.forge.copied' : 'core.forge.copyLink')}</button>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {step === 'pick' && (
        <div style={{ margin: '22px 18px 0' }}>
          <div style={{ fontFamily: T.serif, fontSize: 19, fontStyle: 'italic', color: T.cream, marginBottom: 14, textAlign: 'center' }}>{t('core.forge.pickQ')}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {dreams === null ? <div style={{ textAlign: 'center', color: T.faint, fontSize: 13 }}>{t('core.common.dots')}</div> : dreams.slice(0, 20).map((k: any) => (
              <button key={k.id} onClick={() => startPropose(k)} style={{ padding: '13px 16px', borderRadius: 16, background: T.card, border: (k.numinosity_score ?? 0) >= 0.7 ? `1px solid ${T.gold}66` : T.cardBorder, cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ fontFamily: T.sans, fontSize: 17, fontWeight: 500, color: T.cream, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{k.title || (k.raw_text || '').slice(0, 60)}</div>
                {(k.numinosity_score ?? 0) >= 0.7 && <div style={{ marginTop: 3, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.gold }}>{t('core.forge.radiant')}</div>}
              </button>
            ))}
          </div>
          <div style={{ marginTop: 14, display: 'flex' }}><GhostBtn onClick={() => setStep('gallery')}>{t('core.common.back')}</GhostBtn></div>
        </div>
      )}

      {step === 'visions' && (
        <div style={{ margin: '22px 18px 0' }}>
          <div style={{ fontFamily: T.serif, fontSize: 17, fontStyle: 'italic', color: T.dim, textAlign: 'center', marginBottom: 6 }}>« {chosen?.title || (chosen?.raw_text || '').slice(0, 50)} »</div>
          <div style={{ fontFamily: T.serif, fontSize: 19, fontStyle: 'italic', color: T.cream, textAlign: 'center', marginBottom: 16 }}>{t('core.forge.visionsTitle')}</div>
          {visions === null ? (
            <div style={{ textAlign: 'center', marginTop: 30 }}><Ring s={30} /><div style={{ marginTop: 12, fontFamily: T.sans, fontWeight: 500, fontSize: 17, color: T.dim }}>{t('core.forge.visionsLoading')}</div></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {visions.map((v: any) => {
                const disabled = (v.kind === 'video' && !videoOk) || (balance !== null && balance < v.cost)
                return (
                  <div key={v.kind} style={{ padding: '16px 18px', borderRadius: 20, background: T.card, border: T.cardBorder, opacity: disabled ? 0.55 : 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10 }}>
                      <span style={{ fontSize: 10.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.gold }}>{t(KINDKEY[v.kind])}</span>
                      <span style={{ fontSize: 12, color: T.dim, fontFamily: T.sans }}>{tp('core.forge.cost', v.cost || 0)}</span>
                    </div>
                    <div style={{ marginTop: 6, fontFamily: T.sans, fontSize: 18, fontWeight: 600, color: T.cream }}>{v.title}</div>
                    <div style={{ marginTop: 5, fontSize: 13.5, color: '#ddd4de', lineHeight: 1.45 }}>{v.brief}</div>
                    <div style={{ marginTop: 12, display: 'flex' }}>
                      <PillBtn primary onClick={() => generate(v)} disabled={disabled}>
                        {v.kind === 'video' && !videoOk ? t('core.forge.soon') : balance !== null && balance < v.cost ? t('core.forge.noCredits') : t('core.forge.forgeIt', { n: v.cost })}
                      </PillBtn>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
          {err && <div style={{ marginTop: 12, textAlign: 'center', fontSize: 13, color: T.emberLive }}>{err}</div>}
          <div style={{ marginTop: 14, display: 'flex' }}><GhostBtn onClick={() => setStep('gallery')}>{t('core.forge.notNow')}</GhostBtn></div>
        </div>
      )}

      {step === 'forging' && (
        <div style={{ marginTop: 70, textAlign: 'center', padding: '0 36px' }}>
          <div style={{ width: 70, height: 70, margin: '0 auto', borderRadius: '50%', background: 'radial-gradient(circle at 42% 36%, #f3e6c4 0%, #e0c087 42%, #5a4a1e 90%)', animation: 'lCore 1.4s ease-in-out infinite, lBreath 2.2s ease-in-out infinite' }} />
          <div style={{ marginTop: 22, fontFamily: T.serif, fontSize: 19, fontStyle: 'italic', color: T.cream, lineHeight: 1.45 }}>{t('core.forge.forgingL1')}<br />{t('core.forge.forgingL2')}</div>
          <div style={{ marginTop: 10, fontSize: 12.5, color: T.faint }}>{t('core.forge.forgingSub')}</div>
        </div>
      )}

      {step === 'done' && result && (
        <div style={{ margin: '30px 18px 0', textAlign: 'center', animation: 'lFadeUp .5s ease' }}>
          <div style={{ fontFamily: T.serif, fontSize: 22, fontStyle: 'italic', color: T.cream }}>{t('core.forge.born')}</div>
          {result.kind === 'image' && result.asset_url && <img src={result.asset_url} alt={result.vision_title || ''} style={{ marginTop: 18, width: '100%', borderRadius: 22, border: `1px solid ${T.gold}55` }} />}
          {result.kind === 'game' && result.asset_url && (
            <a href={result.asset_url} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: 18, padding: '15px 34px', borderRadius: 999, background: 'linear-gradient(180deg, #fbeeda, #ecd4b4)', color: '#2a160e', fontSize: 17, fontWeight: 600, textDecoration: 'none', fontFamily: T.sans }}>{t('core.forge.enterWorld')}</a>
          )}
          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}><GhostBtn onClick={() => { setStep('gallery'); setResult(null) }}>{t('core.forge.backToGallery')}</GhostBtn></div>
        </div>
      )}

      {/* F5 — Crédits & abonnement (spec §7.F5 + §12ter.G). Aucun dark pattern :
          pas de compte à rebours, pas d'« offre qui expire ». Historique : pas de
          table ledger dédiée côté back → reconstruit depuis les œuvres (forge_works.cost). */}
      {step === 'credits' && (
        <div style={{ margin: '10px 18px 0' }}>
          <div style={{ textAlign: 'center', marginTop: 14 }}>
            <div style={{ fontSize: 64, fontWeight: 300, color: T.gold, fontFamily: T.sans, lineHeight: 1 }}>{balance ?? t('core.common.dots')}</div>
            <div style={{ marginTop: 6, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: T.faint }}>{t('core.forge.credits')}</div>
          </div>

          {/* comment ça marche — la fiche ⓘ porte le texte exact de la spec */}
          <div style={{ marginTop: 24, padding: '14px 16px', borderRadius: 18, background: T.card, border: T.cardBorder, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ fontSize: 13.5, color: '#ddd4de', lineHeight: 1.5 }}>{t('core.forge.creditsHow')}</div>
            <InfoDot id="credits" size={17} color={T.gold} />
          </div>

          {/* abonnement — sobre, pas de pression */}
          <div style={{ marginTop: 12, padding: 16, borderRadius: 18, background: T.card, border: T.cardBorder }}>
            <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.gold }}>{t('core.forge.subTitle')}</div>
            <div style={{ marginTop: 8, fontSize: 13.5, color: '#ddd4de', lineHeight: 1.55 }}>{t('core.forge.subSoon')}</div>
          </div>

          {/* historique simple des dépenses */}
          <div style={{ marginTop: 22 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.faint, marginBottom: 10 }}>{t('core.forge.historyTitle')}</div>
            {(() => {
              const spent = (works || []).filter((w: any) => (w.cost ?? 0) > 0)
              if (spent.length === 0) return <div style={{ fontSize: 14.5, color: T.dim, fontStyle: 'italic', fontFamily: T.serif, lineHeight: 1.5 }}>{t('core.forge.historyEmpty')}</div>
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {spent.map((w: any) => (
                    <div key={w.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, padding: '10px 14px', borderRadius: 14, background: T.card, border: T.cardBorder }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 14.5, color: T.cream, fontFamily: T.sans, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{w.vision_title || t(KINDKEY[w.kind])}</div>
                        <div style={{ marginTop: 2, fontSize: 11, color: T.faint }}>{w.created_at ? new Date(w.created_at).toLocaleDateString(locale) : ''} · {t(KINDKEY[w.kind])}</div>
                      </div>
                      <div style={{ fontSize: 13, color: T.gold, fontFamily: T.sans, whiteSpace: 'nowrap' }}>−{tp('core.forge.cost', w.cost || 0)}</div>
                    </div>
                  ))}
                </div>
              )
            })()}
          </div>

          <div style={{ marginTop: 24, display: 'flex' }}><GhostBtn onClick={() => setStep('gallery')}>{t('core.forge.backToGallery')}</GhostBtn></div>
        </div>
      )}
    </div>
  )
}

/* ═════════ CERCLES ═════════ */
function CirclesScreen({ session }: { session: Session }) {
  const { t, locale } = useT()
  const [circles, setCircles] = useState<any[] | null>(null)
  const [view, setView] = useState<'list' | 'create' | 'created' | 'join' | 'feed' | 'group'>('list')
  const [active, setActive] = useState<any | null>(null)
  const [shares, setShares] = useState<any[] | null>(null)
  const [name, setName] = useState('')
  const [intention, setIntention] = useState('')
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [created, setCreated] = useState<any | null>(null)
  const [copied, setCopied] = useState(false)

  const load = useCallback(() => {
    api('/api/circles', {}, session).then(r => r.json()).then(j => setCircles(j.circles || [])).catch(() => setCircles([]))
  }, [session])
  useEffect(() => { load() }, [load])

  const create = async () => {
    if (name.trim().length < 2) return
    setBusy(true); setErr('')
    try {
      const r = await api('/api/circles', { method: 'POST', body: JSON.stringify({ name: name.trim(), type: intention.trim() ? 'intentionnel' : 'spontane', intention_text: intention.trim() || undefined }) }, session)
      const j = await r.json().catch(() => ({}))
      setName(''); setIntention(''); setCopied(false); load()
      if (j.circle?.invite_code) { setCreated(j.circle); setView('created') } else { setView('list') }
    } catch (e: any) { setErr(t('core.circles.errCreate', { msg: e.message })) }
    setBusy(false)
  }
  const join = async () => {
    if (code.trim().length < 3) return
    setBusy(true); setErr('')
    try {
      await api('/api/circles/join', { method: 'POST', body: JSON.stringify({ inviteCode: code.trim() }) }, session)
      setCode(''); setView('list'); load()
    } catch { setErr(t('core.circles.errJoin')) }
    setBusy(false)
  }
  const openFeed = async (c: any) => {
    setActive(c); setView('feed'); setShares(null)
    try { const r = await api(`/api/circles/${c.id}/share`, {}, session); setShares((await r.json()).shares || []) } catch { setShares([]) }
  }
  void openFeed // conservé en secours ; le tap ouvre désormais l'écran de groupe complet (G4)
  const openGroup = (c: any) => { setActive(c); setView('group') }

  // G4 — l'écran social complet (chat humain + défis + réglages), câblé 2026-07-11
  if (view === 'group' && active) {
    return <GroupScreen circle={active} session={session} onBack={() => { setActive(null); setView('list'); load() }} />
  }

  return (
    <div style={{ minHeight: '100dvh', paddingBottom: 110 }}>
      {view === 'list' && (
        <>
          <div style={{ paddingTop: 62, paddingLeft: 26, paddingRight: 26 }}>
            <div style={{ fontFamily: T.serif, fontSize: 28, fontStyle: 'italic', color: T.cream }}>{t('core.circles.title')}</div>
            <div style={{ marginTop: 4, fontSize: 13, color: '#b9b0bd' }}>{t('core.circles.sub')}</div>
          </div>
          <div style={{ margin: '24px 18px 0', display: 'flex', flexDirection: 'column', gap: 11 }}>
            {circles === null ? null : circles.length === 0 ? (
              <div style={{ marginTop: 36, textAlign: 'center', padding: '0 30px' }}>
                <div style={{ position: 'relative', width: 90, height: 90, margin: '0 auto' }}>
                  <div style={{ position: 'absolute', inset: -18, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.3), transparent 70%)', filter: 'blur(10px)', animation: 'lBreath 3.2s ease-in-out infinite' }} />
                  <div style={{ position: 'absolute', left: '50%', bottom: 18, transform: 'translateX(-50%)', width: 34, height: 46, borderRadius: '50% 50% 42% 42%', background: 'radial-gradient(circle at 50% 80%, #f3e6c4 0%, #d8b85e 35%, #a8842f 70%, transparent 100%)', animation: 'lCore 1.6s ease-in-out infinite' }} />
                  <div style={{ position: 'absolute', left: '50%', bottom: 10, transform: 'translateX(-50%)', width: 54, height: 8, borderRadius: '50%', background: 'rgba(58,36,23,0.9)' }} />
                </div>
                <div style={{ marginTop: 16, fontFamily: T.serif, fontSize: 19, fontStyle: 'italic', color: T.dim, lineHeight: 1.45 }}>{t('core.circles.emptyL1')}<br />{t('core.circles.emptyL2')}</div>
              </div>
            ) : (
              circles.map((c: any) => (
                <button key={c.id} onClick={() => openGroup(c)} style={{ padding: '16px 18px', borderRadius: 20, background: T.card, border: T.cardBorder, display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', textAlign: 'left' }}>
                  {I.circle3(T.gold, 22)}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: T.sans, fontSize: 18, fontWeight: 600, color: T.cream }}>{c.name}</div>
                    {c.intention_text && <div style={{ marginTop: 3, fontSize: 12.5, color: T.dim, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.intention_text}</div>}
                  </div>
                </button>
              ))
            )}
            <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
              <PillBtn onClick={() => setView('join')}>{t('core.circles.haveCode')}</PillBtn>
              <PillBtn primary onClick={() => setView('create')}>{t('core.circles.createCap')}</PillBtn>
            </div>
          </div>
        </>
      )}
      {view === 'create' && (
        <>
          <BackHeader onBack={() => setView('list')} title={t('core.circles.createCap')} />
          <div style={{ margin: '24px 18px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input value={name} onChange={e => setName(e.target.value)} placeholder={t('core.circles.createName')} style={{ padding: '14px 18px', borderRadius: 16, background: T.card, border: T.cardBorder, color: T.cream, fontSize: 17, fontFamily: T.sans, fontWeight: 500 }} />
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['suggFamily', 'suggDuo', 'suggFriends', 'suggWork'].map(k => (
                <button key={k} onClick={() => setName(t(`core.circles.${k}`))} style={{ padding: '7px 14px', borderRadius: 999, background: 'transparent', border: '1px solid rgba(202,191,206,0.16)', color: T.dim, fontSize: 13, fontFamily: T.sans, cursor: 'pointer' }}>{t(`core.circles.${k}`)}</button>
              ))}
            </div>
            <input value={intention} onChange={e => setIntention(e.target.value)} placeholder={t('core.circles.createIntention')} style={{ padding: '14px 18px', borderRadius: 16, background: T.card, border: T.cardBorder, color: T.cream, fontSize: 17, fontFamily: T.sans, fontWeight: 500 }} />
            <PillBtn primary onClick={create} disabled={busy || name.trim().length < 2}>{busy ? t('core.circles.creating') : t('core.circles.create')}</PillBtn>
            {err && <div style={{ fontSize: 13, color: T.emberLive, textAlign: 'center' }}>{err}</div>}
          </div>
        </>
      )}
      {view === 'created' && created && (
        <>
          <BackHeader onBack={() => setView('list')} title={created.name} />
          <div style={{ margin: '30px 20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <div style={{ fontSize: 13.5, color: T.dim, textAlign: 'center', lineHeight: 1.5 }}>{t('core.circles.shareTitle')}</div>
            <div style={{ padding: '18px 28px', borderRadius: 18, background: T.card, border: T.cardBorder, fontFamily: 'ui-monospace, monospace', fontSize: 34, letterSpacing: '0.22em', color: T.gold }}>{created.invite_code}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 340 }}>
              <PillBtn primary onClick={() => { const msg = t('core.circles.shareMessage', { code: created.invite_code }); try { if (typeof navigator !== 'undefined' && (navigator as any).share) (navigator as any).share({ text: msg }).catch(() => {}); else { navigator.clipboard?.writeText(created.invite_code); setCopied(true) } } catch {} }}>{t('core.circles.shareVia')}</PillBtn>
              <PillBtn onClick={() => { try { navigator.clipboard?.writeText(created.invite_code); setCopied(true) } catch {} }}>{copied ? t('core.circles.copied') : t('core.circles.copyCode')}</PillBtn>
              <GhostBtn onClick={() => openGroup(created)}>{t('core.circles.enterGroup')}</GhostBtn>
            </div>
          </div>
        </>
      )}
      {view === 'join' && (
        <>
          <BackHeader onBack={() => setView('list')} title={t('core.circles.joinTitle')} />
          <div style={{ margin: '24px 18px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 13.5, color: T.dim, lineHeight: 1.5 }}>{t('core.circles.joinHint')}</div>
            <input value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder={t('core.circles.joinPlaceholder')} style={{ padding: '14px 18px', borderRadius: 16, background: T.card, border: T.cardBorder, color: T.gold, fontSize: 20, fontFamily: 'ui-monospace, monospace', textAlign: 'center', letterSpacing: '0.3em' }} />
            <PillBtn primary onClick={join} disabled={busy || code.trim().length < 3}>{busy ? t('core.common.dots') : t('core.circles.joinSubmit')}</PillBtn>
            {err && <div style={{ fontSize: 13, color: T.emberLive, textAlign: 'center' }}>{err}</div>}
          </div>
        </>
      )}
      {view === 'feed' && active && (
        <>
          <BackHeader onBack={() => setView('list')} title={active.name} />
          {active.invite_code && <div style={{ margin: '8px 24px 0', fontSize: 12, color: T.faint, fontFamily: 'ui-monospace, monospace' }}>{t('core.circles.inviteCode', { code: active.invite_code })}</div>}
          <div style={{ margin: '20px 18px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {shares === null ? <div style={{ textAlign: 'center', color: T.dim, fontSize: 13 }}>{t('core.common.oneMomentDots')}</div>
            : shares.length === 0 ? (
              <div style={{ marginTop: 30, textAlign: 'center', padding: '0 30px' }}>
                <Ring s={30} />
                <div style={{ marginTop: 14, fontFamily: T.serif, fontSize: 17, fontStyle: 'italic', color: T.dim, lineHeight: 1.45 }}>{t('core.circles.feedEmptyL1')}<br />{t('core.circles.feedEmptyL2')}</div>
              </div>
            ) : (
              shares.map((s: any) => (
                <div key={s.id} style={{ padding: '15px 17px', borderRadius: 20, background: T.card, border: T.cardBorder }}>
                  <div style={{ fontSize: 11, color: T.faint, marginBottom: 6 }}>{new Date(s.created_at).toLocaleDateString(locale, { day: 'numeric', month: 'long' })}</div>
                  <div style={{ fontFamily: T.serif, fontSize: 17, fontStyle: 'italic', color: '#f1e8d7', lineHeight: 1.5 }}>{(s.content || s.dream_text || s.text || '…').slice(0, 400)}</div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  )
}

/* ═════════ RÉVEIL ═════════ */
function ReveilScreen({ onBack }: { onBack: () => void }) {
  const { t, locale } = useT()
  const [time, setTime] = useState('07:00')
  const [ambiance, setAmbiance] = useState<AmbianceId>('carillon')
  const [soundOn, setSoundOn] = useState(true)
  const [armed, setArmed] = useState<string | null>(null)
  const [ringing, setRinging] = useState(false)
  const timer = useRef<any>(null)
  const previewRef = useRef<AlarmHandle | null>(null)
  const alarmRef = useRef<AlarmHandle | null>(null)
  const vibStopRef = useRef<(() => void) | null>(null)

  // test d'écoute 1 tap : coupe l'aperçu précédent, joue le nouveau
  const test = (id: AmbianceId) => {
    setAmbiance(id)
    previewRef.current?.stop()
    previewRef.current = previewAmbiance(id)
  }
  const stopAll = () => {
    previewRef.current?.stop(); previewRef.current = null
    alarmRef.current?.stop(); alarmRef.current = null
    vibStopRef.current?.(); vibStopRef.current = null
  }
  // déclenchement web (app active) : ambiance générée + vibration progressive
  const fire = () => {
    setRinging(true)
    if (soundOn) {
      alarmRef.current = startAlarm(ambiance)
      vibStopRef.current = startVibration()
    }
    try { if (Notification.permission === 'granted') new Notification('Dream', { body: t('core.reveil.notifBody') }) } catch {}
    setArmed(null)
  }
  const arm = async () => {
    const [h, m] = (time || '').split(':').map(Number)
    if (!Number.isFinite(h) || !Number.isFinite(m)) return
    const target = new Date(); target.setHours(h, m, 0, 0)
    if (target.getTime() <= Date.now()) target.setDate(target.getDate() + 1)
    // App native (wrapper Capacitor) : vraie alarme système, même app fermée.
    // NB fiabilité : les ambiances Carillon/Pluie/Aube sont du Web Audio → elles
    // ne sonnent QUE si l'app est active. En natif on planifie la notification
    // système sur un canal « alarme » dédié (son PAR DÉFAUT du système en
    // fallback fiable). Le son custom natif exige des .wav CC0 bundlés au build
    // → voir docs/ALARM-NATIVE-SOUNDS.md.
    const LN = (window as any).Capacitor?.Plugins?.LocalNotifications
    if (LN) {
      try {
        await LN.requestPermissions()
        // canal Android dédié (importance haute, vibration) — idempotent
        try { await LN.createChannel?.({ id: 'dream-alarm', name: 'Réveil Dream', importance: 5, vibration: true }) } catch {}
        await LN.schedule({ notifications: [{ id: 7, channelId: 'dream-alarm', title: 'Dream', body: t('core.reveil.notifBody'), schedule: { at: target } }] })
        setArmed(t('core.reveil.armedNative', { time: target.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }) }))
        return
      } catch {}
    }
    try { if ('Notification' in window && Notification.permission === 'default') await Notification.requestPermission() } catch {}
    clearTimeout(timer.current)
    timer.current = setTimeout(fire, target.getTime() - Date.now())
    setArmed(target.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }))
  }
  const stopRinging = () => { stopAll(); setRinging(false); onBack() }
  useEffect(() => () => { clearTimeout(timer.current); stopAll() }, [])

  // écran « ça sonne » — sobre : foyer, un mot, un geste (arrêter)
  if (ringing) {
    return (
      <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, padding: 30 }}>
        <div style={{ width: 84, height: 84, borderRadius: '50%', background: 'radial-gradient(circle at 42% 36%, #f3e6c4 0%, #e0c087 45%, #5a4a1e 92%)', animation: 'lBreath 2.4s ease-in-out infinite' }} />
        <div style={{ fontFamily: T.serif, fontSize: 30, fontStyle: 'italic', color: T.cream }}>{t('core.reveil.ringingHeadline')}</div>
        <div style={{ fontSize: 13.5, color: T.dim }}>{t('core.reveil.ringingSub')}</div>
        <div style={{ marginTop: 10, width: '100%', maxWidth: 280, display: 'flex' }}>
          <PillBtn primary onClick={stopRinging}>{t('core.reveil.stopBtn')}</PillBtn>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100dvh', paddingBottom: 60 }}>
      <BackHeader onBack={onBack} title={t('core.reveil.title')} />
      <div style={{ margin: '30px 24px 0', textAlign: 'center' }}>
        <div style={{ fontFamily: T.serif, fontSize: 22, fontStyle: 'italic', color: T.cream, lineHeight: 1.35 }}>{t('core.reveil.headlineL1')}<br />{t('core.reveil.headlineL2')}</div>
        <div style={{ marginTop: 24 }}>
          <input type="time" value={time} onChange={e => setTime(e.target.value)} style={{ padding: '14px 22px', borderRadius: 16, background: T.card, border: T.cardBorder, color: T.gold, fontSize: 30, fontFamily: 'ui-monospace, monospace', textAlign: 'center' }} />
        </div>

        {/* 3 ambiances de réveil — tap = choisir · « écouter » = test 1 tap */}
        <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {AMBIANCES.map(a => {
            const sel = ambiance === a.id
            return (
              <div key={a.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '12px 14px', borderRadius: 14, background: T.card, border: sel ? `1px solid ${T.gold}66` : T.cardBorder }}>
                <button onClick={() => setAmbiance(a.id)} style={{ flex: 1, textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', color: sel ? T.cream : T.dim, fontFamily: T.sans, fontSize: 15.5, fontWeight: sel ? 600 : 500 }}>{t(a.nameKey)}</button>
                <button onClick={() => test(a.id)} style={{ padding: '7px 14px', borderRadius: 999, background: 'transparent', border: `1px solid ${T.gold}44`, color: T.gold, fontSize: 12.5, cursor: 'pointer', fontFamily: T.sans }}>{t('core.reveil.test')}</button>
              </div>
            )
          })}
        </div>

        {/* réveil sonore on/off */}
        <button onClick={() => setSoundOn(v => !v)} style={{ marginTop: 12, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: 14, background: T.card, border: T.cardBorder, cursor: 'pointer' }}>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 15, color: T.cream, fontFamily: T.sans }}>{t('core.reveil.soundOn')}</div>
            <div style={{ marginTop: 2, fontSize: 11.5, color: T.faint }}>{soundOn ? t('core.reveil.soundOnHint') : t('core.reveil.silent')}</div>
          </div>
          <div style={{ width: 44, height: 26, borderRadius: 999, background: soundOn ? T.gold : 'rgba(202,191,206,0.14)', position: 'relative', transition: 'all .2s ease', flexShrink: 0 }}>
            <div style={{ position: 'absolute', top: 3, left: soundOn ? 21 : 3, width: 20, height: 20, borderRadius: '50%', background: '#2a160e', transition: 'all .2s ease' }} />
          </div>
        </button>

        <div style={{ marginTop: 16, display: 'flex', padding: '0 10px' }}>
          <PillBtn primary onClick={arm}>{armed ? t('core.reveil.armedBtn', { time: armed }) : t('core.reveil.arm')}</PillBtn>
        </div>
        {armed && <div style={{ marginTop: 16, fontSize: 13, color: T.dim, lineHeight: 1.5 }}>{t('core.reveil.armedNote')}</div>}
        <div style={{ marginTop: 26, padding: 16, borderRadius: 16, background: T.card, border: T.cardBorder, fontSize: 12.5, color: T.faint, lineHeight: 1.55, textAlign: 'left' }}>
          {t('core.reveil.webNote')}
        </div>
      </div>
    </div>
  )
}
