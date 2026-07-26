// Edge Function: anima-meteo
//
// Calcule la météo de l'inconscient hebdomadaire (cron lundi 6h).
// Lit kairos_global_optin (share_for_meteo=true) sur les 7 derniers jours,
// agrège motifs + archétypes + symboles + polarités via RPC compute_meteo_inconscient,
// applique k-anon ≥ 5 (D3 Tim 2026-04-25), insert meteos_inconscient.
//
// Auteur: Yeshua, 2026-04-25.
//
// Cron schedule:
//   SELECT cron.schedule('anima-meteo-weekly', '0 6 * * 1', ...)
//
// Deploy:
//   supabase functions deploy anima-meteo --project-ref rtrkxzcyblgonwgfzovj

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async () => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const periodEnd = new Date();
    const periodStart = new Date(periodEnd.getTime() - 7 * 24 * 3600 * 1000);

    const { data: agg, error: aggErr } = await supabase.rpc("compute_meteo_inconscient", {
      p_period_start: periodStart.toISOString(),
      p_period_end: periodEnd.toISOString(),
      p_kanon_min: 5,
    });

    if (aggErr) {
      return new Response(JSON.stringify({ error: aggErr.message }), { status: 500 });
    }

    // Insert meteo (approved=true par défaut V1, audit éditorial possible V1.5)
    const { data: inserted, error: insErr } = await supabase
      .from("meteos_inconscient")
      .insert({
        period_start: periodStart.toISOString(),
        period_end: periodEnd.toISOString(),
        top_motifs: agg.top_motifs || [],
        top_archetypes: agg.top_archetypes || [],
        hot_symbols: [],
        polarities: {},
        k_count: agg.k_count || 0,
        approved: true,
      })
      .select()
      .single();

    if (insErr) {
      return new Response(JSON.stringify({ error: insErr.message }), { status: 500 });
    }

    return new Response(
      JSON.stringify({ ok: true, meteo: inserted, k_count: agg.k_count }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
});
