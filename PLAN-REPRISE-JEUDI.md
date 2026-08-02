# PLAN DE REPRISE — jeudi 30 juillet

> Le backlog complet est dans `BACKLOG-2026-07-27.md`. Ce document-ci dit **dans quel ordre**, **pourquoi**, et **quoi coller** pour relancer.
> Principe directeur : on ne relit rien tant que la bibliothèque est cassée, on ne construit rien de collectif tant qu'on n'a pas écouté les traditions du rêve partagé.

---

## Ce qui a été fait dimanche 26 (rappel court)

Neuf agents en flotte, tout vérifié, tout committé.

**Réparé** : la perte d'audio (Vercel plafonne à 4,5 Mo — l'audio n'était persisté nulle part ; upload direct Storage vérifié à 6 Mo, test d'une heure passé, plus aucune limite de durée) · le moteur de résonance (deux `WHERE` jamais lus : 256 liens → 75, et 14 rêves sans aucune résonance, ce qui est la bonne nouvelle) · le build cassé depuis 3 jours par un doublon iCloud · les polices jamais chargées (tout le serif tombait sur Georgia) · 145 digests désynchronisés en base · le bug du retour arrière et ses 9 cas frères.

**Construit** : le filet audio en 5 couches · les grands rêves (marque + détection proposée + journal) · le rêve à rebours (14 points de calcul basculés, −81 % de faux échos) · la distinction récit / lecture / cadre dans la dictée · la bascule « Nuit bleue vivante » (344 valeurs, 26 fichiers) · la bulle ⓘ et la page profonde des kaïros · le mode « ce que j'en ai dit ».

**Écrit** : `DOCTRINE-MIROIR.md` · `LECTURE-WELLER-KALSCHED.md` · `LECTURES-GLOBALES-16-FRUITS.md` · `FAISABILITE-MIROIR.md` · les canoniques réécrits (−405 lignes).

**Déployé et en ligne** : le bleu, le filet audio, les nouvelles routes. Vérifié.

---

## L'ordre de jeudi

### 🔴 VAGUE 0 — Réparer la bibliothèque (bloque tout le reste)

**Pourquoi en premier** : Hillman *The Dream and the Underworld* fonde toute la doctrine du miroir, et son texte en base est une bouillie sans espaces (`231 chunks, 254 mots`). Jung *Psychology and Alchemy* n'est ingéré qu'à 79 chunks. Plusieurs livres semblent afficher le contenu d'un autre. **Toute lecture faite avant cette réparation est fragilisée, et toute lecture faite après en bénéficie.**

→ Relancer **H1** du backlog, intégralement. Un agent Opus, seul, avec accès à `eBOOKS/` pour les sources.

**Le livrable qui compte** : `AUDIT-LISIBILITE-FORET.md` — les 409 livres classés, la cause identifiée, ce qui est réparé et vérifié extrait à l'appui, et **la liste des documents INFUSE qui citent des livres qui n'étaient pas lisibles**.

*Durée estimée : une session d'agent. Rien d'autre en parallèle — les autres agents liraient du texte cassé.*

---

### 🌍 VAGUE 1 — La grande écoute (le virage du 27/07)

**Pourquoi maintenant** : c'est la critique la plus juste que tu m'aies faite. La doctrine s'est bâtie sur Hillman, Kalsched, Gendlin, Weller, Jung, IFS — clinique occidentale du XXᵉ siècle. Les voix anciennes ont été traitées comme un **risque éthique à gérer**, jamais comme une **source de sagesse de design**.

Et la raison profonde compte, parce qu'elle commande la suite : **toute la psychologie des profondeurs occidentale suppose que le rêve appartient à une psyché individuelle.** C'est exactement l'hypothèse qui casse dès qu'on veut du rêve partagé en groupe avec une intention. Sur le rêve collectif, le canon occidental n'a presque rien. Les traditions ont tout — parce que chez elles, le partage *est* la pratique.

