# DEPLOY — Dream

> Écrit le 26/07/2026, le jour où le projet est sorti d'iCloud et passé sous git.
> **Tout est prêt à coller.** Chaque bloc part de `~/Dev/dream-app`.
>
> 🔴 **« commité » ≠ « en ligne ».** Tant qu'un déploiement n'a pas rendu la main
> avec une URL, rien n'a changé pour personne.

---

## 0. Où vit le projet maintenant

| | |
|---|---|
| **Le dépôt** | `~/Dev/dream-app` — hors iCloud, sous git |
| L'ancien dossier | `…/claude-context/dream-alpha-app/` — **mort**, ne plus y travailler (voir son `_MOVED.md`) |
| Projet Vercel | `dream-alpha` · `prj_RpdXaghZBmXb5n8pZJlldA6rs7WN` · org `team_cLtVLN1yZ5xZTHTZkr3ohAuC` |
| URL prod | `dream-alpha-bice.vercel.app` |
| Remote git | `git@github.com:RaomTim/dream-app.git` *(le dépôt reste à créer — étape 1)* |

Le commit initial est **déjà fait**, sur la branche `main`, signé `INFUSE <gestion@infuse.earth>`.
Rien n'a été poussé : je n'ai pas de réseau vers GitHub.

---

## 1. Créer le dépôt GitHub et pousser

**Le dépôt doit être PRIVÉ** — il contient `1_BIBLE.md`, `2_DESIGN.md`, la vision, les audits.

### Voie A — tu as `gh` (une seule commande)

```bash
cd ~/Dev/dream-app
gh repo create RaomTim/dream-app --private --source=. --push
```

*(Si `gh` n'est pas installé : `brew install gh && gh auth login`.)*

### Voie B — par l'interface GitHub

1. https://github.com/new → propriétaire **RaomTim**, nom **dream-app**, **Private**.
2. **Ne coche rien** (pas de README, pas de .gitignore, pas de licence) — le dépôt local en a déjà.
3. Puis :

```bash
cd ~/Dev/dream-app
git push -u origin main
```

Le dépôt est déjà configuré avec ta clé (`core.sshCommand = ssh -i ~/.ssh/id_ed25519_infuse`),
la même que `infuse-2-site`. Rien à saisir.

### Vérifier que c'est parti

```bash
cd ~/Dev/dream-app && git status -sb | head -1
```
→ `## main...origin/main` **sans** `[ahead N]` = tout est en ligne.

---

## 2. Brancher Vercel sur GitHub

Une fois le dépôt poussé :

1. https://vercel.com → projet **dream-alpha** → **Settings** → **Git**
2. **Connect Git Repository** → GitHub → `RaomTim/dream-app`
3. Production Branch : **`main`**

### Ce que ça change pour toi, concrètement

| | Avant | Après |
|---|---|---|
| Déployer | tu tapes `npx vercel --prod --yes` depuis ton Mac | **`git push`** — et c'est tout |
| Ce qui est déployé | ce qu'il y a sur ton disque à cet instant | ce qui est **dans le commit** — donc traçable |
| Retour arrière | recopier un dossier de snapshot | `git revert` puis push, ou « Rollback » dans Vercel |
| Une branche de test | impossible | chaque branche poussée a **sa propre URL de preview**, sans toucher la prod |

**Tu ne tapes plus jamais `vercel --prod`.** Tu pousses, Vercel construit, Vercel déploie.
Si le build casse, il casse **chez Vercel** et la prod reste debout — c'est le vrai gain.

> ⚠️ Vérifie que les variables d'environnement sont bien dans Vercel (Settings → Environment
> Variables). `.env.local` **n'est pas** dans le dépôt — c'est voulu, mais Vercel doit avoir
> les mêmes valeurs de son côté, sinon le build passe et l'app ne répond plus.

---

## 3. Le premier déploiement de la journée

Le `npm ci` **n'est pas optionnel** la première fois : l'ancien `node_modules` était corrompu
par iCloud, et il n'a pas été recopié ici (il aurait fallu de toute façon le refaire).

```bash
cd ~/Dev/dream-app
rm -rf node_modules .next
npm ci
npx next build
```

Attendu : `✓ Compiled successfully`, puis la liste des routes, sans erreur.
*(Les lignes `Dynamic server usage` sur des routes `/api/…` sont normales : ce sont des routes
qui lisent les en-têtes, Next les marque « dynamiques » et continue.)*

Puis, selon l'étape 2 :

```bash
# Vercel branché sur GitHub (recommandé) :
git push

# ou, tant que ce n'est pas branché :
npx vercel --prod --yes
```

### Vérifier que le bon build est en ligne (10 s)

```bash
curl -s https://dream-alpha-bice.vercel.app/mvp | grep -o 'page-[a-f0-9]*\.js' | head -1
```
Note le hash, puis :
```bash
curl -s "https://dream-alpha-bice.vercel.app/_next/static/chunks/app/mvp/$(curl -s https://dream-alpha-bice.vercel.app/mvp | grep -o 'page-[a-f0-9]*\.js' | head -1)" | grep -c "whenTonight"
```
→ **1 ou plus = le build du 26/07 est en ligne** (le rêve à rebours en fait partie).
`0` = vieux build, le déploiement n'a pas pris.

---

## 4. Le test téléphone — 8 min, dans cet ordre

À faire **après** le déploiement. Avant, ces tests reproduisent le bug au lieu de le tester.

