# PATCH `src/app/mvp/page.tsx` — livraison B3 (l'app propose, le rêveur review)

> **Pour B5**, propriétaire de `src/app/mvp/page.tsx`. **B3 n'a pas touché ce fichier.**
> Réf : `RAPPORT-B3.md`. Composants livrés : `src/components/GreatDreamCandidates.tsx`.
> **Les ancres sont du CODE, pas des numéros de ligne.**
> **i18n** : B3 n'a écrit que dans `screens.{fr,en}.json`, sous `screens.great.*` (8 clés ajoutées, `cand*`). `core.*.json` intact.

---

## ⚠️ D'ABORD : il n'y a RIEN d'obligatoire ici

La fonction est **entièrement câblée sans toucher `page.tsx`**. `GreatDreamCandidates` est monté à l'intérieur de `GreatDreamsJournal.tsx` — un fichier de B3 — aux deux endroits utiles (état vide et journal peuplé). L'écran `greatdreams` est déjà routé par A3/A4 :

```tsx
{screen === 'greatdreams' && (
  <GreatDreamsJournal
    session={session}
    initialView={greatView}
    onOpenDream={(id: string) => { setReadId(id); setReadFrom('greatdreams'); setScreen('read') }}
    onBack={() => setScreen(greatFrom)}
  />
)}
```

**Si B5 n'applique rien de ce document, la fonction marche.** Les deux patchs ci-dessous sont des améliorations de découvrabilité, et le patch 2 est explicitement optionnel.

---

## PATCH 1 (recommandé) — la pastille sur l'entrée « les grands rêves »

**Le problème réel** : une proposition hebdomadaire vit dans l'écran `greatdreams`, or personne n'y va spontanément. Sans un signe, la fonction ne se déclenchera jamais. C'est la seule chose qui manque vraiment.

**Ancre exacte** (dans `JournalScreen`, unique dans le fichier) :

```tsx
    <button onClick={onGreatDreams} style={{ marginTop: 13, background: 'none', border: 'none', padding: '6px 0', cursor: 'pointer', fontFamily: T.sans, fontSize: 13, fontWeight: 600, color: T.gold, display: 'block' }}>
      {t('screens.great.entry')} →
    </button>
```

**Remplacer par** :

```tsx
    <button onClick={onGreatDreams} style={{ marginTop: 13, background: 'none', border: 'none', padding: '6px 0', cursor: 'pointer', fontFamily: T.sans, fontSize: 13, fontWeight: 600, color: T.gold, display: 'flex', alignItems: 'center', gap: 8 }}>
      {t('screens.great.entry')} →
      {/* B3 — une proposition attend. Un point, pas un chiffre : §0.5 interdit
          les compteurs, et « 3 » transformerait une invitation en tâche à faire. */}
      {pendingGreat && (
        <span aria-hidden style={{ width: 6, height: 6, borderRadius: '50%', background: T.gold, opacity: 0.7, flexShrink: 0 }} />
      )}
    </button>
```

**Ajouter dans `JournalScreen`** (état + chargement), et `pendingGreat: boolean` à sa signature de props :

```tsx
  const [pendingGreat, setPendingGreat] = useState(false)
  useEffect(() => {
    let alive = true
    const h: Record<string, string> = {}
    if (session?.access_token) h['Authorization'] = `Bearer ${session.access_token}`
    fetch('/api/great-dreams/candidates', { headers: h })
      .then(r => r.json())
      .then(j => { if (alive) setPendingGreat((j.candidates || []).length > 0) })
      .catch(() => {})
    return () => { alive = false }
  }, [session])
```

*(Si B5 préfère éviter un fetch de plus au montage du Journal, mettre le state dans le parent et le passer en prop : le choix lui appartient, l'effet à l'écran est le même.)*

---

## PATCH 2 (OPTIONNEL) — chercher une proposition, une fois par semaine

Rien ne déclenche la recherche hebdomadaire aujourd'hui : la première review est **sollicitée** (bouton dans l'écran), et le mode `weekly` n'a pas d'appelant.

**Ancre** — dans le composant racine, à côté des autres effets de montage de session.

```tsx
  // B3 — la proposition de croisière. UNE par semaine au maximum, et le plus
  // souvent : rien (double barrière relief + lecteur, cf. RAPPORT-B3 §2).
  // La route applique elle-même la cadence : cet appel est idempotent et sûr.
  // Jamais au dépôt : aucun rêve de moins de 30 jours n'est proposable.
  useEffect(() => {
    if (!session?.access_token) return
    const KEY = 'gd_weekly_last'
    const last = Number(localStorage.getItem(KEY) || 0)
    if (Date.now() - last < 7 * 86400_000) return
    localStorage.setItem(KEY, String(Date.now()))
    fetch('/api/great-dreams/candidates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({ mode: 'weekly' }),
    }).catch(() => {})
  }, [session])
```

**Pourquoi c'est optionnel, et pourquoi je ne le tranche pas** : ça fait travailler un LLM au montage de l'app, sans que personne l'ait demandé. Défendable (c'est une fois par semaine, et c'est exactement ce que Tim a demandé : « que l'app propose elle-même »), mais ça mérite son arbitrage — cf. `RAPPORT-B3.md` §5, décision 3. **En attendant, tout passe par la première review, qui est sollicitée.**

---

## Ce qu'il ne faut PAS faire

- **Ne pas monter `GreatDreamCandidates` dans `PostDepotScreen` ni dans le flux de dépôt.** Aucune proposition ne doit apparaître au réveil — c'est le cœur de l'arbitrage A3 (`1_BIBLE` §3.13.1), et la route le garantit déjà côté serveur (`MIN_AGE_DAYS = 30`). Le monter là ne casserait rien techniquement mais viderait la fonction de son sens.
- **Ne pas afficher `relief` ni aucun score.** Il transite dans la réponse d'API (`diagnostics`) uniquement pour le diagnostic. §0.5 : zéro score, zéro classement.
- **Ne pas écrire « ce rêve est un grand rêve ».** Le mot d'écran est **« ressort »** — un fait sur le corpus, pas un verdict sur le rêve. Les libellés sont déjà en i18n, ne pas les reformuler sans lire `RAPPORT-B3.md` §1.
- **Ne pas ajouter de « plus tard » ni de rappel.** Les trois réponses sont : oui, non, et ne rien faire. « Non » veut dire qu'on ne repropose plus ce rêve — jamais de relance.

---

## Clés i18n ajoutées (déjà écrites dans `screens.fr.json` / `screens.en.json`)

`screens.great.candKickerOne` · `candKickerMany` · `candInvite` · `candRun` · `candSearching` · `candSilence` · `candNo` · `candNoRush`
