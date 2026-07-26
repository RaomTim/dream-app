---
title: "Privacy by architecture : quand protéger les rêves est un acte de soin"
slug: "40-privacy-by-architecture"
category: "F"
words: 3080
sources_primaires:
  - Cynthia Dwork, "Differential Privacy" (2006, formalisation dans "Calibrating Noise to Sensitivity in Private Data Analysis", TCC 2006)
  - Latanya Sweeney, "k-anonymity: A Model for Protecting Privacy" (International Journal on Uncertainty, Fuzziness and Knowledge-based Systems, 2002)
  - Dream App 1_BIBLE.md §8.3 + 3_TECHNICAL.md §14
sources_secondaires:
  - Daniel Solove, "Nothing to Hide: The False Trade-off Between Privacy and Security" (2011)
  - Bruce Schneier, "Data and Goliath" (2015)
  - Dwork & Roth, "The Algorithmic Foundations of Differential Privacy" (2014)
status: "draft"
seo_keywords:
  - privacy by design
  - differential privacy reve
  - k-anonymity dream app
  - chiffrement reves
  - zero knowledge app sante mentale
  - RGPD dreams
  - privacy architecture ethique
infuse_concepts:
  - privacy-by-architecture
  - k-anonymity
  - zero-knowledge
  - consentement éclairé
  - acte de soin structurel
  - chiffrement bout-en-bout
---

# Privacy by architecture : quand protéger les rêves est un acte de soin

## Ouverture

Mathieu a 29 ans. Il ouvre une app de journal intime — pas une app de rêves, une app quelconque — et commence à noter ses pensées les plus profondes sur sa relation à son père. Il coche "journal privé". Il voit un cadenas dans le coin de l'écran. Il se sent protégé.

Ce qu'il ne sait pas : l'app envoie ses entrées, en clair, à un serveur hébergé aux États-Unis, géré par un prestataire cloud que la startup a sous-traité à un troisième. Les métadonnées (date, heure, durée de session, géolocalisation approximative) sont transmises à une régie analytique pour "améliorer l'expérience". Une fuite de données chez le prestataire cloud expose ses notes un an plus tard. Elles ne sont jamais utilisées contre lui — il a de la chance. Mais elles ont existé quelque part, lisibles, sous une forme qui permettait de le reconnaître.

Le cadenas était une métaphore. Pas une architecture.

Cette distinction — entre privacy comme **posture déclarative** (checkbox, politique de confidentialité, cadenas décoratif) et privacy comme **architecture structurelle** (chiffrement côté client, aucune donnée sensible lisible côté serveur, k-anonymité réelle, zéro Lat/Long) — est au cœur de l'article 40. Appliquée à une app de rêves, elle n'est pas un luxe de startup premium. C'est la condition de possibilité d'une confiance réelle entre un utilisateur qui partage sa vie onirique et un système qui la reçoit.

---

## La voix de la Forêt

### Latanya Sweeney — k-anonymité et la fin de l'"anonymisation" naïve

Latanya Sweeney, informaticienne au MIT devenue directrice de la Federal Trade Commission, a publié en 2002 un résultat qui a changé la conception de la privacy dans les systèmes de données : **k-anonymity: A Model for Protecting Privacy**.

Sa démonstration de départ est simple et dévastante. En 1997, le groupe de recherche en santé du Massachusetts publie des données médicales "anonymisées" des employés de l'État — les noms ont été supprimés. Sweeney combine ces données avec la liste électorale publique de la ville de Cambridge (date de naissance, code postal, sexe — librement accessible). Résultat : **87% des Américains peuvent être réidentifiés uniquement par la combinaison {date de naissance, code postal, sexe}**. Elle envoie le dossier médical personnel du gouverneur de l'État à son bureau de poste.

> "87% of Americans could be uniquely identified using only {date of birth, postal code, sex}." — Latanya Sweeney, "k-anonymity" (2002)

Ce n'est pas une anecdote. C'est une preuve formelle que l'anonymisation naïve (suppression du nom) ne protège rien dans un monde où des données quasi-identifiant publiques existent. Le terme technique de Sweeney pour ces données : **quasi-identifiers** — des attributs qui, seuls, ne permettent pas l'identification, mais combinés avec d'autres sources, le permettent.