### A — l'enregistrement long (le cas exact du 26/07) · 2 min
1. Écran **Rêve**. Maintenir la lune, laisser tourner un podcast **10 minutes**, relâcher.
2. **Attendu** : « je l'écris… » puis le texte sur l'écran de vérification. Aucune erreur rouge.
   *(Avant : erreur, et le rêve n'existait plus nulle part.)*
3. Depuis le 26/07 il n'y a **plus de durée maximale** : une heure passe. Si tu veux le prouver,
   refais-le avec 30 min — c'est plus long à attendre qu'à tester.

### B — couper le wifi en plein vol · 1 min 30
1. Démarrer un enregistrement. Vers 1 min : **mode avion**. Parler 30 s. Relâcher.
2. **Attendu** : « Gardé sur le téléphone — il partira tout seul. »
3. Sur l'accueil, « 1 rêve en attente » est **cliquable** → **le lecteur audio joue ton rêve.**
4. Couper le mode avion → sous 30 s la ligne disparaît, le rêve apparaît dans le fil.

### C — tuer l'app en pleine transcription · 1 min
1. Enregistrer ~1 min, relâcher, et **pendant** « je l'écris… », fermer l'app de force.
2. Rouvrir : la ligne « en attente » est là, l'audio est réécoutable, la reprise se fait seule.

### D — le brouillon écrit · 30 s
1. **Tap court** sur la lune (mode écriture). Taper 3 lignes. **Ne pas déposer.**
2. Basculer d'app, fermer Dream de force, rouvrir. **Attendu** : le texte est toujours là.

### E — 🆕 le rêve à rebours · 1 min
1. Déposer un rêve (voix ou texte). Sur l'écran de relecture, une ligne : **« et c'était quand ? »**
   avec **« cette nuit » déjà sélectionné**.
2. Toucher **« la nuit d'avant »**, puis « c'est tout ».
3. Ouvrir le **Journal** : le rêve est daté **d'hier**, avec dessous, en tout petit,
   **« déposé le … »**.
4. **Le test qui compte** : ne rien toucher sur un autre rêve → il se comporte exactement
   comme avant. La fonction ne doit rien coûter à qui ne s'en sert pas.

### F — 🆕 la proposition de grand rêve · 1 min
1. Journal → sous « Liste | Univers », le lien **« les grands rêves »**.
2. S'il y a une proposition en attente, **un point doré** est collé au lien.
   *(Pas de chiffre : une invitation, pas une tâche.)*
3. Ouvrir : l'app propose des rêves **qui ressortent** — jamais « ce rêve est un grand rêve ».
   Trois réponses possibles : oui, non, ou ne rien faire.

### G — 🆕 l'écran « Rêve » renommé · 30 s
1. En bas, l'onglet 1 dit **« Rêve »** avec une lune côté nuit, **« Cœur »** avec un soleil
   côté jour. Il **nomme la face où tu te tiens**.
2. Sous le mot « rêve », une ligne : *« ou un signe, un frisson… »* — c'est la traîne.
   **Regarde-la sur ton téléphone** : si elle bavarde, on la coupe en une clé (question Q1 de B5).
3. Le mot « **l'orbe** » ne doit plus apparaître nulle part à l'écran.

### H — 🆕 récit et lecture, sur la fiche d'un rêve · 30 s
1. Ouvrir un rêve où tu as commenté en dictant (« … enfin je crois que ça veut dire… »).
2. Le passage porte un **liseré doré à gauche** — le texte n'est ni coupé ni déplacé.
3. Sous le texte : *« ce que tu en dis toi-même… »* + **[ c'est juste ]** / **[ tout est le rêve ]**.
   Un **tap sur un passage teinté** le rend au récit. ~10 % de faux positifs mesurés :
   c'est prévu, ça se corrige d'un doigt.

---

## 5. La règle anti-collision — maintenant que c'est sous git

**Une branche par chat, partie de `main`.** Jamais deux chats sur la même branche,
jamais deux chats dans le même dossier de travail.

```bash
# ouvrir un chantier
cd ~/Dev/dream-app
git checkout main && git pull
git checkout -b yeshua/<sujet>

# le livrer
git push -u origin yeshua/<sujet>
```

- **Dans Claude Code** : toujours un **worktree isolé**, jamais le dossier partagé —
  c'est ça qui empêche un autre chat de te écraser.
  ```bash
  git worktree add ../wt-<sujet> -b yeshua/<sujet> origin/main
  ```
- **Dans Cowork** : branches / commits / PR via le connecteur **GitHub MCP**, côté serveur —
  ça ne touche rien en local, donc zéro collision. Mais Cowork ne peut **pas** builder,
  tester ni lancer le serveur : dès qu'il faut faire TOURNER quelque chose → **Claude Code**.
- **Un fichier partagé** (layout, provider, `page.tsx`, `CLAUDE.md`) → prévenir avant d'éditer.
  C'est exactement ce qui a coûté la journée du 26/07 : cinq agents, un seul `page.tsx`.

---

## 6. Si ça tourne mal

Maintenant que c'est sous git, le retour arrière est une commande, plus un dossier à recopier :

```bash
cd ~/Dev/dream-app
git log --oneline -10        # trouver le dernier commit sain
git revert <hash>            # défaire proprement, en gardant l'histoire
git push
```

⚠️ **Un retour arrière sur le code ne défait pas les migrations SQL.** Celles du 26/07 sont
additives et sans destruction (nouvelles colonnes, table `capture_audio`, policies Storage,
RPC réécrites) — mais les RPC de résonance, elles, ont changé de comportement. Si tu reviens
en arrière sur le code, dis-le-moi.

L'ancien dossier iCloud reste intact tant que tu ne l'archives pas toi-même :
`…/claude-context/dream-alpha-app/`, avec `_snapshot_pre_fleet_2026-07-26/src/` dedans.
