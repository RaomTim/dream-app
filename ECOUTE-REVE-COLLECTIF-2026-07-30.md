# Écoute — le rêve comme pratique collective

**Date** : 2026-07-30 · **Corpus** : Forêt INFUSE, 409 livres / 98 123 chunks (93 190 vectorisés)
**Méthode** : ~90 requêtes vectorielles (`match_forest_chunks`, text-embedding-3-small), la majorité **en excluant les 24 livres de la racine `rêve`** pour forcer les trouvailles hors rayon ; complétées par des recherches lexicales `ilike`/regex et des lectures séquentielles de chunks.
**Convention de source** : `[TEXTE]` = passage lu intégralement dans `forest_chunks` · `[DIGEST]` = lu dans `digest_tier1`/`digest_tier2`, le livre n'a pas de chunks. Aucune citation ici n'a été écrite sans avoir été ouverte.
**Vérification de slug** : chaque livre cité a été confronté à sa propre page de titre / ses têtes de page courantes. Les sept plus chargés (`wolff-original-wisdom`, `chatwin-the-songlines`, `neale-kelly-songlines`, `sveiby-treading-lightly`, `seeley-honeybee-democracy`, `ingold-perception-of-environment`, `hunt-multiplicity-of-dreams`, `von-franz-interpretation-fairy-tales`) sont conformes. Pas de nouveau cas type `jung-red-book`.

---

## Ce que la recherche a renversé d'entrée

Trois corrections avant les pépites, parce qu'elles changent la lecture de tout le reste.

**① Le rayon « rêve » est le mauvais rayon.** 24 livres, dont **8 de Robert Moss seul** (2 179 chunks à lui). Le reste : Delaney, Hill, Bulkeley, LaBerge, Gendlin, Hillman, von Franz, Taylor, Kaplan Williams. Un manuel de dreamwork thérapeutique occidental, plus un auteur unique surreprésenté. Sur le rêve collectif ce rayon donne surtout **Jeremy Taylor** (groupe de partage volontaire, format atelier) et rien sur l'obligation, la dette, le territoire ou la propriété du rêve. **L'intuition de Tim est exacte** : tout ce qui suit vient d'ailleurs.

**② Le « trou d'Afrique australe » n'existe pas — il n'avait juste jamais été cherché.** La base contient :
- `sobiecki-southern-african-psychoactive-plants` — **133 chunks**, Jean-François Sobiecki, *Southern African Psychoactive & Ubulawu Dream Plants*, articles publiés (Journal of Psychoactive Drugs 44(3), Southern African Humanities 20). **C'est exactement l'épistémologie du rêve xhosa/zulu qu'on croyait absente.**
- `ngubane-body-mind-zulu-medicine` — **187 chunks**, Harriet Ngubane, *Body and Mind in Zulu Medicine*. **Anthropologue zulu, voix interne.**
- `cumes-africa-in-my-bones` — 126 chunks, David Cumes, chirurgien formé auprès de sangomas, chapitre entier « Ancestral Dreams ».
- `mutwa-indaba-my-children` — 476 chunks (à manier avec la réserve de la politique éthique).

La ligne ⓐ du brief est donc **fausse et doit être retirée** du 1_BIBLE si elle y figure. Détail en §5.

**③ Ullman : confirmé absent.** Zéro chunk, zéro digest, zéro mention indexée. Le retrait de l'affirmation du 1_BIBLE était juste. **Et ce n'est pas un trou** : ce que le 1_BIBLE cherchait chez Ullman existe ailleurs, en meilleur, en première main — voir la pépite ①.

---

# 1. LES PÉPITES

Organisées par **ce qu'elles enseignent**. Les cinq premières sont les trouvailles hors rayon — le pari de Tim.

---

## ① Le protocole du cercle du matin, en première main — et ce n'est pas Kilton Stewart

> **`wolff-original-wisdom`** — Robert Wolff, *Original Wisdom: Stories of an Ancient Way of Knowing*, Inner Traditions. **Racine : `invisible`. Pas dans le rayon rêve.** [TEXTE]

**Ce qu'il y a d'énorme ici** : Wolff, psychologue élevé en Indonésie, a vécu dans les années 1960 chez les **Sng'oi** de Malaisie — ce sont **les mêmes gens que la littérature appelle « Senoi »**. Il parlait leur langue. La préface de Thom Hartmann le pose explicitement (p.8, idx4) :

> « A few books have been written about them, often dismissed as fanciful and one even as fictional, but none written (to the best of my knowledge) by people who actually lived among them and spoke their language. But Robert Wolff did. »

**Le corpus lui-même signale le problème Kilton Stewart.** Et le récit de Wolff ne ressemble en rien à la légende Senoi (contrôle du rêve, « affronte ton ennemi », entraînement des enfants). Ce qu'il décrit est autre chose, et bien meilleur pour nous.

**Le protocole, p.96-97 (idx81)** :

> « In the morning, we might not all wake up at the same time, but those who woke up early would lie quietly, waiting for more people to awaken. And somehow, as if by magic, we would find ourselves sitting in a circle, rubbing our eyes, stretching to get the kinks out. One person would say, "I saw a bird, a beautiful bird." Someone else would say, "Yes, I too saw a bird." "What kind of bird was it?" another would ask. **And so we would create a story with images from our dreams. They did not think that they were sharing dreams as we think of dreams.** The Sng'oi believe that the world we live in is a shadow world, and that the real world is behind it. At night, they believe, we visit that real world, and in the morning we share what we saw and learned there. **The story that was created around the memories that four or five people brought back from the real world set the tone for the day.** Sometimes one of the group would take the lead in soliciting input from each person in the room: How about you? What do you remember? Other times the story flowed without help. **A few times no story emerged at all.** It was very obvious that when a more or less coherent story was created around the images we shared, we who had slept in that shelter would live that story that day. »

**La diffusion, p.97-98 (idx82)** :

> « Occasionally the stories were about things that affected all of them, all the people in that settlement, or perhaps even all the Sng'oi. In that case they would make it a point to share with the people who had slept in other shelters as soon as possible. **It might take all morning to disseminate the story to everyone. I did not witness any attempts to call a meeting**, but it was obvious that when a serious story came out of a morning's dream telling, all the people in the settlement would eventually hear that story. »

**L'attribution collective, p.99-100 (idx84)** — le moment le plus important du corpus entier. Wolff raconte un rêve de chien qui aboie. Le groupe l'interroge : était-ce la nuit ? un aboiement continu ou sec ? Une petite fille dit avoir entendu le même son, mais comme la toux d'un tigre. Un homme demande à Wolff s'il a déjà rêvé de tigres. Oui, souvent.

> « "In that case," the woman said, **"the warning is for you, and not for us."** She looked around our little group and asked if anyone else remembered any kind of warning. […] "In that case," said the woman who had taken on the role of interpreter this morning, as she turned to the little girl, **"it means that you heard the warning that Bah Woo heard. You heard the warning that was meant for him."** She turned to me then and said, "Maybe the danger is at your house, not here." All of the people in the circle looked at me with compassion. The man on my left put his hand on my arm and said, **"Somebody at home needs you."** »

Wolff rentre. Un de ses enfants était en urgence médicale.

**Et p.100-101 (idx85)**, l'aveu méthodologique :

> « There is something very powerful about discussing memories from the real world with a group of people that you have spent the night with, huddled together. […] I got used to spending a few minutes every morning […] remembering what I could of my experiences in the dream world. **Doing it by myself did not work as well as doing it with a group of people**, but often I discovered a message, a theme that colored my day. »

Et plus loin (p.101-102, idx86), seul et terrifié par un cauchemar, il **simule mentalement le cercle** — il imagine six personnes autour de lui et joue leurs questions. Ça marche.

### Ce que ça change pour une app de rêve partagé

C'est un protocole complet, testé, et **il contredit frontalement le design par défaut d'une app de rêve** :

| Le réflexe produit | Ce que fait le cercle Sng'oi |
|---|---|
| Chacun poste son rêve entier, puis on lit les rêves des autres | **Un fragment à la fois** — « j'ai vu un oiseau ». Le récit long vient après, ou jamais |
| Chaque rêve reste attaché à son auteur | **Le groupe compose UNE histoire** à partir des fragments de tous |
| Interpréter = donner un sens | **Interpréter = poser des questions factuelles** (nuit ou jour ? sec ou continu ? déjà rêvé de ça ?) jusqu'à ce que l'attribution tombe |
| Le rêve appartient au rêveur | **Le groupe décide à qui le rêve s'adresse** — et peut le réassigner : « tu as entendu l'avertissement qui lui était destiné » |
| Sortie = une interprétation | **Sortie = une orientation pour la journée**, vécue ensemble |
| Il faut toujours produire quelque chose | **« A few times no story emerged at all »** — le silence est un résultat valide |
| Alerte push instantanée à tout le monde | **La diffusion prend la matinée, de foyer en foyer. Personne ne convoque de réunion.** |

Trois specs directement dérivables :
1. **Mode « fragment »** en ouverture de cercle : chaque membre ne peut poster qu'une image courte (≤ 1 ligne / 1 image) tant que le tour n'est pas complet. Le récit long se déverrouille après.
2. **Composition collective** : l'app propose un objet « récit du matin » qui appartient au cercle, pas à un membre — tissé des fragments, éditable par tous, avec attribution visible de chaque fragment.
3. **Bouton « ce rêve est pour X »** : un membre peut proposer qu'un rêve concerne quelqu'un d'autre. Le rêveur ne perd pas son rêve ; il gagne un destinataire.

