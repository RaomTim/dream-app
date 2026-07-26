/**
 * Dream — SWITCH MVP 2026-06-11 (décision audit + GO Tim)
 *
 *   - `/`           → MVP ANIMA Phase 1 (src/app/mvp) — la nouvelle app simple
 *   - `/mvp`        → idem (adresse directe)
 *   - `/v8/`        → redirecteur vers /mvp (pour les wrappers Capacitor installés, sans rebuild binaire)
 *   - `/v8-archive/`→ ancienne alpha V8 (GELÉE) — rollback : recopier v8-archive/index.html dans v8/ (re-pointer le bridge)
 *   - `/v12/`       → legacy V1.2 (préservé)
 *
 * ⚠️ Les wrappers Capacitor pointent explicitement vers /v8/index.html (non impactés).
 *    Le re-point Capacitor → '/' se fait au prochain build store (runbook Vague 3).
 */
import { redirect } from 'next/navigation'

export default function Page() {
  redirect('/mvp')
}
