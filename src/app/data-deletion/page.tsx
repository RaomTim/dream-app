/**
 * Suppression de compte / données — Dream
 * URL : https://dream-alpha-bice.vercel.app/data-deletion
 * Required by : Google Play Console (Account deletion link)
 */
export const metadata = {
  title: 'Supprimer mon compte — Dream',
  description: 'Comment supprimer ton compte et toutes tes données Dream.',
};

export default function DataDeletionPage() {
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
      <h1 style={{ fontSize: 32, marginBottom: 8, fontStyle: 'italic' }}>Supprimer mon compte</h1>
      <p style={{ opacity: 0.6, fontSize: 14, marginBottom: 40 }}>Dernière mise à jour : 15 mai 2026</p>

      <p style={{ marginBottom: 24 }}>
        Tu peux supprimer ton compte Dream et <strong>toutes tes données associées</strong> à
        tout moment, sans justification.
      </p>

      <h2 style={{ fontSize: 22, marginTop: 32, marginBottom: 12 }}>Méthode 1 — Depuis l&apos;application</h2>
      <p style={{ marginBottom: 24 }}>
        (à venir dans la prochaine version) Paramètres → Compte → Supprimer mon compte.
      </p>

      <h2 style={{ fontSize: 22, marginTop: 32, marginBottom: 12 }}>Méthode 2 — Par email</h2>
      <p style={{ marginBottom: 16 }}>
        Envoie un email à <a href="mailto:gestion@infuse.earth?subject=Suppression%20compte%20Dream" style={{ color: '#5a3a2a' }}>gestion@infuse.earth</a> avec :
      </p>
      <ul style={{ marginBottom: 24, paddingLeft: 24 }}>
        <li>Sujet : <code>Suppression compte Dream</code></li>
        <li>L&apos;email associé à ton compte Dream</li>
      </ul>
      <p style={{ marginBottom: 24 }}>
        Ta demande sera traitée sous 7 jours ouvrés. Tu recevras un email de confirmation
        une fois la suppression effective.
      </p>

      <h2 style={{ fontSize: 22, marginTop: 32, marginBottom: 12 }}>Ce qui est supprimé</h2>
      <ul style={{ marginBottom: 24, paddingLeft: 24 }}>
        <li>Ton profil et identifiant compte</li>
        <li>Tous tes kairos (rêves, intuitions, signes, dépôts texte/voix)</li>
        <li>Toutes tes conversations avec Anima</li>
        <li>Tous tes marqueurs corporels (Oracle du Corps)</li>
        <li>Toutes tes participations à des cercles (anonymisées dans les cercles partagés)</li>
        <li>Toutes les analyses générées (portraits, échos prophétiques, motifs détectés)</li>
      </ul>

      <h2 style={{ fontSize: 22, marginTop: 32, marginBottom: 12 }}>Ce qui peut subsister (jusqu&apos;à 30 jours)</h2>
      <ul style={{ marginBottom: 24, paddingLeft: 24 }}>
        <li>Logs techniques anonymisés (pour conformité légale et sécurité)</li>
        <li>Backups Supabase avant suppression complète automatique</li>
      </ul>

      <h2 style={{ fontSize: 22, marginTop: 32, marginBottom: 12 }}>Contact</h2>
      <p style={{ marginBottom: 24 }}>
        Pour toute question : <a href="mailto:gestion@infuse.earth" style={{ color: '#5a3a2a' }}>gestion@infuse.earth</a>
      </p>

      <hr style={{ margin: '48px 0 24px', border: 'none', borderTop: '1px solid #d8cfc0' }} />
      <p style={{ fontSize: 13, opacity: 0.6, fontStyle: 'italic' }}>
        Dream — INFUSE · <a href="/privacy" style={{ color: '#5a3a2a' }}>Politique de confidentialité</a>
      </p>
    </main>
  );
}
