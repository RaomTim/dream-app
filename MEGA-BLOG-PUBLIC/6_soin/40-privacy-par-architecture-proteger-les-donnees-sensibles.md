---
title: "Privacy par architecture : protéger les données sensibles comme acte de soin"
slug: "privacy-par-architecture-donnees-sensibles-soin"
category: "6_soin"
words: 1900
sources_primaires:
  - "Latanya Sweeney, k-anonymity: A Model for Protecting Privacy, 2002"
  - "Cynthia Dwork, Calibrating Noise to Sensitivity in Private Data Analysis, TCC 2006"
sources_secondaires:
  - "Daniel Solove, Nothing to Hide, 2011"
  - "Bruce Schneier, Data and Goliath, 2015"
  - "Dwork & Roth, The Algorithmic Foundations of Differential Privacy, 2014"
status: "published"
voice_validated: true
seo_title: "Privacy par architecture : protéger vraiment les données sensibles"
meta_description: "Un cadenas dans l'interface ne protège rien. Sweeney et Dwork ont formalisé ce que la protection réelle exige — chiffrement côté client, zero-knowledge, k-anonymité pour données de santé mentale et journal intime."
keywords:
  - "privacy by design données sensibles"
  - "k-anonymité Sweeney"
  - "differential privacy Dwork"
  - "chiffrement côté client santé mentale"
  - "RGPD données santé mentale"
  - "zero knowledge app bien-être"
  - "protection données journal intime"
related_articles:
  - "vie-privee-architecture-soin"
  - "38-design-conscient-du-trauma-levine-ogden"
  - "dream-sharing-couple-famille-protocoles-ethiques"
language: "fr"
publisher: "INFUSE"
schema_type: "Article"
---
# Privacy par architecture
## Protéger les données sensibles comme acte de soin

---

> **Note de lecture** : Cet article traite de la protection des données **individuelles** — journal intime, données de santé mentale, bien-être personnel — avec un focus sur le chiffrement côté client et les architectures zero-knowledge. Pour la question de la privacy dans les **communautés et agrégats collectifs** (k-anonymity, differential privacy, plateformes de partage), voir l'article complémentaire : [La vie privée comme architecture du soin](/5-collectif/vie-privee-architecture-soin).

---

## 1. Ouverture

Tu ouvres une application de journal intime. Tu notes tes pensées les plus intimes. Tu coches "journal privé". Tu vois un cadenas dans le coin de l'écran. Tu te sens protégé.

Ce que tu ne sais pas : l'application envoie tes entrées, en clair, à un serveur hébergé dans un pays tiers, géré par un prestataire que la startup a sous-traité à un troisième. Les métadonnées — date, heure, durée de session, localisation approximative — partent vers une régie analytique pour "améliorer l'expérience". Une fuite chez ce prestataire expose tes notes un an plus tard.

Le cadenas était une métaphore. Pas une architecture.

Cette distinction — entre privacy comme **posture déclarative** (case à cocher, politique de confidentialité, icône rassurante) et privacy comme **architecture structurelle** (chiffrement côté client, aucune donnée sensible lisible côté serveur, garanties mathématiques sur l'anonymat) — est au cœur de cet article. Pour toute plateforme qui accueille des données sensibles, cette distinction n'est pas un détail technique. C'est une question éthique.

---

## 2. En 30 secondes

Latanya Sweeney a démontré en 2002 que 87% des Américains peuvent être réidentifiés avec seulement trois points de données "anonymes". Cynthia Dwork a formalisé les garanties mathématiques qui permettent de résister à cette réidentification. Ensemble, leurs travaux définissent ce que protéger des données sensibles signifie réellement — et pourquoi les politiques de confidentialité, seules, ne protègent pas.

---

## 3. Voix des maîtres

> "87% of Americans could be uniquely identified using only {date of birth, postal code, sex}." — Latanya Sweeney, "k-anonymity: A Model for Protecting Privacy" (2002)

> "Differential privacy ensures that the risk to one's privacy is not substantially increased by participating in a statistical database." — Cynthia Dwork & Aaron Roth, "The Algorithmic Foundations of Differential Privacy" (2014)

> "When 87% of Americans can be identified by 3 data points, no app should call its data 'anonymous' without formal k-anonymity guarantees." — Latanya Sweeney

> "Privacy-as-architecture means privacy guaranteed by the structure of the code and database itself, not by a legal policy." — principe de base du design privacy-first

---

## 4. Pourquoi ça compte

### La démonstration de Sweeney : l'anonymisation naïve ne protège rien

En 1997, le groupe de recherche en santé du Massachusetts publie des données médicales "anonymisées" — les noms ont été supprimés. Latanya Sweeney, informaticienne au MIT, combine ces données avec la liste électorale publique de la ville de Cambridge (date de naissance, code postal, sexe — librement accessible).

Résultat : elle peut réidentifier 87% des Américains avec seulement ces trois champs. Elle envoie le dossier médical personnel du gouverneur de l'État à son bureau de poste.

La leçon est structurelle : dans un monde où de nombreuses sources de données existent (réseaux sociaux, listes électorales, données commerciales), supprimer le nom ne suffit pas. Les **quasi-identifiers** — des attributs qui seuls ne permettent pas l'identification mais combinés le permettent — sont omniprésents.

Pour des données sensibles (santé mentale, journal intime, données de bien-être), les quasi-identifiers sont particulièrement redoutables :
- L'heure de saisie (habitudes nocturnes)
- La fréquence d'utilisation (indicateur d'état psychologique)
- Les thèmes récurrents (marqueurs biographiques)
- La durée des sessions
- L'absence de saisie (peut signaler une hospitalisation ou une crise)

