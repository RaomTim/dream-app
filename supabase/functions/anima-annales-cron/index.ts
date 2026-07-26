// Edge Function: anima-annales-cron
//
// Maintenance daily des annales :
// - Recalcule threshold_required = MAX(50, 0.10 * users_optin_actifs)
// - Bascule state='archived' si hold_count >= threshold
// - Bascule state='expired' si > 28j et hold_count < threshold (prolongation +28j unique)
//
// Auteur: Yeshua, 2026-04-25.
//
// Cron: '0 2 * * *' (daily 2h)
// Deploy:
//   supabase functions deploy anima-annales-cron --project-ref rtrkxzcyblgonwgfzovj

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async () => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // 1. Compte users opt-in annales actifs
    const { count: optinCount } = await supabase
      .from("kairos_global_optin")
      .select("user_id", { count: "exact", head: true })
      .eq("share_for_annales", true);

    const newThreshold = Math.max(50, Math.ceil((optinCount || 0) * 0.10));

    // 2. Update threshold sur annales en circulation
    const { error: upErr } = await supabase
      .from("annales_circulation")
      .update({ threshold_required: newThreshold })
      .eq("state", "circulating");

    // 3. Bascule archived ceux qui ont hold_count >= threshold
    const { data: toArchive } = await supabase
      .from("annales_circulation")
      .select("id, hold_count, threshold_required")
      .eq("state", "circulating");

    let archived = 0;
    for (const a of (toArchive || []) as any[]) {
      if ((a.hold_count || 0) >= a.threshold_required) {
        await supabase
          .from("annales_circulation")
          .update({ state: "archived", archived_at: new Date().toISOString() })
          .eq("id", a.id);
        archived++;
      }
    }

    // 4. Expire ceux > 28j sans threshold atteint (prolongation V1.5)
    const cutoff = new Date(Date.now() - 28 * 24 * 3600 * 1000).toISOString();
    const { data: expiredData, error: expErr } = await supabase
      .from("annales_circulation")
      .update({ state: "expired" })
      .lt("shared_at", cutoff)
      .eq("state", "circulating")
      .select("id");

    return new Response(
      JSON.stringify({
        ok: true,
        threshold: newThreshold,
        optin_count: optinCount || 0,
        archived,
        expired: expiredData?.length || 0,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
});
