# PATCH-PAGE-TSX-B4 — le rêve à rebours · récit et lecture du rêveur

> Agent B4 (Opus), 2026-07-26. `src/app/mvp/page.tsx` appartient à B5.
> Tout le back est **livré et vérifié** (migrations appliquées, `tsc --noEmit` : 0 erreur).
> Ce document ne contient que les gestes d'écran.
>
> **Rien ici n'est bloquant.** Sans ce patch, l'app fonctionne exactement comme
> avant : `occurred_at` est une colonne générée qui vaut `created_at` tant qu'aucune
> date de rêve n'est posée. Le patch est ce qui rend la fonction *visible*.

---

## Ce qui existe déjà côté serveur (à consommer, rien à construire)

| Route | Verbe | Sert à |
|---|---|---|
| `/api/kairos` | POST | accepte `dream_date_shortcut` (ou `dream_date` + `dream_date_precision`) au dépôt |
| `/api/kairos` | GET | renvoie désormais `occurred_at`, `occurred_at_reliable`, `dream_date`, `dream_date_precision`, `dream_date_label` — et **trie sur `occurred_at`** |
| `/api/mvp/dream-date` | PATCH | `{ kairos_id, dream_date_shortcut }` → change la date d'un rêve déjà déposé |
| `/api/mvp/text-layers` | GET / POST / PATCH / DELETE | la couche récit / lecture / cadre d'un rêve |
| `/api/mvp/dream-date/propose` | GET / POST / PATCH | l'extraction rétroactive, **en propositions à revoir** |

Helpers prêts à importer, aucun à réécrire :

```ts
import { formatDreamDate, canAssertDelta, type DreamDateShortcut } from '@/lib/kairos/dream-date'
```

`formatDreamDate(k, locale)` → `{ when: string; deposited: string | null }`.
`when` ne montre **jamais plus de précision qu'on n'en a** (« en avril » reste « en avril »).
`deposited` n'est renseigné **que** si le dépôt diffère du jour du rêve.

---

## PATCH 1 — le journal se range à la date du rêve

**Fichier** `src/app/mvp/page.tsx`, carte de rêve du Journal (~l. 2452).

```tsx
<span style={{ fontSize: 11, color: 'rgba(242,232,213,0.4)' }}>{new Date(k.created_at).toLocaleDateString(locale, { day: 'numeric', month: 'short' })}</span>
```

→

```tsx
{/* B4 — la date affichée est celle du RÊVE. Quand il a été raconté un autre jour,
    une seconde ligne, discrète, le dit : « déposé le 26 juillet ». */}
{(() => {
  const d = formatDreamDate(k, locale)
  return (
    <span style={{ fontSize: 11, color: 'rgba(242,232,213,0.4)', textAlign: 'right' }}>
      {d.when}
      {d.deposited && (
        <span style={{ display: 'block', fontSize: 9.5, color: 'rgba(242,232,213,0.28)' }}>
          {t('core.journal.depositedOn', { date: d.deposited })}
        </span>
      )}
    </span>
  )
})()}
```

Même remplacement aux 3 autres endroits qui datent un kairos :
`relDay(k.created_at, locale)` (l. 1228 et 1422) → `relDay(k.occurred_at ?? k.created_at, locale)` ·
`core.journal.nightOf` (l. 2456) et `fallbackDream` (l. 2458) → même source.

> ⚠️ `relDay` dit « il y a 3 jours ». Ne l'appeler que si `k.occurred_at_reliable !== false`.
> Sinon afficher `formatDreamDate(...).when`, qui rend « date inconnue ». C'est le
> garde-fou : on n'affirme pas une distance qu'on ne connaît pas.
> `canAssertDelta(k.dream_date_precision)` répond à la question en une ligne.

**Clés i18n à ajouter** (`core.fr.json` / `core.en.json`) :

```json
"journal.depositedOn": "déposé le {{date}}",
"journal.dateUnknown": "date inconnue",
```

---

## PATCH 2 — le geste : « cette nuit », un tap pour dire autre chose

**Où** : écran post-dépôt (`finalize()`, ~l. 1554 et 1599), juste sous le texte, avant « garder ».
**Jamais de sélecteur de date en plein réveil.** Une seule ligne de pastilles.

```tsx
const [whenDreamt, setWhenDreamt] = useState<DreamDateShortcut>('tonight')

// … dans le rendu, une ligne de pastilles, style identique aux chips de type de kairos :
<div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
  {([
    ['tonight',          'core.capture.whenTonight'],        // « cette nuit »   ← défaut
    ['yesterday',        'core.capture.whenYesterday'],      // « la nuit d'avant »
    ['before_yesterday', 'core.capture.whenBeforeYesterday'],// « avant-hier »
    ['few_days',         'core.capture.whenFewDays'],        // « il y a quelques jours »
    ['unknown',          'core.capture.whenUnknown'],        // « je ne sais plus quand »
  ] as const).map(([k, l]) => (
    <button key={k} onClick={() => setWhenDreamt(k)} style={chip(whenDreamt === k)}>{t(l)}</button>
  ))}
</div>
```

Et dans le `payload` du POST (une ligne) :

```ts
payload.dream_date_shortcut = whenDreamt
```

**Décharge de charge mentale** : la pastille « cette nuit » est déjà sélectionnée.
Le rêveur qui ne touche à rien obtient exactement le comportement d'aujourd'hui.

**Sur un rêve déjà déposé** (fiche rêve), la même ligne, mais qui appelle
`PATCH /api/mvp/dream-date { kairos_id, dream_date_shortcut }`.

