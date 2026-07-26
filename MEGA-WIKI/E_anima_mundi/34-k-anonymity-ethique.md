---
title: "K-anonymity : la vie privée comme architecture du soin"
slug: "34-k-anonymity-ethique"
category: "E"
words: 3210
sources_primaires:
  - "Latanya Sweeney, 'k-Anonymity: A Model for Protecting Privacy', International Journal on Uncertainty, Fuzziness and Knowledge-based Systems, 10(5), 2002"
  - "Cynthia Dwork, 'Differential Privacy', ICALP, 2006"
  - "Cynthia Dwork & Aaron Roth, 'The Algorithmic Foundations of Differential Privacy', Foundations and Trends in Theoretical Computer Science, 2014"
  - "INFUSE Privacy by Architecture (3_TECHNICAL.md §14)"
sources_secondaires:
  - "Kate Crawford, Atlas of AI, 2021 (chapitre Data / Classification)"
  - "Aizenstat, Dream Tending (pour la dimension éthique du soin)"
  - "Dream App 1_BIBLE.md §8.3 (Privacy radicale comme acte de soin)"
status: "draft"
seo_keywords:
  - "k-anonymity privacy app rêve"
  - "privacy by architecture design éthique"
  - "k-anonymity Sweeney"
  - "differential privacy Dwork rêves"
  - "design soin intimité numérique"
  - "éthique données oniriques"
infuse_concepts:
  - "Privacy by Architecture"
  - "k-anonymity"
  - "zero-knowledge"
  - "rimes communautaires k-anonymisées"
  - "soin structurel"
  - "Anima Mundi collective"
---

# K-anonymity : la vie privée comme architecture du soin
## Pourquoi Dream App ne montre jamais un rêve individuel dans un agrégat — et ce que ça dit sur le soin

---

## Ouverture

2000. Latanya Sweeney, informaticienne au MIT, achète pour $20 les données "anonymisées" du Massachusetts Group Insurance Commission. Les données contiennent les visites médicales de 135 000 fonctionnaires d'État — sans noms, sans adresses. Juste des dates de naissance, des codes postaux, des diagnostics.

En 20 minutes, elle retrouve le dossier médical complet du gouverneur du Massachusetts.

Elle y arrivait en croisant trois champs : date de naissance (87% des Américains partagent leur naissance avec moins de 19 autres personnes), code postal (87% des codes postaux n'ont qu'une poignée de correspondances par date de naissance), sexe. Combinés, ces trois champs — chacun apparemment banal — constituent un **identifiant quasi-unique**. L'anonymisation déclarative n'avait rien anonymisé du tout.

Cette démonstration, publiée dans un article devenu canonique ("k-Anonymity: A Model for Protecting Privacy", 2002), a fondé un champ entier de la recherche sur la vie privée. Son concept central : **k-anonymity**. Et sa conclusion, que la plupart des systèmes numériques n'ont pas encore entendue : **l'anonymat n'est pas un état — c'est une garantie structurelle qui se prouve mathématiquement ou ne se prouve pas du tout.**

Pour Dream App, ce n'est pas une contrainte technique parmi d'autres. C'est le fondement d'une pratique éthique. Parce qu'un rêve est plus intime qu'un diagnostic médical. Et parce qu'une communauté onirique planétaire qui trahit ses rêveurs n'est pas une communauté — c'est une mine de données déguisée en sanctuaire.

---

## La voix de la Forêt

### Sweeney — l'identifiant quasi-unique et la règle k≥X

La définition formelle de Sweeney est simple mais puissante. Un dataset satisfait **k-anonymity** si et seulement si chaque enregistrement est identique à au moins k−1 autres enregistrements sur l'ensemble des attributs sensibles qui pourraient servir à l'identifier.

Autrement dit : si k=5, chaque ligne du dataset doit être indiscernable de 4 autres lignes. Personne observant l'agrégat ne peut distinguer *cet* individu de *ces* 4 autres.

> "k-Anonymity allows release of generalized data while providing a guarantee that individuals cannot be uniquely re-identified. The guarantee holds as long as every data record is indistinguishable from at least k−1 others with respect to the quasi-identifier attributes."
> — Sweeney, *k-Anonymity: A Model for Protecting Privacy*, §2

