---
name: ads-production
description: Workflow complet production spot publicitaire Nova — brief → tournage → montage → export
---

# Ads Production — Nova

## Pipeline complet

### 1. Brief client
Questions obligatoires :
- Objectif : notoriété / conversion / trafic ?
- Message clé (1 phrase)
- Cible : âge, zone geo, intérêts
- Plateforme : Meta / YouTube / TikTok / LinkedIn
- Budget et délai
- Références visuelles (si dispo)

### 2. Concept & script
Format recommandé :
```
HOOK (0–3s) : accroche visuelle ou question choc
PROBLÈME (3–7s) : douleur du client cible
SOLUTION (7–15s) : produit / service
PREUVE (15–20s) : chiffre, témoignage, demo
CTA (20–25s) : action claire
```
Pour reels courts (6–15s) : HOOK → SOLUTION → CTA

### 3. Storyboard
Découper en scenes : shot, durée, action, dialogue/VO, son

### 4. Tournage checklist
- [ ] Éclairage : naturel ou 3 points
- [ ] Son : micro-cravate ou boom, pas micro caméra
- [ ] Stabilisation : trépied ou gimbal pour mouvements
- [ ] Formats bruts : 4K 25fps minimum
- [ ] B-roll : 3x plus de contenu que nécessaire
- [ ] Variations : 2–3 versions du CTA final

### 5. Montage
- Logiciel : Premiere Pro / DaVinci Resolve / CapCut (mobile rapide)
- Sous-titres : obligatoires (80% visionnage sans son sur mobile)
- Musique : libre de droits (Epidemic Sound, Artlist)
- Étalonnage : cohérent avec charte visuelle client

### 6. Export formats Nova

| Plateforme | Format | Durée max | Poids max |
|---|---|---|---|
| Meta Feed | 1:1 ou 4:5 | 60s | 4 GB |
| Meta Reels / Stories | 9:16 | 60s | 4 GB |
| YouTube | 16:9 | illimité | — |
| YouTube Shorts | 9:16 | 60s | — |
| LinkedIn | 16:9 | 30min | 5 GB |
| TikTok | 9:16 | 10min | 287 MB |

Résolution min : 1080p. Préférer H.264 pour compatibilité.

### 7. Génération IA avec Pika

```bash
# Générer une vidéo spot
curl -X POST https://api.pika.art/v1/generate \
  -H "Authorization: Bearer $PIKA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "close-up shot of [produit], cinematic lighting, dark background, ultra HD",
    "duration": 5,
    "ratio": "16:9",
    "motion": "medium",
    "style": "cinematic"
  }'
```

Bons prompts Pika pour pubs :
- `"product hero shot, [produit], studio lighting, smooth camera movement, 4K"`
- `"testimonial style, [personne] speaking, natural light, shallow depth of field"`
- `"before after transformation, split screen, professional"`

### 8. Motion design avec Hyperframes

```bash
# Créer intro animée
hyperframes render intro.html --output intro.mp4 --fps 60

# Template intro Nova
# Fond #0f0f0f + texte Sora + accent #FF3B3B
# Animation : fade-in 300ms, slide-up 500ms
```

### 9. Checklist livraison
- [ ] Version 16:9 master
- [ ] Version 9:16 recadrée
- [ ] Version 1:1 si requis
- [ ] Sous-titres SRT inclus
- [ ] Vignette / thumbnail 1280x720
- [ ] Rapport de rendu (codecs, résolution, durée)