**Clés i18n** :
```json
"capture.whenTonight": "cette nuit",
"capture.whenYesterday": "la nuit d'avant",
"capture.whenBeforeYesterday": "avant-hier",
"capture.whenFewDays": "il y a quelques jours",
"capture.whenUnknown": "je ne sais plus quand"
```

> ⚠️ `src/lib/offline-queue.ts` (B2) porte un `createdAtOverride`. Quand B2 y touchera,
> il faudra qu'il transporte `dream_date_shortcut` plutôt que d'écrire `created_at`.
> En l'état, le champ `created_at` envoyé par un client offline est **traduit
> automatiquement en `dream_date` côté serveur** (`/api/kairos` POST) — rien ne casse,
> mais la date de dépôt cesse d'être réécrite.

---

## PATCH 3 — récit et lecture du rêveur, sur la fiche rêve

C'est le morceau délicat. **La règle, à tenir dans le rendu** (voir `RAPPORT-B4.md` §2) :

1. **Le texte reste entier et intact.** On n'affiche jamais deux blocs séparés,
   jamais un « vrai rêve » d'un côté et un « commentaire » de l'autre.
   On rend `raw_text` **en un seul flux**, dans l'ordre, et on **teinte** les passages.
2. **Aucune hiérarchie visuelle.** Pas de grisé, pas d'italique dégradé, pas
   d'opacité réduite sur la lecture du rêveur : ce serait dire qu'elle vaut moins.
   Un **liseré à gauche** en or discret, et un mot en petites capitales.
3. Le mot employé n'est jamais « commentaire », « hors-sujet », « méta » ou « bruit ».
   Deux mots seulement : **« le rêve »** et **« ce que tu en dis »**.
4. **Rien pendant la capture.** Cette couche n'apparaît que sur la fiche, après.
   L'afficher au dépôt apprendrait au rêveur à se surveiller en dictant.

```tsx
// Chargement : GET /api/mvp/text-layers?kairos_id=…
// → { status, spans: [{ kind: 'lecture' | 'cadre', start, end, quote, source }] }
const [layers, setLayers] = useState<{ status: string; spans: any[] } | null>(null)

// Rendu : un seul flux de texte, découpé par les bornes, jamais réordonné.
function renderWithLayers(raw: string, spans: any[]) {
  const sorted = [...spans].sort((a, b) => a.start - b.start)
  const out: React.ReactNode[] = []
  let cursor = 0
  sorted.forEach((s, i) => {
    if (s.start > cursor) out.push(<span key={`r${i}`}>{raw.slice(cursor, s.start)}</span>)
    out.push(
      <span key={`m${i}`} data-kind={s.kind} style={{
        display: 'inline',
        boxShadow: s.kind === 'lecture' ? `inset 2px 0 0 ${T.gold}55` : 'inset 2px 0 0 rgba(242,232,213,0.14)',
        paddingLeft: 8,
      }}>
        {raw.slice(s.start, s.end)}
      </span>
    )
    cursor = Math.max(cursor, s.end)
  })
  out.push(<span key="tail">{raw.slice(cursor)}</span>)
  return out
}
```

**Une seule ligne de légende**, sous le texte, uniquement si `status === 'proposed'` :

> ⟋ *ce que tu en dis toi-même — c'est à toi, l'app ne l'a pas écrit*
> [ c'est juste ] [ tout est le rêve ]

- **« c'est juste »** → `PATCH /api/mvp/text-layers { kairos_id, spans }` avec les mêmes
  bornes ⇒ `status='confirmed'`, `source='user'`, plus jamais réécrasé par l'IA.
- **« tout est le rêve »** → `DELETE /api/mvp/text-layers { kairos_id }` ⇒ couche effacée,
  définitivement.
- Un **tap sur un passage teinté** le rend au récit (retirer ce span, renvoyer les autres
  en PATCH). C'est la correction la plus fréquente : la mesure sur 10 rêves réels donne
  **~10 % de faux positifs sur la lecture** (§4 du rapport), tous d'un seul tap.

**Clés i18n** :
```json
"dream.layersLegend": "ce que tu en dis toi-même — c'est à toi, l'app ne l'a pas écrit",
"dream.layersConfirm": "c'est juste",
"dream.layersReset": "tout est le rêve"
```

---

## PATCH 4 — l'écran de relecture des dates (rare, mais nécessaire une fois)

Un écran de réglages, listant `GET /api/mvp/dream-date/propose?status=pending`.
**24 propositions attendent** sur le compte de Tim, dont **11 sans année** (la date
est dite mais l'année ne l'est pas). Une carte par proposition :

> **L'École des Cœurs en Compétition**
> il est dit dans l'enregistrement : « *Rêve du 24 avril* »
> l'année n'est pas dite — [ 2023 ] [ 2024 ] [ 2025 ] [ autre ]
> [ garder cette date ] [ laisser sans date ]

- garder → `PATCH { id, decision: 'accept', dream_date: 'YYYY-MM-DD' }`
- laisser → `PATCH { id, decision: 'reject' }`

**Rien n'est appliqué tant que Tim n'a pas tapé.** C'est volontaire : une date mal
devinée fabrique de faux échos, exactement le bug qu'on répare.

---

## Ce qui ne demande AUCUN patch

- Le tri du journal (fait côté `/api/kairos` GET).
- La fenêtre saison/année de l'écran Univers (fait côté `/api/mvp/symbol-book`
  et `/api/personal-dictionary/refresh`).
- L'écho ancien, les patterns récurrents, la constellation, dedans/dehors,
  la météo collective (fait côté RPC).
