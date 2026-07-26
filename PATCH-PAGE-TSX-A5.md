# PATCH-PAGE-TSX-A5.md — demande à A8 (Dream App, `src/app/mvp/page.tsx`)

Territoire A4 (page.tsx) — je n'y touche pas. Une seule demande, Lot 4.

## Supprimer le bloc mort `PROTO_CATALOG` + son unique consommateur

**Fichier** : `src/app/mvp/page.tsx`
**Plage exacte** : lignes **1653 à 1904** (au moment de l'audit, 2026-07-26 — vérifier les
numéros de ligne au moment du patch si le fichier a bougé entre-temps, chercher les
marqueurs de commentaire ci-dessous, ils sont stables).

Contenu de la plage, du début à la fin :
- commentaires `/* ═════════ PROTOCOLE (honorer · re-entry) ═════════ */` et
  `/* ═════════ catalogue de protocoles (porté de v12 — sources Forêt) ═════════ */`
- `type PStep = …` et `type Proto = …`
- `const PROTO_CATALOG: Proto[] = [ … ]` (~71 lignes, 10 protocoles : Lightning Dreamwork,
  Dream Tending, Sidewalk Oracle, Reverie Tending, Hypnagogic Recall, Synchronicity Story,
  Focusing — Felt Sense, Pré-sommeil, Fin de Journée, Réentrée)
- `function ProtocolRunner({ … }) { … }` (~70 lignes)
- `function ProtocolScreen({ … }) { … }` (~105 lignes) — se termine juste avant le
  commentaire `/* ═════════ INTERPRÉTATION (+ mythe) ═════════ */`

**Preuve que c'est mort** : `grep -n "<ProtocolScreen" src/app/mvp/page.tsx` → **zéro
résultat**. `ProtocolScreen` est défini mais jamais instancié nulle part dans le fichier
(ni ailleurs — la fonction n'est pas exportée). `ProtocolRunner` n'est appelé que
*depuis l'intérieur* de `ProtocolScreen` (ligne 1883), donc il tombe avec lui.
`PROTO_CATALOG` n'est lu que par `ProtocolScreen` (ligne 1857).

Aucune route, aucun écran, aucun bouton du parcours actuel ne mène à `ProtocolScreen`.
Le vocabulaire (« protocole », catalogue figé de 10 pratiques nommées par auteur) est
d'ailleurs celui que la refonte MVP a explicitement remplacé par les 4 sorties
Comprendre/Créer/Partager/Garder (commentaire `§A4` ligne 1627, juste avant ce bloc).

**Action demandée** : supprimer les ~252 lignes en bloc. Rien d'autre dans le fichier n'en
dépend (vérifié par grep, aucune référence externe à `PROTO_CATALOG`, `ProtocolRunner`,
`ProtocolScreen`, `PStep`, `Proto` en dehors de cette plage).

**Vérification après suppression** : `npx tsc --noEmit -p tsconfig.json` doit rester à
zéro erreur (c'était déjà le cas avant patch, cf. `RAPPORT-A5.md` §Vérification).
