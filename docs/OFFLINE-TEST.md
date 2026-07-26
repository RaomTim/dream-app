# OFFLINE-TEST — le cas sacré (3 h du matin, mode avion)

> Chantier offline-first (« ABSOLUMENT » Tim · SPEC §0.3 / §10 A3).
> Objectif du test : prouver **ZÉRO perte** — un rêve dicté hors-ligne arrive intact
> au retour du réseau, sans doublon.

## Ce qui a été câblé

- **Service worker** `public/sw.js` (enregistré depuis `src/app/mvp/layout.tsx` via
  `ServiceWorkerRegister`) : precache le shell `/mvp` + les assets `/_next/static`
  → l'app **s'ouvre en mode avion** après une première visite en ligne.
- **File d'attente** `src/lib/offline-queue.ts` (IndexedDB) : stocke le dépôt complet
  (audio + texte éventuel + type + marqueurs + horodatages) et rejoue
  `transcribe → POST kairos → upload audio` au retour du réseau, idempotent.
- **UI honnête** : bandeau « Gardé sur le téléphone — il partira tout seul » à la
  capture hors-ligne ; ligne « N rêve(s) en attente de réseau — rien n'est perdu »
  sur l'accueil tant que la file n'est pas vidée.

## Pré-requis (une seule fois, EN LIGNE)

1. Ouvrir l'app (`/mvp`), se connecter, déposer 1 rêve normal → vérifier qu'il arrive.
   Ce premier passage en ligne **installe le SW et cache le shell**.
2. (Recommandé) Appliquer la migration `supabase-migrations/2026-07-22_kairos_client_dedup.sql`
   pour fermer le dernier trou d'idempotence (réponse perdue). Sans elle, l'app marche
   quand même (idempotence côté client).

## Test A — capture voix hors-ligne (LE cas critique)

1. Passer en **mode avion** (ou DevTools ▸ Network ▸ Offline).
2. Fermer complètement l'app, puis la **rouvrir** → elle doit **s'afficher** (shell caché).
   ✅ Sans SW, elle resterait noire.
3. Sur l'accueil (l'Orbe), **maintenir** l'orbe et **dicter** un rêve, relâcher.
4. Attendu : pas d'erreur rouge, mais la ligne calme **« Gardé sur le téléphone — il
   partira tout seul. »**. (La transcription ne tourne pas : pas de réseau.)
5. **Fermer l'app** (kill complet) — c'est le vrai test de persistance.
6. Rouvrir l'app hors-ligne → l'accueil montre **« 1 rêve en attente de réseau — rien
   n'est perdu »**.
7. **Rétablir le réseau** (désactiver mode avion).
8. Attendre quelques secondes (event `online` + flush ; sinon flush auto toutes les 30 s).
   Attendu : la ligne « en attente » **disparaît**. Le rêve apparaît dans le fil de
   l'accueil / le Journal, **avec sa transcription** et, sur la fiche, **le lecteur audio**
   (l'audio d'origine a été poussé).
9. Vérifier qu'il n'y a **qu'un seul** rêve (pas de doublon), même si on rouvre / re-sync.

## Test B — filet réseau au moment de « garder » (flux écrit / post-dépôt)

1. En ligne, dicter ou écrire un rêve pour arriver à l'écran post-dépôt (« Ton rêve »).
2. Passer **offline** juste avant de toucher « C'est tout ».
3. Toucher « C'est tout » → message **« le réseau a flanché — ton rêve est gardé sur ton
   téléphone. réessaie quand ça revient. »** (désormais **vrai** : dépôt en file).
4. Rétablir le réseau → le rêve se poste tout seul, la ligne « en attente » se vide.

## Test C — multi-rêves d'une nuit hors-ligne

1. Hors-ligne, dicter une nuit avec marqueurs « rêve suivant », arriver à « Ta nuit ».
   (Le découpage fin nécessite le réseau ; hors-ligne on découpe au moins sur les
   séparateurs écrits — jamais un mot perdu.)
2. « Oui, sépare » → les rêves partent dans la file (même nuit : `night_group_id`
   partagé). Au retour réseau, ils arrivent groupés, sans doublon.

## Garde-fou taille (à connaître)

- La file plafonne l'audio cumulé à **~50 Mo**. Au-delà, elle **abandonne l'audio des
  plus vieux dépôts DÉJÀ transcrits** (FIFO) — jamais le texte, jamais l'audio d'un rêve
  pas encore transcrit. Le rêve (son texte) n'est donc jamais perdu ; seule la pièce
  audio des plus anciens peut sauter si on accumule beaucoup de dictées longues hors-ligne.

## Ce qui reste ONLINE-ONLY (assumé)

- **Transcription** (Whisper) et **interprétation / guides / enrichissement** exigent le
  réseau. Hors-ligne : capture + file OK ; ces étapes se font au retour du réseau.
- **Scanner (OCR)** : la photo est gardée, la lecture est différée en ligne.
- **Fonts Google** : hors-ligne, l'app retombe sur les polices système (lisible, moins
  « habillé ») — non caché volontairement (SW sobre, pas de cache cross-origin opaque).
