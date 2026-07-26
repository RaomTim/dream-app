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
  themeColor: '#1a1310',
}

export default function MvpLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Fonts chargées au runtime (pas next/font : build sandbox sans réseau) */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300..600;1,300..600&family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <div style={{ minHeight: '100dvh', background: '#160d0a' }}>{children}</div>
      {/* Offline-first : enregistre le SW (precache shell) + auto-flush de la file de dépôts. */}
      <ServiceWorkerRegister />
    </>
  )
}
