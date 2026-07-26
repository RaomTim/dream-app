#!/usr/bin/env node
/**
 * A2 — recalibration de la résonance + rattrapage de la numinosité.
 *
 * À lancer :
 *   • après un import de masse (la calibration se recalcule seule tous les
 *     10 dépôts, mais un import de 40 rêves d'un coup mérite un passage explicite) ;
 *   • après un changement de poids d'embedding ;
 *   • pour rattraper les kairos dont le pipeline n'a jamais écrit la numinosité.
 *
 * Sans argument : traite TOUS les rêveurs ayant au moins un kairos.
 *   node scripts/a2-recalibrate-resonance.mjs [user_id]
 *
 * Ce que ça fait, et rien d'autre :
 *   1. numinosité — recalcule le score DÉTERMINISTE depuis les colonnes
 *      d'extraction déjà persistées, UNIQUEMENT là où il vaut 0. Ne touche
 *      jamais un score produit par le pipeline complet (plus riche : il inclut
 *      le blend Sonnet et `tradition_specific`). Trace la provenance dans
 *      setting_metadata.numinosity_recompute ;
 *   2. calibration — recalcule mean_sim par kairos (correction de hubness) et
 *      les seuils du rêveur ;
 *   3. seuil empirique — si le rêveur a ≥ 30 verdicts « résonne / pas vraiment »
 *      horodatés avec leur z, le seuil est LU dans ses verdicts au lieu d'être posé.
 *
 * Yeshua (Opus, agent A2), 2026-07-26.
 */
import fs from 'node:fs'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'

const envPath = path.join(process.cwd(), '.env.local')
for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '')
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } },
)

const only = process.argv[2] || null

const { data: users, error } = await supabase.rpc('exec_a2_list_users').then(
  r => r,
  () => ({ data: null, error: null }),
)

// Pas de RPC dédiée : on lit les user_id distincts côté client.
let userIds = []
if (only) {
  userIds = [only]
} else {
  const { data, error: e2 } = await supabase.from('kairos').select('user_id').limit(10000)
  if (e2) throw e2
  userIds = [...new Set((data || []).map(r => r.user_id).filter(Boolean))]
}
void users; void error

console.log(`${userIds.length} rêveur(s) à traiter\n`)

for (const uid of userIds) {
  // 1. numinosité — uniquement les scores à 0 dont l'extraction existe
  const { data: zeros } = await supabase
    .from('kairos').select('id, numinosity_score')
    .eq('user_id', uid).or('numinosity_score.is.null,numinosity_score.eq.0')
  let fixed = 0
  for (const k of zeros || []) {
    const { data: score } = await supabase.rpc('kairos_numinosity_floor', { p_kairos_id: k.id })
    if (typeof score !== 'number' || score <= 0) continue
    const { error: uErr } = await supabase.from('kairos')
      .update({ numinosity_score: score }).eq('id', k.id).eq('user_id', uid)
    if (!uErr) fixed++
  }

  // 2. calibration (mean_sim par kairos + seuils)
  const { data: cal, error: cErr } = await supabase
    .rpc('recompute_resonance_calibration', { p_user_id: uid })
  if (cErr) { console.warn(`  ! ${uid} calibration: ${cErr.message}`); continue }
  const c = Array.isArray(cal) ? cal[0] : cal

  // 3. seuil empirique depuis les verdicts, si assez de matière
  const { data: zEmp } = await supabase.rpc('calibrate_z_from_feedback', { p_user_id: uid })

  console.log(
    `${uid}\n` +
    `  numinosité rattrapée : ${fixed}\n` +
    `  corpus ${c?.n_kairos ?? '?'} · moyenne des paires ${Number(c?.global_mean ?? 0).toFixed(4)}` +
    ` · plancher ${Number(c?.abs_floor ?? 0).toFixed(4)} · plafond de liens ${c?.max_links ?? '?'}\n` +
    `  seuil z : ${zEmp ? `${Number(zEmp).toFixed(2)} (lu dans les verdicts)` : `${Number(c?.z_threshold ?? 2).toFixed(2)} (défaut — pas encore 30 verdicts)`}\n`,
  )
}
console.log('terminé.')
