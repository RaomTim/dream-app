'use client'

/**
 * DepositScope — « ce qu'on dépose ici », les trois étages, sur les deux faces.
 *
 * C1 · 2026-07-26 · Yeshua (Opus). Sens & structure : `src/lib/depositScope.ts`.
 *
 *   <ScopeTrail face="dream" />   la traîne du mot, devenue tapable  →  bulle  →  page
 *   <ScopeTrail face="heart" day />                idem, en lumière de jour
 *
 * ── CE QUI EST RÉUTILISÉ, ET POURQUOI ────────────────────────────────────────
 * Tim : « la solution comme d'hab est cette petite bulle ». « Comme d'hab » = le système
 * ⓘ de `InfoSystem.tsx` (bulle d'une phrase + « En savoir plus » → fiche). On ne le
 * ré-invente pas : on lui emprunte sa COQUILLE (`BubbleFrame`, `SheetFrame`, `InfoGlyph`,
 * `skinOf`), qui vient d'être extraite pour ça. Même scrim, mêmes rayons, mêmes deux
 * boutons, même cible de 44 px. Une seule chose change, et c'est la demande de Tim :
 * le corps de la bulle n'est plus une phrase, c'est LA LISTE ELLE-MÊME.
 *
 * ── LES TROIS ÉCARTS ASSUMÉS ─────────────────────────────────────────────────
 * 1. Le déclencheur n'est pas un ⓘ flottant, c'est LA TRAÎNE. « ou un signe, un
 *    frisson… » finissait déjà sur trois points de suspension : ils promettaient une
 *    suite que rien ne tenait. Ils la tiennent maintenant. Zéro élément ajouté au
 *    budget §15.1 — la traîne vit dans l'emplacement n°3 (« 1 mot »), avant comme après.
 * 2. « Lire + » n'ouvre pas une fiche de 200 mots, mais une PAGE (plein écran, en-tête
 *    de retour, défilement). Tim a demandé « une vraie page en profondeur » ; une feuille
 *    montante de 88 dvh aurait été une fiche déguisée.
 * 3. La page existe en JOUR. La coquille ⓘ était nuit en dur ; la poser telle quelle sur
 *    le Cœur aurait refait le défaut de la nav corrigé le 26/07 (RAPPORT-B5 §3.1).
 */

import React, { useState } from 'react'
import { useT } from '@/lib/i18n'
import { T, DT, SCALE, MOTION } from '@/lib/dream-design'
import { KGLYPH } from '@/lib/kairos-glyphs'
import { DREAM_TYPES, HEART_ROWS, ScopeFace, scopeKey, ktypeLabelKey } from '@/lib/depositScope'
import { BubbleFrame, InfoGlyph, InfoStyle, skinOf } from '@/components/InfoSystem'

type Mode = 'closed' | 'bubble' | 'page'

/* ═════════════════ ÉTAGE 1 — LA TRAÎNE, DEVENUE UNE PORTE ═════════════════ */

