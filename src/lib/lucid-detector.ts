/**
 * src/lib/lucid-detector.ts
 *
 * NLP Lucid Marker Detection — pipeline post-extraction (Phase 3.5).
 *
 * Détecte les marqueurs de lucidité dans un texte de rêve brut :
 *  - Reconnaissance explicite ("j'ai su que je rêvais", "je me suis rendu compte")
 *  - Reality check référencé ("j'ai testé la réalité", "regardé mes mains")
 *  - Techniques nommées (DILD/MILD/WILD/SSILD/WBTB/FILD)
 *  - Sleep paralysis / hypnagogie
 *  - Posture (observation/dialogue/pilote_active)
 *
 * 3 niveaux d'évidence :
 *  - regex strict explicit ("j'étais lucide", "I became lucid") → confidence 0.90+
 *  - regex implicit ("soudain j'ai compris", "j'avais conscience") → 0.75-0.85
 *  - keyword spotting (lucide, RC, MILD) → 0.50-0.70
 *
 * Cohérent 1_LUCID_BIBLE §8.2 (bridge auto Dream → Lucid) +
 *           3_LUCID_TECHNICAL §4 (pipeline 8 phases — Phase 3.5).
 *
 * Anti-faux-positif : "j'ai rêvé que je rêvais" (rêve dans rêve, pas lucide)
 * traité distinctement → flag double_dream sans is_lucid_candidate.
 *
 * Auteur : Yeshua, 2026-04-28.
 */

export interface LucidMarkers {
  is_lucid: boolean
  confidence: number              // 0..1
  signals: string[]               // matched evidence strings
  technique_detected?: string | null  // 'mild' | 'wbtb' | ...
  recognition_category?: 'inner_awareness' | 'action' | 'form' | 'context' | null
  posture_detected?: 'observation' | 'dialogue' | 'pilote_active' | 'tend' | null
  hypnagogic_entry: boolean
  sleep_paralysis_experienced: boolean
  double_dream_only: boolean      // true si "rêve dans rêve" sans lucidité
}

