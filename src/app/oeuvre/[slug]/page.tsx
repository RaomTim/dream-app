import { createServerClient } from '@/lib/supabase'

/**
 * /oeuvre/[slug] — page publique d'une œuvre de la Forge (si is_public).
 * Server component, zéro auth : seul ce que le rêveur a choisi de partager.
 * Yeshua, 2026-06-11 (Vague B).
 */
export const dynamic = 'force-dynamic'

export default async function OeuvrePage({ params }: { params: { slug: string } }) {
  const supabase = createServerClient()
  const { data: w } = await supabase
    .from('forge_works')
    .select('kind, vision_title, vision_brief, asset_url, is_public, created_at')
    .eq('share_slug', params.slug)
    .maybeSingle()

  const S = {
    page: { minHeight: '100dvh', background: 'linear-gradient(180deg, #1a1310 0%, #241712 38%, #2c1810 68%, #160d0a 100%)', fontFamily: '"Inter", system-ui, sans-serif', color: '#f3e6d4', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', padding: '48px 20px 60px' },
    serif: { fontFamily: '"Fraunces", Georgia, serif', fontStyle: 'italic' as const },
  }

  if (!w || !w.is_public) {
    return (
      <div style={S.page}>
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300..500;1,300..500&family=Inter:wght@400;500&display=swap" rel="stylesheet" />
        <div style={{ ...S.serif, fontSize: 24, color: '#fbeeda', marginTop: 80, textAlign: 'center' }}>cette œuvre dort,<br />ou n&apos;a pas choisi d&apos;être vue.</div>
        <a href="/mvp" style={{ marginTop: 30, color: '#e8a865', fontSize: 14 }}>entrer dans Dream →</a>
      </div>
    )
  }

  return (
    <div style={S.page}>
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300..500;1,300..500&family=Inter:wght@400;500&display=swap" rel="stylesheet" />
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: '#e8a865' }}>
        {w.kind === 'image' ? 'image rêvée' : w.kind === 'game' ? 'monde jouable' : 'vision en mouvement'} · forgée d&apos;un rêve réel
      </div>
      <h1 style={{ ...S.serif, fontWeight: 400, fontSize: 30, color: '#fbeeda', margin: '14px 0 6px', textAlign: 'center' }}>{w.vision_title || 'œuvre du rêve'}</h1>
      {w.vision_brief && <p style={{ ...S.serif, fontSize: 15, color: 'rgba(243,230,212,0.65)', maxWidth: 480, textAlign: 'center', lineHeight: 1.55, margin: '0 0 26px' }}>{w.vision_brief}</p>}
      {w.kind === 'image' && w.asset_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={w.asset_url} alt={w.vision_title || 'image du rêve'} style={{ width: '100%', maxWidth: 560, borderRadius: 22, border: '1px solid rgba(232,168,101,0.35)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }} />
      )}
      {w.kind === 'game' && w.asset_url && (
        <>
          <iframe src={w.asset_url} title={w.vision_title || 'monde jouable'} style={{ width: '100%', maxWidth: 420, height: 620, border: '1px solid rgba(232,168,101,0.35)', borderRadius: 22, background: '#160d0a' }} sandbox="allow-scripts" />
          <a href={w.asset_url} target="_blank" rel="noreferrer" style={{ marginTop: 14, color: '#e8a865', fontSize: 13 }}>ouvrir en plein écran →</a>
        </>
      )}
      <a href="/mvp" style={{ marginTop: 38, padding: '13px 30px', borderRadius: 999, background: 'linear-gradient(180deg, #fbeeda, #ecd4b4)', color: '#2a160e', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
        déposer mon propre rêve
      </a>
      <div style={{ marginTop: 14, fontSize: 12, color: 'rgba(243,230,212,0.4)' }}>Dream — chaque rêve devient un monde</div>
    </div>
  )
}
