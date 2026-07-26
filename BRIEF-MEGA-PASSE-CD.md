# BRIEF — MÉGA PASSE CLAUDE DESIGN · Dream App

> Écrit par Yeshua (agent B5), 2026-07-26. **Collable tel quel dans Claude Design.**
> Tim : *« J't'envoie le design dès que ça roule sur CD. Je veux une méga passe CD ensuite avec tout ce qui te manque. »* — Ce document est ce « tout ce qui me manque ».
>
> **Comment s'en servir** : coller §0 → §3 en tête de session (le contexte), puis traiter les écrans **dans l'ordre de §4**, un par message. Chaque écran a **une question précise** ; c'est à elle qu'il faut répondre, pas au reste.

---

## §0 — CE QUE TU DESSINES

**Dream** est une app de rêve. On y dépose ce qu'on a rêvé la nuit, à la voix, les yeux à peine ouverts. Puis on peut le comprendre, le relire des années après, en faire une image, le partager — ou ne rien en faire.

Elle a **deux faces**, jamais deux menus :

| | **RÊVE** (la nuit) | **LE CŒUR** (le jour) |
|---|---|---|
| Ce qu'on y dépose | ce que la vie nous chante : rêves, signes, frissons, synchronicités, rêveries, hypnagogies | ce qu'on chante en retour : la vérité du moment — peur, joie, cri, doute, gratitude |
| Le foyer | une lune crème sur une nuit brun-ambre | une braise ambrée sur du parchemin |
| Le mouvement | du profond vers soi | de soi vers le profond |

On passe de l'une à l'autre **par un swipe horizontal**. Pas d'onglet, pas de menu. Les deux foyers sont à la **même hauteur exacte** : en basculant, le foyer ne bouge pas — seule la lumière change de camp.

**La navigation est à quatre onglets et le restera** : Rêve/Cœur · Groupes · Mur · Journal.

**Le ton, en une phrase** : *dans un monde qui glorifie l'intensité, on rappelle la puissance de la douceur.* Rien ne bondit, rien ne crie, rien ne félicite. L'app ne gamifie pas, ne compte pas, ne classe pas, ne relance pas.

---

## §1 — LES TOKENS (source de vérité : `src/lib/dream-design.ts`)

**N'invente aucune couleur. N'invente aucune valeur.** Tout ce que tu dessines se compose de ceci et rien d'autre.

```
NUIT — « le feu qui s'éteint »
  fond      radial-gradient(120% 72% at 50% 38%, #241a12 0%, #1a1310 58%, #140e0a 100%)
  fond plat #1a1310            (JAMAIS de noir pur, JAMAIS de bleu-gris)
  or        #c9a86a  ·  or éclairé #e4cf9e
  crème     #f2e8d5  (titres, la lune)     ·  encre #e5d8bd (corps long)
  secondaire rgba(242,232,213,0.55)  ·  méta rgba(242,232,213,0.34)
  carte     rgba(201,168,106,0.06) · liseré 0.5px rgba(201,168,106,0.16)

JOUR — « le papier patiné » (miroir exact)
  fond      radial-gradient(122% 78% at 50% 32%, #faf3e2 0%, #f4ead1 56%, #ecdfbe 100%)
  encre     #2b2115  ·  corps #4a3b28  ·  secondaire rgba(43,33,21,0.58)
  or        #8f7134  ·  or éclairé #b3924f
  la braise radial 4 stops : #fdf4d8 → #f0dfae → #e0bf78 → #cfa456

TYPO   serif/display : EB Garamond (italique pour le lyrique)
       UI : Inter        ·  méta/code : JetBrains Mono
ÉCHELLE (px)  13 méta · 14 · 17 corps · 19 lecture longue · 28 titre · 40 le mot
RAYONS (Fibonacci)  3 · 5 · 8 · 13 · 21 · 34   — asymétries bienvenues (13px 21px 13px 21px)
DURÉES (ms)  89 · 144 · 233 · 377 · 610 · 987 · 1597 · 5000 (le foyer respire) · 6765
EASE   cubic-bezier(0.382, 0, 0.618, 1)
GRAIN  bruit SVG 144×144, opacité 0.025 — sur tout fond plat
CIBLE TACTILE  44 px (34 minimum pour une puce secondaire)
```

