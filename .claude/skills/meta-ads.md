---
name: meta-ads
description: Structure et gestion campagnes Meta Ads / Google Ads pour clients Nova
---

# Meta & Google Ads — Nova

## Structure campagne Meta Ads

### Architecture recommandée
```
Campagne (objectif)
  └── Ensemble de publicités (audience)
        └── Publicités (créatives A/B)
```

**Objectifs selon besoin :**
- Notoriété → Couverture maximale
- Trafic → Clics vers site
- Leads → Formulaire instantané
- Conversions → Achat / RDV / Appel
- Vidéo → Vues (ThruPlay 15s)

### Audiences

**Audiences froides (prospection) :**
- Intérêts : cibler 3–5 intérêts liés au secteur client
- Lookalike : 1–3% sur liste clients / visiteurs site
- Zone géo : Belgique + nord France (ou préciser ville)

**Audiences chaudes (retargeting) :**
- Visiteurs site 30 jours
- Engagés page/profil 60 jours
- Vidéo vue 25–50%

### Budget & enchères
- Test : 5–10€/jour minimum par ensemble pub
- Scale : doublement progressif (+20% max tous les 3 jours)
- Enchère : Coût le plus bas (laisser l'algo optimiser)
- Fréquence cible : 2–4 sur 7 jours (retargeting 5–8)

### Copywriting annonces

**Structure AIDA :**
```
Attention : hook choc (question, stat, emoji)
Intérêt : douleur ou désir spécifique
Désir : bénéfice concret, pas feature
Action : CTA clair et unique
```

**Exemples hooks qui convertissent :**
- "Pourquoi votre pub Facebook ne convertit pas ?"
- "🎯 [Résultat] en [Durée] — sans [Obstacle commun]"
- "Vous perdez des clients à cause de ça :"

### A/B testing framework
- Variable 1 : visual (vidéo vs image vs carousel)
- Variable 2 : hook / headline
- Variable 3 : CTA (Acheter / En savoir plus / Réserver)
- Durée min test : 7 jours, min 50 conversions par variante

---

## Google Ads

### Structure campagne Search
```
Campagne (budget / zone / appareil)
  └── Groupe d'annonces (thème / intention)
        └── Annonces RSA (15 titres, 4 descriptions)
              └── Mots-clés (exact, expression, large modifié)
```

**Types de correspondance :**
- [Exact] → intention précise, coût élevé, volume faible
- "Expression" → équilibre volume / pertinence
- Large modifié → volume max, surveiller les termes de recherche

### Mots-clés négatifs systématiques
Ajouter dès le début : `gratuit`, `emploi`, `formation`, `tutoriel`, `DIY`, `comment faire`

### Extensions obligatoires
- Sitelinks (4 min)
- Accroche (callout)
- Numéro de téléphone
- Lieu (si pertinent)

### KPIs à tracker

| KPI | Objectif |
|---|---|
| CTR Search | > 5% |
| CTR Display | > 0.35% |
| Quality Score | > 7/10 |
| CPC cible | selon secteur |
| ROAS (e-commerce) | > 3x |
| CPL (lead gen) | < budget unitaire service |

### Rapport mensuel type
- Résumé 3 métriques clés (impressions, clics, conversions)
- Évolution vs mois précédent
- Top 3 annonces / top 3 mots-clés
- Recommandations mois suivant