export function ScopeTrail({
  face, day, onGuides,
}: {
  face: ScopeFace
  /** face Cœur (parchemin). Change la peau de la bulle ET de la page. */
  day?: boolean
  /** « voir les guides » — la bibliothèque C4. Absent = le lien ne s'affiche pas. */
  onGuides?: () => void
}) {
  const { t, tRaw } = useT()
  const [mode, setMode] = useState<Mode>('closed')
  const skin = skinOf(day)
  const heartRows: string[] = (() => {
    const v = tRaw('content.scope.heart.rows')
    return Array.isArray(v) ? v : []
  })()

  /* La copie de la traîne reste EXACTEMENT là où elle était (`core.home.also` /
     `core.animus.also`) : c'est la voix de Tim, on n'y touche pas — on la rend tapable. */
  const label = t(face === 'dream' ? 'core.home.also' : 'core.animus.also')

  /* ⚠️ Côté jour, `DT.dim` mesure 3,79:1 sur le parchemin — sous AA pour du 17 px.
     `DT.inkSoft` donne 9,04:1 (RAPPORT-B5 §3.3). Côté nuit `T.dim` passe (5,27:1). */
  const trailColor = day ? DT.inkSoft : T.dim

  return (
    <>
      {/* 🔴 L'ENVELOPPE DE BLOC N'EST PAS DÉCORATIVE — constatée au rendu, invisible
          au code. La micro-ligne d'usage de `page.tsx` est en `display:'inline-flex'`.
          Un bouton `inline-flex` posé juste avant elle est un second élément DE LIGNE :
          les deux se rangent côte à côte dès qu'ils tiennent dans la largeur. Côté Rêve
          la traîne est assez longue pour renvoyer la micro-ligne à la ligne suivante et
          l'accident ne se voit pas ; côté Cœur (« comment tu te sens, là ? » + « maintiens ·
          ou écris » ≈ 295 px pour 322 px utiles) tout tenait sur UNE ligne — la traîne et
          le geste fondus en une bouillie. Ce `div` garantit la séparation quelle que soit
          la copie, sur les deux faces, dans les deux langues. */}
      <div>
      <button
        type="button"
        onClick={() => setMode('bubble')}
        aria-haspopup="dialog"
        aria-label={t(scopeKey(face, 'trailAria'))}
        style={{
          marginTop: 5, background: 'none', border: 'none', padding: '3px 0',
          display: 'inline-flex', alignItems: 'baseline', justifyContent: 'center', gap: 8,
          fontFamily: T.serif, fontSize: SCALE.body, fontStyle: 'italic',
          color: trailColor, lineHeight: 1.25, cursor: 'pointer',
          WebkitTapHighlightColor: 'transparent',
          animation: `dream-fade-in ${MOTION.fade}ms ${MOTION.ease}`,
        }}
      >
        <span>{label}</span>
        {/* le ⓘ termine la phrase — il n'est pas posé à côté d'elle.
            Cible tactile : c'est la LIGNE entière qui est le bouton, donc largement
            au-delà des 44 px, sans avoir à gonfler le glyphe.
            Opacité 0,85 et non 0,72 (constaté au rendu) : c'est la SEULE affordance
            de la ligne. Un signe qu'on ne voit pas ne signale rien — la leçon du
            liseré de seuil, §15.3, transposée à quatorze pixels. */}
        <span style={{ position: 'relative', top: 2, flexShrink: 0, lineHeight: 0, opacity: 0.85 }}>
          <InfoGlyph c={trailColor} s={14} />
        </span>
      </button>
      </div>

      {mode === 'bubble' && (
        <BubbleFrame
          skin={skin}
          onClose={() => setMode('closed')}
          onMore={() => setMode('page')}
          moreLabel={t(scopeKey(face, 'more'))}
          closeLabel={t('screens.info.thanks')}
          lead={<InfoGlyph c={skin.gold} s={17} />}
        >
          <p style={{ margin: 0, fontFamily: skin.serif, fontSize: 17, fontStyle: 'italic', lineHeight: 1.4, color: skin.cream }}>
            {t(scopeKey(face, 'bubbleLead'))}
          </p>
          {/* ⚠️ GRILLE, pas une pile de `flex` — et c'est le rendu qui l'a exigé.
              En flex, chaque ligne calait son six-mots juste après son propre nom :
              sept départs différents, et les deux noms longs (« hypnagogie »,
              « synchronicité ») poussaient leur glose sur une seconde ligne. Une
              liste de sept qui se dés-aligne n'est plus une liste, c'est un
              paragraphe haché. La grille aligne la colonne des noms sur le plus
              long, sans nombre magique : `auto` fait le calcul. */}
          <div style={face === 'dream'
            ? { marginTop: 15, display: 'grid', gridTemplateColumns: '14px auto 1fr', columnGap: 9, rowGap: 10, alignItems: 'baseline' }
            : { marginTop: 15, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {face === 'dream'
              ? DREAM_TYPES.map(id => (
                  <React.Fragment key={id}>
                    <span aria-hidden style={{ position: 'relative', top: 2, lineHeight: 0 }}>{KGLYPH[id](skin.gold, 14)}</span>
                    <span style={{ fontFamily: skin.sans, fontSize: 14, fontWeight: 600, color: skin.cream, whiteSpace: 'nowrap' }}>{t(ktypeLabelKey(id))}</span>
                    <span style={{ fontFamily: skin.serif, fontSize: 14.5, fontStyle: 'italic', color: skin.dim, lineHeight: 1.3 }}>
                      {t(scopeKey('dream', `hints.${id}`))}
                    </span>
                  </React.Fragment>
                ))
              : heartRows.map((row, i) => (
                  /* Pas de glyphes ici — c'est une décision, pas un oubli : voir
                     `depositScope.ts`. Un point suffit à faire une liste. */
                  <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 9 }}>
                    <span aria-hidden style={{ width: 4, height: 4, borderRadius: '50%', background: skin.gold, opacity: 0.7, flexShrink: 0, position: 'relative', top: -3 }} />
                    <span style={{ fontFamily: skin.serif, fontSize: 15.5, fontStyle: 'italic', color: skin.cream, lineHeight: 1.3 }}>{row}</span>
                  </div>
                ))}
          </div>
        </BubbleFrame>
      )}

      {mode === 'page' && (
        <ScopePage face={face} day={day} onClose={() => setMode('closed')} onGuides={onGuides} />
      )}
    </>
  )
}

/* ═════════════════ ÉTAGE 3 — LA PAGE EN PROFONDEUR ═════════════════
 * Une vraie page : plein écran, son fond, son en-tête de retour, son défilement.
 * Elle n'est pas une route : l'app `/mvp` est une machine à états à un seul fichier,
 * et y ajouter un écran aurait touché `page.tsx` bien au-delà de deux lignes. Un
 * calque plein écran donne le même objet perçu pour un centième du risque.        */