// ─── Patterns explicites — confidence haute ───────────────────────────────
// FR + EN. "?:" pour groupes non-capturants. Souples sur ponctuation/conjugaison.
const EXPLICIT_PATTERNS: { re: RegExp; weight: number; label: string }[] = [
  // FR
  { re: /j['ʼ]?ai (?:su|réalisé|compris|pris conscience) (?:que|qu['ʼ]?)\s*(?:c['ʼ]?était|j['ʼ]?étais (?:en train de )?)?\s*(?:un )?rêv(?:e|ais|ait)/i, weight: 0.95, label: 'reconnaissance_explicite_fr' },
  { re: /j['ʼ]?(?:étais|ai été) (?:devenu )?lucide/i, weight: 0.92, label: 'etat_lucide_declare_fr' },
  { re: /(?:devenir|devenu|été) lucide (?:dans|en|pendant)/i, weight: 0.90, label: 'devenir_lucide_fr' },
  { re: /je (?:savais|avais conscience) (?:que|qu['ʼ]?)\s*je rêvais/i, weight: 0.90, label: 'conscience_de_rever_fr' },
  { re: /j['ʼ]?ai (?:pris|repris) (?:le )?contrôle (?:du|dans le|de mon) rêve/i, weight: 0.88, label: 'controle_du_reve_fr' },
  { re: /(?:reality check|RC|test (?:de )?réalité).{0,40}(?:dans|pendant) (?:le |mon )?rêve/i, weight: 0.85, label: 'rc_dans_le_reve_fr' },
  { re: /j['ʼ]?ai (?:regardé|vérifié|compté) (?:mes|les) (?:mains|doigts).{0,80}(?:c['ʼ]?était un rêve|j['ʼ]?ai compris|j['ʼ]?étais lucide)/i, weight: 0.88, label: 'mains_doigts_rc_fr' },
  // EN
  { re: /\bI (?:realized|knew|understood|became aware) (?:I was )?dreaming\b/i, weight: 0.95, label: 'recognized_dreaming_en' },
  { re: /\b(?:became|got|went) lucid\b/i, weight: 0.92, label: 'became_lucid_en' },
  { re: /\bI (?:was|am) (?:fully )?lucid\b/i, weight: 0.90, label: 'was_lucid_en' },
  { re: /\b(?:did|performed) a reality check\b/i, weight: 0.85, label: 'reality_check_en' },
  { re: /\bI took control of (?:the|my) dream\b/i, weight: 0.85, label: 'control_dream_en' },
]

// ─── Patterns implicites — confidence moyenne ─────────────────────────────
const IMPLICIT_PATTERNS: { re: RegExp; weight: number; label: string }[] = [
  { re: /soudain (?:j['ʼ]?ai|je) (?:su|compris|réalisé|sus)/i, weight: 0.72, label: 'soudain_realise_fr' },
  { re: /je flottais en sachant que c['ʼ]?était (?:un rêve|imaginaire|pas réel)/i, weight: 0.80, label: 'flottais_sachant_fr' },
  { re: /j['ʼ]?avais conscience de (?:la fabrique|l['ʼ]?irréalité|l['ʼ]?illusion) du rêve/i, weight: 0.78, label: 'conscience_fabrique_fr' },
  { re: /tout (?:à|d'un) coup, j['ʼ]?ai (?:su|senti|compris)/i, weight: 0.65, label: 'tout_a_coup_realise_fr' },
  { re: /je me suis rendu compte que (?:c['ʼ]?était|je rêvais|j['ʼ]?étais)/i, weight: 0.78, label: 'rendu_compte_fr' },
  { re: /\bsuddenly I (?:knew|realized|understood)\b/i, weight: 0.70, label: 'suddenly_realized_en' },
]

// ─── Keyword spotting (basse confidence — booste seulement) ───────────────
const KEYWORD_SIGNALS: { kw: RegExp; weight: number; label: string }[] = [
  { kw: /\blucide?\b/i, weight: 0.20, label: 'mot_lucide' },
  { kw: /\blucid(?:ity)?\b/i, weight: 0.20, label: 'word_lucid' },
  { kw: /\boniron(?:aut|autes?)\b/i, weight: 0.15, label: 'oneironaute' },
]

// ─── Techniques d'induction nommées ───────────────────────────────────────
const TECHNIQUE_PATTERNS: { re: RegExp; tech: string; label: string }[] = [
  { re: /\b(?:WBTB[\s\-]?MILD|wbtb[\s\-]?mild)\b/i, tech: 'wbtb_mild', label: 'wbtb_mild' },
  { re: /\bWBTB\b/i, tech: 'wbtb_mild', label: 'wbtb' },
  { re: /\bMILD\b/i, tech: 'mild', label: 'mild' },
  { re: /\bSSILD\b/i, tech: 'ssild', label: 'ssild' },
  { re: /\bWILD\b/i, tech: 'wild', label: 'wild' },
  { re: /\bFILD\b/i, tech: 'fild', label: 'fild' },
  { re: /\bDILD\b/i, tech: 'mild', label: 'dild_treated_as_mild' }, // DILD = spontané, on le rattache à mild en V1
]

// ─── Hypnagogie & Sleep Paralysis ─────────────────────────────────────────
const HYPNAGOGIC_PATTERNS = [
  /\bhypnagogi(?:e|que|c)\b/i,
  /(?:images|visions|sons) (?:juste avant|en m['ʼ]?endormant|à l['ʼ]?endormissement)/i,
  /\bsleep onset (?:imagery|dreams)\b/i,
]

const SLEEP_PARALYSIS_PATTERNS = [
  /paralysie du sommeil/i,
  /\bsleep paralysis\b/i,
  /je (?:ne pouvais pas|n['ʼ]?arrivais pas à) bouger/i,
  /(?:cloué|paralysé)e? (?:au lit|sur le lit|dans mon lit)/i,
]

// ─── Posture detection ────────────────────────────────────────────────────
const POSTURE_PATTERNS: { re: RegExp; posture: 'observation' | 'dialogue' | 'pilote_active' | 'tend' }[] = [
  { re: /j['ʼ]?ai (?:juste )?observé|sans rien forcer|j['ʼ]?ai laissé (?:venir|le rêve)/i, posture: 'observation' },
  { re: /j['ʼ]?ai (?:parlé|dialogué|demandé) (?:avec|à) (?:la|le|un|une|cette) (?:figure|personnage|personne)/i, posture: 'dialogue' },
  { re: /j['ʼ]?ai (?:volé|changé (?:la )?scène|fait apparaître|invoqué|téléporté)/i, posture: 'pilote_active' },
  { re: /j['ʼ]?ai tendu (?:au|vers le|le) rêve|j['ʼ]?ai accueilli/i, posture: 'tend' },
]

// ─── Recognition category (LaBerge 4 cat) ─────────────────────────────────
const RECOGNITION_CATEGORY_PATTERNS: { re: RegExp; cat: 'inner_awareness' | 'action' | 'form' | 'context' }[] = [
  { re: /(?:respiration (?:bizarre|étrange)|sensation (?:intérieure|étrange)|émotion (?:trop forte|trop intense))/i, cat: 'inner_awareness' },
  { re: /(?:je volais|je flottais|je passais à travers)/i, cat: 'action' },
  { re: /(?:six doigts|6 doigts|texte qui change|horloge (?:qui|déformée|étrange)|miroir (?:bizarre|déformé))/i, cat: 'form' },
  { re: /(?:pièce inconnue|maison (?:étrange|différente)|lieu impossible|époque (?:étrange|mélangée))/i, cat: 'context' },
]

// ─── Double dream (rêve dans rêve) — distinct de lucidité ─────────────────
const DOUBLE_DREAM_PATTERNS = [
  /(?:un|le) rêve dans (?:un|le) rêve/i,
  /j['ʼ]?ai rêvé que je rêvais/i,
  /je me suis réveillé(?:e)? (?:dans|encore dans) (?:un|le) rêve/i,
  /faux réveil/i,
  /\bfalse awakening\b/i,
]

/**
 * Détecte les marqueurs lucides dans un texte brut.
 *
 * @param rawText texte du rêve (français ou anglais)
 * @returns LucidMarkers structurés
 */
export function detectLucidMarkers(rawText: string): LucidMarkers {
  if (!rawText || typeof rawText !== 'string' || rawText.length < 5) {
    return defaultMarkers()
  }

  const text = rawText.normalize('NFC')
  const signals: string[] = []
  let weightedScore = 0
  let maxWeight = 0

  // Pass 1 — explicit
  for (const p of EXPLICIT_PATTERNS) {
    if (p.re.test(text)) {
      signals.push(p.label)
      weightedScore += p.weight
      maxWeight = Math.max(maxWeight, p.weight)
    }
  }

  // Pass 2 — implicit
  for (const p of IMPLICIT_PATTERNS) {
    if (p.re.test(text)) {
      signals.push(p.label)
      weightedScore += p.weight * 0.7  // implicit pondéré moins fort
      maxWeight = Math.max(maxWeight, p.weight)
    }
  }

  // Pass 3 — keyword spotting (booste seulement, ne déclenche pas seul)
  let kwBoost = 0
  for (const k of KEYWORD_SIGNALS) {
    if (k.kw.test(text)) {
      signals.push(k.label)
      kwBoost += k.weight
    }
  }
  // Keywords seuls → max confidence 0.50 (suspect mais pas confirmé)
  if (signals.length > 0 && weightedScore === 0) {
    weightedScore = Math.min(0.50, kwBoost)
  } else {
    weightedScore += kwBoost * 0.3
  }

  // Technique détectée
  let technique_detected: string | null = null
  for (const t of TECHNIQUE_PATTERNS) {
    if (t.re.test(text)) {
      signals.push(`tech:${t.label}`)
      technique_detected = t.tech
      break  // on prend la première rencontrée
    }
  }

  // Hypnagogie
  const hypnagogic_entry = HYPNAGOGIC_PATTERNS.some((p) => p.test(text))
  if (hypnagogic_entry) signals.push('hypnagogic')

  // Sleep paralysis
  const sleep_paralysis_experienced = SLEEP_PARALYSIS_PATTERNS.some((p) => p.test(text))
  if (sleep_paralysis_experienced) signals.push('sleep_paralysis')

  // Posture
  let posture_detected: 'observation' | 'dialogue' | 'pilote_active' | 'tend' | null = null
  for (const p of POSTURE_PATTERNS) {
    if (p.re.test(text)) {
      posture_detected = p.posture
      signals.push(`posture:${p.posture}`)
      break
    }
  }

  // Recognition category
  let recognition_category: 'inner_awareness' | 'action' | 'form' | 'context' | null = null
  for (const c of RECOGNITION_CATEGORY_PATTERNS) {
    if (c.re.test(text)) {
      recognition_category = c.cat
      signals.push(`rec_cat:${c.cat}`)
      break
    }
  }

  // Double dream (rêve dans rêve) — distinct
  const isDoubleDreamMatch = DOUBLE_DREAM_PATTERNS.some((p) => p.test(text))
  // Double dream SEUL (sans aucun marqueur lucide explicit/implicit) = pas lucide
  const double_dream_only = isDoubleDreamMatch && weightedScore < 0.30
  if (isDoubleDreamMatch) signals.push('double_dream')

  // Confidence finale (clamp 0-1)
  // Stratégie : on prend max entre weightedScore et maxWeight (le pattern le plus fort)
  // pour ne pas pénaliser un signal unique mais clair.
  let confidence = Math.min(1, Math.max(weightedScore, maxWeight * 0.95))

  // Si double_dream_only → on baisse drastiquement
  if (double_dream_only) confidence = Math.min(confidence, 0.25)

  // is_lucid décision : threshold à 0.70 (cohérent §3.2 detect-markers brief)
  const is_lucid = confidence >= 0.70 && !double_dream_only

  return {
    is_lucid,
    confidence: Number(confidence.toFixed(3)),
    signals,
    technique_detected,
    recognition_category,
    posture_detected,
    hypnagogic_entry,
    sleep_paralysis_experienced,
    double_dream_only,
  }
}

function defaultMarkers(): LucidMarkers {
  return {
    is_lucid: false,
    confidence: 0,
    signals: [],
    technique_detected: null,
    recognition_category: null,
    posture_detected: null,
    hypnagogic_entry: false,
    sleep_paralysis_experienced: false,
    double_dream_only: false,
  }
}

/**
 * Helper : déclenche-t-on l'auto-tag is_lucid_candidate ?
 * Threshold 0.70 cohérent §3.2 brief technique.
 */
export function shouldAutoTagLucid(markers: LucidMarkers): boolean {
  return markers.confidence >= 0.70 && !markers.double_dream_only
}

/**
 * Helper : faut-il proposer le bridge "as-tu reconnu le rêve cette nuit ?"
 * Plus permissif que shouldAutoTagLucid — si confidence > 0.40, on ASK.
 * Cohérent §4.3 brief : prompt user, refusable d'un tap.
 */
export function shouldPromptLucidConfirmation(markers: LucidMarkers): boolean {
  return markers.confidence >= 0.40 && !markers.double_dream_only
}