**Alerte éthique** — Wolff : `ethical_notes` vide en base, mais le contenu est une communauté autochtone nommée (Sng'oi, Malaisie). Nommer le peuple, nommer Wolff, ne jamais dire « méthode Senoi ». Rappeler que les Sng'oi ne « partageaient pas des rêves » au sens où nous l'entendons.

---

## ② Le rêve raconté au foyer, chaque matin, avec escalade — et le rêve qui s'accumule en objet héritable

> **`prechtel-secrets-talking-jaguar`** — Martín Prechtel, *Secrets of the Talking Jaguar*, Tzutujil Maya (Santiago Atitlán, Guatemala). **Racine : `anciens`.** [TEXTE]

**Le rituel domestique, p.189-190 (idx163)** :

> « Early every morning, all village families gather around the warm, fragrant open flames of the cooking hut's hearth. […] **each person begins recounting his dreams. By skillfully reading the family dreams every morning, a grandma or grandfather can help all the members of the compound navigate through the many dangers of this hard earth-oriented struggle for life.** They may even be able to direct their families to some unseen opportunities. **No Tzutujil disregards his dreams. If the dreams are overly disturbing or more powerful than usual, or if they startle you awake, then shamans are approached for a ritual interpretation.** »

**Un système à deux étages, avec un seuil de déclenchement explicite** : le foyer traite l'ordinaire ; l'anormal (« disturbing », « more powerful than usual », « startle you awake ») **sort du foyer** et monte au spécialiste. Ce n'est pas un choix de l'utilisateur, c'est une propriété du rêve.

**La propriété qui n'en est pas une, p.190-191 (idx164)** :

> « **Dreams are a direct, incorruptible expression of the mysterious nature of life and are considered to be free of human connivance. Because of this, people trusted dreams more than they trusted people.** The term for reading a dream was *n Tzikij*, the same word used for calling animals and weather. »

Et : « **A shaman's bundle is essentially a bundle of dreams.** One could inherit a bundle from one's teacher or a grandfather or grandmother. »

**L'archive héritée, p.192-193 (idx166)** :

> « When a shaman got old, he or she might transfer one of these bundles to a new shaman, and **the recipient would add his own dreams to the old bundle. But the new bundle holder would have to maintain the original feeding specifications and ritual taboos associated with the original bundle, on top of those belonging to the new shaman.** When one of these old bundles had been passed for several centuries, then a lot of varied ritual had been formulated. »

**Le refus de l'interprétation, p.191-192 (idx165)** :

> « **Shamans are not interested in the meanings in these kinds of dreams and therefore do not want to preserve the meanings. They are after the heart or power of the dream.** »

**Le tabou d'accès** : « no one but the shaman is allowed to touch them, address them, or speak of them. »

### Ce que ça change

- **L'escalade est une fonction, pas un réglage.** Un rêve qui réveille en sursaut ne se traite pas comme un rêve ordinaire. L'app peut détecter le signal (réveil nocturne, marqueur « ça m'a réveillé », intensité déclarée) et **proposer d'elle-même** de sortir du cercle familial vers un cadre plus tenu. Aujourd'hui l'app suppose que tous les rêves ont le même poids social.
- **Un cercle accumule un « bundle ».** Pas un feed — un **objet qui grossit et se transmet**, avec des règles attachées héritées de ses fondateurs. Quand un nouveau membre rejoint un cercle ancien, il hérite des obligations, il n'arrive pas dans un flux vierge. C'est l'anti-feed absolu, et c'est directement implémentable : `circle_bundle` avec `inherited_rules[]` non modifiables par les entrants.
- **« They are after the heart or power of the dream, not the meaning. »** Une app de rêve qui pousse à interpréter fait exactement ce que le chamane tzutujil refuse. Sortie possible : bouton **« garder le cœur »** — on conserve l'image, la charge, la phrase, sans jamais demander « qu'est-ce que ça veut dire ».
- **Il y a des choses qu'on ne montre pas, même à son cercle.** Le bundle a un tabou de toucher.

---

## ③ Chatwin : le chant comme titre de propriété — on le prête, on l'emprunte, on ne le vend jamais

> **`chatwin-the-songlines`** — Bruce Chatwin, *The Songlines*, Penguin. **Racine : `parole`. Récit de voyage. Personne ne cherche un régime de propriété du rêve dans un livre de voyage.** [TEXTE, p.61-62]

> « A man's verses were his title deeds to territory. **He could lend them to others. He could borrow other verses in return. The one thing he couldn't do was sell or get rid of them.** […] Supposing the Elders of a Carpet Snake clan decided it was time to sing their song cycle from beginning to end? Messages would be sent out, up and down the track, summoning song-owners to assemble at the Big Place. One after the other, each 'owner' would then sing his stretch of the Ancestor's footprints. **Always in the correct sequence!** 'To sing a verse out of order', Flynn said sombrely, 'was a crime. Usually meant the death penalty.' »

Et p.16-17 : « A song was both map and direction-finder. Providing you knew the song, you could always find your way across country. »

### Ce que ça change

**C'est le modèle de droits qu'il faut pour un rêve partagé, et il n'existe dans aucune app.** Trois verbes, pas deux :

| Verbe | Ce que ça veut dire dans l'app | Ce que ça remplace |
|---|---|---|
| **Prêter** (`lend`) | Je donne accès à mon rêve à quelqu'un, pour une durée, révocable | « partager » (irréversible) |
| **Emprunter** (`borrow`) | Je reçois le rêve d'un autre en dépôt, avec obligation d'en prendre soin | « voir » (passif) |
| **Ne pas céder** (`inalienable`) | Aucune action ne transfère la propriété. Jamais. Pas d'export, pas de repost, pas de vente, pas d'entraînement de modèle | rien — c'est absent partout |

Et la **séquence** : un cycle de chant se chante dans l'ordre, chaque propriétaire son tronçon. Traduction produit : un **cercle peut ouvrir un « cycle »** où chaque membre a un tour et un seul, dans un ordre fixé, et où **prendre le tour d'un autre est une faute**, pas une contribution. C'est l'exact inverse du fil de commentaires.

---

## ④ Seeley : les abeilles savent à combien on décide — et pourquoi le vote secret d'abord

> **`seeley-honeybee-democracy`** — Thomas D. Seeley, *Honeybee Democracy*, Princeton. **Racine : `vivant`. Un livre d'entomologie.** [TEXTE]

**Le quorum comme arbitrage vitesse/justesse, p.221-222** :

> « We found that **adjusting the number downward from its normal value—some 15 bees present simultaneously outside the nest site—caused swarms to make quick but error-prone decisions, while adjusting it upward gave rise to slower but only slightly more accurate decisions.** It looks, therefore, like the bees normally operate with a quorum set high enough to guarantee that swarms make highly accurate decisions rather than super speedy ones. »

**Démocratie unitaire vs adversariale, p.127-128** :

> « This kind of group decision making has been called "adversary democracy" because it arises from a group of individuals who have conflicting interests and different preferences. In contrast, the group decision making of swarm bees is **"unitary democracy"** since it involves individuals who have congruent interests […] and shared preferences. »

**Leçon 1, p.228-229** : « Compose the Decision-Making Group of Individuals with Shared Interests and Mutual Respect. »
**Leçon 5, p.238-239** : « To have independent opinion, free of peer pressure that could produce conformity, they realized that **voting by secret ballot is the best way to know our true collective judgment on an issue.** »
Et p.231-232, le contre-exemple : un leader qui annonce sa position en premier produit **un consensus prématuré**.

### Ce que ça change

C'est la **mécanique manquante** des cercles d'intention. Trois paramètres chiffrables là où on n'avait que des intentions :

1. **Seuil de quorum ajustable par cercle.** Un cercle de deuil (justesse > vitesse) monte son quorum : la synthèse du cercle n'apparaît qu'à partir de N contributions. Un cercle de projet le baisse. **Exposer ce réglage, avec le trade-off nommé** : « plus haut = plus juste, plus lent ».
2. **Contribution indépendante AVANT lecture.** Chacun dépose son fragment **sans voir ceux des autres**, puis le tour s'ouvre. C'est le vote à bulletin secret des abeilles, et ça supprime mécaniquement l'ancrage.
3. **Interdit de leader.** Le fondateur du cercle **ne peut pas** déposer en premier. Techniquement : ordre de révélation randomisé, ou fondateur forcé en dernier.

Un livre sur les abeilles vient de résoudre le problème d'ancrage du rêve de groupe. C'est exactement le genre d'endroit dont Tim parlait.

---

## ⑤ Zuboff : le sanctuaire est la première citadelle à tomber

> **`zuboff-surveillance-capitalism`** — Shoshana Zuboff, *The Age of Surveillance Capitalism*. **Racine : `lien`. 41 chunks contenant « dream ».** [TEXTE, p.128-129, idx509-512]

Zuboff ouvre son chapitre sur le sanctuaire… **par Bachelard et le rêve** :

> « The house shelters daydreaming, the house protects the dreamer, the house allows one to dream in peace. »

Puis :

> « According to Big Other's architects, **these walls must come down. There can be no refuge.** […] There can be no corners in which to curl up and taste the pleasures of solitary inwardness. There can be no secret hiding places because there can be no secrets. […] **In the march of institutional interests intent on implementing Big Other, the very first citadel to fall is the most ancient: the principle of sanctuary.** […] The Greek word *asylon* means "unplunderable". »

Et la ligne qui devrait être punaisée au-dessus de l'écran de tout designer d'app de rêve :

> « the crucial developmental challenges of the self-other balance cannot be negotiated adequately without the sanctity of "disconnected" time and space for the ripening of inward awareness and the possibility of reflexivity. **The real psychological truth is this: If you've got nothing to hide, you are nothing.** »

Elle cite Pedersen : six comportements de vie privée (solitude, isolement, anonymat, réserve, intimité avec des amis, intimité familiale) servant neuf fonctions (contemplation, autonomie, régénération, **confidence**, liberté, créativité, récupération, catharsis, dissimulation).

### Ce que ça change

**C'est le garde-fou de tout ce document.** Le reste de ces pages plaide pour partager davantage. Zuboff dit que la chambre est le dernier lieu inviolable, et que le rêve est ce qui y pousse. Une app qui capte le rêve au réveil **est littéralement dans la chambre**.

Conséquences non négociables :
- **Le défaut est le non-partage.** Toujours. Aucun nudge, aucun badge, aucun streak lié au partage. Le « prompt de partage » au réveil est interdit.
- **Le rêve non partagé ne sort jamais du device**, ou est chiffré côté client. Ce qui n'est pas partagé n'est pas indexable, pas résumable, pas entraînable.
- **Les six comportements de Pedersen deviennent six modes, pas trois.** Le système actuel (tous / un groupe / un seul) manque **solitude**, **anonymat** et **réserve**. Voir §4.
- **« Confiding » est une fonction de la vie privée, pas son contraire.** Se confier à un cercle n'est pas moins privé que se taire — à condition que le cercle soit *unplunderable*. C'est ce qui légitime tout le reste.

---

## ⑥ Sobiecki : le rêve appartient au domaine des ancêtres

> **`sobiecki-southern-african-psychoactive-plants`** — Jean-François Sobiecki, Dept. of Anthropology & Development Studies, University of Johannesburg. Articles publiés. **Racine : `prophetie`.** [TEXTE]

**p.4 (idx9)** :

> « The term **ubulawu** comes from the Xhosa verb *ukulawula* (**to control**) and refers to "**that spirit that controls one**" (Hirst 2005). […] Whereas lay people can obtain insight or spiritual guidance into their lives with ubulawu, **the diviner healer learns to use dreams as a path to heal.** […] Mama Maponya shed light on this question when she said, "**Anyone can use the plants to connect with their ancestors. The plants give you what you are.** … Those people with a strong spirit, only they can have this connection with special spiritual powers [becoming a healer]. If anyone just uses them it can't work in the same way." **In the Southern Bantu worldview, dreams belong to the domain of the ancestors and serve as the medium through which the diviner establishes contact with, and receives healing knowledge from their ancestors.** »

**p.5 (idx12)** — le rêve comme baromètre lisible par un tiers :

> « the content and emotional aspect of the initiate's dreams can be viewed as a **psychospiritual barometer, indicating progress on the healing path.** […] the progression of the diviners own healing process while using the ubulawu plants is paralleled with clearer dreams of their ancestral spirits instructing them in terms of traditional rituals observances, the location of medicinal plants and how to use them, as well as the nature of their clients ailments even before they arrive for consultations. »

**p.5-6 (idx13)** — la condition sociale du rêve :

> « **the relationship of trust between initiate and tutor healer during the healing process is essential if learning is to take place.** »

**p.64 (idx126)** — l'honnêteté rare :

> « Having used the "mirror ubulawu", **I was expecting my dreams to be clearer but disappointingly this did not happen.** However, what did happen was my intuition and sensitivity increased to the point I felt overwhelmed to be in any place with a lot of stimuli, e.g., shopping malls. »

### Ce que ça change

- **« Dreams belong to the domain of the ancestors »** — la propriété du rêve n'est ni au rêveur ni au groupe : **elle est ailleurs**. C'est la position la plus radicale du corpus et elle dissout la question « qui possède le rêve ? ». Le rêveur est un **destinataire**, pas un propriétaire. Traduction produit : le vocabulaire de l'app ne devrait jamais dire « ton rêve » comme on dit « ta photo ». « Le rêve qui t'est venu » est plus juste et plus vrai partout.
- **Le rêve est lisible longitudinalement par quelqu'un d'autre que le rêveur.** L'initié ne juge pas son propre progrès — le tuteur lit la série. Une app qui ne montre les séries qu'au rêveur reproduit exactement l'individualisme diagnostiqué. **Fonction « témoin longitudinal »** : un membre désigné (un seul) peut voir l'évolution d'un autre dans la durée, sans commenter chaque entrée.
- **La confiance conditionne l'expérience elle-même.** Pas « la confiance améliore le partage » — **sans confiance, le rêve ne vient pas.** Ça justifie des cercles lents à constituer.
- **Sobiecki documente son propre échec.** Un modèle : l'app doit avoir une place pour « rien n'est venu », sans que ce soit un vide dans le graphe.

**Alerte éthique — HIGH.** `ethical_notes` : « Living, named indigenous tradition (Xhosa/Cape Nguni, Zulu, Sotho diviners; ukuthwasa initiation; named informants and healers). INFUSE sells two of these plants (undlela-ziimlophe = *Silene undulata/capensis*; uvuma-omhlope = *Synaptolepis kirkii*). Said MEDIUM-HIGH (risk of romanticizing 'African dream magic' — use sober…) ». **Conséquence directe : INFUSE vend ces plantes. Toute page produit qui parle de rêve xhosa/zulu doit citer Sobiecki, nommer les peuples (Xhosa/Cape Nguni, Zulu, Sotho), nommer l'initiation (*ukuthwasa*), et ne jamais suggérer que l'usage laïc équivaut à l'usage du diviner — Mama Maponya dit exactement le contraire.** Ne jamais employer « ubulawu » comme nom de feature.

---

## ⑦ Ngubane : « reporter » aux ancêtres est une obligation procédurale

> **`ngubane-body-mind-zulu-medicine`** — Harriet Ngubane, *Body and Mind in Zulu Medicine: An Ethnography of Health and Disease in Nyuswa-Zulu Thought and Practice*. **Anthropologue zulu. Racine : `guerison`.** [TEXTE]

**p.68-69 (idx54)** — le cas Gwala. Une jeune femme vient vivre chez son futur mari avant la fin des paiements de mariage. Un enfant tombe malade. La devineresse diagnostique :

> « before she left home, **her father sacrificed and reported to the ancestors the circumstances surrounding her departure.** This is what the diviner meant when she emphasized that the baby's maternal ancestors were satisfied because they had been given the respect which they considered their due. **Gwala had missed out on this when he failed to report the circumstances surrounding the arrival of his future wife before the wedding ceremony.** »

**p.72-73 (idx58)** : « Gwala had never introduced his wife to his ancestors, but had only presented them with the twins; accordingly they made one of the twins ill, **to remind him to observe first things first.** »

**p.75-76 (idx62)** — la section invisible de la société :

> « This is their base, and from there they come to earth and **live as an invisible section of the society.** […] No stranger may go beyond the ridge into the **umsamo** area. »

**p.105-106 (idx92)** — le début de l'appel de la devineresse :

> « The first phase begins with the manifestation of her contact with the spirits—**when she dreams of them**, hears voices whispering in her ears, prefers solitude, neglects her appearance, eats very little […] and finally runs away to a diviner to be trained as an *ithwasa* (neophyte). Being a neophyte marks her second phase, **during which she withdraws from society almost completely.** »

**p.76-77 (idx63)** — le conflit de juridiction : quand une devineresse se marie, ses ancêtres paternels entrent en collision avec ceux du foyer. « To resolve it **the husband sacrifices a goat to his ancestors and requests them to allow the diviner's ancestors to operate within the homestead. If this is not done she never divines there.** »

### Ce que ça change

- **Le « reporting » comme obligation.** Chez les Nyuswa-Zulu, tout changement d'état d'une personne doit être **annoncé** à la section invisible de la communauté. Ne pas annoncer = la faute. Ce n'est pas de la transparence, c'est un **devoir de notification**. Pour un cercle d'intention (famille en deuil, couple en chemin) : **fonction « je vous annonce »** — un post de statut structural (une entrée, une sortie, un anniversaire de décès, une décision) qui n'attend pas de réponse et qu'on ne peut pas commenter. Ça n'existe nulle part dans les apps sociales, qui ne savent faire que du post commentable.
- **Le retrait est une phase, pas un abandon.** L'*ithwasa* se retire presque totalement de la société pendant sa formation. Une app de rêve partagé a besoin d'un **mode retrait annoncé** : je reste membre, je ne poste pas, je ne lis pas, **et le cercle le sait**. Différent de la désinscription, différent du silence.
- **Le conflit de juridiction est prévu et réglé par un rite.** Quand deux appartenances entrent en collision, il y a une procédure. Pour l'app : quand un membre appartient à deux cercles qui se recoupent (une famille et un couple, par ex.), **il faut un geste explicite** avant que du contenu circule entre les deux. Pas un réglage silencieux.
- **Ngubane est une voix interne.** À citer nommément quand INFUSE parle de rêve zulu. C'est la meilleure source du corpus sur ce terrain, et elle n'a jamais été mobilisée.

---

## ⑧ Neale & Kelly : « Robust because they are restricted »

> **`neale-kelly-songlines`** — Margo Neale (co-autrice aborigène, First Knowledges series) & Lynne Kelly. **Racine : `anciens`.** [TEXTE]

**p.14-15 (idx82)**, titre de section : **« ROBUST BECAUSE THEY ARE RESTRICTED »**

> « The foundation, the skeleton will be the same, but how much of the flesh that has been added to the skeleton is taught to children **will depend on their role in the community and their level of initiation into knowledge transfer. It is only by restricting knowledge that the Songlines have been maintained so accurately over such long periods of time.** You may have played the children's game in which players line up and messages are passed by whispering from one to the next. […] the final message can vary greatly from what was first whispered. »

**p.13 (idx63)** :

> « senior members of the community provide commentary, not only to teach but also **to use restricted knowledge to maintain accuracy.** By keeping knowledge secret from those not yet ready to receive and protect it, they can ensure that every repetition of the story is accurate. **That can't be done in a free-for-all chat.** »

**p.14 (idx81)** : « Research into many different Aboriginal cultures shows that **it takes thirty to forty years to be taught all the knowledge associated with the Songlines.** […] **access to knowledge is considered both a right and a privilege. With the knowledge comes responsibilities.** »

**p.8-9 (idx4)**, Neale sur la co-écriture : « There have been **no attempts to homogenise our voices** as might be the case in other co-authored publications; our cultural and individual differences [remain]. »

### Ce que ça change

**« That can't be done in a free-for-all chat » est écrit par une autrice aborigène, à propos de la fidélité.** L'argument standard contre la restriction, c'est le pouvoir. Neale & Kelly donnent l'argument inverse : **la restriction est le mécanisme d'intégrité du contenu**. Un savoir qui circule sans gradient se dégrade — c'est le téléphone arabe.

Traduction produit, et c'est un renversement complet :
- **Les niveaux d'accès ne sont pas des paramètres de confidentialité, ce sont des garanties de qualité.** Le message dans l'UI ne devrait pas être « qui peut voir ça ? » mais « **qui est en mesure de bien recevoir ça ?** ».
- **L'ancienneté dans un cercle donne des droits ET des devoirs.** Un membre de trois ans n'a pas le même statut qu'un membre de trois jours. Pas parce qu'il est supérieur, parce qu'il a **la responsabilité de la fidélité** de ce qui se transmet.
- **Le modèle de co-écriture Neale/Kelly** — ne pas homogénéiser les voix — est directement transposable : quand un cercle produit une synthèse, **ne jamais fondre les voix en un texte unique et lisse.** Garder les registres distincts. C'est aussi une position esthétique qui va très bien à INFUSE.

---

## ⑨ Sveiby & Skuthorpe : la garde n'est pas la propriété, et une histoire a quatre étages

> **`sveiby-treading-lightly`** — Karl-Erik Sveiby & **Tex Skuthorpe (Nhunggabarra)**. **Racine : `impact`. Un livre de management.** [TEXTE]

**p.77-78** :

> « [In Western property law the owner can do] whatever they want with the land. If the owner neglects it, no one else would dream of tending to it. **Nhunggabarra custodianship, instead, meant there was an obligation for the community to care for all land within its borders; it was unthinkable to neglect land or to leave it untended.** A property boundary today in many countries also functions to exclude: it defines a right to prevent other people's access. For the Nhunggabarra, however, a **'boundary was to cross'**; it did not exist for excluding non-owners. Instead, the boundaries of their country defined **where their responsibilities and their stories** [ended]. »

**p.62-64** : « The stories and their hidden meanings constituted the Nhunggabarra peoples' archives, law book, educational textbooks, country maps and Bible. […] **The 'keys' to this knowledge base were only held by those who went through the traditional education.** »

**p.74-75** — et ici la solution élégante :

> « The four-level model also meant that **all stories could be told freely to the whole community**; the four levels and the education process ensured that **each person understood the story on the level that fitted their individual level of development.** Children would understand the first level and have their curiosity satisfied, while the older p[eople…] »

### Ce que ça change

**C'est la réponse au dilemme de la restriction.** Neale & Kelly disent : restreindre pour protéger la fidélité. Skuthorpe dit : **on ne restreint pas l'accès, on stratifie la profondeur**. Tout le monde entend la même histoire ; chacun en reçoit l'étage qu'il peut porter.

C'est infiniment plus élégant qu'un système de permissions, et directement implémentable :
- **Un rêve peut être posté avec plusieurs étages** : (1) l'image nue, (2) le contexte, (3) ce que ça remue, (4) ce que ça engage. Chaque membre voit jusqu'à l'étage qui correspond à sa relation au rêveur — **et il ne sait pas qu'il y a des étages au-dessus.** Personne n'est exclu, personne ne voit une porte fermée.
- **La frontière est faite pour être traversée, pas pour exclure.** Les cercles ne devraient pas être des enclos étanches mais des **domaines de responsabilité**. Un membre d'un cercle voisin n'est pas bloqué — il est **hors de sa zone de responsabilité**, ce qui est une phrase complètement différente.
- **La garde implique le devoir de soin.** Recevoir le rêve de quelqu'un crée une obligation : y revenir, en prendre des nouvelles. **Fonction « reprendre des nouvelles d'un rêve »**, proposée à J+7 à ceux qui l'ont reçu. Pas au rêveur — **aux receveurs**.

---

## ⑩ Ingold : le rêve n'est pas un intérieur

> **`ingold-perception-of-environment`** — Tim Ingold, *The Perception of the Environment*, Routledge. **Racine : `lien`. Un traité d'anthropologie écologique.** [TEXTE, p.114]

> « People in the West are encouraged to think of dreams as hallucinations, comprising **a stream of free-floating images that exist only in the interiority of the unconscious mind**, a mind that is freed during sleep from its bodily bearings in the real world. Thus we consider the dreamworld to be the very opposite of the solid, physical world 'out there', just as illusion is opposed to reality, fantasy to fact. **For the Ojibwa, by contrast, the world of dreams, like that of myth, is continuous with that of one's waking life.** Just as myths are understood as the past experiences of other-than-human persons, **so dreams are among the past experiences of human selves.** In their dreams, humans meet the grandfatherly protagonists of my[th…] »

### Ce que ça change

**« Dreams are among the past experiences of human selves »** — pas des images, des **expériences vécues**. Si le rêve est une expérience passée, alors :
- Le vocabulaire de l'app doit basculer : pas « j'ai fait un rêve » mais **« il s'est passé quelque chose »**. Pas « symbole » mais « rencontre ».
- Un rêve peut être **daté, localisé, peuplé** au même titre qu'un souvenir de veille — et donc **partagé au même titre**. On ne « partage » pas un souvenir de vacances, on **le raconte**, et ceux qui y étaient complètent. Ça reconfigure tout le modèle de données : le rêve n'est pas un contenu, c'est un **événement**, et un événement peut avoir plusieurs témoins.
- C'est la meilleure justification théorique du cercle Sng'oi (§①) : si quatre personnes ont visité le même lieu réel la nuit, il est **normal** qu'elles composent un récit unique. Ce n'est plus une jolie métaphore.

**Racine `lien`. Trouvé dans un livre qui ne parle pas de rêve.**

---

## ⑪ Hunt : le rêve socialement significatif s'éteint quand la culture s'éteint

> **`hunt-multiplicity-of-dreams`** — Harry T. Hunt, *The Multiplicity of Dreams*. **Racine : `psyche` — hors du rayon rêve alors que c'est le meilleur livre académique sur le rêve du corpus.** [TEXTE]

**p.99-100** :

> « the public mirror of personal and social concerns? Indeed, much of the function of modern psychotherapy might thereby be achieved. Correspondingly, native informants comment on the shift in dreaming patterns that comes with Westernization. **Many native peoples complain that few "big" dreams are reported any more and that young shaman initiates no longer have socially significant dreams** (Lincoln, 1935; Tedlock, 1987). A contemporary Huichol shaman states: **"If a person doesn't believe in his dreams, he might say, 'It's only a dream; it's not real; the gods aren't really talking to me.' Little by little everything will become less clear…"** »

Et le pendant, chez **`jung-man-and-his-symbols`** (p.48-49) [TEXTE] — l'observation de terrain de Jung en Afrique de l'Est :

> « These tribesmen denied that they had any dreams. But through patient, indirect talks with them I soon found that they had dreams just like everyone else, **but that they were convinced their dreams had no meaning.** "Dreams of ordinary men mean nothing," they told me. They thought that the only dreams that mattered were those of chiefs and medicine men; these, **which concerned the welfare of the tribe**, were highly appreciated. The only drawback was that the chief and the medicine man both claimed that they had **ceased having meaningful dreams. They dated this change from the time that the British came to their country.** »

### Ce que ça change

**Le rêve socialement significatif n'est pas une propriété du cerveau — c'est une propriété du cadre social.** Retirez le cadre (colonisation, occidentalisation, individualisation), et les grands rêves **cessent d'arriver**. Le shaman huichol le dit dans l'ordre causal : d'abord tu cesses de croire, ensuite tout devient moins clair.

C'est l'argument le plus fort qui existe pour l'app, et il n'est ni mystique ni marketing : **un dispositif collectif ne rend pas les rêves plus intéressants à raconter — il change ce qui est rêvé.** À manier avec une prudence absolue (aucun claim, aucune promesse), mais c'est la thèse de fond, et elle est attestée par deux sources indépendantes, dont une académique et une d'observation directe.

Corollaire produit : **la régularité du cadre est le produit.** Pas les features. Un cercle qui se retrouve tous les matins pendant six mois est le dispositif. L'app est l'échafaudage.

---

## ⑫ Les autres trouvailles, plus brèves

**`black-elk-speaks`** (Nicholas Black Elk, p.75-77) [TEXTE] — **le crieur**. Le camp lève, les conseillers sont dans le tipi du conseil, le crieur fait le tour du cercle du village et transmet. Puis les éclaireurs reviennent et **tous se rassemblent pour entendre**, le crieur parlant *pour* les éclaireurs. → Un cercle a besoin d'une **fonction crieur** : quelqu'un qui porte l'information à travers le cercle, distincte de celui qui la détient. Aujourd'hui les apps confondent auteur et diffuseur. *(Alerte éthique : ruling V1 « stricter conditions », superseded par V2 — usable, mais aucun usage décoratif d'imagerie lakota, aucune mythologie de marque.)*

**`lawlor-voices-first-day`** (p.372-373) [TEXTE] — le deuil de clan aborigène : « The clan members gather at the campsite of their dead kin and ritually grieve **and wound themselves with increased intensity as the night falls and the number of mourners grows. The emotion of grief must be fully released, since any sorrow withheld in the psyche would also form a link to which the deceased spirit might cling.** As clan members arrive from d[istant places…] » → **L'intensité monte avec le nombre de présents**, et le chagrin retenu est un danger pour le mort. Pour un cercle de deuil : la charge d'un rituel doit **croître avec la participation**, pas se diluer. *(Alerte éthique HIGH : Lawlor est non-autochtone, reconstruction occidentale d'un savoir oral. Toujours le dire. Ne jamais présenter comme autorité sur la tradition.)*

**`some-of-water-and-spirit`** (Malidoma Somé, p.56-57) [TEXTE] — « Different cultures have different relationships with their dead […] **Why do the dead walk where I come from? They walk because they are still as important to the living as they were before.** » → Le mort reste membre du cercle. Pour un cercle de deuil, **le défunt a une place, pas un mémorial.** Différence énorme en UI.

**`weller-wild-edge-of-sorrow`** (p.134-136) [TEXTE] — « **the most salient obstacle to grieving is the lack of collective practices for the releasing of grief.** […] **Grief has always been communal and has always been connected with the sacred.** » Et p.82-83 : « We have gone from being seen as valuable to the community, a carrier of gifts, to having to earn a living. No one asks, **'What is the gift you carry in your soul? What have you brought with you into the heart of the village?'** » → Question d'onboarding d'un cercle, littéralement.

**`kimmerer-braiding-sweetgrass`** (p.232-233) [TEXTE] — « The seventh rule of the Honorable Harvest is to **reciprocate the gift**. You have received something, and now you must give something in return. **This is not a transaction, not an exchange. It is a cycle of relationship.** » Et p.38-39 : le sweetgrass « **cannot be bought or sold and still retain its essence for ceremony** ». → Recevoir un rêve crée une dette de relation, pas une dette de contenu. **Ne jamais implémenter la réciprocité comme un ratio** (« tu as lu 5 rêves, partages-en 1 »). C'est exactement ce que Kimmerer exclut.

**`graeber-debt`** (p.126-127) et **`cialdini-influence`** (p.31-32) [TEXTE] — Cialdini : « **Another person can trigger a feeling of indebtedness by doing us an uninvited favor.** » Graeber : le cadeau qui ne peut pas être remboursé doit être *représenté* comme un remboursement pour restaurer l'égalité. → **Un rêve reçu sans l'avoir demandé crée une obligation non consentie.** Il faut donc un **consentement à recevoir**, pas seulement un consentement à partager. Aucune app ne fait ça. Spec : avant qu'un rêve n'arrive chez quelqu'un, il faut qu'il ait accepté d'en recevoir de cette personne, ou dans cette fenêtre.

**`yunkaporta-sand-talk`** (p.13) [TEXTE] — « **There is no 'talking stick' protocol. (The talking stick idea was appropriated by the West from Native American culture.)** This back-and-forth yarning style neutralises the unpleasant phenomenon […] of one person grandstanding and waffling on while the rest of the group drowns in polite boredom. […] **There is a lot of overlapping speech that makes yarning vibrant and dynamic.** » → **Contredit frontalement Plotkin et Pendell** (voir §3). Et corrige INFUSE : ne jamais mettre un « bâton de parole » dans l'app en l'attribuant à une sagesse autochtone générique. *(Ruling V1 « internal corrective only », superseded par V2 ; risque d'extraction exotique élevé — usage interne/structurel, pas de copy publique dérivée.)*

**`von-franz-interpretation-fairy-tales`** (p.52-53) [TEXTE] — sur le refus d'interpréter : « "Well, look at the dream! **It tells you all it can. It is its own best possible interpretation.**" That has its merits because then the dreamer may go home and keep turning the dream around in his mind and suddenly get his own illumination about it. **And that process of rubbing one's churinga stone — treating the dream as one might a churinga stone or a talisman till it gives you some strength — is not interrupted by a third person who interposes himself.** » → La jungienne la plus orthodoxe défend le **non-interprétatif**. C'est le meilleur allié inattendu du bouton « garder le cœur » de §②.

**`pendell-pharmako-gnosis`** (p.219-220) [TEXTE, OCR partiellement dégradé] — dans la même page : « The ancients recognized three categories of dream — those ordinary dreams that are overflow from the events of the day; then deep dreams, strong and portentous, revealing answers or clarifying practical or spiritual dilemmas […] Then there are true dreams, dreams from the gods ». Et, fragment lisible mais tronqué par l'OCR : « **Mohammed listened to the dreams of his followers eve[ry…]** ». Le chunk suivant confirme le cadre : « **The Prophet's dream practice was maintained by the Sufis, that while prophecy had been sealed, dreams, being only 1/46th part prophecy, were still a gate for revelation** » et « **Prophecy is sealed but the Shaykh will listen.** » → **Une tradition abrahamique majeure avec une pratique d'écoute collective matinale des rêves.** Le corpus ne permet pas d'en dire plus (OCR dégradé, source secondaire poétique). **À ne pas affirmer publiquement sur cette seule base** — mais c'est un gisement d'acquisition évident (voir §5).

**`buhner-plant-intelligence-imaginal-realm`** (p.400-401) [TEXTE] — citant Bradford Keeney sur les Ju/'hoansi : « the songs become **lines or ropes that take you somewhere**. […] They are "**lines or ropes or grids of connection between living things**." And they are […] "indistinguishable from the songs that are voiced in ecstatic emotion." » → Seconde source Afrique australe (Kalahari), en source tertiaire (Buhner citant Keeney). À traiter comme piste, pas comme autorité.

**`simpson-as-we-have-always-done`** — Leanne Betasamosake Simpson [DIGEST — livre sans chunks] : « **Constellations of Coresistance** : an organizational form drawn from Jarrett Martineau. Small place-based collectives ("stars") doing everyday acts of resurgence within their own grounded normativity, **linking to other constellations across nations.** "When constellations work in international relationship to other constellations, the fabric of the night sky changes." » → **La forme structurelle exacte pour un réseau de cercles** : pas un graphe social, pas une communauté globale — des **petites constellations liées entre elles**. Directement applicable à §4.

**`benkler-wealth-of-networks`** (p.173) [TEXTE] — l'expérience de pensée des trois sociétés : chez les Rouges, le conteur est héréditaire et choisit seul ses histoires ; chez les Bleus, il est élu chaque soir à la majorité ; chez les Verts, tout le monde raconte tout le temps. → Trois régimes de parole, trois sociétés différentes. **Choisir lequel un cercle applique est une décision de gouvernance, pas d'UX**, et l'app devrait la rendre explicite.

**`alexander-pattern-language`** (Christopher Alexander, p.522-523) [TEXTE] — « our whole day depends critically on the conditions under which we waken. **If we wake up immediately after a period of dreaming (REM sleep), we will feel ebullient, energetic, and refreshed for the whole day** […] If, however, we wake up during delta sleep […] we will feel irritable, drowsy, flat, and lethargic all day long […] anyone who is woken by an alarm clock, will [be at the mercy of chance] ». Trouvé dans un traité d'architecture. → L'app touche le **moment du réveil**, qui conditionne la journée entière. Argument physiologique pour ne **jamais** notifier ni demander quoi que ce soit dans les premières minutes.

---

# 2. CE QUE LES TRADITIONS SAVENT ET QUE LE CANON OCCIDENTAL IGNORE

Six écarts. Chacun est un endroit où la psychologie des profondeurs n'a **rien** et où les traditions ont un système complet.

### 2.1 — Le partage n'est pas une étape après le rêve, c'est le rêve

Chez Gendlin, Hill, Delaney, Taylor, la séquence est : rêver → se souvenir → noter → (optionnellement) partager → interpréter. Le partage est une **option en position 4**.

Chez les Sng'oi, il n'y a pas de rêve individuel à partager : **il y a un lieu où quatre ou cinq personnes sont allées, et le matin on reconstitue ce qui s'y est passé.** « They did not think that they were sharing dreams as we think of dreams. » Chez les Tzutujil, le récit au foyer est le premier geste du jour, avant le travail — pas une option.

**L'écart** : le canon suppose un objet privé qu'on peut choisir d'exposer. Les traditions supposent un **événement collectif dont chacun rapporte un fragment**. Les deux ne produisent pas le même logiciel : dans le premier cas on construit un journal avec des boutons de partage ; dans le second on construit **une table de composition**.

### 2.2 — L'obligation existe, et elle est asymétrique

Le canon n'a aucune notion d'obligation liée au rêve. Le rêve ne demande rien à personne.

Les traditions en ont plusieurs, **toutes différentes** :
- **Tzutujil** : obligation de **nourrir** le rêve (« ritually fed to keep the songs and prayers alive »). Un rêve non nourri s'éteint.
- **Nyuswa-Zulu** : obligation de **reporter** — annoncer les changements d'état à la section invisible. L'omission rend malade.
- **Nhunggabarra** : obligation de **prendre soin** — « it was unthinkable to neglect land or to leave it untended ». La garde est un devoir, pas un droit.
- **Aborigène (Neale)** : « **With the knowledge comes responsibilities** for the stories, songs, ceremonies, art. »

L'obligation ne pèse jamais sur le rêveur seul. Elle pèse sur **celui qui reçoit**, sur **le groupe**, sur **le lignage**. C'est l'inverse exact d'un feed, où recevoir est gratuit et poster est coûteux.

### 2.3 — La restitution est un métier

Le canon a le partage libre (Taylor, Ullman absent) ou le cadre thérapeutique (Hill, Gendlin). Deux modes.

Les traditions ont un **appareil de restitution** :
- **qui parle** : chez les Sng'oi, « the woman who had taken on the role of interpreter **this morning** » — le rôle tourne, il n'est pas attaché à une personne
- **dans quel ordre** : chez Chatwin, chaque propriétaire son tronçon, **dans l'ordre correct**, sous peine grave
- **avec quel niveau de détail** : chez Skuthorpe, quatre étages selon le développement de l'auditeur
- **jusqu'où ça va** : chez les Sng'oi, de foyer en foyer, toute la matinée
- **qui porte** : chez Black Elk, le crieur, distinct de celui qui sait

Aucune de ces cinq questions n'est posée par le canon occidental du rêve. Toutes les cinq sont des specs produit.

### 2.4 — Le témoin est structural, pas facultatif

Le canon a le thérapeute (payé, extérieur, temporaire) ou le groupe de pairs (volontaire, symétrique).

Les traditions ont le **tuteur** : chez Sobiecki, « the relationship of trust between initiate and tutor healer during the healing process is essential **if learning is to take place** » — et surtout, le tuteur **lit la série**, pas l'épisode : le rêve comme « psychospiritual barometer ». Chez Ngubane, la novice est apprentie chez une devineresse qualifiée pendant des années, avec des sacrifices étalés jusqu'à un bœuf final.

**L'écart** : le canon connaît l'interprète d'un rêve. Les traditions connaissent le **témoin d'une trajectoire**. Ce n'est pas la même fonction, ce n'est pas le même métier, et ce n'est pas la même feature.

### 2.5 — Le temps du rêve n'est pas le temps de l'app

- **Sng'oi** : la diffusion prend **une matinée**. Personne ne convoque de réunion.
- **Aborigène (Neale)** : « **it takes thirty to forty years** to be taught all the knowledge associated with the Songlines. »
- **Ngubane** : la formation de l'*ithwasa* = une série de sacrifices de chèvres culminant sur un bœuf.
- **Sobiecki** : « **time is needed for the practitioner to become familiar** with the spi[ritual…] »
- **Tzutujil** : un bundle transmis « for several centuries ».

Le canon occidental du rêve fonctionne en séance de 50 minutes. Les traditions fonctionnent en décennies. **Une app de rêve construite sur des unités de temps de type notification est structurellement du côté du canon**, quoi qu'elle dise d'elle-même.

### 2.6 — La propriété du rêve : quatre régimes, aucun n'est « le rêveur possède son rêve »

| Régime | Source | Qui « a » le rêve |
|---|---|---|
| **Ancestral** | Sobiecki [TEXTE] : « dreams belong to the domain of the ancestors » | Ni le rêveur ni le groupe — les ancêtres. Le rêveur est destinataire |
| **Inaliénable-prêtable** | Chatwin [TEXTE] : « He could lend them […] The one thing he couldn't do was sell » | Le rêveur, mais sans droit de cession |
| **Custodial** | Sveiby & Skuthorpe [TEXTE] : custodianship, obligation de soin | La communauté, en charge de soin |
| **Composé** | Wolff [TEXTE] : le groupe compose une histoire et attribue l'avertissement | Le cercle, qui décide à qui ça s'adresse |

Le canon occidental n'a qu'un régime, jamais énoncé parce que jamais questionné : **le rêve est un contenu mental privé de son producteur**. C'est aussi, exactement, le régime par défaut de toute application logicielle. **Ce n'est pas une coïncidence, et c'est l'hypothèse à casser.**

---

# 3. LES CONTRADICTIONS, TENUES

Tim demande « un espace juste au centre de toutes les traditions ». Une moyenne serait une bouillie. Voici les six désaccords réels, chacun avec ses deux camps sourcés. **La position juste consiste à faire tenir les deux dans le produit, pas à trancher.**

### ⓐ Le bâton de parole : outil sacré ou appropriation ?

**POUR** — `pendell-pharmako-gnosis` (p.149-151) [TEXTE] : « **The talking stick is the central medicine of the circle.** It comes to us through the Native American Church, and is found in many kinds of circles […] Anarchistically-inclined groups from Buddhists to certain peace action groups use some form of the talking stick as an alternative to […] Robert's Rules of Order. »
**Et** `plotkin-soulcraft` (p.186-189) [TEXTE] : format council complet — objet cérémoniel passé de main en main, quatre intentions, « being of lean expression », personne ne parle hors tour sauf trois exceptions nommées.

**CONTRE** — `yunkaporta-sand-talk` (p.13) [TEXTE] : « **There is no 'talking stick' protocol. (The talking stick idea was appropriated by the West from Native American culture.)** […] There is a lot of overlapping speech that makes yarning vibrant and dynamic and deeply stimulating. It is non-linear, branching off into div[ergences…] »

**Ce qui se joue** : le tour de parole strict protège les timides et empêche l'accaparement ; il tue aussi la vitalité et il est, selon un universitaire aborigène, une invention occidentale plaquée sur une culture qui ne la pratiquait pas.

**Tenir les deux** : offrir **deux modes de cercle nommés honnêtement** — « tour » (séquentiel, un passage chacun, personne ne répond avant la fin) et « yarn » (chevauchement autorisé, contributions qui enrichissent, non-linéaire). **Ne jamais appeler le premier « bâton de parole » ni l'attribuer à une tradition.** Yunkaporta doit gagner sur le nommage même si Plotkin gagne sur la mécanique.

### ⓑ Le groupe approfondit / le groupe abaisse

**LE GROUPE ABAISSE** — `jung-archetypes-collective-unconscious` (p.122-124, idx107-108) [TEXTE] : « **To experience transformation in a group and to experience it in oneself are two totally different things.** […] **A group experience takes place on a lower level of consciousness than the experience of an individual.** […] the total psyche emerging from the group is below the level of the individual psyche. […] **the group experience goes no deeper than the level of one's own mind in that state. It does work a change in you, but the change does not last.** On the contrary, you must have continual recourse to mass intoxication in order to consolidate the experience. »

**LE GROUPE APPROFONDIT** — Wolff (p.100-101) [TEXTE] : « **Doing it by myself did not work as well as doing it with a group of people.** » · Weller (p.134-136) [TEXTE] : « the most salient obstacle to grieving is the lack of collective practices ». · Prechtel : le foyer lit les rêves de la famille chaque matin depuis des générations.

**LA RÉCONCILIATION, DONNÉE PAR JUNG LUI-MÊME** (p.124-125, idx109) [TEXTE] :

> « **The inevitable psychological regression within the group is partially counteracted by ritual**, that is to say through a cult ceremony which makes the solemn performance of sacred events the centre of group activity and prevents the crowd from relapsing into unconscious instinctuality. **By engaging the individual's interest and attention, the ritual makes it possible for him to have a comparatively individual experience even within the group and so to remain more or less conscious. But if there is no relation to a centre which expresses the unconscious through its symbolism, the mass psyche inevitably becomes the hypnotic focus of fascination, drawing everyone under its spell.** »

**Ce que ça donne, et c'est peut-être la conclusion la plus opérationnelle du document** : Jung ne condamne pas le groupe, il énonce une condition. **Un groupe sans forme régresse ; un groupe avec une forme rituelle et un centre symbolique permet une expérience individuelle à l'intérieur du collectif.** Traduction : le danger d'un cercle de rêve n'est pas le partage, c'est **l'absence de forme**. Un fil de discussion est un groupe sans centre — donc, selon Jung, un dispositif de régression. Un cercle avec ouverture, tour, seuil, clôture est l'inverse. **La forme n'est pas de la décoration : c'est le mécanisme de sécurité.**

Et Jung ajoute la nuance qui empêche de le caricaturer : « **The group can give the individual a courage, a bearing, and a dignity which may easily get lost in isolation. It can awaken within him the memory of being a man among men.** »

### ⓒ Restreindre l'accès / stratifier la profondeur

**RESTREINDRE** — Neale & Kelly [TEXTE] : « **It is only by restricting knowledge that the Songlines have been maintained so accurately** […] That can't be done in a free-for-all chat. » Chatwin : chanter un couplet hors séquence = crime capital.
**NE PAS RESTREINDRE, STRATIFIER** — Sveiby & Skuthorpe [TEXTE] : « **all stories could be told freely to the whole community**; the four levels and the education process ensured that each person understood the story on the level that fitted their individual level of development. »

Deux peuples aborigènes, deux solutions incompatibles au même problème. **Ne pas trancher** : la stratification (Nhunggabarra) pour le contenu ordinaire — tout le monde reçoit, chacun à son étage ; la restriction (Yanyuwa/Neale) pour ce qui doit rester **exact** dans la durée. Le critère de bascule n'est pas la sensibilité, c'est **l'exigence de fidélité**.

### ⓓ Dire le secret guérit / le secret est la condition de l'intégrité

**DIRE** — `estes-women-who-run-with-the-wolves` (p.274, 280) [TEXTE] : « **The way to change a tragic drama back into a heroic one is to open the secret, speak of it to someone** […] Say it to someone. It is never too late. […] The can of worms you are worried about opening is far better off being out there than festering inside yourself. »
**GARDER** — `jung-memories-dreams-reflections` (p.357-358) [TEXTE] : « **There is no better means of intensifying the treasured feeling of individuality than the possession of a secret which the individual is pledged to guard.** » · `eliade-myths-dreams-mysteries` (p.203-204) [TEXTE] : « **there is no mystery-society without its oath of secrecy** […] The second reason for the reinforcement of secrecy is more of a historic order: the world changes […] To prevent their deterioration, the teachings are transmitted more [restrictively]. » · Zuboff : « If you've got nothing to hide, you are nothing. »

**Tenir les deux** : Estés parle du **secret honteux** (« shame-filled secrets »), Jung et Eliade du **secret consacré**. Ce ne sont pas les mêmes objets. L'app doit rendre la différence **visible et manipulable** : deux gestes distincts, « ce que je porte seul et qui pèse » (→ vers un témoin, avec accompagnement) et « ce que je garde parce que c'est encore vivant » (→ verrouillé, non exportable, avec un rappel possible plus tard). Les confondre est la faute.

### ⓔ Le rêve engage l'action / le rêve ne veut rien dire

**ENGAGE** — Prechtel : la famille est orientée par les rêves du matin. Sobiecki : le diviner reçoit la localisation des plantes et la nature du mal du client. Wolff : « Somebody at home needs you » — il rentre, c'était vrai.
**N'ENGAGE PAS** — `cumes-africa-in-my-bones` (p.113-114) [TEXTE] : « a medicine man whose visions for his people led to conclusions that proved to be wrong. **Not taking dreams too seriously is sage advice as dreams can be wrong** and the opposite may also be true. […] **As there can be countless variables, and there is always free will, prophecy is a tricky thing.** » Et il applique la même réserve à ses propres os divinatoires : « I warn clients that because any one factor can change on account of free will, they should be w[ary…] »

**Cumes est la voix la plus utile du corpus pour INFUSE** parce qu'il est à la fois formé dans la tradition et médecin, et qu'il **met en garde depuis l'intérieur**. Tenir les deux : un cercle peut proposer une orientation d'action, **jamais une prédiction**, et l'app doit inscrire quelque part, dans son propre langage, l'équivalent de « les rêves peuvent se tromper ». C'est aussi une exigence d'intégrité-vérité INFUSE, pas seulement une prudence juridique.

### ⓕ Le tuteur valide / personne ne doit s'interposer

**VALIDE** — Sobiecki : le tuteur lit la progression de l'initié dans ses rêves ; la relation de confiance est la condition de l'apprentissage. Prechtel : au-delà d'un seuil, on va voir le chamane. Mutwa (p.202-204) [TEXTE, à manier avec réserve] : le chef fait un rêve trouble, « early that morning he sent for Shondo » — le spécialiste est convoqué à l'aube.
**PERSONNE NE S'INTERPOSE** — von Franz (p.52-53) [TEXTE] : « that process of rubbing one's churinga stone […] **is not interrupted by a third person who interposes himself.** » Wolff : chez les Sng'oi le rôle d'interprète est tenu par **une personne différente chaque matin**, il n'y a pas de spécialiste.

**Tenir les trois** (car il y a trois positions, pas deux) : **pas d'interprète** en régime ordinaire (Sng'oi, von Franz) · **rôle tournant** dans le cercle · **spécialiste convoqué** seulement au franchissement d'un seuil (Prechtel). L'erreur serait d'avoir un « guide » permanent — c'est ce qu'aucune des trois traditions ne fait.

---

# 4. CE QUE ÇA CHANGE, CONCRÈTEMENT

Protocoles, seuils, interdits. Rien d'intentionnel.

## 4.1 — Les six modes d'amis (le système à trois modes est incomplet)

Le système actuel — **tous / un groupe / un seul** — n'implémente que trois des six comportements de vie privée que Pedersen documente chez Zuboff (p.128-129) [TEXTE]. Il manque exactement ceux qui protègent.

| Mode | Source | Ce que ça fait | Existe ? |
|---|---|---|---|
| **Solitude** | Pedersen/Zuboff [TEXTE] | Le rêve ne quitte pas l'appareil. Non indexé, non résumé, non entraîné. **Défaut système.** | ❌ à créer |
| **Réserve** | Pedersen/Zuboff [TEXTE] | Déposé dans un cercle mais **scellé** : compte dans la présence, invisible en contenu. Le cercle sait que tu as rêvé, pas quoi | ❌ à créer |
| **Anonymat** | Pedersen/Zuboff [TEXTE] | Le fragment entre dans la composition du matin **sans nom**. C'est le mode Sng'oi par défaut — dans le cercle, les fragments ne sont pas signés | ❌ à créer |
| **Un seul (témoin)** | Sobiecki [TEXTE] : tutor healer | Une personne, désignée, qui voit **la série** et pas seulement l'épisode | ~ à requalifier |
| **Un cercle** | Prechtel [TEXTE] : le foyer | Le groupe qui compose le matin. Quorum, seuil, clôture | ✅ à outiller |
| **Tous** | Wolff [TEXTE] : de foyer en foyer | **Diffusion lente et manuelle**, jamais un broadcast. Réservé à ce qui concerne tout le monde | ⚠️ à ralentir |

**Interdit** : que le passage d'un mode restreint à un mode ouvert soit un simple toggle. Chez les Nhunggabarra la frontière se traverse ; elle se traverse **par un geste**, pas par un interrupteur.

## 4.2 — Le protocole du cercle du matin (composite sourcé)

Chaque étape a une source. C'est un composite, pas une tradition — **à ne jamais présenter comme la pratique d'un peuple.**

1. **Ouverture décalée** — les premiers réveillés attendent, en silence, que d'autres se lèvent. *Wolff p.96 [TEXTE].* Traduction : le cercle a une **fenêtre d'ouverture**, pas un horaire. Il s'ouvre quand N membres sont présents.
2. **Dépôt aveugle** — chacun dépose son fragment **sans voir les autres**. *Seeley p.238-239, scrutin secret [TEXTE].* Le fondateur ne peut pas être premier. *Seeley p.231-232 [TEXTE].*
3. **Fragment court d'abord** — une image, une ligne. Pas de récit. *Wolff p.96 : « I saw a bird » [TEXTE].*
4. **Quorum** — la composition ne s'ouvre qu'à partir de N. Réglable par cercle, avec le trade-off affiché : bas = rapide et faillible, haut = lent et juste. *Seeley p.221-222 [TEXTE].*
5. **Écho** — chacun peut dire « moi aussi j'ai vu » sur le fragment d'un autre. C'est le geste central, et il n'existe dans aucune app. *Wolff p.96 [TEXTE].*
6. **Questions factuelles, jamais d'interprétation** — l'app ne propose que des questions de fait (jour ou nuit ? une fois ou plusieurs ? déjà vu ça ?). **Aucun prompt « qu'est-ce que ça signifie ? ».** *Wolff p.98-100 + von Franz p.52-53 [TEXTE].*
7. **Attribution** — le cercle peut désigner à qui le rêve s'adresse, y compris à quelqu'un d'autre que le rêveur. *Wolff p.100 [TEXTE].*
8. **Sortie = orientation, pas sens** — le cercle produit une phrase pour la journée, ou rien. **« A few times no story emerged at all »** doit être un état affiché, pas un vide. *Wolff p.97 [TEXTE].*
9. **Rôle tournant** — l'animateur du jour change chaque matin, automatiquement. *Wolff p.100 : « the woman who had taken on the role of interpreter this morning » [TEXTE].*
10. **Escalade** — si le rêve a réveillé en sursaut / est déclaré « plus fort que d'habitude », l'app **propose d'elle-même** de sortir du cercle ordinaire. *Prechtel p.189-190 [TEXTE].*
11. **Clôture** — le cercle se ferme. Ce qui n'a pas été dit ne l'est pas. *Plotkin p.188-189 [TEXTE].*

**Interdits absolus dans ce protocole** :
- ❌ notification dans les 20 premières minutes du réveil (*Alexander p.522-523 [TEXTE]* : la manière dont on se réveille conditionne la journée entière)
- ❌ compteur, streak, badge, classement sur le partage (*Zuboff : le défaut est le sanctuaire*)
- ❌ suggestion d'interprétation générée (*Prechtel : « after the heart, not the meaning »* ; *von Franz : ne pas interposer un tiers*)
- ❌ réciprocité chiffrée type « lis 5 pour poster 1 » (*Kimmerer p.232-233 : « This is not a transaction »*)
- ❌ rêve poussé chez quelqu'un qui n'a pas consenti à en recevoir (*Cialdini p.31-32 : la faveur non sollicitée crée une dette non consentie*)

## 4.3 — Par type de cercle d'intention

**Famille en deuil**
- Le défunt **reste membre** du cercle, avec une place, pas un mémorial. *Somé p.56-57 [TEXTE].*
- La charge du rituel **croît avec le nombre de présents**, elle ne se dilue pas. *Lawlor p.372-373 [TEXTE].*
- Fonction « **je vous annonce** » : un post structural non commentable (une date, une décision, un anniversaire). *Ngubane p.68-69, le protocole de report [TEXTE].*
- Quorum **haut** : la synthèse du matin n'apparaît qu'avec la moitié du cercle. Justesse > vitesse. *Seeley p.221-222 [TEXTE].*
- **Interdit** : tout mécanisme d'engagement. Un cercle de deuil ne se relance pas.

**Couple en chemin**
- Deux personnes = pas de quorum, donc **pas de composition anonyme**. Le mode qui convient est le **dépôt aveugle mutuel** : chacun dépose, puis les deux s'ouvrent simultanément.
- **Le conflit de juridiction est prévu** : un membre du couple appartient aussi à sa famille d'origine. Un geste explicite est requis avant qu'un contenu passe d'un cercle à l'autre. *Ngubane p.76-77 [TEXTE].*
- **Interdit** : la visibilité asymétrique. Si l'un voit la série de l'autre, la réciproque doit être vraie ou explicitement refusée.

**Communauté (au sens INFUSE)**
- **Constellations, pas réseau** : des petits cercles ancrés, liés entre eux, jamais une communauté globale unique. *Simpson [DIGEST].*
- **Restriction par ancienneté = garantie de fidélité, pas hiérarchie.** Le message est « qui est en mesure de bien recevoir », jamais « qui a le droit ». *Neale & Kelly p.13-15 [TEXTE].*
- **Quatre étages de profondeur sur un même post** : tout le monde reçoit, chacun à son niveau, personne ne voit une porte close. *Sveiby & Skuthorpe p.74-75 [TEXTE].*
- **Fonction crieur** : quelqu'un porte, distinct de celui qui détient. *Black Elk p.75-77 [TEXTE].*
- **Diffusion lente et manuelle** entre cercles. Pas de broadcast. *Wolff p.97-98 [TEXTE].*

**Groupe de projet / collectif artistique / groupe de recherche**
- **Démocratie unitaire** : ne fonctionne que si les intérêts sont congruents. Un cercle de rêve dans une organisation où les intérêts divergent produira de la conformité, pas de l'intelligence. *Seeley p.127-128, p.228-229 [TEXTE].* → **Question d'onboarding obligatoire** : « vos intérêts sont-ils alignés ? ». Si non, ne pas ouvrir le cercle.
- **Le fondateur parle en dernier.** Techniquement forcé. *Seeley p.231-232 [TEXTE].*
- **Un « bundle » de projet** qui s'accumule et se transmet avec ses règles. *Prechtel p.192-193 [TEXTE].*
- **Cycle séquentiel** pour les moments de décision : chaque membre son tronçon, dans l'ordre. *Chatwin p.61-62 [TEXTE].*

## 4.4 — Le régime de droits sur un rêve

Trois verbes, pas « partager ». *Chatwin p.61-62 [TEXTE], Sveiby & Skuthorpe p.77-78 [TEXTE], Sobiecki p.4 [TEXTE].*

- **Prêter** : accès accordé, duré, révocable. Le rêve ne se duplique pas.
- **Emprunter** : réception acceptée, avec devoir de soin. **Rappel à J+7 aux receveurs** — « des nouvelles de ce rêve ? ». Pas au rêveur.
- **Inaliénable** : aucun geste ne transfère la propriété. Pas d'export brut, pas de repost hors cercle, pas de vente, **pas d'entraînement de modèle**. À écrire dans les CGU, pas seulement dans le code.

Et le mot juste : **ne jamais écrire « ton rêve » comme on écrit « ta photo »**. Le rêve t'est venu. *Sobiecki p.4 [TEXTE] : « dreams belong to the domain of the ancestors » ; Ingold p.114 [TEXTE] : le rêve est une expérience vécue, pas un contenu.*

---

# 5. LE « TROU » D'AFRIQUE AUSTRALE — DOCUMENTÉ ET LARGEMENT RÉFUTÉ

## Ce qui est là

| Livre | Chunks | Voix | Ce qu'il couvre |
|---|---|---|---|
| `sobiecki-southern-african-psychoactive-plants` | **133** | Ethnobotaniste sud-africain, **initié**, publié en revue à comité de lecture | **Épistémologie complète du rêve ubulawu** : étymologie xhosa (*ukulawula*), différence laïc/diviner, le rêve comme domaine des ancêtres, le rêve comme baromètre lu par le tuteur, 85 espèces de divination, préparations (ukugabha, foam), échecs documentés |
| `ngubane-body-mind-zulu-medicine` | **187** | **Harriet Ngubane, anthropologue zulu — voix interne** | Structure sociale de l'invisible, protocole de report aux ancêtres, appel de la devineresse par le rêve, phases de retrait, conflits de juridiction ancestrale, économie du soin |
| `cumes-africa-in-my-bones` | **126** | Chirurgien sud-africain formé par des sangomas | Typologie des rêves ancestraux, **rêves faits pour autrui** (« dreams that close friends, relations or loved ones may have on our behalf »), mise en garde interne contre la surinterprétation |
| `mutwa-indaba-my-children` | **476** | Vusamazulu Credo Mutwa, zulu, **controversé** | Récit mytho-historique, rêve du chef → convocation du devin à l'aube |
| `buhner-plant-intelligence-imaginal-realm` | (extrait) | Buhner citant Keeney sur les Ju/'hoansi | Chants comme « cordes de connexion » — source **tertiaire**, piste seulement |

**Verdict : l'affirmation « zéro épistémologie du rêve d'Afrique australe » est fausse.** Elle vient de ce que ces livres sont classés en `guerison`, `prophetie` et `mythe` — jamais en `rêve`. Le rayonnage a produit la cécité.

**À corriger dans `1_BIBLE.md` :** remplacer le constat de trou par le constat inverse, et citer Sobiecki + Ngubane comme sources de rang bible sur ce terrain. **C'est urgent** parce qu'INFUSE vend deux des plantes documentées par Sobiecki.

## Ce qui manque vraiment

Le trou réel est plus étroit et plus précis :

1. **Aucun auteur xhosa ou zulu écrivant sur le rêve depuis l'intérieur, en son nom, aujourd'hui.** Ngubane est une voix interne mais c'est une ethnographie académique de 1977 ; Sobiecki est un chercheur blanc sud-africain initié ; Cumes est un médecin blanc sud-africain ; Mutwa est contesté. **Personne dans le corpus n'est un·e sangoma ou igqirha écrivant en son nom propre.**
2. **Aucune source sur le rêve *collectif* en Afrique australe.** Tout ce qu'on a est dyadique (initié/tuteur) ou familial (Ngubane). Rien sur un équivalent du cercle du matin.
3. **Le Kalahari (San / Ju/'hoansi) n'est présent qu'en source tertiaire.**

## Proposition d'acquisition

**Règle** : auteur issu de la tradition, **ou** ethnographie académique sourcée, **ou** rien. Aucun manuel, aucun « guide du rêve africain ».

**Priorité 1 — auteur de la tradition, écrivant en son nom**
- **Nokuzola Mndende** — universitaire xhosa, fondatrice de l'Icamagu Institute, écrit sur la religion africaine depuis l'intérieur, en refusant explicitement le cadre chrétien. C'est exactement le profil manquant.
- **Mpho Tutu / littérature igqirha contemporaine** — à explorer, chaîne de provenance à vérifier avant acquisition.

**Priorité 2 — ethnographie académique sourcée, déjà citée par Sobiecki (chaîne de provenance vérifiable)**
- **Manton Hirst**, *The Healer's Art: Cape Nguni Diviners in the Townships of Grahamstown* (thèse, Rhodes) — Sobiecki le cite pour l'ubulawu dans l'initiation xhosa. C'est **la** source primaire derrière ses propres affirmations.
- **Joan Broster**, *Amagqirha: Religion, Magic and Medicine in Transkei* (1981) — Sobiecki en tire le cas de Nombuso, initiée xhosa dont les rêves servent de baromètre. Récit d'initiation suivi.
- **W.D. Hammond-Tooke**, *Rituals and Medicines* / *The Roots of Black South Africa* — anthropologie standard des Cape Nguni.

**Priorité 3 — Kalahari, pour sortir de la source tertiaire**
- **Bradford Keeney**, *Ropes to God* — Keeney est cité par Buhner en tertiaire ; le texte de première main existe. À vérifier côté éthique (Keeney est un praticien occidental initié, statut analogue à Sobiecki).
- **Megan Biesele**, *Women Like Meat* — folklore et transe ju/'hoansi, académique, provenance solide.

**Priorité 4 — le gisement soufi/islamique** (§⑫, Pendell) : une tradition abrahamique majeure avec écoute matinale collective des rêves, **totalement absente du corpus**. La source à viser est académique : **Nile Green**, *« The Religious and Cultural Roles of Dreams and Visions in Islam »* (Journal of the Royal Asiatic Society) ou **Iain Edgar**, *The Dream in Islam*. Pas de littérature dévotionnelle.

**À ne PAS acquérir** : tout titre de type « African Dream Wisdom », « Sangoma Dreaming for Westerners », toute source secondaire New Age sur l'ubulawu, tout auteur ne pouvant pas justifier d'une lignée ou d'un protocole de recherche.

---

# 6. CE QUE JE N'AI PAS PU CHERCHER

**35 livres sont sans chunks.** Ils n'ont jamais pu remonter dans une seule des ~90 requêtes. Ce n'est pas un silence de la tradition, c'est un silence de la base.

**Les plus coûteux pour cette question précise** (par ordre de perte) :

| Livre | Digest ? | Ce que la perte coûte ici |
|---|---|---|
| `simpson-as-we-have-always-done` | T1 11k / T2 11k | **Grave.** Simpson est *la* théoricienne nishnaabeg de la resurgence. Le seul concept que j'ai pu tirer du digest (« constellations of coresistance ») s'est révélé être **la meilleure forme structurelle du document** pour le réseau de cercles. Le texte intégral en contiendrait dix autres. **Priorité #1 d'ingestion.** |
| `moreton-robinson-critical-indigenous-studies` | T1 11k / T2 10k | **Grave.** Souveraineté épistémique autochtone — c'est exactement le cadre pour décider ce qu'INFUSE a le droit de faire des matériaux de §1-2. Le digest n'a rien produit sur le rêve. |
| `wangyal-tibetan-yogas` | T1 **1,3k** / T2 8k | **Grave et doublement.** Seul livre du corpus sur le yoga du rêve bön/dzogchen — et son T1 est **anormalement maigre (1 311 caractères)**, donc même le digest est faible. La tradition tibétaine est représentée par presque rien alors qu'elle a une doctrine du rêve complète. **Priorité #2.** |
| `ngugi-decolonising-the-mind` | T1 **547 car.** / T2 12k | **Grave.** T1 quasi vide. Ngũgĩ sur la langue et le théâtre communautaire gĩkũyũ — le digest signale Kamĩrĩĩthũ (création collective par des paysans, théâtre détruit par l'État). Directement pertinent pour « ce qui se perd quand une pratique collective est écrasée ». |
| `anzaldua-borderlands` | T1 14k / T2 12k | **Moyen-grave.** Anzaldúa a une théorie de la *facultad* et des états liminaux qui relève exactement du rêve partagé. Rien n'est remonté. |
| `moss-sidewalk-oracles` | T1 10k / T2 8k | Moyen. Le digest donne « reincidence » et « real magic » (« bringing gifts from another world into this world […] **Magic without action is imagination** »), utile pour la dimension action. Moss est déjà surreprésenté par ailleurs (8 livres, 2 179 chunks). |
| `hillman-souls-code` | T1 6,5k / T2 8k | Faible pour cette question (théorie du daimon individuel — précisément l'hypothèse qu'on cherche à décentrer). |
| `seth-nature-of-the-psyche` | T1 4,5k / T2 2k | Faible. Seth est déjà présent via 3 autres volumes (813 chunks). |
| `macfarlane-underland` | T1 3,2k / T2 15k | Moyen. Deep time, lieux, sépulture — j'ai cherché « rêve et territoire » sans lui. |
| `ovide-metamorphoses` · `grimm-kinder-und-hausmarchen` · `jacobs-english-fairy-tales` | T1 8-33k | Moyen. Le conte européen comme rêve socialisé — angle non exploré faute de texte. |
| `lorde-uses-of-the-erotic` | T1 12k / T2 18k | Moyen. Lorde sur le savoir non rationnel partagé entre femmes — angle perdu. |
| `hildegarde-scivias` · `hildegarde-physica` | T1 10k / 12k | Moyen. **Vision reçue par une femme et validée par une communauté monastique** — c'est un cas de rêve/vision collectif européen, et il est inaccessible. |
| `hua-shurangama-mantra-vol1` | T1 23k | Faible-moyen pour cette question. |
| `barabasi-linked` | T1 11k | Faible. Sheldrake et Benkler ont couvert l'angle réseau. |
| `lakoff-johnson-metaphors-we-live-by` | T1 12k | Faible-moyen. La métaphore comme structure partagée. |
| `bringhurst-elements-typographic-style` · `tanizaki-praise-shadows` · `block-visual-story` · `alton-painting-with-light` (celui-ci a des chunks) | T1 1-11k | **J'ai cherché exprès dans la typographie et le cinéma** (le brief le demandait). Bringhurst et Tanizaki sont sans chunks — l'angle « forme du support / esthétique de l'ombre » est donc inexploré. Tanizaki en particulier (l'éloge de la pénombre) aurait pu donner quelque chose sur l'atmosphère d'un cercle nocturne. |
| Les 18 autres (`johnson-he`, `dana-polyvagal-exercises`, `hoffmann-medical-herbalism`, `niego-fungi-global-economy`, `fabre-plantes-mediterraneennes`, `mckenna-archaic-revival`, `nettlau-panarchy`, `karkkainen-panarchy-adaptive-change`, `mazzucato-entrepreneurial-state`, `martin-untrue`, `easton-hardy-salope-ethique`, `bataille-histoire-erotisme`, `mayne-bataille-erotisme-ecriture`, `odier-lillusionniste`) | variable | Faible incidence sur cette question. |

**Note d'intégrité complémentaire** : les **4 933 chunks en quarantaine** (`embedding IS NULL`) n'ont jamais pu remonter non plus. Je n'ai pas d'inventaire de ce qu'ils contiennent — c'est un angle mort non quantifié, réparti sur l'ensemble du corpus.

**Note OCR** : `pendell-pharmako-gnosis` p.219-221 est fortement dégradé (voir §⑫). La phrase sur le Prophet est lisible mais tronquée. **Ne pas la publier telle quelle.**

---

# 7. PROTOCOLE FORÊT — post-consultation

**Livres consultés en texte intégral (33)** : `wolff-original-wisdom` · `prechtel-secrets-talking-jaguar` · `chatwin-the-songlines` · `neale-kelly-songlines` · `sveiby-treading-lightly` · `sobiecki-southern-african-psychoactive-plants` · `ngubane-body-mind-zulu-medicine` · `cumes-africa-in-my-bones` · `mutwa-indaba-my-children` · `seeley-honeybee-democracy` · `zuboff-surveillance-capitalism` · `ingold-perception-of-environment` · `hunt-multiplicity-of-dreams` · `jung-archetypes-collective-unconscious` · `jung-man-and-his-symbols` · `jung-memories-dreams-reflections` · `black-elk-speaks` · `lawlor-voices-first-day` · `some-of-water-and-spirit` · `weller-wild-edge-of-sorrow` · `kimmerer-braiding-sweetgrass` · `graeber-debt` · `cialdini-influence` · `yunkaporta-sand-talk` · `von-franz-interpretation-fairy-tales` · `pendell-pharmako-gnosis` · `buhner-plant-intelligence-imaginal-realm` · `estes-women-who-run-with-the-wolves` · `eliade-myths-dreams-mysteries` · `plotkin-soulcraft` · `benkler-wealth-of-networks` · `alexander-pattern-language` · `davis-wayfinders`
**Consultés en digest (2)** : `simpson-as-we-have-always-done` · `moss-sidewalk-oracles`

**Racines activées** : `anciens` · `invisible` · `lien` · `vivant` · `guerison` · `prophetie` · `parole` · `mythe` · `psyche` · `impact` · `craft` — **onze racines sur seize**, et la racine `rêve` volontairement neutralisée. C'est la consultation la plus transversale à ce jour.

**Concepts cross-book émergents** (à créer dans `concept_nodes/`) :
1. **`composition-collective-du-recit`** — Wolff × Prechtel × Sveiby × Benkler. Le récit du matin comme objet appartenant au groupe.
2. **`propriete-inalienable-pretable`** — Chatwin × Sveiby/Skuthorpe × Sobiecki × Kimmerer. Prêter/emprunter/ne pas céder.
3. **`seuil-descalade`** — Prechtel × Ngubane × Mutwa. Le rêve anormal sort du cercle ordinaire.
4. **`restriction-comme-fidelite`** — Neale/Kelly × Eliade × Chatwin, **en tension avec** Sveiby/Skuthorpe (stratifier plutôt que restreindre).
5. **`la-forme-previent-la-regression`** — Jung (archetypes p.124-125) × Plotkin × Seeley. Le rituel est le mécanisme de sécurité du groupe.
6. **`sanctuaire-inviolable`** — Zuboff × Bachelard × Jung (secret) × Eliade, **en tension avec** Estés (dire le secret guérit).

**Tensions inter-livres à créer dans `inter_book_tensions/`** : les six de §3, en particulier **Yunkaporta × Pendell/Plotkin** (bâton de parole) et **Jung × Wolff/Weller** (le groupe abaisse / approfondit), qui sont les deux plus productives.

**Gaps détectés à ajouter dans `gaps.json`** :
- `gap_rêve_collectif_afrique_australe_voix_interne` — voir §5, propositions d'acquisition
- `gap_rêve_islam_soufi` — absence totale, gisement identifié
- `gap_indigene_decolonial_sans_chunks` — **structurel** : les 6 livres autochtones/décoloniaux les plus importants du corpus (Simpson, Moreton-Robinson, Ngũgĩ, Anzaldúa, Wangyal, + Sand Talk qui a des chunks mais un ruling) sont ceux qui n'en ont pas. **Ce n'est probablement pas un hasard** (formats, DRM, disponibilité) — mais l'effet net est que la Forêt est structurellement plus occidentale qu'elle n'en a l'air. **À traiter comme un défaut d'infrastructure, pas comme une lacune de catalogue.**
- `gap_digests_t1_anormalement_courts` — `ngugi` (547 car.), `wangyal` (1 311), `mckenna-archaic-revival` (1 462), `odier-lillusionniste` (526). Digestion à refaire.

**Alerte éthique consolidée (politique V2, aucun livre restreint)** — sources sensibles utilisées ici :
- **Sobiecki** — HIGH. Tradition vivante nommée (Xhosa/Cape Nguni, Zulu, Sotho ; *ukuthwasa*). **INFUSE vend deux des plantes documentées.** Nommer Sobiecki, nommer les peuples, nommer les informateurs quand ils sont nommés (Mama Maponya). Ne jamais suggérer que l'usage laïc équivaut à l'usage du diviner. **Jamais « ubulawu » comme nom de feature.** Réciprocité concrète à définir avant toute publication.
- **Ngubane / Mutwa / Cumes** — nommer le peuple Zulu, nommer la controverse Mutwa. Cumes : réciprocité requise pour tout usage public.
- **Lawlor** — HIGH. Non-autochtone, reconstruction occidentale d'un savoir oral. Pont conceptuel, jamais autorité.
- **Black Elk Speaks** — aucun usage décoratif d'imagerie lakota, aucune mythologie de marque.
- **Sand Talk** — usage interne/correctif ; pas de copy publique dérivée sans le cadre de réciprocité.
- **Neale & Kelly / Sveiby & Skuthorpe** — co-autorat aborigène : **toujours nommer le co-auteur autochtone** (Margo Neale, Tex Skuthorpe/Nhunggabarra), jamais « Sveiby » ou « Kelly » seuls.
- **Somé / Prechtel / Wolff** — nommer le peuple (Dagara, Tzutujil Maya, Sng'oi) et l'auteur. **Ne jamais écrire « méthode Senoi ».**
- **`ondinnonk`** : recherche lexicale menée sur tout le corpus hors racine `rêve` → **zéro occurrence**. Le concept n'existe dans la Forêt que via Moss, source secondaire non autochtone. **Concept haudenosaunee vivant. Jamais un nom de feature, jamais dans de la copy publique.**

---

## Feedback Forêt rapide

1. Qu'est-ce qui t'a été utile dans cette consultation ?
2. Qu'est-ce qui manquait ou te laisse sur ta faim ?
3. Quelque chose t'a surpris ?
4. Score rapide 1-5 ?
