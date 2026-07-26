# PATCH `src/app/mvp/page.tsx` — livraison A3 (les grands rêves)

> **Pour l'agent A4**, propriétaire de `src/app/mvp/page.tsx`. **A3 n'a pas touché ce fichier.**
> Réf : `TAXONOMIE-GRANDS-REVES.md` · Composants livrés : `src/components/GreatDreamFlag.tsx`, `src/components/GreatDreamsJournal.tsx`.
> **Les ancres sont du CODE, pas des numéros de ligne** — A4 restructure ce fichier en parallèle.
> Tout est **additif** : aucune suppression, aucune signature existante modifiée sauf mention explicite.
> **i18n** : A3 n'a écrit QUE dans `screens.fr.json` / `screens.en.json`, sous `screens.great.*`.
> **`core.*.json` n'a pas été touché** — aucun conflit possible avec A4.

---

## PATCH 1 — les imports

**Ancre** — le bloc d'imports de composants, repérable par :
```tsx
import KeptInterpretation from '@/components/KeptInterpretation'
```
(ou n'importe quel `import … from '@/components/…'`).

**Ajouter :**
```tsx
import GreatDreamFlag from '@/components/GreatDreamFlag'
import GreatDreamsJournal from '@/components/GreatDreamsJournal'
```

---

## PATCH 2 — le geste, sur la fiche du rêve (`ReadScreen`)

**Ancre exacte** (unique dans le fichier, à l'intérieur de `ReadScreen`) :
```tsx
        <KeptInterpretation session={session} kairosId={kairosId} />
```

**Insérer JUSTE AVANT cette ligne :**
```tsx
        {/* A3 — « un grand rêve » : la marque du rêveur (TAXONOMIE-GRANDS-REVES.md §1).
            Placée AVANT l'interprétation gardée : c'est un geste sur le rêve, pas sur sa lecture.
            `radiant` = suggestion de l'IA seule (score ≥ 0.7), JAMAIS `|| user_marked_numinous` —
            l'asymétrie IA/rêveur est le cœur de la fonction (§1.5). */}
        {k && (
          <GreatDreamFlag
            session={session}
            kairosId={kairosId}
            marked={!!k.user_marked_numinous}
            markedAt={k.marked_great_at}
            facets={k.great_dream_facets}
            note={k.great_dream_note}
            radiant={(k.numinosity_score ?? 0) >= 0.7}
            onChange={(next) => setK((prev: any) => ({
              ...(prev || {}),
              user_marked_numinous: next.marked,
              great_dream_facets: next.facets,
              great_dream_note: next.note,
            }))}
          />
        )}
```

**Pré-requis déjà en place** — rien à faire :
- `k` et `setK` existent dans `ReadScreen` (`const [k, setK] = useState<any | null>(null)`).
- `GET /api/kairos/[id]` renvoie désormais `marked_great_at`, `great_dream_facets`, `great_dream_note` (A3 a étendu le `select`).
- `PATCH /api/kairos/[id]` accepte `great_dream_facets` et `great_dream_note` (A3 a étendu la whitelist). `user_marked_numinous` y était déjà.
- `marked_great_at` n'est **pas** whitelisté en écriture : un trigger DB le pose. Ne pas l'envoyer.

---

## PATCH 3 — l'écran du journal

### 3a. Le type `Screen`

**Ancre** :
```tsx
type Screen = 'home' | 'animus' | 'journal' | 'universe' | 'circles' | 'forge' | 'postdepot' | 'protocol' | 'interpret' | 'read' | 'import' | 'reveil' | 'scan' | 'wall' | 'guide' | 'guides' | 'settings'
```
**Ajouter `| 'greatdreams'`** en fin d'union.

### 3b. Le rendu

**Ancre** (dans `MvpAppInner`, le rendu de l'écran Journal) :
```tsx
      {screen === 'journal' && <JournalScreen session={session} view={journalView} setView={setJournalView}
```

**Insérer un bloc frère JUSTE AVANT** (ou juste après le bloc `journal` complet) :
```tsx
      {/* A3 — les grands rêves : journal à part + consultation à double lecture.
          `greatFrom` retient d'où l'on vient (Journal ou Cœur) pour que le retour soit juste. */}
      {screen === 'greatdreams' && (
        <GreatDreamsJournal
          session={session}
          initialView={greatView}
          onOpenDream={(id: string) => { setReadId(id); setReadFrom('greatdreams'); setScreen('read') }}
          onBack={() => setScreen(greatFrom)}
        />
      )}
```

### 3c. Les deux états à déclarer

**Ancre** — le groupe de `useState` en tête de `MvpAppInner`, repérable par :
```tsx
  const [screen, setScreen] = useState<Screen>('home')
```
**Ajouter en dessous :**
```tsx
  const [greatView, setGreatView] = useState<'journal' | 'consult'>('journal')
  const [greatFrom, setGreatFrom] = useState<Screen>('journal')
```

> ⚠️ `setReadFrom('greatdreams')` au patch 3b suppose que `readFrom` est typé `Screen`. S'il est typé plus étroitement, élargir son type à `Screen` (il est déjà utilisé avec `'home' | 'animus' | 'journal'`).

---

## PATCH 4 — l'entrée depuis le Journal

**Ancre** — la signature de `JournalScreen` :
```tsx
function JournalScreen({ session, view, setView, onOpen, onImport, onSettings, onGallery }: {
```
**→** ajouter `onGreatDreams` aux paramètres et au type :
```tsx
function JournalScreen({ session, view, setView, onOpen, onImport, onSettings, onGallery, onGreatDreams }: {
  …
  onGallery: () => void
  onGreatDreams: () => void
}) {
```

**Ancre** — la fin du bloc `seg` dans `JournalScreen` :
```tsx
      ))}
    </div>
  )
  return view === 'liste'
```

**Remplacer par** (on enveloppe le segmented + un lien discret ; le segmented `liste | univers` n'est PAS touché — pas de 3ᵉ pilule, §0.5 « une idée par écran ») :
```tsx
      ))}
    </div>
  )
  const greatLink = (
    <button onClick={onGreatDreams} style={{ marginTop: 13, background: 'none', border: 'none', padding: '6px 0', cursor: 'pointer', fontFamily: T.sans, fontSize: 13, fontWeight: 600, color: T.gold, display: 'block' }}>
      {t('screens.great.entry')} →
    </button>
  )
  const seg2 = <>{seg}{greatLink}</>
  return view === 'liste'
```
puis, dans les deux `return`, passer **`segmented={seg2}`** au lieu de `segmented={seg}`.

**Ancre** — l'appel de `JournalScreen` dans `MvpAppInner` :
```tsx
        onImport={() => setScreen('import')} onSettings={() => { setSettingsFrom('journal'); setScreen('settings') }} onGallery={() => setScreen('forge')} />}
```
**→** ajouter avant le `/>` :
```tsx
        onGreatDreams={() => { setGreatFrom('journal'); setGreatView('journal'); setScreen('greatdreams') }}
```

---

## PATCH 5 — l'entrée depuis l'écran Cœur (`AnimusScreen`)

C'est la demande centrale de Tim : *« en un click face à des challenges du quotidien (messages "cœur") consulter nos grands rêves »*.
L'écran Cœur **reste un écran de dépôt** — la consultation est proposée **sous** le dépôt, jamais à sa place (§6.4 de la taxonomie).

**Ancre exacte** (unique, dans `AnimusScreen`) :
```tsx
                <div style={{ marginTop: 18, textAlign: 'center' }}>
                  <button onClick={goAnima} style={{ background: 'none', border: 'none', color: DT.gold, fontWeight: 600, fontSize: 13.5, cursor: 'pointer', fontFamily: T.sans, padding: 8 }}>{t('core.animus.orb')}</button>
                </div>
```

**Remplacer par :**
```tsx
                <div style={{ marginTop: 18, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {/* A3 — demander à ses rêves depuis le Cœur (double lecture) */}
                  <button onClick={onGreatConsult} style={{ background: 'none', border: 'none', color: DT.inkSoft, fontWeight: 600, fontSize: 13.5, cursor: 'pointer', fontFamily: T.sans, padding: 8 }}>{t('screens.great.entryFromHeart')} →</button>
                  <button onClick={goAnima} style={{ background: 'none', border: 'none', color: DT.gold, fontWeight: 600, fontSize: 13.5, cursor: 'pointer', fontFamily: T.sans, padding: 8 }}>{t('core.animus.orb')}</button>
                </div>
```

**Ancre** — la signature d'`AnimusScreen` :
```tsx
function AnimusScreen({ session, goAnima, onCaptured, openDream }: { session: Session; goAnima: () => void; onCaptured: (text: string, kairosType?: string) => void; openDream: (id: string) => void }) {
```
**→**
```tsx
function AnimusScreen({ session, goAnima, onCaptured, openDream, onGreatConsult }: { session: Session; goAnima: () => void; onCaptured: (text: string, kairosType?: string) => void; openDream: (id: string) => void; onGreatConsult: () => void }) {
```

**Ancre** — l'appel dans `MvpAppInner` :
```tsx
      {screen === 'animus' && <AnimusScreen session={session} goAnima={() => crossTo('home')} onCaptured={…} openDream={id => { setReadId(id); setReadFrom('animus'); setScreen('read') }} />}
```
**→** ajouter avant le `/>` :
```tsx
        onGreatConsult={() => { setGreatFrom('animus'); setGreatView('consult'); setScreen('greatdreams') }}
```

---

## PATCH 6 — la nav basse (1 ligne)

**Ancre** :
```tsx
      {['home', 'animus', 'journal', 'forge', 'wall', 'circles'].includes(screen) && <QuietNav …
```
**Ne rien ajouter à `QuietNav`** (la nav reste à 4 onglets — §0.5). L'écran `greatdreams` n'est volontairement pas dans cette liste : il est en plein écran, avec sa flèche retour, comme `read`. **Aucune modification requise.**
*(Si Tim demande un 5ᵉ onglet, il faudra en retirer un — voir §6.3 de la taxonomie.)*

---

## PATCH 7 — OPTIONNEL, à l'appréciation d'A4 : dé-fusionner IA et rêveur dans la liste

**Ancre** (dans `AtlasScreen`) :
```tsx
                  const big = (k.numinosity_score ?? 0) >= 0.7 || k.user_marked_numinous
```

Cette ligne traite la **suggestion de l'IA** et la **décision du rêveur** comme la même chose. Ce n'est plus vrai (§1.5). Si A4 veut distinguer les deux dans le Journal :
```tsx
                  const marked = !!k.user_marked_numinous          // décision du rêveur
                  const big = marked || (k.numinosity_score ?? 0) >= 0.7  // halo existant, inchangé
```
puis n'afficher la marque pleine que sur `marked`.

**Non bloquant.** Laissé tel quel, tout continue de fonctionner — le badge sera juste un peu généreux. La ligne `2505` (`onGuides(… (k?.numinosity_score ?? 0) >= 0.7 || !!k?.user_marked_numinous)`) est en revanche **correcte telle quelle** : pour proposer des guides « rêve fort », l'union des deux est le bon critère. **Ne pas y toucher.**

---

## Ce que ce patch n'exige PAS

- Aucune migration côté A4 — elle est appliquée (`great_dreams_taxonomy_a3`).
- Aucune clé `core.*.json` à ajouter : tous les libellés sont sous `screens.great.*`, y compris ceux des deux entrées (`screens.great.entry`, `screens.great.entryFromHeart`).
- Aucun changement de `QuietNav`, du type `journalView`, ni du flux de dépôt.
- **Le marquage n'apparaît nulle part dans `PostDepotScreen`** — c'est délibéré et c'est le cœur de l'arbitrage (§1 et §2 de la taxonomie). Merci de ne pas l'y ajouter « pour la découvrabilité ».