export function ScopePage({
  face, day, onClose, onGuides,
}: {
  face: ScopeFace
  day?: boolean
  onClose: () => void
  onGuides?: () => void
}) {
  const { t, tRaw } = useT()
  const skin = skinOf(day)
  const arr = (leaf: string): string[] => {
    const v = tRaw(scopeKey(face, leaf))
    return Array.isArray(v) ? v : []
  }

  const paras = (lines: string[], size = 17) =>
    lines.map((p, i) => (
      <p key={i} style={{ margin: i ? '11px 0 0' : 0, fontFamily: skin.serif, fontSize: size, lineHeight: 1.5, color: skin.ink }}>{p}</p>
    ))

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed', inset: 0, zIndex: 250, overflowY: 'auto',
        background: day ? DT.paper : T.bg,
        animation: 'infoFade .3s ease',
      }}
      className="infoAnim"
    >
      <InfoStyle />
      {/* grain — la page appartient au même monde que l'écran d'où elle sort */}
      <div aria-hidden style={{ position: 'fixed', inset: 0, pointerEvents: 'none', opacity: 0.025, backgroundRepeat: 'repeat', backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='144' height='144'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

      <div style={{ position: 'relative', maxWidth: 560, margin: '0 auto', padding: '0 24px 89px' }}>
        {/* en-tête de retour — même geste que `HowDreamWorks` */}
        <div style={{ paddingTop: 55, display: 'flex', alignItems: 'center', gap: 12, minHeight: 44 }}>
          <button
            onClick={onClose}
            aria-label={t('screens.common.back')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 10, margin: -10, display: 'inline-flex', lineHeight: 0 }}
          >
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke={skin.dim} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>

        <h1 style={{ marginTop: 21, fontFamily: skin.serif, fontSize: 34, fontStyle: 'italic', fontWeight: 400, lineHeight: 1.1, color: skin.cream }}>
          {t(scopeKey(face, 'pageTitle'))}
        </h1>

        <div style={{ marginTop: 18 }}>{paras(arr('pageIntro'), 17.5)}</div>

        <div style={{ marginTop: 34, display: 'flex', flexDirection: 'column', gap: 34 }}>
          {face === 'dream'
            ? DREAM_TYPES.map(id => (
                <section key={id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 11 }}>
                    <span aria-hidden style={{ flexShrink: 0, lineHeight: 0 }}>{KGLYPH[id](skin.gold, 17)}</span>
                    <h2 style={{ margin: 0, fontFamily: skin.display, fontSize: 12, fontWeight: 500, letterSpacing: '0.24em', textTransform: 'uppercase', color: skin.kicker }}>
                      {t(ktypeLabelKey(id))}
                    </h2>
                  </div>
                  {paras(arr(`sections.${id}`))}
                </section>
              ))
            : HEART_ROWS.map(id => (
                <section key={id}>
                  <h2 style={{ margin: '0 0 11px', fontFamily: skin.display, fontSize: 12, fontWeight: 500, letterSpacing: '0.24em', textTransform: 'uppercase', color: skin.kicker }}>
                    {t(scopeKey('heart', `sections.${id}.title`))}
                  </h2>
                  {paras(arr(`sections.${id}.body`))}
                </section>
              ))}
        </div>

        {/* ═══ LE PONT VERS LES GUIDES ═══
            Tim : « ça amène même aux protocoles dans le "in depth" ». Il vise ce que
            l'app appelle des GUIDES : le mot « protocole » est banni de l'écran depuis
            la refonte MVP (guides.ts §0.1), et le `PROTO_CATALOG` qui portait ce nom
            était du code mort, injoignable, supprimé le 26/07 (PATCH-A5).
            Un lien, pas une grille : la page enseigne un périmètre, elle n'ouvre pas
            un tableau de bord. */}
        <div style={{ marginTop: 55, paddingTop: 26, borderTop: `0.5px solid ${skin.rule}` }}>
          <h2 style={{ margin: 0, fontFamily: skin.serif, fontSize: 21, fontStyle: 'italic', fontWeight: 400, color: skin.cream }}>
            {t(scopeKey(face, 'afterTitle'))}
          </h2>
          <div style={{ marginTop: 13 }}>{paras(arr('after'))}</div>
          {onGuides && (
            <button
              onClick={() => { onClose(); onGuides() }}
              style={{ marginTop: 21, minHeight: 44, padding: '13px 21px', borderRadius: 999, background: skin.moreBg, border: `1px solid ${skin.moreBorder}`, color: skin.cream, fontSize: 14, fontWeight: 600, fontFamily: skin.sans, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              {t(scopeKey(face, 'guidesLink'))}
              <span aria-hidden>→</span>
            </button>
          )}
        </div>

        {/* « D'où ça vient » — même bloc que les fiches ⓘ. Il n'est pas décoratif :
            ETHICAL-POLICY-V2 demande que l'attribution remonte JUSQU'À L'UTILISATEUR
            quand on s'appuie sur un auteur vivant ou une tradition (le cluster Moss est
            flagué MEDIUM). Les quatre noms cités portent réellement ce qui est écrit. */}
        {face === 'dream' && (
          <div style={{ marginTop: 34, paddingTop: 18, borderTop: `0.5px solid ${skin.rule}` }}>
            <p style={{ margin: 0, fontFamily: skin.sans, fontSize: 13, lineHeight: 1.6, color: skin.dim, fontStyle: 'italic' }}>
              {t(scopeKey('dream', 'source'))}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
