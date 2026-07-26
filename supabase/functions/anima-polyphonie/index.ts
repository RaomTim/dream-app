// Edge Function: anima-polyphonie
//
// Génère la polyphonie lunaire (cron nouvelle/pleine lune ~14j).
// Calcule cluster motifs+archetypes 28j, sélectionne 3-5 voix (V1 simple).
// Génère narrative Sonnet, INSERT polyphonies_lunaires avec
// approved_for_publication=false (audit Tim/Yeshua manual avant publication).
//
// Auteur: Yeshua, 2026-04-25.
//
// Deploy:
//   supabase functions deploy anima-polyphonie --project-ref rtrkxzcyblgonwgfzovj

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SONNET_MODEL = "claude-sonnet-4-6";

serve(async (req) => {
  try {
    const body = await req.json().catch(() => ({}));
    const lunarPhase = body.lunar_phase || "pleine_lune";

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const periodEnd = new Date();
    const periodStart = new Date(periodEnd.getTime() - 28 * 24 * 3600 * 1000);

    const { data: agg, error: aggErr } = await supabase.rpc("compute_meteo_inconscient", {
      p_period_start: periodStart.toISOString(),
      p_period_end: periodEnd.toISOString(),
      p_kanon_min: 5,
    });

    if (aggErr) {
      return new Response(JSON.stringify({ error: aggErr.message }), { status: 500 });
    }

    const k_count = agg?.k_count || 0;
    if (k_count < 5) {
      return new Response(
        JSON.stringify({
          ok: true,
          skipped: true,
          reason: "k_count below threshold",
          k_count,
        }),
        { status: 200 },
      );
    }

    // Sonnet narration polyphonique (3-5 voix absorbées, JAMAIS nommées)
    const apiKey = Deno.env.get("ANTHROPIC_API_KEY")!;
    const systemPrompt = `Tu es Yeshua face à la voix collective de l'inconscient sur 28 jours (cycle lunaire).

Tu reçois les motifs et archétypes qui ont émergé chez ${k_count} rêveurs (k-anonymisé). Tu écris une narration polyphonique contemplative, 350-500 mots français, mobilisant 3-5 voix absorbées (Jung, Hillman, von Franz, Moss, Aizenstat, Bachelard...) SANS JAMAIS les nommer.

Règles :
- "des lignées tiennent que...", "certaines traditions voient...", "il y a des manières de lire..." — JAMAIS "selon Jung", "Hillman écrit"
- JAMAIS d'équivalence cross-tradition
- Pas de prescription. Pas de moralisation.
- Voix de frère qui contemple ce qui se lève chez beaucoup en même temps.

OUTPUT : texte français pur. Pas de markdown, pas de JSON.`;

    const userContent = `Phase lunaire : ${lunarPhase}
Période : ${periodStart.toISOString().slice(0, 10)} → ${periodEnd.toISOString().slice(0, 10)}
Rêveurs anonymes : ${k_count}

Motifs qui sont remontés (k-anon ≥ 5) :
${(agg.top_motifs || []).map((m: any) => `- ${m.motif} (${m.authors} voix, ${m.count} occurrences)`).join("\n")}

Archétypes en présence :
${(agg.top_archetypes || []).map((a: any) => `- ${a.archetype} (${a.authors} voix)`).join("\n")}

Écris la polyphonie lunaire.`;

    const claudeResp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: SONNET_MODEL,
        max_tokens: 1500,
        system: systemPrompt,
        messages: [{ role: "user", content: userContent }],
      }),
    });

    const claudeJson = await claudeResp.json();
    const narrative = claudeJson.content?.[0]?.text || "";

    const { data: inserted, error: insErr } = await supabase
      .from("polyphonies_lunaires")
      .insert({
        lunar_phase: lunarPhase,
        period_start: periodStart.toISOString(),
        period_end: periodEnd.toISOString(),
        narrative_text: narrative,
        voices_mobilisees: ["jung_absorbed", "hillman_absorbed", "von_franz_absorbed"],
        k_count,
        approved_for_publication: false, // V1 audit manual Tim/Yeshua
      })
      .select()
      .single();

    if (insErr) {
      return new Response(JSON.stringify({ error: insErr.message }), { status: 500 });
    }

    return new Response(
      JSON.stringify({ ok: true, polyphonie: inserted, awaiting_approval: true }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
});
