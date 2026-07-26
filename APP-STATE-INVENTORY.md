# Dream App — Inventaire d'état (audit 2026-04-20)

---

## CRITIQUE — Lire en premier

### TOP 3 BUGS BLOQUANTS

**BUG-1 : Échos — explosion combinatoire sans dédup visuel**
- `/api/echoes` parcourt 50 entrées récentes × 10 matches chacune = jusqu'à 500 paires potentielles avant dédup.
- La fonction `deduplicateEchoes` déduplique les paires A↔B, mais **pas les paires qui partagent le même `sourceId`** côté UI. Si "Jade prédit l'effondrement crypto" a 10 matchs vectoriels distincts, les 10 cartes s'affichent — toutes avec `sourceTitle` identique (le même rêve), des `strength` proches → impression de doublons 67% partout. Ce n'est pas un bug de dédup de paire, c'est un manque de **regroupement par sourceId** dans la vue DreamSync.
- Fichiers : `src/app/api/echoes/route.ts` l.365-374, `src/components/dream/screens/DreamSync.tsx` l.75-78
- Impact : UX brisée pour les utilisateurs avec plus de 20 rêves.

**BUG-2 : Collectif — expose TOUS les rêves de TOUS les users sans vérification opt-in**
- `/api/dreams/collective` requiert seulement un `userId` (facilement spoofable côté client — aucun cookie de session validé). Il renvoie `soul_wish` (textes personnels) de rêveurs aléatoires, leurs `figure_types`, `mood`, `archetypal_process`, aucun opt-in L1/L2/L3 vérifié.
- Le TODO dans le code (ligne 48) l'indique explicitement : `TODO (P0 structurel) : remplacer par session cookie Supabase + vérifier que l'user a opt-in L1/L2/L3`.
- Fichier : `src/app/api/dreams/collective/route.ts` l.44-52
- Impact : **brèche de confidentialité P0**. Toutes les données personnelles de tous les rêveurs sont accessibles à n'importe qui avec un userId valide.

**BUG-3 : Conte — dépend de la table `tales` qui peut être vide**
- `/api/tales/match` interroge `supabase.from('tales').select('*').eq('ethics_flag', 'open')`. Si la table `tales` est vide ou non-peuplée, il retourne `{ tales: [], message: 'No tales in database' }` silencieusement.
- Côté UI (dans `DreamDetail`), quand `matchedTales` est vide après la requête, un état vide générique s'affiche — l'user ne sait pas si c'est un manque de données ou si le système a cherché.
- Plus critique : **aucun pipeline de peuplement de la table `tales` n'est visible dans ce repo**. La table pourrait être complètement vide en prod. Le matching est architecturalement correct (score-based, pas de génération IA, conforme à la règle Tim), mais inutilisable sans données.
- Fichier : `src/app/api/tales/match/route.ts` l.48-55

---

### TOP 3 MYSTÈRES UX

**MYSTÈRE-1 : "Figures" dans la nav du bas — ce sont des MOTS FLOTTANTS, pas des personnages**
- L'onglet "Figures" du BottomNav ouvre `DreamPattern` (écran `pattern`), qui affiche un **nuage de mots** (word cloud) positionnés aléatoirement sur l'écran. Les "mots" sont les noms des figures extraites des rêves (ex: "la mère", "l'inconnu", "le loup"). Ils "flottent" dans un espace 2D avec des positions fixes `CLOUD_POSITIONS[]`. C'est pour ça que Tim voit "des mots flottants" — c'est le design voulu. Cliquer sur un mot → liste des rêves où cette figure apparaît (`figure-dreams` screen).
- Ce n'est pas un bug. Mais l'UX n'explique pas à l'user ce qu'il regarde.

**MYSTÈRE-2 : Oracle (tirages) — pas d'écran dédié, c'est le chat en mode oracle**
- Il n'existe pas d'écran "Oracle" avec des cartes visuelles à tirer. L'"oracle" est le mode de chat Claude où l'user pose une question et reçoit une réponse. L'entrée se fait via `DreamCapture` → destination `oracle` → ouvre `DreamChat` en `mode='oracle'`. Il n'y a pas de tirage, pas de carte, pas de système symbolique visuel — c'est un chat habillé en oracle.

**MYSTÈRE-3 : Réentrée — accessible uniquement depuis la vue DreamDetail d'un rêve existant**
- La Réentrée Moss n'a pas d'entrée depuis la home ou la nav. Elle n'est accessible que via le bouton dans `DreamDetail` → `onOpenReentry`. Si l'user veut faire une réentrée, il doit : ouvrir le journal → cliquer sur un rêve → trouver le bouton réentrée. Le panneau dans la home (`onOpenReentry={() => setScreen('journal')}`) redirige vers le journal, pas directement vers une réentrée.

---

## INVENTAIRE PAR ESPACE

| Espace | Screen file | API route | État | Utilité (1 phrase) | Issues connues | What next |
|--------|-------------|-----------|------|-------------------|----------------|-----------|
| **Oracle** (tirages & signes) | Pas de screen dédié — c'est `DreamChat` en mode `oracle` | `/api/chat` (mode=oracle) | **PARTIAL** | Tu poses une question au chat qui répond comme un oracle en absorbant la Forêt | Pas de tirage visuel, pas de carte, juste du chat — UX oracle non distincte | Créer un OracleScreen avec UI de tirage si l'intention est des cartes |
| **Conte** (conte-miroir) | Pas de screen dédié — s'ouvre via `DreamDetail.onOpenTale` → `DreamChat` mode=tale | `/api/tales/match` (POST depuis DreamDetail) + `/api/chat` mode=tale | **PARTIAL** | Matche un rêve à des contes réels stockés en DB (score par motifs/structure/figures) — JAMAIS de génération IA (conforme règle Tim) | Table `tales` probablement vide en prod — sans données aucun conte n'est retourné | Vérifier et peupler la table `tales` avec de vrais contes (ethics_flag='open') |
| **Réentrée** (dream re-entry Moss) | `ProtocolGuide` avec `REENTRY_PROTOCOL` (screen=`protocol-reentry`) | `/api/chat` mode=reentry + `/api/dreams` POST | **LIVE** | Guide l'user en 5 étapes pour replonger dans un rêve ancien (Moss/Gendlin) et génère une entrée type 'reentry' | Accessible uniquement depuis DreamDetail d'un rêve existant — pas d'entrée directe | Ajouter un accès depuis la home ou la nav |
| **Cercles** | `CirclesScreen.tsx` | `/api/circles` GET+POST, `/api/circles/[id]/sessions`, `/api/circles/[id]/share`, `/api/circles/[id]/resonances`, `/api/circles/join` | **LIVE** | Groupes de rêveurs qui partagent des rêves et voient leurs figures/thèmes communs via l'IA | Résonances dépendent que les membres aient des rêves avec `figure_types` extrait (pipeline requis) | LIVE, mais adopter sans users actifs dans un cercle = vide |
| **Corps** (Oracle du Corps) | `OracleCorpsScreen.tsx` | `/api/oracle-corps` GET | **PARTIAL** | Carte corporelle interactive qui montre quelles zones du corps reviennent dans tes rêves (Mindell dreambody) | Dépend des colonnes `somatic_location` et `body_symbolism` — si le pipeline extract-deep ne tourne pas, l'écran est vide | Vérifier que `extract-deep` peuple ces colonnes en prod |
| **Ligne de vie** | `LifelineScreen.tsx` | `/api/dreams/lifeline` GET | **LIVE** | Timeline chronologique de tous tes rêves avec figures récurrentes, grands rêves (numinosité), échos prophétiques confirmés et engagements honorés | Vide si peu de rêves ou si `figure_types`/`numinosity` non renseignés par le pipeline | LIVE, mais utile seulement avec 10+ rêves traités |
| **Collectif** | `CollectiveScreen.tsx` | `/api/dreams/collective` GET | **BROKEN** | Detecteur d'inconscient collectif — montre les figures/thèmes convergents entre tous les rêveurs | Brèche confidentialité P0 (aucun opt-in vérifié, soul_wish exposés), userId spoofable côté client | Bloquer derrière session cookie Supabase + opt-in L3 avant d'utiliser en prod |
| **Échos** | `DreamSync.tsx` | `/api/echoes` GET | **PARTIAL** | Détecte les rêves qui résonnent avec tes journaux de jour (prophétique) et les rêves entre eux (vectoriel pgvector) | Bug UX : même rêve source peut apparaître N fois sous des "cartes" différentes — look de doublons. Dépend que les embeddings soient générés (pipeline `/api/dreams/embed`) | Regrouper les cartes par `sourceId` + afficher "N correspondances" plutôt que N cartes distinctes |
| **Figures** | `DreamPattern.tsx` (nuage de mots) + `figure-dreams` screen (liste des rêves par figure) | `/api/figures` GET | **LIVE** | Nuage de mots des figures extraites de tes rêves, cliquable — chaque mot = une présence récurrente, cliquer = voir les rêves où elle apparaît | Vide si `figure_types` non renseigné (pipeline extract-deep requis). Le word cloud peut se superposer sur mobile pour beaucoup de figures | LIVE si pipeline tourne |

---

## ESPACES PLANIFIÉS MAIS PAS CODÉS

Aucun espace n'est complètement fictif/inexistant côté code — tous ont un screen et une API. Mais :

- **Oracle tirages visuels** : l'intention design originale d'un système de cartes à tirer n'est pas implémentée. Ce qui existe = chat en mode oracle.
- **Conte** : architecturalement correct, mais **inutilisable sans données** dans la table `tales`. C'est un STUB fonctionnel en attente de contenu.

---

## ÉTAT PAR DÉPENDANCE CRITIQUE

| Dépendance | Requise par | État estimé |
|------------|-------------|-------------|
| Pipeline embedding `/api/dreams/embed` | Échos (vectoriel), Similar | Déployé mais doit tourner sur chaque rêve |
| Pipeline extract `/api/dreams/extract` | Figures (basique), Conte (tags) | Tourne en fire-and-forget à chaque capture |
| Pipeline extract-deep `/api/dreams/extract-deep` | Corps (somatic_location), Figures (figure_types complets), Ligne de vie | État inconnu — à vérifier en prod |
| Table `tales` peuplée | Conte | Probablement vide — audit DB requis |
| Table `circles` + `circle_members` | Cercles | Schema déployé (inference code) |
| Table `master_events` | Collectif (historique) | Schema déployé (code écrit dedans) |
| RPC `find_dream_echoes` | Échos (Phase 1 vectorielle) | Marqué SHIPPÉ dans DREAM-CHANTIERS-AVRIL-MAI.md |
| RPC `find_similar_dreams` | Similar dreams (DreamDetail) | Incertain — fallback tag-matching si absent |
| Opt-in L1/L2/L3 users | Collectif (confidentialité) | NON IMPLÉMENTÉ — P0 avant mise en prod |

---

*Généré par audit code — 2026-04-20*