→ Relancer **H2**. Recherche vectorielle large dans les 90 000+ chunks, requêtes multiples, **pas seulement dans les livres classés « rêve »** — c'est ton intuition et je pense qu'elle est juste : les pépites seront chez Kimmerer, Abram, Yunkaporta, Eliade, Kohn, Somé, Buhner, dans des livres que personne n'a rangés au rayon onirique.

**Deux corrections à porter dans cette vague** :
- 🔴 **Zéro épistémologie du rêve d'Afrique australe dans la Forêt.** INFUSE vend des plantes de rêve xhosa/zulu, tradition Ubulawu. Le commerce repose dessus, la doctrine de l'app n'en contient rien. C'est un problème d'intégrité avant d'être une lacune documentaire.
- Les Senoi ne sont pas Moss. Le matériel Senoi vient de Kilton Stewart et est **académiquement considéré comme largement fictif** — ruling déjà en base. Moss = Active Dreaming, adossé à l'iroquois, avec une bénédiction d'aîné que nous n'avons pas en source secondaire.

**Le livrable** : un document de sagesse du rêve partagé, sourcé, non dogmatique, qui tient ensemble science, psychologie, animisme et traditions vivantes — sans les fondre et sans en hiérarchiser aucune.

*Parallélisable : oui, plusieurs agents sur des axes de recherche différents. La synthèse reste en une seule tête.*

---

### 🕸️ VAGUE 2 — Les cercles d'intention

**Ne pas commencer avant la vague 1.** Construire une feature de rêve collectif en s'appuyant sur un canon qui ne connaît que la psyché individuelle, c'est exactement l'erreur qui a tué les cercles précédents.

→ **H3** (cercles d'intention + miroir collectif) et **H4** (système d'amis, 3 modes).

Ce qu'on sait déjà et qui doit tenir :
- Weller et Kalsched convergent sans se citer : **l'opération décisive requiert une autre personne.** Le miroir de groupe n'est donc pas un bonus, c'est ce qui rend le miroir individuel complet.
- L'autopsie des cercles morts : *« on a construit des lieux, pas des actes »*. **Une intention est un acte.** C'est la correction.
- Le seuil dur à 3 personnes (Taylor : en dessous, les projections n'ont pas de quoi s'annuler).
- Le partage comme **événement rare et cadré**, jamais comme flux (festivals de rêves iroquois).
- Le risque à traiter d'emblée, et c'est le pire : **le rêve d'une personne mis au service de l'agenda du groupe.**
- ⚠️ Ullman est **absent de la Forêt**. C'est le protocole de groupe le plus rigoureux jamais écrit, et `1_BIBLE` L467 l'invoque sans qu'aucune lecture ne le fonde. **Acquisition P0.**

---

### 📚 VAGUE 3 — Jung en un seul contexte, puis l'amplification

→ **H5**. Débloqué par la vague 0.

Déjà propres et lisibles aujourd'hui : Red Book (184 k mots), Memories Dreams Reflections (181 k), Man and His Symbols (152 k), Corbin (163 k), Seth vol.1 (175 k), Moss Dreamgates (143 k), Hillman Re-Visioning (128 k), Bulkeley Big Dreams (125 k), Hunt (123 k), von Franz (81 k).

Puis **amplifier `DOCTRINE-MIROIR.md`** : Jung + Seth + Moss + les grands oubliés + tout ce que la vague 1 aura ramené. C'est là que la doctrine devient vraiment la tienne.

