# Rec. App — Chat desktop Claude pour Nova

## Objectif
App Electron avec UI rouge où l'équipe Nova chatte directement avec Claude (sans terminal), en réutilisant l'abonnement Claude Code de chaque membre. Skills + agents Nova intégrés, agents custom créables.

## Auth
Via Claude Agent SDK (`@anthropic-ai/claude-agent-sdk`) qui réutilise l'auth de Claude Code installé (plan Pro/Max). Zéro clé API, zéro coût au token.

## Architecture
```
Electron
├── renderer (UI rouge) : sidebar projets + agents, chat streaming, composer, modal agent
├── preload (contextBridge `api`)
└── main : SDK query() streaming, project store, agent registry (.claude/agents/*.json)
```

## Composants
- **main.js** — fenêtre frameless, IPC : list/pick projet, list/save/delete agents, send-message (stream events → renderer), reset-session.
- **preload.js** — bridge `api` (contextIsolation).
- **renderer.js** — state (project/agent/agents/tabId/streaming), rendu sidebar, chat, markdown léger, gestion stream.
- **styles.css** — design system Rec. (#FF3B3B, #0f0f0f, grain film, Sora fallback Segoe).

## Agents
- 4 presets Nova (Spot/Ads/Site/SEO) → system prompt + skill + allowedTools.
- Custom : créés via modal, persistés `.claude/agents/<id>.json`, partagés via git.

## Flux message
1. renderer `send-message` (tabId, projectPath, prompt, agent)
2. main : `query({ prompt, options:{ cwd, permissionMode:bypassPermissions, includePartialMessages, systemPrompt preset claude_code + append rôle agent, allowedTools, resume } })`
3. stream events → IPC : token (content_block_delta), tool (tool_use), done (session_id+cost), error
4. renderer affiche token par token + chips tool calls.

## Sessions
`resume` par tabId via session_id renvoyé dans le message `result`.

## MCP 21st.dev Magic
Clé Magic (env `MAGIC_API_KEY`/`TWENTYFIRST_API_KEY` ou `rec-config.json` userData) → `options.mcpServers.magic` (npx `@21st-dev/magic`). Tools `mcp__magic__*` ajoutés à `allowedTools` même pour agents restreints. Réglages via modal ⚙ sidebar.

## Design (skills SuperClaude : impeccable + taste)
Font Sora (corps) + Plus Jakarta Sans (titres). Focus-visible accent. `prefers-reduced-motion`. Message user en bulle surface, assistant plein largeur. Espacement aéré (gap 28px, max-width 720px). Max 2 accents, grain film.

## Hors scope v1
- Onglets multiples simultanés (tabId fixé 'main', extensible)
- Build .dmg Mac (config prête)
- Icône .ico HD (SVG fallback en dev)