La réponse de Sweeney est le modèle **k-anonymité** : dans tout ensemble de données publié ou agrégé, chaque individu doit être indistinguable d'au moins k-1 autres individus pour l'ensemble des quasi-identifiers. Si k=100, un individu ne peut pas être distingué de 99 autres. Si k=5, cinq suffisent — et Sweeney a montré que k=5 est trivial à casser avec des sources tierces.

Pour une app de rêves, les quasi-identifiers sont nombreux et redoutables : heure de saisie du rêve (habitudes nocturnes), patterns récurrents de figures (marqueurs biographiques), localisation approximative (si on l'accepte), fréquence de saisie (indicateur de santé mentale), type de contenu (anxiété, deuil, trauma). Chacun, seul, est anodin. Combinés avec une fuite d'un autre service ou un accès institutionnel, ils peuvent permettre une réidentification de données que l'utilisateur croyait protégées.

La règle concrète que Sweeney en tire : **aucune agrégation ne doit être publiée sans vérification de k-anonymité**, où k est défini en fonction de la sensibilité du contenu. Pour des données médicales, k=100 est une recommandation standard. Pour des données de rêves — qui touchent à la santé mentale, aux désirs, aux peurs, au deuil — k=100 est un minimum raisonnable.

### Cynthia Dwork — la privacy différentielle comme garantie mathématique

Cynthia Dwork, chercheuse chez Microsoft Research, a formalisé en 2006 le cadre de la **differential privacy** — une définition mathématique de ce que "protéger la privacy" signifie pour des algorithmes d'agrégation. Publiée dans "Calibrating Noise to Sensitivity in Private Data Analysis" (TCC 2006), la définition est désormais standard dans les systèmes de données à grande échelle.

L'idée centrale est contre-intuitive : on ne peut pas garantir qu'une donnée individuelle ne sera jamais inférée à partir d'un agrégat. Ce qu'on peut garantir, c'est que **la présence ou l'absence d'un individu dans la base change si peu le résultat de l'agrégat que personne ne peut en inférer quoi que ce soit de significatif sur cet individu**.

Formellement, un algorithme M est (ε, δ)-differentially private si, pour tout voisin de base de données D et D' (qui diffèrent par un seul individu) et tout sous-ensemble S de sorties possibles :

**P[M(D) ∈ S] ≤ e^ε × P[M(D') ∈ S] + δ**

Le paramètre ε (epsilon) est le "budget privacy" — plus il est petit, plus la garantie est forte. δ est la probabilité d'échec de la garantie. Le mécanisme pratique : on ajoute du bruit aléatoire calibré aux résultats de requêtes sur la base de données, de sorte que le bruit masque la contribution individuelle.

> "Differential privacy ensures that the risk to one's privacy is not substantially increased by participating in a statistical database." — Dwork & Roth, "The Algorithmic Foundations of Differential Privacy" (2014)

Pourquoi c'est important pour Dream App : l'app détecte des patterns collectifs (clusters de rêves, "Master Events", convergences symboliques entre rêveurs à k-anonymité ≥ 100). Si ces agrégats ne sont pas produits avec une forme de privacy différentielle, un adversaire sophistiqué peut potentiellement, par accumulation de requêtes sur l'API, inférer des informations sur des individus à partir des résultats agrégés.

Dwork a aussi formalisé la notion de **composition** : la privacy différentielle se dégrade quand on cumule des requêtes. Si un utilisateur fait n requêtes différentes, le budget ε est consommé n fois. Il faut donc concevoir des limites de requêtes et un suivi du budget pour les systèmes qui exposent des APIs de requêtes agrégées.

### La leçon de Sweeney appliquée aux métadonnées oniriques

Sweeney a démontré sa thèse sur des données médicales. Le raisonnement s'applique directement aux données de rêves, avec une acuité encore plus grande : **les rêves sont des données de santé mentale au sens large**. En France, la CNIL classe les données de santé comme données sensibles au sens du RGPD (article 9). Les données révélant des "croyances religieuses ou philosophiques" — catégorie dans laquelle tomberait le contenu onirique de beaucoup d'utilisateurs — sont aussi protégées par l'article 9.

Les quasi-identifiers d'une app de rêves sont redoutables :
- **Heure de saisie** : un utilisateur qui saisit systématiquement entre 6h15 et 6h45 a un pattern distinct.
- **Durée de saisie** : les rêves longs (>500 mots) signalent des événements marquants.
- **Figures récurrentes** : si un utilisateur a un "père" récurrent dans ses rêves, et qu'une fuite révèle qui a ce pattern, la biographie se dévoile.
- **Patterns de contenu** : anxiété chronique, deuil en cours, trauma actif — tous inférables avec suffisamment de données.
- **Absence de saisie** : une absence de 14 jours peut signaler une hospitalisation ou une crise.

Sweeney dit : "When 87% of Americans can be identified by 3 data points, no app should call its data 'anonymous' without formal k-anonymity guarantees." Pour des données oniriques, ce chiffre est probablement plus élevé — les rêves sont biographiquement plus discriminants que la combinaison naissance+code postal+sexe.

### Ce que l'architecture résout que la politique ne peut pas résoudre

Daniel Solove (*Nothing to Hide*, 2011) et Bruce Schneier (*Data and Goliath*, 2015) convergent sur un point : **les politiques de confidentialité ne protègent pas**. Elles distribuent la responsabilité légale sans créer de protection réelle.

Une politique de confidentialité peut promettre "nous ne vendrons jamais vos données". Mais :
- Elle peut être modifiée unilatéralement (voir WhatsApp 2021).
- Elle ne protège pas contre les fuites (ingénierie sociale, faille 0-day, prestataire compromis).
- Elle ne protège pas contre l'accès judiciaire (mandat, réquisition).
- Elle ne protège pas contre le rachat (si la startup est achetée, les données transitent avec l'entreprise).

Seule l'architecture peut résoudre certains de ces problèmes. Spécifiquement :

**Le chiffrement côté client avant envoi** (*end-to-end encryption, zero-knowledge*) fait que le serveur stocke des octets illisibles. Même sous mandat judiciaire, même en cas de fuite, même si la startup est rachetée — le contenu des rêves reste illisible à quiconque n'a pas la clé de déchiffrement, que seul l'utilisateur possède. Le serveur est aveugle par construction.

**La séparation des données sensibles et des métadonnées** fait que même si les métadonnées fuient (timestamp, durée, taille de saisie), elles ne peuvent pas être reliées à du contenu en clair.

**L'absence de Lat/Long** (*pas de géolocalisation précise*) retire le quasi-identifier géographique le plus discriminant. On ne stocke pas où le rêve a été rêvé — on stocke le nom que l'utilisateur donne à ce lieu, en texte libre, chiffré.

---

## L'enjeu pour Dream App

Dream App accueille du matériel que les utilisateurs ne partagent avec personne — des rêves de désir, de honte, de peur, de deuil, d'ambivalence, de trauma. Souvent, le rêve est la première formulation de quelque chose qui n'a pas encore de mots dans la vie éveillée. C'est précisément pourquoi la confiance est le produit.

Si un utilisateur se dit "l'app peut lire mes rêves", "mes rêves pourraient fuiter", "un algorithme quelque part me profile sur la base de mon inconscient" — il ne saisira pas ses rêves les plus importants. Il censurera. Il utilisera l'app pour les rêves neutres. Et l'app perdra l'essentiel.

La privacy par architecture n'est donc pas une fonctionnalité de conformité réglementaire. C'est la condition de possibilité de la profondeur. Sans elle, l'app est condamnée à la surface.

La vision Dream App — application mondiale pour l'émergence d'une Dream Society planétaire — requiert cette confiance à une échelle encore plus large. Si l'app vise des centaines de millions d'utilisateurs à travers des cultures, des régimes politiques, des contextes légaux différents, elle doit pouvoir opérer avec une privacy structurelle qui ne dépend pas des législations locales ni des bonnes intentions d'une startup française. La protection doit être dans le code, pas dans la politique.

---

## Câblage actuel

La 3_TECHNICAL.md §14 détaille l'architecture privacy de Dream App en cinq couches :

**§14.1 Zero-knowledge encryption client-side.** Tout contenu sensible (`body_text`, `toponym_user_defined`, `somatic_field`) est chiffré côté client avant envoi. Le serveur stocke des `bytea`. Clé dérivée de la passphrase utilisateur via PBKDF2 (600 000 itérations, SHA-256), IV aléatoire, AES-GCM. Conséquence : l'IA ne peut traiter le contenu qu'en éphémère côté serveur, avec une clé temporaire envoyée par le client lors d'un opt-in explicite pour cette entrée spécifique.

**§14.2 EXIF strip systématique.** Tout audio uploadé passe par `ffmpeg -map_metadata -1` avant stockage. Toute image : `sharp().withMetadata({}).toBuffer()`. Les métadonnées embarquées (géolocalisation, modèle d'appareil, timestamp exact) sont supprimées.

**§14.3 K-anonymité stricte.** Toute agrégation collective (`master_events`, `collective_digests`, `territorial_aggregates`) a `dreamer_count >= 100`. Cette contrainte est dans le schéma SQL : `CHECK (n_dreamers >= 100)`. Elle ne peut pas être contournée par une requête mal écrite — elle est dans la base.

**§14.4 Aucun analytics tiers sur le contenu.** Sentry, PostHog, Mixpanel, GA4 : autorisés uniquement sur erreurs techniques et événements UX anonymes. Jamais de `body_text` dans un payload externe. Une `denylist` de paths dans `lib/sentry.ts` enforce cela.

**§14.5 Politique de rétention.** L'utilisateur peut effacer son archive entière à tout moment. Aucune copie "anonymisée" conservée après effacement. Backups chiffrés avec la passphrase utilisateur — irrécupérables sans elle.

Ce câblage est solide. Il est partiellement implémenté en alpha, partiellement spécifié pour V1. Il met en oeuvre les principes de Sweeney (k-anonymité) et partiellement ceux de Dwork (isolation des données individuelles).

---

## Câblage à faire

**1. Privacy screen et explication en clair (priorité 1).**
Un écran dédié, accessible en 2 clics depuis n'importe quel point de l'app : "Comment tes rêves sont protégés." Pas en small print. Pas en jargon légal. En clair : "Ton rêve est chiffré sur ton téléphone avant de nous parvenir. Nous ne pouvons pas le lire. Même si notre serveur était piraté demain, tes rêves resteraient illisibles pour tout le monde sauf toi." Références Sweeney et Dwork intégrées sous forme de storytelling accessible, pas de formules.

**2. Audit annuel public (priorité 2).**
Engagement contractuel : audit annuel par tiers indépendant (privacy + éthique) publié en open access sur le site Dream App. Le rapport couvre : vérification du zero-knowledge, vérification des seuils k-anonymité, vérification de l'absence de trackers dans les payloads. Ce n'est pas une feature — c'est une gouvernance. Référence : 1_BIBLE.md §8.3 — "Audit annuel public par tiers indépendant."

**3. Privacy différentielle sur les requêtes d'agrégation (priorité 3 — V2).**
Les APIs qui exposent des agrégats (`/api/master-events`, `/api/collective-digests`) doivent implémenter un mécanisme de bruit différentiel sur les résultats. Concrètement : ajouter un bruit gaussien calibré (ε=1.0, mécanisme de Gaussian) aux comptages avant retour. Ce bruit est invisible à l'utilisateur final (les différences sont <5% sur des agrégats de n≥100) mais invalide les attaques par accumulation de requêtes. Référence : Dwork "Calibrating Noise to Sensitivity" — le bruit doit être proportionnel à la sensibilité de la requête.

**4. Pas de Lat/Long jamais — enforced architecturalement (priorité absolue — V1).**
La 3_TECHNICAL.md §14 et la 1_BIBLE.md §8.4 sont explicites : `toponym_user_defined` (champ texte libre, chiffré) — jamais `geo_lat / geo_lng / geo_precision`. Cette règle doit être dans le schéma SQL (pas de colonne Lat/Long dans aucune table `dream_entries`), dans le system prompt d'Anima (instruction explicite de ne jamais demander la localisation précise), et dans la politique de revue de code (PR qui ajouterait un champ de géolocalisation serait rejeté).

**5. Mode rêve éphémère (priorité 1).**
Un mode optionnel : le rêve n'est pas archivé. Il est traité en mémoire vive côté serveur (ephemeral_only: true), sans embedding, sans stockage, sans backup. Suppression automatique J+1. Pour les utilisateurs qui veulent juste articuler un rêve sans le stocker. Ce mode doit être proposé dès l'onboarding, pas caché dans les paramètres avancés.

**6. Engagement "aucun rêve sensible vers l'IA sans opt-in explicite" (priorité 1).**
Comme spécifié en 1_BIBLE.md §8.3 : "Engagement contractuel : aucun rêve marqué sensible n'entraîne IA." L'opt-in IA sur un rêve spécifique doit être séparé du marquage "sensible". Un rêve peut être stocké sans jamais être traité par l'IA. Ce découplage doit être exposé clairement dans l'UI et enforced dans l'architecture (bit `ia_opt_in` par entrée, non `ia_opt_in` global par compte).

---

## Test d'application

À 6 mois en alpha :
- Proportion d'utilisateurs qui ont vu la Privacy screen au moins une fois. Cible : 80%.
- Proportion d'utilisateurs qui comprennent ce que "chiffré sur ton téléphone" veut dire (survey 3 questions). Cible : 60% peuvent l'expliquer avec leurs propres mots.
- Volume de rêves marqués `sensitive` vs volume de rêves avec `ia_opt_in: true`. Cible : les rêves sensibles ont un taux d'opt-in IA inférieur à 20% — signe que les utilisateurs distinguent bien les deux.
- Nombre de rêves enregistrés en mode éphémère vs mode standard. Pas de cible précise — mais l'existence d'utilisation du mode éphémère confirme que l'option est connue et utilisée.

---

## Citations clés

> "87% of Americans could be uniquely identified using only {date of birth, postal code, sex}." — Latanya Sweeney, "k-anonymity: A Model for Protecting Privacy" (2002)

> "Differential privacy ensures that the risk to one's privacy is not substantially increased by participating in a statistical database." — Dwork & Roth, "The Algorithmic Foundations of Differential Privacy" (2014)

> "When a planet's invitation is refused, the archetype doesn't disappear — it becomes compulsion." — Caroline Casey (principe applicable ici : quand la privacy est refusée structurellement, l'auto-censure devient compulsion chez l'utilisateur)

> "Privacy-by-architecture : privacy garantie par la structure même du code et de la DB, pas par une politique légale." — 3_TECHNICAL.md §14, Dream App

> "Chiffrement bout en bout par défaut. Mode rêve éphémère en un clic. Effacement immédiat sans questionnement. Engagement contractuel : aucun rêve marqué sensible n'entraîne IA." — 1_BIBLE.md §8.3, Dream App

> "Si tu codes Lat/Long en V1 'pour V3', tu construis un actif que tu ne peux plus défaire." — 1_BIBLE.md §8.4, Dream App (règle d'architecture irréversible)

> "Aucune copie 'anonymisée' conservée après effacement. Backups chiffrés avec la passphrase user, irrécupérables sans elle." — 3_TECHNICAL.md §14.5, Dream App

---

## Pour aller plus loin

- **Cynthia Dwork & Aaron Roth — "The Algorithmic Foundations of Differential Privacy" (2014)** : le texte de référence complet sur la privacy différentielle. Dense mais accessible pour des développeurs. Lire au moins les chapitres 1-3 pour comprendre le mécanisme de base.
- **Latanya Sweeney — "k-anonymity: A Model for Protecting Privacy" (2002)** : l'article original, court (15 pages), avec la démonstration complète de la réidentification. Lecture obligatoire pour tout ingénieur travaillant sur des données sensibles.
- **Daniel Solove — "Nothing to Hide: The False Trade-off Between Privacy and Security" (2011)** : panorama philosophique et juridique des arguments pro-privacy. Utile pour articuler pourquoi "je n'ai rien à cacher" est un argument intenable.
- **Bruce Schneier — "Data and Goliath: The Hidden Battles to Collect Your Data and Control Your World" (2015)** : panorama des risques de la collecte de données à grande échelle. Contexte indispensable pour comprendre pourquoi les politiques de confidentialité ne suffisent pas.
- **Helen Nissenbaum — "Privacy in Context: Technology, Policy, and the Integrity of Social Life" (2010)** : cadre conceptuel de la "contextual integrity" — l'idée que la privacy n'est pas l'absence de partage de données, mais le respect des normes de flux informationnels propres à chaque contexte social. Application directe au contexte onirique.
