# Rec.

**Assistant Claude Code pour l'équipe Nova.**

---

## Installation — 3 étapes

### 1. Télécharger

Télécharge le fichier `Rec. Setup 1.0.0.exe` dans les [releases](https://github.com/makooff/rec-studio/releases).

### 2. Installer

Double-clique sur le fichier `.exe` et suis les étapes :

- **Clé Pika** — pour générer des vidéos IA (spots, reels)
- **Clé Magic** — pour les composants UI
- **Clé Obsidian** — optionnel, si tu utilises Obsidian

### 3. Ouvrir ton projet

Choisis le dossier de ton projet Nova → Claude Code s'ouvre automatiquement avec toute la config.

---

## Ce que ça fait

Une fois installé, Claude Code connaît les services Nova :

| Service | Ce que tu peux demander |
|---|---|
| **Spot publicitaire** | "Crée un spot pour [client]", "Script 30s pour Meta" |
| **Campagnes Ads** | "Lance une campagne Meta pour [client]", "Optimise le CPC" |
| **Agents IA** | "Automatise [tâche]", "Configure un workflow" |
| **Site web** | "Fais un site pour [client]", "Checklist avant livraison" |
| **SEO local** | "Optimise le GBP de [client]", "Mots-clés Bruxelles" |

Pas de commandes à retenir. Décris ce que tu veux, Claude comprend et utilise le bon outil.

---

## Prérequis

- Windows 10/11
- [Claude Code](https://claude.ai/code) installé
- [Node.js 18+](https://nodejs.org)
- Clé API Pika (sur pika.art)

---

## Pour les développeurs — build local

```powershell
# Windows
.\build.ps1

# Mac
bash build.sh
```

Prérequis build : Node.js 18+, npm.
