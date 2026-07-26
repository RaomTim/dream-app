# OTP Migration — Magic Link → Code 6 chiffres

**Date** : 2026-05-16
**Contexte** : L'app Android (Capacitor WebView) ne peut pas intercepter les magic links qui s'ouvrent dans le browser système. Solution : OTP code 6 chiffres entré directement dans l'app.

---

## Étape 1 — Deploy du code

```bash
cd /Users/timote/Desktop/eBOOKS/CLAUDE\ CONTEXTE/claude-context/dream-alpha-app
npx vercel --prod
```

Fichier modifié : `public/v8/dream-api-bridge.js`

---

## Étape 2 — Modifier le template email Supabase (CRITIQUE)

Sans cette étape, l'email contiendra encore un magic link. L'email DOIT contenir le code `{{ .Token }}`.

1. Aller sur [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Ouvrir ton projet Dream
3. Aller dans **Authentication → Email Templates**
4. Cliquer sur **"Magic Link"**
5. Remplacer le contenu du template par :

```html
<h2>Ton code Dream</h2>

<p>Entre ce code dans l'app pour accéder à tes rêves :</p>

<p style="font-size: 36px; font-weight: bold; letter-spacing: 0.2em; text-align: center;">
  {{ .Token }}
</p>

<p style="color: #888; font-size: 13px;">
  Ce code expire dans 1 heure. Si tu n'as pas demandé ce code, ignore cet email.
</p>
```

**Clé** : `{{ .Token }}` = le code 6 chiffres. `{{ .ConfirmationURL }}` = l'ancien magic link. Ne pas mettre `{{ .ConfirmationURL }}` dans le template (ou le mettre en bas en fallback discret si tu veux garder une porte de sortie browser).

6. Cliquer **Save**

---

## Étape 3 — Test sur Android

1. Ouvrir l'app native Dream sur Android
2. Sur l'écran auth : entrer ton email → cliquer **"recevoir le code"**
3. Ouvrir l'email reçu → noter le code 6 chiffres (ex: `482931`)
4. Revenir dans l'app (PAS dans le browser) → entrer le code dans le champ doré
5. Cliquer **"valider le code"** (ou laisser l'auto-verify dès que 6 digits sont tapés)
6. Vérifier : l'overlay auth disparaît, l'app Dream s'ouvre en mode connecté

---

## Comportement UI

- **Étape 1** : input email + bouton "recevoir le code"
- **Après envoi** : transition vers étape 2 — input 6 digits (style monospace doré) + bouton "valider le code" + bouton "renvoyer le code" (cooldown 30s)
- **Auto-verify** : si l'user colle 6 chiffres d'un coup, la vérification se lance automatiquement
- **En cas d'erreur** : message d'erreur Supabase affiché en italique, champ réinitialisé

---

## Backward compat

Si le template Supabase n'est **pas encore mis à jour** (étape 2 pas faite) :
- L'email contiendra encore un magic link
- L'user ne verra pas de code 6 chiffres dans l'email
- L'user peut cliquer le lien dans son browser (qui ouvre dans le browser système = même problème qu'avant)
- Solution : faire l'étape 2 dès que le code est déployé

---

## Debug

```
# Dans la console browser/WebView — vérifier que la session est établie après OTP
window.DreamSupabase.auth.getSession().then(r => console.log(r.data.session))
```

Si `session` est null après verify → vérifier que `{{ .Token }}` est bien dans le template Supabase.
