// Edge Function: kairos-enrich
//
// Orchestrateur async pipeline 8 phases (cf 3_TECHNICAL.md §38).
//
// Trigger: POST { kairos_id, user_id } depuis Next.js route POST /api/kairos
//          (alternative au runKairosEnrichmentPipeline inline pour offload)
//
// Auteur: Yeshua, 2026-04-25 — Chantier 2 câblage backend Dream App.
//
// V1 NOTE : V1 Next.js route POST /api/kairos appelle directement
// runKairosEnrichmentPipeline (fire-and-forget). Cette EF est l'option V1.5
// quand le backend devient assez chargé pour bénéficier d'un workload externe.
//
// Variables env requises (Supabase secrets) :
//  - SUPABASE_URL
//  - SUPABASE_SERVICE_ROLE_KEY
//  - OPENAI_API_KEY
//  - ANTHROPIC_API_KEY
//  - INTERNAL_PIPELINE_URL (URL de Vercel app, pour fallback HTTP du pipeline)
//
// Deploy command (Tim) :
//   cd /sessions/laughing-tender-clarke/mnt/claude-context/dream-alpha-app
//   supabase functions deploy kairos-enrich --project-ref rtrkxzcyblgonwgfzovj

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { kairos_id, user_id } = await req.json();
    if (!kairos_id || !user_id) {
      return new Response(JSON.stringify({ error: "kairos_id + user_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // V1 : déléguer au backend Next.js (qui a tout le code Sonnet/embeddings/RPC).
    // Le service_role token est passé pour bypass RLS dans le backend.
    const internalUrl = Deno.env.get("INTERNAL_PIPELINE_URL");
    if (!internalUrl) {
      return new Response(
        JSON.stringify({
          error: "INTERNAL_PIPELINE_URL not set — V1 fallback expects pipeline call from Next.js route directly",
        }),
        { status: 501, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const resp = await fetch(`${internalUrl}/api/kairos/${kairos_id}/enrich-trigger`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-secret": Deno.env.get("INTERNAL_PIPELINE_SECRET") ?? "",
      },
      body: JSON.stringify({ user_id }),
    });
    const json = await resp.json();

    return new Response(JSON.stringify(json), {
      status: resp.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
