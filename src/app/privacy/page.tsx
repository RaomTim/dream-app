/**
 * Politique de confidentialité — Dream
 * URL : https://dream-alpha-bice.vercel.app/privacy
 * Required by : Google Play Console + Apple App Store + RGPD
 * Last updated : 2026-05-15
 */
export const metadata = {
  title: 'Politique de confidentialité — Dream',
  description: 'Politique de confidentialité de Dream — application de journal onirique INFUSE.',
};

export default function PrivacyPage() {
  return (
    <main style={{
      maxWidth: 760,
      margin: '0 auto',
      padding: '60px 24px 120px',
      fontFamily: 'Georgia, serif',
      lineHeight: 1.7,
      color: '#2a2520',
      background: '#faf6f0',
      minHeight: '100vh',
    }}>
      <h1 style={{ fontSize: 32, marginBottom: 8, fontStyle: 'italic' }}>Politique de confidentialité</h1>
      <p style={{ opacity: 0.6, fontSize: 14, marginBottom: 40 }}>
        Dernière mise à jour : 15 mai 2026 · Version 1.0
      </p>

      <p style={{ marginBottom: 24 }}>
        Dream est une application de journal onirique développée par <strong>INFUSE</strong>{' '}
        (Christophe Cardona, France · DUNS 282628520). Elle te permet de déposer tes rêves,
        intuitions et signes du quotidien, et d&apos;être accompagné·e par une présence d&apos;écoute
        nommée Anima.
      </p>

      <p style={{ marginBottom: 32 }}>
        Cette politique explique ce que nous collectons, pourquoi, comment nous le protégeons,
        et comment tu peux contrôler tes données.
      </p>

      <h2 style={{ fontSize: 22, marginTop: 32, marginBottom: 12 }}>1. Données collectées</h2>
      <ul style={{ marginBottom: 24, paddingLeft: 24 }}>
        <li><strong>Identifiants</strong> : ton adresse email (pour l&apos;authentification par lien magique)</li>
        <li><strong>Contenu utilisateur</strong> : rêves, kairos, dépôts texte et vocaux que tu choisis d&apos;enregistrer</li>
        <li><strong>Audio</strong> : enregistrements vocaux temporaires pour transcription via Whisper (OpenAI), supprimés immédiatement après transcription</li>
        <li><strong>Métadonnées</strong> : date et heure de dépôt, fuseau horaire (pour le mode atmosphérique), région optionnelle (Bachelard regions)</li>
      </ul>
      <p style={{ marginBottom: 24 }}>
        Nous ne collectons <strong>aucune donnée publicitaire</strong>, aucun identifiant
        d&apos;appareil persistant, aucune position GPS, aucun contact, aucune photo.
      </p>

      <h2 style={{ fontSize: 22, marginTop: 32, marginBottom: 12 }}>2. Pourquoi</h2>
      <ul style={{ marginBottom: 24, paddingLeft: 24 }}>
        <li>Te permettre de relire ton journal, voir des motifs récurrents, recevoir des échos prophétiques personnels</li>
        <li>Permettre à Anima (assistant IA) de te répondre dans le contexte de tes propres dépôts</li>
        <li>Détecter automatiquement des signes de détresse pour proposer des ressources de soutien (3114 prévention suicide, SOS Amitié, etc.)</li>
      </ul>

      <h2 style={{ fontSize: 22, marginTop: 32, marginBottom: 12 }}>3. Partage avec des tiers</h2>
      <p style={{ marginBottom: 16 }}>
        Tes données ne sont <strong>jamais vendues</strong>. Elles transitent uniquement par les
        prestataires techniques nécessaires au fonctionnement de l&apos;app :
      </p>
      <ul style={{ marginBottom: 24, paddingLeft: 24 }}>
        <li><strong>Supabase</strong> (hébergement base de données + authentification, UE)</li>
        <li><strong>Vercel</strong> (hébergement web, US/UE)</li>
        <li><strong>Anthropic Claude</strong> (génération de réponses Anima)</li>
        <li><strong>OpenAI Whisper</strong> (transcription vocale uniquement, audio supprimé après usage)</li>
      </ul>
      <p style={{ marginBottom: 24 }}>
        Aucun de ces prestataires n&apos;utilise tes contenus pour entraîner ses modèles.
      </p>

      <h2 style={{ fontSize: 22, marginTop: 32, marginBottom: 12 }}>4. Sécurité</h2>
      <p style={{ marginBottom: 16 }}>
        Tes données sont chiffrées en transit (HTTPS/TLS) et au repos (Supabase encryption).
        L&apos;accès est protégé par Row-Level Security (RLS) Supabase : seul·e toi peux lire
        et écrire tes propres dépôts.
      </p>
      <p style={{ marginBottom: 24 }}>
        Aucune publicité, aucun tracking analytics tiers (pas de Google Analytics,
        pas de Facebook Pixel, pas de Mixpanel).
      </p>

      <h2 style={{ fontSize: 22, marginTop: 32, marginBottom: 12 }}>5. Tes droits (RGPD)</h2>
      <ul style={{ marginBottom: 24, paddingLeft: 24 }}>
        <li><strong>Accès</strong> : tu peux exporter toutes tes données à tout moment depuis l&apos;app (Paramètres → Exporter mes données)</li>
        <li><strong>Suppression</strong> : tu peux supprimer ton compte et toutes tes données via{' '}
          <a href="/data-deletion" style={{ color: '#5a3a2a' }}>cette page</a> ou en écrivant à{' '}
          <a href="mailto:gestion@infuse.earth" style={{ color: '#5a3a2a' }}>gestion@infuse.earth</a>
        </li>
        <li><strong>Rectification</strong> : tu peux modifier ou supprimer chaque dépôt individuellement dans l&apos;app</li>
        <li><strong>Portabilité</strong> : export JSON disponible à la demande</li>
      </ul>

      <h2 style={{ fontSize: 22, marginTop: 32, marginBottom: 12 }}>6. Mineurs</h2>
      <p style={{ marginBottom: 24 }}>
        Dream est destiné aux personnes de <strong>18 ans et plus</strong>. Nous ne collectons
        pas sciemment de données de mineurs. Si tu penses qu&apos;un·e mineur·e a créé un compte,
        contacte-nous : <a href="mailto:gestion@infuse.earth" style={{ color: '#5a3a2a' }}>gestion@infuse.earth</a>.
      </p>

      <h2 style={{ fontSize: 22, marginTop: 32, marginBottom: 12 }}>7. Conservation</h2>
      <p style={{ marginBottom: 24 }}>
        Tes données sont conservées tant que ton compte est actif. Si tu n&apos;ouvres pas
        l&apos;app pendant 24 mois consécutifs, nous t&apos;envoyons un email avant suppression
        automatique. Tu peux aussi demander suppression immédiate à tout moment.
      </p>

      <h2 style={{ fontSize: 22, marginTop: 32, marginBottom: 12 }}>8. Contact</h2>
      <p style={{ marginBottom: 24 }}>
        Pour toute question sur tes données, ou pour exercer tes droits :<br />
        Email : <a href="mailto:gestion@infuse.earth" style={{ color: '#5a3a2a' }}>gestion@infuse.earth</a><br />
        Responsable du traitement : Christophe Cardona, INFUSE — France
      </p>

      <h2 style={{ fontSize: 22, marginTop: 32, marginBottom: 12 }}>9. Modifications</h2>
      <p style={{ marginBottom: 24 }}>
        Cette politique peut évoluer. Toute modification importante te sera notifiée par email
        et affichée dans l&apos;app au moins 30 jours avant son entrée en vigueur.
      </p>

      <hr style={{ margin: '48px 0 24px', border: 'none', borderTop: '1px solid #d8cfc0' }} />
      <p style={{ fontSize: 13, opacity: 0.6, fontStyle: 'italic' }}>
        Dream — INFUSE · application de journal onirique<br />
        version 0.1.0-alpha · Dernière révision : 15 mai 2026
      </p>
    </main>
  );
}