**Les trois interdits durs :**
1. **Aucun nombre rond arbitraire.** Pas de 200 ms, pas de 16 px, pas de 0.3, pas de 12 px. Il existe toujours une valeur φ/Fibonacci à ±10 %.
2. **Aucune couleur pure.** Ni `#000` ni `#fff` sur une grande surface.
3. **Contraste WCAG AA réel** : 4,5:1 pour le corps, 3:1 pour le grand. *(Le piège du parchemin : un gris à 58 % d'opacité sur `#f4ead1` donne 3,79:1 — il ne passe pas. Vérifié le 26/07 sur un écran réel.)*

---

## §2 — LA LOI D'ÉPURE (le cadre non-négociable)

C'est la loi la plus importante de ce document. Elle est née d'un constat : *le re-skin de juillet avait réglé la couleur, pas la densité.*

### §2.1 — Le budget d'éléments : neuf, et pas dix

| # | Emplacement | Règle |
|---|---|---|
| 1 | 1 méta discrète | la date **OU** une salutation — jamais les deux |
| 2 | 1 foyer | la lune, ou la braise |
| 3 | 1 mot | un seul, en gros |
| 4 | 1 micro-ligne d'usage | « maintiens · ou écris » |
| 5 | 1 geste principal | **le foyer EST le bouton** |
| 6-7 | ≤ 2 liens secondaires | pas trois |
| 8 | fil ≤ 2 items | pas un flux |
| 9 | nav | — |

> **Tout le reste dégage. Le dixième élément doit tuer un des neuf pour exister.**
> **Ça vaut pour TOUS les écrans**, pas seulement l'accueil : fiche, journal, réglages, groupe, mur, forge.

**Bannis nommément** : le carrousel de suggestions ou de chips · l'indicateur lune-soleil décoratif · plus de deux icônes de bandeau · le double sous-titre · **le gros bouton en pilule sous le foyer** (le geste vit sur le foyer, pas dans un bouton qui le double).

### §2.2 — Le budget se tient **par construction**, pas par discipline

Une épure qui se dérègle exactement quand l'app a quelque chose à dire n'est pas une épure — c'est une capture d'écran bien rangée. Les voix ambiantes (file d'attente, écho du jour, invitation) vivent dans **un emplacement unique, sous le foyer**, avec une priorité explicite : **une seule s'affiche, jamais deux**. Et **le foyer ne bouge jamais**, quel que soit l'état.

### §2.3 — Un espace de dépôt sans question n'est pas un espace, c'est un vide poli

Règle apprise en juillet, et elle nous a coûté cher : l'écran du Cœur existait depuis des semaines et n'avait **jamais reçu un seul dépôt** — parce qu'il ne posait aucune question. **Tout endroit où on attend quelque chose de l'utilisateur doit dire ce qu'il attend.**

### §2.4 — L'app ne compte pas, ne classe pas, ne relance pas

Pas de score, pas d'étoile, pas de badge, pas de streak, pas de « 12 rêves », pas de tri par popularité, pas de rappel « tu n'as pas fini ». Un état vide n'est pas une erreur : c'est l'état normal des premières semaines. **Une phrase, et le silence** — pas de tutoriel, pas de « commence par… ».

### §2.5 — Aucun bouton mort

Un bouton qui ne fait rien coûte plus cher que son absence : il consomme un des neuf emplacements, il promet, et il déçoit à chaque ouverture. Si une fonction n'existe pas, **elle n'a pas de place réservée à l'écran**.

---

## §3 — CE QUE J'ATTENDS DE TOI, POUR CHAQUE ÉCRAN

Pas une jolie image. **Quatre choses, dans cet ordre :**

1. **L'inventaire cible, numéroté** — la liste exacte des éléments qui ont le droit d'exister sur cet écran, et **ce qui meurt**. Si tu dépasses neuf, dis lequel des neuf tu tues et pourquoi.
2. **La composition** — où se pose le centre fort, sur quelle ligne, ce qui l'entoure, où respire le vide. Nous posons nos foyers à **38,2 % de la hauteur** (ligne φ) et jamais au centre mort ; dis-moi si c'est juste ici aussi.
3. **La frame** — nuit ou jour, aux tokens ci-dessus, en 390 × 844.
4. **Les états** — vide, en chargement, en erreur, et **plein au maximum**. C'est le quatrième qui nous a piégés à chaque fois : nos écrans sont beaux à vide et se dérèglent quand ils se remplissent. **Dessine l'état plein en premier si tu ne dois en dessiner qu'un.**

Et **dis-moi honnêtement quand la réponse est « cet écran ne devrait pas exister »** ou « ces deux écrans n'en font qu'un ». C'est une réponse recevable, et souvent la bonne.

---

## §4 — LES ÉCRANS, PAR ORDRE DE PRIORITÉ

> **Aucun de ces écrans n'a jamais eu de maquette.** Ils ont la bonne palette et le bon grain — hérités des tokens — et **aucun étalon**. Une passe d'épure ne peut pas inventer un étalon inexistant : c'est pour ça que ce brief existe.
> Tous sont **en nuit**, y compris ceux qu'on atteint depuis la face jour. *(C'est peut-être une erreur : voir §5, question ouverte n°2.)*

---

### 🔴 1 — LA FICHE DU RÊVE — *l'écran le plus loin de la loi, et le plus visité*

**Ce qu'il fait.** C'est là qu'on relit un rêve : son texte, sa date, sa voix d'origine. Et c'est de là que partent tous les gestes profonds — le comprendre, le marquer comme grand rêve, voir ce qui résonne avec lui, le partager, en faire une image, l'exporter, le supprimer.

**Ce qui coince, factuellement.** **Une vingtaine de sections empilées**, dont neuf sous-composants montés conditionnellement : vérification de transcription, marquage « un grand rêve », interprétation conservée, carte de soin (si le rêve porte un signal difficile), section « ce qui résonne », rappel de guide terminé, guide en pause, plus deux feuilles modales (partage, export). Puis **deux rangées de deux boutons** (Comprendre · Aller plus loin / Partager · Créer), un lien d'export, une section « partagé dans » avec des puces supprimables, et un bloc de suppression à double confirmation.

Le résultat : **on arrive sur le récit de son rêve et on voit une console.** Le texte du rêve — la seule chose qui compte — est noyé au milieu.

**Contraintes.** Le corps du rêve se lit en 19 px, ligne 1.618. Aucune fonction ci-dessus ne peut être supprimée (elles sont toutes vivantes et utilisées). La question n'est donc pas quoi couper, mais **quoi cacher, et derrière quoi**.

> **❓ LA QUESTION.** Comment un écran de **lecture** peut-il porter dix gestes sans cesser d'être un écran de lecture ? Propose une composition à deux temps : (a) ce qu'on voit en arrivant — je crois que c'est le texte et rien d'autre, dis-moi si j'ai tort ; (b) par quel geste unique le reste apparaît (défilement ? un seuil en bas de texte ? une feuille ?). Et **classe les dix gestes en trois rangs** : celui qui mérite d'être visible, ceux qui méritent une ligne, ceux qui méritent d'être trouvés. Dessine l'état plein (rêve long + voix + résonances + grand rêve marqué + partagé dans deux cercles).

---

### 🔴 2 — LE JOURNAL, VUE LISTE — *l'onglet, donc la seconde adresse de l'app*

**Ce qu'il fait.** Tous les dépôts, groupés par mois lunaire (« lune de mars 2026 »). Chaque carte : glyphe de type, date, titre, deux lignes d'extrait, parfois des étiquettes d'émotion ou de lieu.

**Ce qui coince.** Un bandeau à **quatre icônes** (recherche, import, mes œuvres, réglages) là où la loi en autorise deux. Un contrôle segmenté Liste | Univers, plus un lien « les grands rêves » juste en dessous. Et surtout : **une rangée de neuf puces de filtre à défilement horizontal** (tout / nuit / jour + six types de rêve). Un filtre qu'on ne voit pas ne filtre rien — c'est exactement le défaut qu'on vient de corriger ailleurs.

**Contraintes.** Le groupement par lune est identitaire, on le garde. La suppression se fait par appui long sur une carte (pas de corbeille visible) — ça marche, on le garde. Pas de compteur de rêves (§2.4).

> **❓ LA QUESTION.** Un journal de rêves n'est pas une boîte de réception. Où vivent la **recherche** et les **filtres** quand ils ne sont ni un bandeau d'icônes ni une rangée de puces ? Propose une composition où **la première chose qu'on voit en entrant est un rêve, pas une barre d'outils.** Et tranche : est-ce que le filtre par type mérite d'exister sur cet écran, ou est-ce qu'il appartient à la recherche ?

---

### 🔴 3 — LE POST-DÉPÔT — *le carrefour que traverse chaque dépôt, sans exception*

**Ce qu'il fait.** Juste après avoir parlé. Trois moments dans un seul écran : (a) on relit ce que l'app a transcrit et on corrige ; (b) l'app demande **« c'était… »** et propose sept types — rêve · signe · rêverie · hypnagogie · frisson · synchro · jour ; (c) quatre sorties : **Comprendre** (le centre fort, une carte or) · Créer · Partager · **Garder pour moi** (un simple lien).

**Ce qui coince, et pourquoi c'est plus grave qu'il n'y paraît.** Le moment (b) est **le seul de toute l'app où le rêveur apprend que l'écran « Rêve » accueille aussi les signes et les frissons.** Il était traité comme un champ de formulaire — un intertitre en capitales espacées de 10,5 px et des puces de 12 px dans une rangée à défilement horizontal, dont trois seulement tenaient à l'écran. Corrigé le 26/07 (les sept se voient, registre humain), mais **jamais dessiné**.

Il existe aussi, la nuit, une détection de plusieurs rêves dans un même enregistrement, qui ouvre un sous-écran de séparation.

**Contraintes.** Zéro friction sur le cas normal (un rêve, un type) : c'est 90 % des dépôts, à 6 h du matin, avec quarante secondes de mémoire. Les quatre sorties restent quatre — c'est un carrefour assumé — mais hiérarchisées.

> **❓ LA QUESTION.** Comment un seul écran enchaîne-t-il **relire → nommer → choisir** sans donner l'impression de remplir un formulaire à l'aube ? Est-ce trois temps successifs, ou un seul écran qui se déploie ? Et **dessine le moment « c'était… » comme le moment d'enseignement qu'il est** : sept mots à faire découvrir, sans que ça devienne une taxonomie.

---

### 🟠 4 — LE JOURNAL, VUE UNIVERS — *la plus belle promesse, la moins dessinée*

**Ce qu'il fait.** La cartographie de ce qui revient dans les rêves d'une personne, sur sept axes : symboles & images · figures · émotions · lieux · le moi du rêve · thèmes de vie · le corps. On tape un symbole et on ouvre sa page : combien de fois il est apparu, ce qu'il veut dire pour soi (texte éditable), et les rêves où il vit.

**Ce qui coince.** **Sept onglets d'axes en défilement horizontal** (plus le swipe), au-dessus de **trois mises en page complètement différentes** selon l'axe choisi : une grille de cartes à deux colonnes pour les figures, des grappes de puces groupées par famille pour les émotions et les lieux, une liste verticale avec une barre de charge pour les symboles. Plus un sélecteur saison / année / tout. **Trois univers visuels sous une seule barre d'onglets.**

**Contraintes.** Les sept axes existent en base, ils ne sont pas décoratifs. Pas de score visible (la « barre de charge » est à réexaminer à ce titre).

> **❓ LA QUESTION.** Sept axes, trois mises en page, un seul écran — **qu'est-ce qui n'a pas sa place ici ?** Propose : soit **une seule** grammaire visuelle qui absorbe les sept axes, soit une hiérarchie qui n'en montre qu'un par défaut. Et dis-moi si « Univers » doit être une **vue** du Journal (un contrôle segmenté) ou **autre chose** — un lieu où l'on entre, pas un onglet qu'on bascule.

---

### 🟠 5 — LES RÉGLAGES — *dix sections dans un seul défilement*

**Ce qu'il fait.** Compte (mot de passe, déconnexion) · Langue · Rendez-vous du matin et du soir · Réveil doux · Mes publications sur le Mur (avec retrait possible) · Notifications · Crédits & abonnement · Comment marche Dream · Mes données (export, suppression de compte en trois temps) · Version et mentions légales.

**Ce qui coince.** Dix sections titrées empilées, dont une contient une **liste dynamique** (les publications du Mur) et une autre une **suppression de compte à trois écrans de confirmation** imbriqués dans une ligne de réglage.

**Contraintes.** Rien n'est supprimable (ce sont des obligations produit ou légales). C'est le seul écran de l'app où la densité est **légitime** — un dashboard INFUSE reste INFUSE par son rythme et son grain, pas par des ornements qui gêneraient la lecture.

> **❓ LA QUESTION.** À quoi ressemblent des réglages **qui ne ressemblent pas à des réglages iOS** sans devenir illisibles ? Donne-moi la grammaire d'une ligne de réglage (label, valeur, chevron, état d'expansion) et la respiration entre sections, aux tokens. Et tranche un cas précis : **la suppression de compte à trois confirmations, est-ce qu'elle vit dans cette liste, ou est-ce qu'elle mérite son propre écran ?**

