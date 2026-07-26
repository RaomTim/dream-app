import type { Metadata, Viewport } from 'next'
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister'

export const metadata: Metadata = {
  title: 'Dream',
  description: 'Dépose un rêve. Tu seras le premier à le comprendre.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#221d29',
}

export default function MvpLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Fonts chargées au runtime (pas next/font : build sandbox sans réseau).
          ⚠️ 2026-07-26 — CE BLOC MENTAIT. Il chargeait Fraunces + Inter, alors que
          `dream-design.ts` déclarait « EB Garamond » : la police déclarée n'était
          JAMAIS téléchargée, et tout le serif de l'app retombait sur Georgia.
          L'étalon « nuit bleue vivante » nomme ses trois familles, une par
          fonction — on charge exactement celles-là, et rien d'autre :
            · Cormorant Garamond 300 → les titres et le mot (27–44px)
            · Newsreader 400 (+ italique) → le corps long, 16,5–19px / 1.618
            · Hanken Grotesk 400–700 → toute l'UI (11–17px)
          `T.mono` retombe volontairement sur la mono système : aucun écran ne
          l'utilise plus pour du texte lisible depuis le passage des intertitres
          en Hanken. */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Hanken+Grotesk:wght@400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,300..600;1,6..72,300..600&display=swap"
        rel="stylesheet"
      />
      <div style={{ minHeight: '100dvh', background: '#191521' }}>{children}</div>
      {/* Offline-first : enregistre le SW (precache shell) + auto-flush de la file de dépôts. */}
      <ServiceWorkerRegister />
    </>
  )
}
