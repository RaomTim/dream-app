# Réveil Dream — sons natifs custom (Capacitor)

> Statut : `partial` — le web fonctionne (Web Audio), le natif utilise le son
> système par défaut. Ce doc explique comment ajouter les sons custom bundlés au
> prochain build. Chantier braindump §12ter.F.

## Ce qui marche déjà

- **Web (app active / onglet ouvert)** : trois ambiances 100% générées en Web
  Audio — `src/lib/alarm-sounds.ts` : `Carillon`, `Pluie douce (générée)`,
  `Aube`. Départ très doux, montée progressive, + vibration progressive
  (`navigator.vibrate`). Aucun fichier binaire.
- **Natif (Capacitor, même app fermée)** : `ReveilScreen` planifie une
  notification via `@capacitor/local-notifications` sur un canal dédié
  `dream-alarm` (Android : `importance: 5`, vibration ON). Le son joué est le
  **son de notification par défaut du système** — fallback fiable.

## Limite honnête

Le Web Audio **ne sonne pas** quand l'app est en arrière-plan ou fermée : le
navigateur/WebView suspend le contexte audio. Pour un vrai réveil custom
(Carillon/Pluie/Aube) même app fermée, il faut des **assets audio bundlés** dans
le binaire natif, référencés par la notification programmée.

## Ajouter un son custom au prochain build

Prérequis : fichiers audio **CC0 / libres de droits** (aucun asset inventé ou
téléchargé sans licence claire — red line). Rendu court (~15-30 s), départ doux.

### Android

1. Déposer le `.wav` (ou `.ogg`) dans `android/app/src/main/res/raw/`
   (nom en minuscules, sans extension dans le code : ex. `dawn.wav` → `dawn`).
2. Créer le canal avec le son au premier lancement (ou dans `arm()`), une seule
   fois — le son d'un canal Android est **immuable après création** :
   ```ts
   await LN.createChannel({
     id: 'dream-alarm-dawn',
     name: 'Réveil Dream — Aube',
     importance: 5,
     sound: 'dawn.wav',   // nom du fichier dans res/raw
     vibration: true,
   })
   ```
3. Programmer la notif sur ce canal : `channelId: 'dream-alarm-dawn'`.
   → un canal par ambiance (le son est lié au canal, pas à la notif).

### iOS

1. Ajouter le `.caf`/`.wav` (< 30 s, format supporté) au bundle de l'app Xcode
   (target → Build Phases → Copy Bundle Resources).
2. Programmer la notif avec le champ `sound` = nom du fichier :
   ```ts
   await LN.schedule({ notifications: [{ id: 7, sound: 'dawn.wav', title: 'Dream', body: '…', schedule: { at: target } }] })
   ```

## Câblage côté code

- `src/lib/alarm-sounds.ts` — moteur Web Audio + vibration (source de vérité des
  ambiances et de leurs `id` : `carillon` / `pluie` / `aube`).
- `src/app/mvp/page.tsx` → `ReveilScreen` — UI (heure, 3 ambiances, on/off,
  test 1 tap), déclenchement web (`startAlarm` + `startVibration`) et planif
  native (canal `dream-alarm`). Commentaire en place au niveau de `arm()`.

## À faire quand Tim valide

- [ ] Sourcer 3 `.wav` CC0 (Carillon, Pluie, Aube) — ou rendre les ambiances Web
      Audio en fichiers offline via un rendu `OfflineAudioContext`.
- [ ] Un canal Android par ambiance + bundling iOS.
- [ ] Mapper `AmbianceId` → nom de fichier / canal dans `ReveilScreen.arm()`.
- [ ] Tester en avion + app fermée sur device réel (fiabilité = le point dur).