### La réponse de Sweeney : la k-anonymité

Sweeney formalise le modèle de **k-anonymité** : dans tout ensemble de données publié ou agrégé, chaque individu doit être indistinguable d'au moins k-1 autres individus sur l'ensemble des quasi-identifiers.

Si k=100, une personne ne peut pas être distinguée de 99 autres. Pour des données médicales, k=100 est une recommandation standard. Pour des données de santé mentale ou de journal intime — plus biographiquement discriminantes — c'est un minimum raisonnable.

La règle concrète : **aucune agrégation de données ne devrait être publiée ou partagée sans vérification formelle de k-anonymité.**

### La réponse de Dwork : la privacy différentielle

Cynthia Dwork a formalisé un cadre encore plus robuste : la **differential privacy**. L'idée centrale est contre-intuitive : on ne peut pas garantir qu'une donnée individuelle ne sera jamais inférée. Mais on peut garantir que **la présence ou l'absence d'un individu dans la base change si peu le résultat des analyses que personne ne peut en inférer quoi que ce soit de significatif sur cet individu**.

En pratique : on ajoute du bruit aléatoire calibré aux résultats des requêtes sur la base de données. Ce bruit masque la contribution individuelle tout en laissant les analyses agrégées statistiquement valides.

C'est ce que font aujourd'hui Apple (iOS), Google (Chrome) et le recensement américain pour protéger les données de leurs utilisateurs lors des analyses statistiques.

---

## 5. La pratique — ce que la protection réelle exige

### 1. Chiffrement côté client (zero-knowledge)

Le principe : les données sont chiffrées sur l'appareil de l'utilisateur avant d'être envoyées au serveur. Le serveur stocke des octets illisibles. Même si le serveur est piraté, même sous mandat judiciaire, même si la startup est rachetée — les données restent illisibles.

Seul l'utilisateur possède la clé. La plateforme est **aveugle par construction**.

Ce que cela requiert techniquement : chiffrement AES-GCM côté client, clé dérivée de la passphrase utilisateur via PBKDF2 ou Argon2, IV aléatoire par entrée. Les données ne transitent sur le serveur que sous forme chiffrée.

### 2. Séparation des données et des métadonnées

Même avec du chiffrement côté client, les métadonnées (timestamp, durée de session, fréquence) restent en clair côté serveur. Ces métadonnées doivent être traitées comme des données sensibles à part entière — ou minimisées au strict nécessaire.

La règle : ne collecter que ce qui est absolument nécessaire au fonctionnement. Si une fonctionnalité n'a pas besoin de la localisation précise, ne pas la collecter.

### 3. K-anonymité stricte sur les agrégations

Si la plateforme agrège des données pour produire des insights collectifs, appliquer une contrainte k-anonymité sur tout résultat exposé : chaque agrégat doit correspondre à au moins 100 individus distincts. Cette contrainte doit être dans le schéma de données lui-même — pas dans la logique applicative où elle peut être contournée par erreur.

### 4. Aucune géolocalisation précise

La localisation GPS est l'un des quasi-identifiers les plus discriminants. Pour des données de journal intime ou de santé mentale, ne jamais collecter Lat/Long. Collecter uniquement le nom que l'utilisateur donne lui-même à son lieu, en texte libre — et chiffré.

### 5. Droit à l'effacement réel

