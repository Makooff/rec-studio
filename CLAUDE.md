# Rec. — Nova Studio

## Contexte agence
Nova = agence production vidéo publicitaire + Ads + Agents IA, Bruxelles.
Clients : entreprises belges et françaises.
Services : spots pub, campagnes Meta/Google Ads, agents IA, création sites web, SEO local.

## Règle fondamentale — Skills always-on

**AVANT chaque réponse**, identifier la catégorie de tâche et invoquer le skill approprié. Pas de mot-clé requis — analyser l'INTENTION.

| Catégorie | Skills | Exemples d'intention |
|---|---|---|
| Vidéo / spot / pub | `Skill(video-generation)` `Skill(ads-production)` | spot pub, tournage, montage, reels, story, pika, hyperframes |
| Campagne Ads | `Skill(meta-ads)` | Meta Ads, Google Ads, campagne, budget, ciblage, annonce |
| Agents IA / automatisation | `Skill(ai-agents)` | agent, automatisation, workflow, mémoire, prompt |
| Site web | `Skill(web-creation)` | site, landing, Next.js, Webflow, WordPress, deploy |
| SEO / référencement | `Skill(seo-local)` | SEO, référencement, Google, local, position, Bruxelles |
| UI / design / visuel | `Skill(impeccable)` `Skill(taste-skill)` | design, UI, composant, animation, layout, couleur |
| Revue / qualité | `Skill(code-review)` | relire, refactorer, optimiser |
| Tests | `Skill(tdd-workflow)` | tests, coverage, spec, E2E |
| Debug / fix | `Skill(systematic-debugging)` | bug, crash, erreur, ne fonctionne pas |
| Sécurité | `Skill(security)` | auth, token, clé, permission |
| Plan / architecture | `Skill(writing-plans)` `Skill(executing-plans)` | nouvelle feature, comment implémenter |
| Vérification | `Skill(verify)` | vérifier, QA, CI, deploy |

Si le hook `⚡ SKILLS REQUIS` précise des skills : invoquer IMMÉDIATEMENT.

## Self-learning
Les learnings accumulés sont injectés automatiquement. Les appliquer sans question.

## Output
- Réponses courtes. Pas de prose. Pas de résumé sauf demandé.
- Zéro commentaire code sauf WHY non-obvious.

## Vidéo / Ads
- `Pika` → génération vidéo IA (spots, reels, stories). API key: `$PIKA_API_KEY`
- `Hyperframes` → motion design HTML→vidéo. CLI: `npx hyperframes render`
- Formats : 16:9 YouTube, 9:16 Reels/Stories, 1:1 Feed
- Plateformes : Meta Ads, Google Ads, YouTube

## MCPs
- `magic` → composants UI 21st.dev
- `playwright` → browser/E2E
- `context7` → docs live

## Design — interdictions absolues
- NO `transition-all` / `background-clip:text` / Inter font / glassmorphism
- Easing : `cubic-bezier(0.16,1,0.3,1)`. Press : `scale(0.97)`.
- Palette Nova : `#0f0f0f` bg, `#FF3B3B` accent, `#f5f5f5` text, Sora font.

## Commits
`feat|fix|refactor: desc` — Pas de Co-Authored-By.
