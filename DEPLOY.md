# Dream Alpha — Guide de déploiement rapide

## 1. Supabase (gratuit)

1. Crée un projet sur [supabase.com](https://supabase.com)
2. Va dans SQL Editor → colle le contenu de `supabase-schema.sql` → Run
3. Récupère tes clés dans Settings → API :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

## 2. Clés API

- **Anthropic** : [console.anthropic.com](https://console.anthropic.com) → crée une API key
- **OpenAI** (pour Whisper) : [platform.openai.com](https://platform.openai.com) → crée une API key

## 3. Vercel (déploiement)

```bash
# Option A : depuis GitHub
# Push le repo sur GitHub, connecte-le dans vercel.com

# Option B : Vercel CLI
npm i -g vercel
cd dream-alpha-app
vercel
```

Dans Vercel → Settings → Environment Variables, ajoute :

```
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXTAUTH_SECRET=une-chaine-random-longue
```

## 4. PWA sur iPhone

1. Ouvre l'URL Vercel dans Safari sur ton iPhone
2. Tap le bouton partage (carré avec flèche)
3. "Sur l'écran d'accueil"
4. L'app apparaît comme une vraie app — plein écran, pas de barre Safari

## 5. Dev local (optionnel)

```bash
cp .env.example .env.local
# Remplis les clés dans .env.local
npm install
npm run dev
# → http://localhost:3000
```

## Coûts estimés

| Service | Coût |
|---------|------|
| Supabase Free | 0€ |
| Vercel Free | 0€ |
| Anthropic API (Haiku+Sonnet) | ~5-15€/mois |
| OpenAI Whisper | ~0.006€/min |
| **Total solo** | **~10-20€/mois** |
