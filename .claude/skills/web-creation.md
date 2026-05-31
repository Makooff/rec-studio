---
name: web-creation
description: Création de sites web clients Nova — brief, stack, développement, déploiement
---

# Création Site Web — Nova

## Brief client (questions obligatoires)

1. Secteur / activité
2. Objectif principal du site (vitrine / e-commerce / lead gen / réservation)
3. Cible (âge, zone, habitudes)
4. Budget (définit la stack)
5. Délai
6. Sites de référence (3 exemples qu'ils aiment)
7. Contenu existant (logo, textes, photos) ou à produire ?
8. Langue(s) : FR / NL / EN

## Stack selon budget

| Budget | Stack recommandée | Délai |
|---|---|---|
| < 1 500€ | WordPress + Kadence / Elementor | 2–3 semaines |
| 1 500–5 000€ | Webflow | 3–5 semaines |
| > 5 000€ | Next.js + Tailwind + Vercel | 4–8 semaines |
| E-commerce < 3k | WooCommerce ou Shopify Starter | 3–4 semaines |
| E-commerce > 3k | Shopify Custom ou Next.js + Stripe | 5–10 semaines |

## Architecture pages type (vitrine)

```
/ Home
  ↳ Hero (valeur proposition + CTA)
  ↳ Services / Offres
  ↳ Réalisations / Portfolio
  ↳ Témoignages
  ↳ À propos
  ↳ CTA final + Contact

/services (ou pages par service)
/realisations
/a-propos
/contact
/blog (si SEO prioritaire)
```

## Checklist développement

### Avant livraison
- [ ] Responsive mobile (tester 375px, 768px, 1440px)
- [ ] Vitesse : PageSpeed > 85 mobile, > 90 desktop
- [ ] Images optimisées (WebP, lazy load)
- [ ] Formulaire de contact testé
- [ ] Google Analytics / Tag Manager installé
- [ ] Google Search Console configurée
- [ ] Sitemap.xml généré
- [ ] robots.txt configuré
- [ ] SSL activé (HTTPS)
- [ ] Mentions légales + Politique de confidentialité
- [ ] Cookie banner RGPD (si tracking)
- [ ] Favicon + og:image (1200×630)

### SEO on-page (chaque page)
- [ ] Title tag unique (50–60 chars)
- [ ] Meta description (150–160 chars)
- [ ] H1 unique contenant le mot-clé principal
- [ ] Structure Hn logique (H2, H3...)
- [ ] Alt text images
- [ ] URL slug propre (sans accents, tirets)
- [ ] Internal links

## Déploiement

**Vercel (Next.js) :**
```bash
vercel --prod
# ou via GitHub Actions (auto sur push main)
```

**Netlify (Webflow / static) :**
- Export depuis Webflow → upload ZIP

**WordPress :**
- Hébergeur recommandé : WP Engine, Kinsta, o2switch (FR/BE)
- Backup quotidien via UpdraftPlus

## Livraison client

```
✓ URL site en production
✓ Accès admin (WordPress) ou projet (Webflow)
✓ Guide rapide (2 pages max — comment modifier textes/images)
✓ Google Analytics accès partagé
✓ Rapport performances initial (PageSpeed + Search Console)
```