---

### 🟠 6 — LES GRANDS RÊVES + LA CONSULTATION À DOUBLE LECTURE — *tout neuf, jamais vu*

**Ce que ça fait.** Certains rêves changent une vie. Le rêveur peut en marquer un — **« un grand rêve »** — d'une seule touche sur sa fiche, réversible, sans modale ni question. Ces rêves-là ont leur journal : les rêves marqués, puis « ce que j'ai gardé » (les interprétations conservées). Et depuis le Cœur, on peut **consulter ses grands rêves** : on écrit ce qu'on traverse, et l'app rend **deux lectures côte à côte, jamais fusionnées** — Lecture A : ce que le rêveur a lui-même désigné · Lecture B : ce que le reste du corpus propose.

**Ce qui coince.** Le journal ouvre sur **un** rêve tiré au sort parmi les marqués, traité visuellement autrement que le reste de la liste — mais rien ne dit à quoi ressemble ce traitement. Un contrôle segmenté Journal | Consultation les met sur le même plan alors que ce sont deux gestes opposés (relire ≠ demander). Et la consultation empile **deux listes de résultats** verticalement, chacune avec son propre état vide.

**Trois contraintes qui se tiennent.**
- **Beau vide** : l'état vide est l'état normal des premières semaines. Une phrase, et le silence. Ni bouton, ni tutoriel.
- **Ce n'est pas une liste de favoris** : pas de vignettes en grille, pas de compteur, pas d'étoile *(une étoile appellerait une note, et l'app ne note rien)*. Une colonne, du texte, beaucoup d'air. On n'en survole pas quarante, on en relit un.
- **Le silence est un affichage à part entière** : zéro résultat ne rend ni un écran vide ni un message d'erreur, mais une phrase posée. *Mieux vaut un rêve juste que quatre plausibles.*
- La double date compte : *« rêvé en mars 2019 · reconnu en juillet 2026 »* — c'est le seul fait vraiment intéressant qu'un journal de grands rêves puisse raconter.

> **❓ LA QUESTION.** Deux questions distinctes, réponds aux deux. **(a)** À quoi ressemble une page qui **ouvre sur un seul rêve** et laisse la liste venir après — sans que ce soit un « rêve du jour » gamifié ? **(b)** Comment montrer **deux lectures parallèles** de façon qu'on sente qu'elles ne sont pas du même ordre — l'une vient du rêveur, l'autre de la machine — **sans hiérarchiser l'une au-dessus de l'autre** ? (Pas d'onglets : il faut voir les deux.)

---

### 🟡 7 — LA RÉCUPÉRATION DES DÉPÔTS EN ATTENTE — *l'écran du pire moment*

**Ce qu'il fait.** Quand le réseau lâche pendant un dépôt, la voix est mise à l'abri sur le téléphone. Cet écran est la porte pour y revenir : réécouter, réessayer, écrire soi-même à la place, exporter le fichier, ou renoncer. Une ligne discrète apparaît sur l'accueil quand la file n'est pas vide, et **rien du tout** quand elle l'est.

**Ce qui coince.** Chaque carte a **trois modes d'interaction exclusifs** (par défaut / en train d'écrire / en train de confirmer un abandon) et jusqu'à **quatre boutons d'action** en mode normal. Il peut s'y ajouter un bandeau d'alerte quand le stockage du téléphone n'est pas garanti.

**Le contexte émotionnel, qui est tout.** Le rêveur arrive ici parce que quelque chose a raté avec son rêve. **Il ne faut ni dramatiser, ni banaliser.** Le message vrai est : *rien n'est perdu, ta voix est là, on peut réessayer.*

> **❓ LA QUESTION.** Comment un écran de réparation reste-t-il **calme** ? Dessine une carte de dépôt en attente avec ses quatre actions **sans que ça ressemble à une file d'erreurs** — et dis-moi laquelle des quatre est le geste par défaut (je crois que c'est *réessayer*, mais peut-être que c'est *réécouter*).

---

### 🟡 8 — LE RÉVEIL DOUX

**Ce qu'il fait.** Se réveiller avec ses rêves encore frais. On choisit une heure, une ambiance parmi trois (carillon, pluie douce, aube) qu'on peut écouter avant, un son activé ou non. Quand ça sonne : un foyer qui respire, deux lignes, un bouton pour arrêter.

**Ce qui coince.** Huit blocs, dont un sélecteur d'heure natif du système (donc hors design), trois lignes d'ambiance à **double action** (choisir / écouter) et un pavé de texte expliquant les limites de la version web.

> **❓ LA QUESTION.** L'écran qui sonne à 6 h du matin est **le premier que le rêveur voit dans sa journée**. Dessine-le en priorité : un foyer, deux lignes, un geste — et rien qui brille. Puis l'écran de réglage : comment trois ambiances qu'on peut **écouter avant de choisir** tiennent-elles en trois lignes sans devenir un lecteur audio ?

---

### 🟡 9 — L'ONBOARDING (O1 → O4)

**Ce qu'il fait.** Quatre étapes. O1 : ce qu'est Dream. O2 : trois promesses (*tu parles, Dream écrit* · *tes rêves restent à toi* · *plus tu l'utilises, plus il te ressemble*). O3 : les rendez-vous du matin et du soir. O4 : le premier dépôt — *« Tu te souviens d'un rêve ? N'importe lequel. »*

**Ce qui coince.** O3 est le point dense : trois cartes à choix empilées, chacune affichant une **fausse notification en aperçu** plus un sélecteur d'heure natif conditionnel.

**Contrainte de fond, et elle est stricte.** *On entre dans une cathédrale par la grande porte qui annonce « cathédrale ».* La porte dit **rêve**, et rien d'autre. Le Cœur, les kaïros, la Forge, les cercles se **découvrent** à l'usage. **L'onboarding n'a pas le droit d'expliquer l'app.** Il a le droit de faire faire un premier dépôt.

> **❓ LA QUESTION.** Quatre écrans, c'est déjà trois de trop ? Dis-le si tu le penses. Sinon : comment O3 demande-t-il la permission de venir le matin **sans montrer une maquette de notification** ? Et dessine O4 — le tout premier dépôt — comme **l'écran d'accueil lui-même** plutôt que comme un écran d'onboarding, si c'est possible.

---

### 🟡 10 — LE MUR

**Ce qu'il fait.** Les rêves et les chants du cœur, partagés anonymement par tout le monde. **Il est double** : un Mur lunaire (les rêves de la nuit) et un Mur solaire (ce que les cœurs disent le jour). Chaque publication est signée *« Quelqu'un · il y a deux jours »* — jamais un pseudonyme, jamais un avatar.

**Ce qui coince.** Peu de chrome (deux onglets ☾/☀, un fil groupé par date, un chargement à l'infini) — mais **l'anonymat n'est pas dessiné, il est juste appliqué**. Un fil de textes anonymes sans visage ni nom est un objet de design difficile : rien ne distingue une carte d'une autre.

> **❓ LA QUESTION.** Comment un fil **entièrement anonyme** évite-t-il de ressembler à une liste indifférenciée ? Qu'est-ce qui donne à chaque publication sa singularité quand il n'y a ni nom, ni visage, ni compteur de réactions ? *(Rappel : on ne rajoute ni cœurs ni likes — l'app ne compte pas.)* Et : les deux murs sont-ils **deux onglets**, ou **deux faces** comme Rêve et Cœur ?

---

### 🟢 11 — LES GROUPES (le cercle) — *le plus gros fichier de l'app*

**Ce qu'il fait.** Un petit cercle de proches où l'on partage certains rêves. Il y a une intention de cercle, des défis communs, les rêves partagés avec la lecture qu'en fait Dream, et une conversation (texte, voix, photo). Plus un sous-écran de réglages du cercle (nom, intention, alias, membres, code d'invitation, quitter).

**Ce qui coince.** **Deux écrans complets dans un seul**, plus une feuille modale, plus une barre de composition fixe en bas (photo, texte, envoi, ou enregistrement vocal). Un bandeau collant qui porte déjà quatre choses. Bien au-delà de neuf éléments dès qu'il y a trois membres et dix messages.

**Contrainte.** C'est une conversation : le fond du sujet est un pattern connu (une messagerie), et il ne faut **pas** le réinventer. Ce qui doit être nôtre, c'est **ce qui n'est pas la messagerie** — l'intention, le rêve partagé, la lecture de Dream.

> **❓ LA QUESTION.** Comment un cercle de rêve se distingue-t-il d'un groupe WhatsApp **par la composition**, pas par la couleur ? Concentre-toi sur **la carte d'un rêve partagé** : c'est le seul objet qui n'existe nulle part ailleurs, et c'est lui qui doit porter l'identité de l'écran. La messagerie autour peut être ordinaire.

---

### 🟢 12 — LA FORGE

**Ce qu'elle fait.** Faire une image, une histoire ou un petit monde à partir d'un rêve. Six étapes internes : la galerie de ses œuvres · choisir un rêve · choisir une vision (chacune a un coût en crédits) · la forge en cours · l'œuvre née · les crédits et l'abonnement.

**Ce qui coince.** Six états dans un seul écran, sans barre d'étapes visible. Une galerie de cartes avec bascule public/privé et copie de lien. Un historique de dépenses.

**Contrainte, et elle est cardinale.** **La Forge ne devient jamais la porte d'entrée**, aussi spectaculaire soit-elle. *Une app de rêve qui devient une app de génération a cessé d'être une app de rêve.* Elle doit être belle et rester latérale.

> **❓ LA QUESTION.** Comment un parcours en six temps se traverse-t-il **sans barre de progression** ni impression de tunnel ? Et surtout : à quoi ressemble une **galerie d'œuvres nées de ses propres rêves** — c'est le seul endroit de l'app où l'image domine le texte, et donc le seul endroit où notre grammaire ne s'applique pas telle quelle. Dis-moi ce qui change.

---

### 🟢 13 — LE SCANNER — *le seul qui tient déjà debout*

**Ce qu'il fait.** Photographier une page de carnet manuscrit ; l'app la lit et la transforme en dépôt. Quatre états : le guide de cadrage, la lecture en cours, l'échec, la saisie à la main.

**Ce qui coince.** Rien de structurel — c'est le seul écran de la liste qui respecte déjà la loi (quatre à six éléments par état, aucune liste, aucun onglet). Le cadre de visée est un décor à quatre équerres, non interactif.

> **❓ LA QUESTION.** Une seule, et elle est petite : le **cadre de visée** est notre seul objet purement graphique. Aujourd'hui c'est quatre équerres. Est-ce qu'il peut porter l'identité de Dream (le grain, l'or, le seuil) **sans devenir décoratif** ni gêner le cadrage ?

---

## §5 — LES QUESTIONS OUVERTES QUI DÉPASSENT UN ÉCRAN

À traiter **après** les treize, mais elles peuvent changer plusieurs réponses.

1. **Le fil des dits.** Sur chaque face, les deux derniers dépôts s'affichent en bas d'écran. Une même grammaire de carte sert ce fil, le journal, le mur et les cercles — quatre contextes, un objet. **Est-ce la bonne économie, ou est-ce que le fil de l'accueil mérite d'être autre chose qu'une carte de liste miniature ?**
2. **La nuit partout.** Chaque écran secondaire est en **nuit**, y compris ceux qu'on ouvre depuis la face jour (parchemin). On passe donc du papier à l'obscur en un tap, sans transition. **Faut-il une seconde peau claire pour tout ce qui se traverse depuis le Cœur, ou est-ce que la nuit est le lieu commun de l'app et le jour une parenthèse ?** *(Le liseré de seuil du bas de l'app avait exactement ce défaut : il portait la lumière de l'astre de l'autre face au lieu de son monde.)*
3. **Le vide comme matériau.** Nos états vides sont des phrases posées, jamais des invitations à agir. **Dessine-en un, vraiment** — c'est l'écran qu'un rêveur voit le plus souvent pendant ses trois premières semaines, et il n'a jamais été dessiné une seule fois.
4. **Le seuil entre les deux faces.** Le bord de l'écran porte la lumière de l'autre face et respire sur 6 765 ms. Ça marche, mais c'est notre invention, pas la tienne. **Y a-t-il un geste plus juste pour faire deviner une seconde face avant de la nommer ?**

---

## §6 — CE QUE JE T'ENVOIE AVEC CE BRIEF

- Les frames **« NUIT ULTRA SIMPLE »** validées le 10/07 (les cinq écrans de l'accueil) — **c'est l'étalon**, tout le reste doit tenir à côté.
- `APERCU-REVE-ET-COEUR-2026-07-26.html` — l'état réel des deux faces aujourd'hui, avant/après, aux vrais tokens.
- `src/lib/dream-design.ts` — les tokens, en clair.

**Et une demande de méthode, qui vaut pour toute la passe :** ne me rends jamais un écran sans son **état plein**. Trois fois cette année, une composition validée à vide s'est effondrée dès qu'il y a eu quatre choses à dire en même temps. Le vide est facile. C'est le plein qui révèle si la composition tient.