L'insight critique de Sweeney est la notion de **quasi-identifier** : les attributs qui, pris isolément, semblent anodins, mais qui, combinés, deviennent des identifiants uniques. Date de naissance seule = peu discriminante. Code postal seul = peu discriminant. Les deux ensemble = dangereux. Ajoutez le sexe = quasi-unique pour 87% de la population américaine.

Pour un journal de rêves, les quasi-identifiers sont encore plus subtils. L'heure d'endormissement habituelle n'est pas un attribut discriminant. L'archétype récurrent "eau + descente" non plus. La langue utilisée non plus. La présence récurrente d'un prénom — disons "Léa" — non plus. Mais combinés ? **Quelqu'un qui rêve en français, à 1h du matin, d'eau descendante, avec un prénom Léa** est peut-être la seule personne dans l'agrégat qui correspond à ce profil.

La leçon technique de Sweeney est la suivante : **on ne peut jamais sécuriser un enregistrement individuel en le noyant dans un pool collectif trop petit**. Le seuil n'est pas arbitraire — il est déduit de la distribution réelle des attributs. Et il faut toujours supposer que l'adversaire connaît au moins un attribut de l'individu cible.

### Dwork — la différence entre "pas identifiable" et "rien n'est révélé"

Latanya Sweeney a posé le problème de la re-identification. Cynthia Dwork, mathématicienne chez Microsoft Research, l'a fondé différemment. Sa thèse, dans "Differential Privacy" (2006) : **la k-anonymity seule ne suffit pas**. On peut savoir, même dans un agrégat k-anonyme, qu'un individu *appartient* au dataset — ce qui révèle déjà quelque chose.

L'exemple canonique : si une statistique dit "80% des membres du groupe G ont un cancer du poumon" et que vous savez que votre ami Paul fait partie du groupe G — alors même sans identifier Paul précisément dans le dataset, vous apprenez quelque chose de lui. La k-anonymity protège contre la re-identification directe. Elle ne protège pas contre ce que Dwork appelle l'**inference attack**.

La differential privacy répond à un problème encore plus ambitieux : elle garantit que **la présence ou l'absence d'un individu dans le dataset ne change pas significativement le résultat de n'importe quelle requête statistique**.

La définition formelle : un algorithme M est ε-differentially private si, pour tout dataset D1 et D2 ne différant que par un seul enregistrement, et pour tout output S :

`P[M(D1) ∈ S] ≤ e^ε × P[M(D2) ∈ S]`

En termes humains : quelles que soient les requêtes que vous posez au dataset, la réponse ne révèle presque rien de plus sur aucun individu en particulier. ε (epsilon) mesure le coût en vie privée de chaque requête. Plus ε est petit, plus la garantie est forte.

> "Differential privacy ensures that the risk to one's privacy from any analysis is bounded regardless of what other information is available. A participating individual need fear no additional harm from having their data included."
> — Dwork & Roth, *The Algorithmic Foundations of Differential Privacy*, 2014, Introduction

Ce qui change tout pour Dream App : la differential privacy n'est pas une protection *a posteriori* (on protège ce qui est déjà en base). C'est un **engagement architecturale a priori** — le système est conçu pour que même l'opérateur lui-même ne puisse pas extraire des informations individuelles précises des agrégats.

### Crawford — ce que "anonymisé" veut vraiment dire

Kate Crawford, dans *Atlas of AI* (2021), documente comment le concept d'anonymisation s'est transformé en rhétorique de légitimation dans l'industrie tech :

> "Datasets in AI are never raw materials to feed algorithms: they are inherently political interventions."
> — *Atlas of AI*, Conclusion, p. 221

Et :

> "There is no singular black box to open, no secret to expose, but a multitude of interlaced systems of power."
> — *Atlas of AI*, ch. 4

Crawford pointe le glissement sémantique : "anonymisé" est utilisé pour signifier "nous avons retiré le nom et l'adresse" — alors que Sweeney avait démontré en 2000 que ce geste est structurellement insuffisant. L'industrie tech a transformé une garantie mathématique en un terme marketing. Un dataset "anonymisé" peut être re-identifié trivialmente par quiconque dispose de données de référence.