Et **H6** en parallèle (recherche web sur l'asymétrie IA–rêveur) — avec l'hypothèse que ce n'est peut-être pas un trou théorique : les traditions où le rêve n'a jamais été privé ont déjà répondu à « qui détient ton rêve ».

---

### 🏫 VAGUE 4 — L'école et le parcours

→ **H7** (école du rêve, podcasts, abonnement + palier gratuit) et **H8** (le parcours initiatique avant les miroirs).

H8 mérite d'être souligné : ton idée de parcours **résout un problème que la doctrine n'avait pas résolu**. Le plancher de corpus n'est plus un seuil arbitraire, c'est une aventure traversée. On ne débloque pas un miroir parce qu'on a atteint 12 rêves — on le débloque parce qu'on est allé à la rencontre de ses rêves. C'est infiniment plus juste.

---

### 🔐 VAGUE 5 — L'intimité

→ **H9**. Coffre-fort à rêves, protection globale, et la rotation de la clé `service_role` (89 endroits inventoriés, migration sans coupure possible). Pas urgent, à solder un jour calme.

---

## En parallèle, quand tu veux — les chantiers courts

Ceux-là ne dépendent de rien et se font en une session chacun :

| | Quoi | Pourquoi maintenant |
|---|---|---|
| **T1** | **Les 11 dates récupérables d'un tap** | **Le meilleur rapport effort/effet de tout le reste.** Cinq fils du miroir passent du désordre à la ligne du temps. Les dates sont déjà extraites. |
| T2 | Mur + Groupes alignés sur l'étalon CD | Les 2 seuls écrans que la maquette décrit complètement et qu'on n'a pas faits. Aucune décision requise. |
| T3 | Bouton retour Android | Aujourd'hui il **ferme l'app**. ~53 lignes, à faire dans Claude Code. |
| T5 | Coller le prompt Claude Design | 9 lots séparés, pour les 11 écrans jamais maquettés + toute la face jour. |

---

## Les décisions qui n'attendent que toi

Aucune ne demande de crédits — juste ton avis.

1. **La traçabilité.** Tu proposes les sources en bas de texte pour laisser une liberté créative à l'IA. La doctrine §8(d) exige l'inverse : *les rêves sont l'artefact, la prose est l'emballage.* **Ma position** : les deux peuvent cohabiter, mais pas au même endroit. La prose du miroir peut respirer, être belle, prendre des libertés de forme — à condition que **les rêves entiers dont elle est faite soient ouvrables juste en dessous**, dans ton texte, avec leurs dates. Pas une note de bas de page en petit : un accès. La liberté créative porte sur *comment on assemble*, jamais sur *ce qu'on assemble*. Une phrase du miroir qui ne s'adosse à aucun rêve ouvrable n'a pas le droit d'exister — mais la façon de les faire résonner, elle, peut être audacieuse.
2. **Le point 10 du §7** de la doctrine, que tu questionnes doucement.
3. **Le fil `rêve`** du mode « ce que j'en ai dit » : il te touche, ou il te renvoie à ton propre outillage ?
4. **« Flow »** — critère retenu : un acte, pas un lieu.
5. **Le retour de consultation Forêt** sur Weller/Kalsched (utile ? manquait ? surpris ? note sur 5).

---

## Ce qui est à canoniser dès la reprise

Validé par toi, pas encore écrit dans `1_BIBLE.md` :

1. **« Être vu est nécessaire. Être caractérisé déforme. »**
2. **Le biais d'ascension** — une interface qui n'affiche que de la montée fabrique du sentiment d'échec.
3. **L'insistance** comme troisième miroir.
4. **La loi des 16 fruits** — une totalité se rend par ses trous, ses contradictions et ses refus, jamais par son résumé.
5. **Le miroir est beau par montage, pas par écriture.**
6. **La sortie vers un humain** dans le même écran sur la matière lourde.
7. **Le 18ᵉ fruit — « Le Fil »**, engendré le 19/04, jamais construit, avec son garde-fou d'origine.

---

## Comment relancer

Un chat frais par vague, jamais deux vagues dans le même. Coller :

> Lis `/Users/timote/Dev/dream-app/PLAN-REPRISE-JEUDI.md` et `BACKLOG-2026-07-27.md`, puis attaque la VAGUE [n].

Et **une branche par chat** — `yeshua/<sujet>`, partie de `main`. Trois branches attendent encore d'être poussées ou mergées : `yeshua/fix-retour-consultation`, `yeshua/miroir-ce-que-jen-ai-dit`, `yeshua/bulle-kairos`.
