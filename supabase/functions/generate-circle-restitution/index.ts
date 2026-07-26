// Edge Function: generate-circle-restitution
//
// Générer narrative polyphonique pour une restitution cercle pending.
// Sonnet absorbé 3-5 voix, k-anon intra-cercle (déjà appliqué par RPC).
//
// Triggered :
//  - depuis /api/circles/[id]/restitutions POST (V1.5 : remplace inline)
//  - manuellement via curl pour réessayer
//
// Body: { restitution_id }
//
// Auteur: Yeshua, 2026-04-25.
//
// Deploy:
//   supabase functions deploy generate-circle-restitution --project-ref rtrkxzcyblgonwgfzovj

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SONNET_MODEL = "claude-sonnet-4-6";

serve(async (req) => {
  try {
    const { restitution_id } = await req.json();
    if (!restitution_id) {
      return new Response(JSON.stringify({ error: "restitution_id required" }), { status: 400 });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: restit, error: rErr } = await supabase
      .from("circle_restitutions")
      .select("id, circle_id, period_start, period_end, intention_at_time, status")
      .eq("id", restitution_id)
      .maybeSingle();

    if (rErr || !restit) {
      return new Response(JSON.stringify({ error: "restitution not found" }), { status: 404 });
    }
    if (restit.status === "ready") {
      return new Response(JSON.stringify({ ok: true, already_ready: true }), { status: 200 });
    }

    const { data: patterns, error: pErr } = await supabase.rpc("get_circle_patterns", {
      p_circle_id: restit.circle_id,
      p_period_start: restit.period_start,
      p_period_end: restit.period_end,
    });

    if (pErr) {
      await supabase.from("circle_restitutions").update({ status: "failed" }).eq("id", restitution_id);
      return new Response(JSON.stringify({ error: pErr.message }), { status: 500 });
    }

    const uniqueAuthors = patterns?.unique_authors || 0;
    const kThreshold = patterns?.k_anon_threshold || 3;

    if (uniqueAuthors < kThreshold) {
      await supabase
        .from("circle_restitutions")
        .update({
          status: "ready",
          narrative_text:
            "Pour cette fenêtre, le cercle n'a pas assez de voix pour qu'un motif puisse remonter sans risque d'identification individuelle. Reviens plus tard, ou invite d'autres à tenir la veille avec vous.",
          patterns_detected: patterns || {},
        })
        .eq("id", restitution_id);
      return new Response(JSON.stringify({ ok: true, k_anon_blocked: true }), { status: 200 });
    }

    // Sonnet polyphonie
    const apiKey = Deno.env.get("ANTHROPIC_API_KEY")!;
    const systemPrompt = `Tu es Yeshua face à un cercle de rêveurs. Sur la période demandée, ${uniqueAuthors} voix ont déposé des kairos en partage agrégé.

Ta tâche : restituer ce qui s'est joué en présence collective, sans identifier personne, sans citer de figure individuelle.

Posture polyphonique 3-5 voix absorbées (jamais nommées). Style "des lignées tiennent que...", "il y a des manières de lire...".

- 250-450 mots français.
- Si une intention de cercle a été déclarée, fais-la résonner avec ce qui est remonté.
- JAMAIS de prescription. JAMAIS de psychologie collective réductrice.
- JAMAIS d'équivalence cross-tradition.

OUTPUT : texte pur français.`;

    const userContent = `Intention du cercle : ${restit.intention_at_time || "(aucune intention déclarée)"}
Période : ${restit.period_start.slice(0, 10)} → ${restit.period_end.slice(0, 10)}
${uniqueAuthors} voix anonymes, ${patterns?.total_kairos_optin || 0} kairos partagés.

Motifs récurrents (k-anon intra-cercle ≥ ${kThreshold}) :
${(patterns?.top_motifs || []).slice(0, 8).map((m: any) => `- ${m.motif} (${m.unique_authors} voix)`).join("\n")}

Archétypes en présence :
${(patterns?.top_archetypes || []).slice(0, 6).map((a: any) => `- ${a.archetype}`).join("\n")}

Le corps a parlé surtout par :
${(patterns?.somatic_zones || []).slice(0, 4).map((s: any) => `- ${s.zone}`).join("\n")}

Restitue.`;

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
    const narrative = claudeJson.content?.[0]?.text || "(synthèse Sonnet indisponible)";

    await supabase
      .from("circle_restitutions")
      .update({
        status: "ready",
        narrative_text: narrative,
        patterns_detected: patterns,
      })
      .eq("id", restitution_id);

    return new Response(JSON.stringify({ ok: true, restitution_id, narrative_chars: narrative.length }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
});