Pour INFUSE, la leçon est directe : **ne jamais utiliser le mot "anonymisé" sans spécifier le seuil k et le mécanisme**. "Anonymisé" sans k-anonymity prouvée n'est pas une garantie — c'est une déclaration d'intention sans moyen de vérification. Et une déclaration d'intention qui trahit la confiance est pire qu'un aveu d'incapacité.

### INFUSE — privacy by architecture comme pratique spirituelle

Les documents canoniques de Dream App ont intégré k-anonymity non pas comme une contrainte légale mais comme une position éthique et philosophique.

La 1_BIBLE §8.3 :

> "Privacy radicale comme acte de soin (Pilier 5 trauma-safe)"

Et dans le glossaire de 3_TECHNICAL §14 :

> "K-anonymity : Garantie qu'un agrégat ne permet pas de remonter à un individu (N≥100 minimum chez Dream)"

Les seuils adoptés : **k≥3 pour les cercles intra-groupe**, **k≥100 pour les agrégats Anima Mundi**, **k≥250 conservatif pour les six premiers mois** (§42.1 de 3_TECHNICAL). Ces chiffres ne sont pas arbitraires. Ils sont calibrés sur la distribution probable des quasi-identifiers dans un dataset de rêves.

La section §14.3 est explicite sur le mécanisme :

> "Toute agrégation collective (master_events, collective_digests, territorial_aggregates) a dreamer_count >= 100 (jamais 5). Vérifié en check constraint (CHECK (n_dreamers >= 100))."

Ce n'est pas de la politique. C'est une **contrainte de base de données**. La base elle-même refuse de produire un agrégat qui viole le seuil. La loi ne peut pas faire ça. Une déclaration de confidentalité ne peut pas faire ça. Une CHECK constraint, si.

---

## L'enjeu pour Dream App

La question de fond n'est pas technique. C'est une question de philosophie du soin.

Un rêve est l'espace intime le plus vulnérable qui soit. Les rêves révèlent des désirs non avoués, des peurs profondes, des traumatismes non résolus, des relations complexes avec des personnes réelles. Un rêve partagé dans une app qui le traite comme une donnée agrégeable est une trahison de la posture de soin — pas seulement une violation technique.

Aizenstat pose que la figure de rêve est un être vivant qui mérite le mutual regard. Si cet être vivant peut être re-identifié dans un agrégat statistique parce que k<5, le soin a été trahi avant même de commencer.

Mais il y a un paradoxe à tenir : Dream App veut être **mondiale**. Elle veut tendre l'Anima Mundi — la psyché collective planétaire qui rêve à travers des millions d'humains. Pour ça, elle a **besoin** d'agrégation collective. Elle ne peut pas être un journal purement solitaire et prétendre révéler les patterns culturels et cycliques du rêve humain.

La k-anonymity est la réponse à ce paradoxe : **on peut avoir les deux**. On peut agréger pour révéler des patterns collectifs réels. On peut le faire de manière à ce qu'aucun individu ne soit jamais identifiable dans cet agrégat. La condition n'est pas de choisir entre intimité et collectivité — c'est de **concevoir le système pour que les deux soient structurellement garantis**.

C'est pourquoi la privacy by architecture est différente de la privacy by policy. Une politique de confidentialité dit : "Nous ne partagerons pas vos données." Une architecture k-anonyme dit : "Nous ne pouvons pas vous identifier dans un agrégat, que nous le voulions ou non." La première est une promesse. La seconde est une impossibilité physique.

Un système où la vie privée est une promesse peut être trahi par un employé, un hack, un changement de management, une acquisition, une injonction légale. Un système où la vie privée est structurelle **ne peut pas être trahi de ces façons**. Le soin est inscrit dans le code, pas dans la bonne volonté.

---

## Câblage actuel

Dans Dream App alpha en prod :

