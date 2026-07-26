// Edge Function: kairos-numinosity-recalc
//
// Recalcule numinosity_score pour les kairos avec numinosity_pending=true.
// Triggered par pg_cron toutes les 6h.
//
// V1 simple : passe les kairos pending au pipeline d'enrichissement (recalcul léger).
//
// Auteur: Yeshua, 2026-04-25.
//
// Deploy:
//   supabase functions deploy kairos-numinosity-recalc --project-ref rtrkxzcyblgonwgfzovj
//
// Cron schedule (à appliquer SQL):
//   SELECT cron.schedule('kairos-numinosity-recalc-6h', '0 */6 * * *',
//     $$ SELECT net.http_post(
//          url := 'https://rtrkxzcyblgonwgfzovj.supabase.co/functions/v1/kairos-numinosity-recalc',
//          headers := jsonb_build_object('Authorization', 'Bearer [SERVICE_ROLE_KEY]')
//        ) $$);

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async () => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Récupère kairos pending récents (last 30j) avec embedding_semantic présent
    const { data: pending, error } = await supabase
      .from("kairos")
      .select("id, user_id, numinosity_score, root_dream_patterns, archetypal_tags, somatic_markers")
      .eq("numinosity_pending", true)
      .not("embedding_semantic", "is", null)
      .gte("created_at", new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString())
      .limit(50);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    let updated = 0;
    for (const k of (pending || []) as any[]) {
      // Compte les root_pattern matches dans le corpus user
      const { count: rootMatches } = await supabase
        .from("kairos")
        .select("id", { count: "exact", head: true })
        .eq("user_id", k.user_id)
        .overlaps("root_dream_patterns", k.root_dream_patterns || [])
        .neq("id", k.id);

      // Compte les edges existants
      const { count: edgesCount } = await supabase
        .from("kairos_edges")
        .select("id", { count: "exact", head: true })
        .eq("user_id", k.user_id)
        .or(`kairos_a_id.eq.${k.id},kairos_b_id.eq.${k.id}`);

      // Recalcul léger : juste réapprécie selon corpus user élargi
      const archetypalBoost = (k.archetypal_tags?.length || 0) >= 3 ? 0.10 : 0;
      const somaticBoost = Object.keys(k.somatic_markers || {}).length >= 2 ? 0.05 : 0;
      const recurrenceBoost = (rootMatches || 0) >= 5 ? 0.15 : (rootMatches || 0) >= 2 ? 0.08 : 0;
      const edgesBoost = (edgesCount || 0) >= 5 ? 0.10 : 0;

      const newScore = Math.min(
        1,
        (k.numinosity_score || 0) * 0.6 + archetypalBoost + somaticBoost + recurrenceBoost + edgesBoost,
      );
      const stillPending = (rootMatches || 0) < 3;

      await supabase
        .from("kairos")
        .update({ numinosity_score: newScore, numinosity_pending: stillPending })
        .eq("id", k.id);

      updated++;
    }

    return new Response(JSON.stringify({ ok: true, updated }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
});