Quand un utilisateur supprime ses données, elles doivent être supprimées — pas "anonymisées" et conservées. Les backups doivent être chiffrés avec la clé de l'utilisateur, de sorte qu'ils deviennent inaccessibles après effacement. Un effacement réel signifie : aucune copie récupérable, nulle part.

---

## 6. Pièges fréquents

**Confondre "chiffrement en transit" et "chiffrement end-to-end".** Le chiffrement HTTPS protège les données pendant le transport — pas sur le serveur. Si le serveur stocke les données en clair, HTTPS ne protège pas contre une fuite ou un accès non autorisé côté serveur.

**Croire que la politique de confidentialité protège.** Elle distribue la responsabilité légale. Elle ne crée pas de protection technique. Elle peut être modifiée unilatéralement. Elle ne protège pas contre les fuites, les mandats judiciaires, les rachats.

**Collecter "pour l'avenir" ce dont on n'a pas besoin maintenant.** La tentation de stocker toutes les données disponibles "au cas où" est compréhensible mais dangereuse. Chaque donnée collectée est un risque latent. La règle : ne collecter que ce qui est nécessaire aujourd'hui.

**Traiter les métadonnées comme non-sensibles.** L'heure à laquelle quelqu'un utilise une application de bien-être la nuit, la fréquence de ses sessions, les patterns d'absence — tout cela est potentiellement aussi révélateur que le contenu lui-même.

---

## 7. Questions fréquentes

**Est-ce que le RGPD n'est pas suffisant ?**
Le RGPD est une réglementation légale qui établit des droits et des obligations. Il ne crée pas de protection technique. Il peut imposer des amendes après une fuite — il ne prévient pas la fuite. La privacy par architecture est la couche technique qui, elle, prévient.

**Le chiffrement côté client est-il compatible avec les fonctionnalités d'IA ou d'analyse ?**
C'est là que la tension technique est réelle. Si les données sont chiffrées côté client, le serveur ne peut pas les analyser directement. Les approches possibles : traitement éphémère (les données sont déchiffrées en mémoire vive côté serveur pendant le traitement, puis effacées), ou opt-in explicite de l'utilisateur pour une entrée spécifique. Le compromis doit être explicite et choisi par l'utilisateur.

**Est-ce réservé aux grandes entreprises avec des équipes techniques importantes ?**
Non. Le chiffrement AES-GCM côté client est disponible via des bibliothèques standard dans tous les langages. La k-anonymité s'implémente avec une contrainte SQL. La suppression réelle des backups est une règle de gouvernance, pas un défi technique. Ces choix sont accessibles à des équipes de taille modeste — si la priorité est là dès le début.

**Pourquoi cela devient-il un "acte de soin" et pas seulement de la technique ?**
Parce que les personnes qui partagent leurs données les plus intimes — journal, états émotionnels, expériences difficiles — le font sur la base d'une confiance implicite. Trahir cette confiance par inadvertance technique est une forme de négligence de soin. Et à l'inverse, concevoir un système qui ne peut structurellement pas trahir cette confiance est un acte de soin positif — indépendamment de tout cadre légal.

---

## 8. Pour aller plus loin

1. **Latanya Sweeney — "k-anonymity: A Model for Protecting Privacy" (2002)** : l'article original, 15 pages, avec la démonstration complète. Lecture obligatoire pour tout ingénieur travaillant sur des données sensibles.

2. **Cynthia Dwork & Aaron Roth — "The Algorithmic Foundations of Differential Privacy" (2014)** : le texte de référence. Lire les chapitres 1-3 pour les bases. Dense mais accessible pour des développeurs.

3. **Daniel Solove — *Nothing to Hide: The False Trade-off Between Privacy and Security* (2011)** : panorama philosophique et juridique. Utile pour articuler pourquoi "je n'ai rien à cacher" est un argument intenable.

4. **Bruce Schneier — *Data and Goliath* (2015)** : panorama des risques de la collecte de données à grande échelle. Contexte indispensable pour comprendre pourquoi les politiques seules ne suffisent pas.

5. **Helen Nissenbaum — *Privacy in Context* (2010)** : cadre conceptuel de la "contextual integrity" — la privacy comme respect des normes de flux informationnels propres à chaque contexte social. Application directe aux données de bien-être.

### Articles INFUSE liés

**Cet article traite de la protection des données individuelles** — journal intime, santé mentale, chiffrement côté client, architectures zero-knowledge. Pour la privacy dans les communautés et agrégats collectifs (k-anonymity, differential privacy, plateformes de partage), voir l'article complémentaire :

- [La vie privée comme architecture du soin — k-anonymity et éthique numérique du collectif](/5-collectif/vie-privee-architecture-soin)

---