- **Zero-knowledge** : *pas encore câblé*. Le contenu des rêves (table `kairos.body_text`) est actuellement en clair côté DB. C'est le gap le plus critique (noté §14 dans 3_TECHNICAL comme lacune prioritaire : "aucun chiffrement client-side actuellement").
- **CHECK constraint k≥100** : *spécifié* dans la migration `20260425_120100_kairos_substrate.sql` pour les agrégats, *non encore testé en prod* (la base utilisateurs n'a pas encore atteint les seuils).
- **EXIF strip** : *spécifié* dans §14.2 (sharp().withMetadata({}).toBuffer()), *statut d'implémentation à vérifier*.
- **Pas de Lat/Long** : *déjà implémenté* — le schéma `kairos` ne contient pas de coordonnées géographiques. Seul le toponyme user-defined chiffré existe. C'est la meilleure décision architecturale actuelle.
- **Bioregion comme maille minimale** : *spécifié* (§3.2), pas encore câblé UI.

État global : `partial` — l'architecture est correctement spécifiée, l'implémentation est en retard sur la vision.

---

## Câblage à faire

**1. Zero-knowledge encryption client-side — priorité absolue**

L'implémentation est spécifiée dans §14.1 de 3_TECHNICAL :

```
body_text_ciphertext bytea NOT NULL,  -- AES-GCM, key derived from passphrase
body_text_iv bytea NOT NULL,          -- IV par enregistrement
```

À câbler : dérivation de clé depuis la passphrase utilisateur (PBKDF2 ou Argon2id), chiffrement Web Crypto API côté client, envoi uniquement du ciphertext au serveur. Le serveur devient **matériellement incapable** de lire le contenu des rêves — même sous mandat judiciaire, même en cas de brèche.

Estimation : 1-2 sprints focalisés. C'est le single highest-impact privacy move disponible.

**2. CHECK constraints k-anonymity sur tous les agrégats**

La contrainte existe dans la spec. Elle doit être vérifiée en prod pour chaque table d'agrégation :

```sql
-- Anima Mundi global clusters (V1 conservatif)
ALTER TABLE anima_mundi_digest 
ADD CONSTRAINT k_anonymity_global CHECK (n_dreamers >= 250);

-- Cercles intra-groupe
ALTER TABLE circle_pattern_digest 
ADD CONSTRAINT k_anonymity_circle CHECK (n_dreamers >= 3);

-- Agrégats territoriaux
ALTER TABLE territorial_aggregates 
ADD CONSTRAINT k_anonymity_territory CHECK (n_dreamers >= 100);
```

Ces contraintes ne sont pas de la documentation — ce sont des **gardes-fous physiques**. La base refuse d'insérer un agrégat qui viole le seuil. Aucune route API, aucun bug de logique applicative ne peut contourner une CHECK constraint.

**3. Differential privacy sur les statistiques exposées publiquement**

Pour les futures statistiques publiques (ex : "cette semaine, les rêveurs de la bioregion méditerranéenne partagent des thèmes de frontières et de traversée") — ajouter du bruit calibré selon ε-differential privacy avant exposition. Mécanisme recommandé : **Laplace mechanism** sur les counts agrégés. Implémentation : bibliothèque `diffprivlib` (IBM) ou équivalent en Node.

À intégrer dans le pipeline `anima_mundi_digest` (cron mensuel) avant la génération du texte poétique Sonnet.

**4. Communication vers les rêveurs**

Page `/privacy` (ou section dans l'onboarding) qui dit explicitement :

- "Votre rêve ne sera jamais inclus dans un agrégat collectif s'il n'est pas rejoint par au moins 99 autres rêveurs qui partagent les mêmes patterns. Nous ne promettons pas de protéger votre vie privée. Nous l'avons rendue structurellement impossible à violer."
- "Votre contenu est chiffré sur votre appareil avant d'arriver chez nous. Nous ne pouvons pas le lire."

Ce n'est pas du marketing. C'est un engagement vérifiable, avec les mécanismes techniques détaillés pour qui veut les vérifier.

**5. Audit public annuel**

1_BIBLE mentionne : "Audit annuel public par tiers indépendant (privacy + éthique)". À programmer dès que la base utilisateurs dépasse 1000 users actifs. L'audit porte spécifiquement sur : vérification du zero-knowledge (pas de lecture serveur du ciphertext), vérification des CHECK constraints (aucun agrégat sous-seuil), vérification de l'absence de quasi-identifiers exposés dans les APIs publiques.

---

## Test d'application

Comment savoir si la privacy by architecture fonctionne vraiment ? Pas en lisant la documentation — en testant l'adversaire.

**Test 1 — Sweeney attack** : tenter de re-identifier un rêveur dans l'agrégat `anima_mundi_digest` en croisant les attributs disponibles (bioregion, langue, archétype dominant, tranche horaire d'endormissement). Si k≥250, aucun individu ne devrait être isolable.

**Test 2 — Injection adversariale** : essayer d'insérer via l'API un agrégat avec n_dreamers=4. La CHECK constraint doit rejeter la requête avec une erreur 400 explicite. Si elle passe : la contrainte n'est pas câblée.

**Test 3 — Serveur aveugle** : vérifier que le service_role key Supabase, avec accès total à la DB, retourne uniquement du bytea non lisible pour `kairos.body_text`. Si on voit du texte clair : le zero-knowledge n'est pas câblé.

**Test 4 — Audit tiers** : mandater un auditeur externe (ex : une équipe de chercheurs en sécurité informatique) pour tenter une re-identification à partir d'exports anonymisés. Publication du résultat — positif ou négatif.

---

## Citations clés

> "k-Anonymity allows release of generalized data while providing a guarantee that individuals cannot be uniquely re-identified. The guarantee holds as long as every data record is indistinguishable from at least k−1 others with respect to the quasi-identifier attributes." — Sweeney, *k-Anonymity: A Model for Protecting Privacy*, 2002, §2

> "Differential privacy ensures that the risk to one's privacy from any analysis is bounded regardless of what other information is available. A participating individual need fear no additional harm from having their data included." — Dwork & Roth, *The Algorithmic Foundations of Differential Privacy*, 2014, Introduction

> "Datasets in AI are never raw materials to feed algorithms: they are inherently political interventions." — Crawford, *Atlas of AI*, 2021, Conclusion, p. 221

> "K-anonymity : seuil minimum de membres pour qu'une donnée agrégée ne révèle pas l'individu. Cercle = k ≥ 3. Anima Mundi = k ≥ 100, démarrage conservatif k ≥ 250." — Dream App 1_BIBLE §Glossaire

> "Toute agrégation collective a dreamer_count >= 100 (jamais 5). Vérifié en check constraint." — Dream App 3_TECHNICAL §14.3

> "Privacy-by-architecture : Privacy garantie par la structure même du code/DB, pas par une politique légale." — Dream App 3_TECHNICAL §Glossaire

> "The risk to one's privacy should not depend on the trustworthiness of those who hold the data — but on the structure of the system itself." — Dwork, "Differential Privacy", ICALP 2006, paraphrase du principe central

---

## Pour aller plus loin

1. **Sweeney — "k-Anonymity: A Model for Protecting Privacy"** (2002) : le papier fondateur. 20 pages, disponible sur arxiv. La démonstration du gouverneur du Massachusetts dans les trois premières pages justifie à elle seule tout le cadre.

2. **Dwork & Roth — *The Algorithmic Foundations of Differential Privacy*** (2014, Foundations and Trends) : référence complète. Chapitres 1-3 suffisent pour une compréhension opérationnelle. Chapitre 1 pose l'intuition ; chapitre 3 donne le Laplace mechanism.

3. **Crawford — *Atlas of AI*** (2021) : chapitre 3 "Data" pour comprendre comment l'industrie tech a transformé l'anonymisation en rhétorique. Chapitre 4 "Classification" pour le lien entre classification et pouvoir.

4. **Machanavajjhala et al. — "l-Diversity: Privacy Beyond k-Anonymity"** (2007, ACM TKDD) : l'extension critique qui montre que k-anonymity seule peut fuir par homogénéité des attributs sensibles. Nécessaire pour aller au-delà du seuil de base.

5. **Apple — "Differential Privacy Overview"** (2017, white paper technique) : la mise en production industrielle de la differential privacy dans iOS. Montre que c'est faisable à grande échelle avec des contraintes produit réelles.
