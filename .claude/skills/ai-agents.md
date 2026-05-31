---
name: ai-agents
description: Configuration et usage des agents IA Nova — workflows, mémoire, automatisation
---

# Agents IA — Nova

## Agents disponibles

Via SuperClaude (installé par Rec. Studio) :
- **191 agents** wshobson/agents (review, debug, test, sécurité, fullstack, perf...)
- **12 plugins officiels** (code-review, github, vercel, supabase, stripe, claude-mem...)
- **MCPs** : magic (UI), playwright (browser), context7 (docs)

## Mémoire cross-session

`claude-mem` installé automatiquement — mémorise les faits importants entre sessions.

Pour forcer la mémorisation :
```
Mémorise : [fait important]
```

Pour rappeler :
```
Qu'est-ce que tu sais sur [sujet] ?
```

**Obsidian** (si configuré) : inject contexte à chaque message — tâches, décisions, contexte projet.

## Workflows Nova typiques

### Workflow spot publicitaire
```
1. /ads-brief     → générer brief structuré depuis description client
2. /script        → écrire script spot (hook/problème/solution/CTA)
3. Pika           → générer visuels IA
4. Hyperframes    → motion graphics intro/outro
5. /export        → checklist formats (16:9, 9:16, 1:1)
```

### Workflow campagne Ads
```
1. /audience      → définir personas + segments
2. /copy          → générer 5 variantes d'annonce
3. /ab-plan       → structure test A/B
4. /rapport       → template rapport mensuel
```

### Workflow site web client
```
1. /site-brief    → recueillir infos client (secteur, cible, objectif, budget)
2. /archi         → proposition stack + structure pages
3. /copy          → textes SEO optimisés par page
4. /deploy        → checklist mise en ligne
```

## Automatisation workflows répétitifs

Créer des prompts système Nova dans CLAUDE.md pour les tâches récurrentes :
```markdown
## Prompt brief client
"Pour chaque nouveau client Nova, commencer par :
1. Secteur d'activité
2. Cible principale (âge, lieu, intérêts)
3. Objectif campagne
4. Budget mensuel
5. Délai
6. Concurrents principaux"
```

## Agent ultra (bypassPermissions)

Activé par Rec. Studio dans `.claude/settings.json` :
```json
{ "permissions": { "defaultMode": "bypassPermissions" } }
```

Claude agit sans demander confirmation — idéal pour les tâches longues (builds, migrations, génération de contenu en masse).

⚠️ Utiliser sur projets de confiance uniquement. Revenir à `acceptEdits` si besoin.

## Skill routing Nova

Les skills s'invoquent automatiquement sans mot-clé. Exemples :
- "crée un spot pour X" → Skill(video-generation) + Skill(ads-production)
- "lance une campagne Meta pour Y" → Skill(meta-ads)
- "fais-nous un site pour Z" → Skill(web-creation)
- "optimise le référencement de A" → Skill(seo-local)
