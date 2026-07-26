# PATCH `src/app/mvp/page.tsx` — demandé par l'agent A2 (résonances)

> A4 est propriétaire de `page.tsx`. Un seul changement est nécessaire, une ligne.
> Ancré sur du contexte de code stable (le prop `emptyHint` de `<ResonanceSection>`),
> pas sur un numéro de ligne — A4 restructure le fichier en parallèle.

---

## Le changement

**Chercher** l'unique occurrence de `<ResonanceSection` (composant importé ligne ~17,
rendu dans `ReadScreen`, dans le `<div ref={resonanceRef}>`) :

```tsx
<ResonanceSection session={session} kairosId={kairosId} kairosType={k?.kairos_type} onOpenDream={onOpenDream} emptyHint={k?.kairos_type === 'note_jour'} />
```

**Remplacer** la valeur de `emptyHint` — et elle seule — par `true` :

```tsx
<ResonanceSection session={session} kairosId={kairosId} kairosType={k?.kairos_type} onOpenDream={onOpenDream} emptyHint />
```

Rien d'autre ne bouge. Aucun autre appel de `ResonanceSection` n'existe dans le fichier.

---

## Pourquoi

`emptyHint={false}` fait que `ResonanceSection` **retourne `null`** quand rien ne
résonne (`if (empty && !emptyHint) return null`). La section disparaît sans un mot.

Tant que la route renvoyait **toujours exactement 4 liens** — ce qu'elle faisait, le
seuil étant du code mort (AUDIT §3) — ce cas n'arrivait jamais sur un rêve. Depuis le
correctif du 26/07, il arrive : **14 rêves sur les 64 de Tim n'ont plus aucune
résonance**, et c'est le comportement voulu, pas une panne.

Sans ce patch, ces 14 rêves affichent un trou muet. `1_BIBLE.md:365` demande
l'inverse, explicitement :

> « Pas de génération si vide : si aucun ne résonne sérieusement, la polyphonie
> **le dit doucement**. » — SILENCE_AS_FEATURE

Le silence doit être **dit**, pas subi. La différence entre les deux, c'est toute la
différence entre une app qui se tait et une app qui a planté.

## Ce qui s'affichera

Le texte est déjà en place côté A2 (i18n `fr` + `en`, les deux seules locales de
l'app). `ResonanceSection` choisit désormais la bonne phrase selon `corpus_size`,
que la route renvoie :

| Corpus | Clé | Texte affiché (fr) |
|---|---|---|
| < 5 kairos | `screens.resonance.empty` | *rien ne résonne encore — raconte d'autres nuits, et les fils se tisseront.* |
| ≥ 5 kairos | `screens.resonance.emptyAlone` | *ce rêve se tient seul pour l'instant. rien d'autre ne lui répond — c'est une réponse, pas un manque.* |

Le second cas est le nouveau, et c'est celui de Tim. L'ancienne phrase (« raconte
d'autres nuits ») serait fausse et vaguement culpabilisante pour quelqu'un qui a
déjà déposé 64 rêves.

## Vérification

- `npx tsc --noEmit -p tsconfig.json` : `emptyHint` est un `boolean` optionnel
  (`emptyHint?: boolean`, défaut `false`) — passer `emptyHint` seul vaut `true`.
  Aucun changement de type, aucune erreur attendue.
- À l'œil : ouvrir un rêve sans résonance → la section « CE QUI RÉSONNE » doit
  afficher son titre et la phrase douce, jamais rien du tout.

---
*Agent A2, 2026-07-26.*
