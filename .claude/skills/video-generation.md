---
name: video-generation
description: Génération vidéo pub/ads avec Pika API et motion design HTML avec Hyperframes CLI
---

# Video Generation Skill

## Outils disponibles

### Pika — Ads / vidéo IA
API REST. Requiert `PIKA_API_KEY` dans `.env.local`.

**Générer une vidéo:**
```bash
curl -X POST https://api.pika.art/v1/generate \
  -H "Authorization: Bearer $PIKA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "[DESCRIPTION]",
    "duration": 5,
    "ratio": "16:9",
    "motion": "medium"
  }'
```

**Récupérer le résultat** (polling sur `id` retourné):
```bash
curl https://api.pika.art/v1/videos/[ID] \
  -H "Authorization: Bearer $PIKA_API_KEY"
```

**Paramètres utiles:**
- `duration`: 3-10 secondes
- `ratio`: `16:9` | `9:16` | `1:1`
- `motion`: `low` | `medium` | `high`
- `style`: `cinematic` | `animation` | `3d`

---

### Hyperframes — Motion design HTML→vidéo
CLI local. Requiert Node.js. Installe : `npm install -g hyperframes`

**Workflow:**
1. Créer une composition HTML (`composition.html`)
2. Preview live : `hyperframes preview composition.html`
3. Render en vidéo : `hyperframes render composition.html --output out.mp4`

**Template composition de base:**
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; width: 1920px; height: 1080px; background: #09090b; font-family: system-ui; }
    .scene { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
  </style>
</head>
<body>
  <div class="scene" data-duration="3000">
    <!-- Contenu de la scène -->
  </div>
</body>
</html>
```

**Attributs de timeline:**
- `data-duration="3000"` — durée scène en ms
- `data-enter="fade"` / `data-exit="slide"` — transitions
- `data-delay="500"` — délai d'entrée

**Options render:**
```bash
hyperframes render composition.html \
  --output out.mp4 \
  --width 1920 \
  --height 1080 \
  --fps 60
```

---

## Quand utiliser quoi

| Besoin | Outil |
|---|---|
| Pub produit, teaser, ad IA | Pika |
| Intro animée, titre, motion logo | Hyperframes |
| Explainer animé avec texte/code | Hyperframes |
| Vidéo depuis image/texte pur | Pika |
| Séquence HTML pixel-perfect | Hyperframes |

## Workflow pub complète

1. **Concept** → décrire le visuel en une phrase
2. **Variantes** → générer 2-3 prompts Pika différents
3. **Polish** → Hyperframes pour intro/outro/lower-thirds
4. **Export** → `.mp4` 1080p minimum

## Règles qualité

- Prompts Pika : décrire caméra + sujet + ambiance (`close-up shot of [X], cinematic, dark moody`)
- Hyperframes : respecter design system SuperClaude (`#09090b` bg, `#7c3aed` accent, Outfit font)
- Toujours exporter en 60fps pour motion design
