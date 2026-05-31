const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron')
const path = require('path')
const fs = require('fs')
const os = require('os')

let win
let sdk = null // lazy-loaded ESM SDK

async function loadSDK() {
  if (sdk) return sdk
  sdk = await import('@anthropic-ai/claude-agent-sdk')
  return sdk
}

function createWindow() {
  win = new BrowserWindow({
    width: 1180,
    height: 760,
    minWidth: 860,
    minHeight: 560,
    backgroundColor: '#0f0f0f',
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })
  win.loadFile(path.join(__dirname, 'src', 'index.html'))
}

app.whenReady().then(createWindow)
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() })
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow() })

// ---- window controls ----
ipcMain.on('win-minimize', () => win?.minimize())
ipcMain.on('win-close', () => win?.close())

// ---- recent projects store ----
const storePath = path.join(app.getPath('userData'), 'rec-projects.json')
function readStore() {
  try { return JSON.parse(fs.readFileSync(storePath, 'utf8')) } catch { return { projects: [] } }
}
function writeStore(s) { fs.writeFileSync(storePath, JSON.stringify(s, null, 2)) }

ipcMain.handle('list-projects', () => readStore().projects)

ipcMain.handle('pick-folder', async () => {
  const r = await dialog.showOpenDialog(win, { properties: ['openDirectory'] })
  if (r.canceled || !r.filePaths[0]) return null
  const dir = r.filePaths[0]
  const store = readStore()
  if (!store.projects.find(p => p.path === dir)) {
    store.projects.unshift({ path: dir, name: path.basename(dir) })
    writeStore(store)
  }
  return { path: dir, name: path.basename(dir) }
})

// ---- agents (Nova presets + custom from .claude/agents/*.json) ----
const NOVA_AGENTS = [
  { id: 'spot', icon: '🎬', name: 'Spot publicitaire', skill: 'ads-production',
    prompt: 'Tu es directeur créatif Nova. Produis des spots publicitaires : brief, concept, script (hook/problème/solution/CTA), storyboard, specs export. Utilise Pika pour la génération vidéo IA. Réponds en français, concret, orienté conversion.',
    tools: ['Read','Write','Edit','Bash','Glob','Grep'] },
  { id: 'ads', icon: '📈', name: 'Campagne Ads', skill: 'meta-ads',
    prompt: 'Tu es media buyer Nova (Meta + Google Ads). Structure campagnes, audiences, copywriting AIDA, A/B testing, budgets, KPIs. Réponds en français, data-driven.',
    tools: ['Read','Write','Edit','Glob','Grep'] },
  { id: 'site', icon: '🌐', name: 'Site web', skill: 'web-creation',
    prompt: 'Tu es développeur web Nova. Crée des sites (WordPress/Webflow/Next.js selon budget). Architecture, SEO on-page, checklist livraison, déploiement. Réponds en français.',
    tools: ['Read','Write','Edit','Bash','Glob','Grep'] },
  { id: 'seo', icon: '📍', name: 'SEO local', skill: 'seo-local',
    prompt: 'Tu es expert SEO local Nova (Belgique + France). Google Business Profile, mots-clés géo, citations NAP, avis, rapports. Réponds en français.',
    tools: ['Read','Write','Edit','Glob','Grep'] },
]

function agentsDir(projectPath) { return path.join(projectPath, '.claude', 'agents') }

ipcMain.handle('list-agents', (_e, projectPath) => {
  const custom = []
  try {
    const d = agentsDir(projectPath)
    if (fs.existsSync(d)) {
      for (const f of fs.readdirSync(d).filter(f => f.endsWith('.json'))) {
        try { custom.push({ ...JSON.parse(fs.readFileSync(path.join(d, f), 'utf8')), custom: true }) } catch {}
      }
    }
  } catch {}
  return { nova: NOVA_AGENTS, custom }
})

ipcMain.handle('save-agent', (_e, projectPath, agent) => {
  const d = agentsDir(projectPath)
  fs.mkdirSync(d, { recursive: true })
  const id = agent.id || agent.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const data = { id, icon: agent.icon || '🤖', name: agent.name, prompt: agent.prompt, tools: agent.tools || ['Read','Write','Edit','Bash'] }
  fs.writeFileSync(path.join(d, id + '.json'), JSON.stringify(data, null, 2))
  return data
})

ipcMain.handle('delete-agent', (_e, projectPath, id) => {
  try { fs.unlinkSync(path.join(agentsDir(projectPath), id + '.json')) } catch {}
  return true
})

// ---- MCP servers (21st.dev Magic, Context7, Playwright) ----
// Keys read from env or rec-config.json in userData.
function readConfig() {
  try { return JSON.parse(fs.readFileSync(path.join(app.getPath('userData'), 'rec-config.json'), 'utf8')) } catch { return {} }
}
function buildMcpServers() {
  const cfg = readConfig()
  const servers = {}
  const magicKey = process.env.MAGIC_API_KEY || process.env.TWENTYFIRST_API_KEY || cfg.magicKey
  if (magicKey) {
    servers.magic = {
      type: 'stdio',
      command: process.platform === 'win32' ? 'npx.cmd' : 'npx',
      args: ['-y', '@21st-dev/magic@latest'],
      env: { ...process.env, API_KEY: magicKey },
    }
  }
  return servers
}
// 21st.dev Magic tool names — appended to allowedTools so restricted agents keep UI generation
const MAGIC_TOOLS = [
  'mcp__magic__21st_magic_component_builder',
  'mcp__magic__21st_magic_component_inspiration',
  'mcp__magic__21st_magic_component_refiner',
  'mcp__magic__logo_search',
]

ipcMain.handle('get-config', () => {
  const cfg = readConfig()
  return { hasMagic: !!(process.env.MAGIC_API_KEY || process.env.TWENTYFIRST_API_KEY || cfg.magicKey) }
})
ipcMain.handle('save-config', (_e, patch) => {
  const cfg = { ...readConfig(), ...patch }
  fs.writeFileSync(path.join(app.getPath('userData'), 'rec-config.json'), JSON.stringify(cfg, null, 2))
  return { hasMagic: !!cfg.magicKey }
})

// ---- chat: streaming query via Claude Agent SDK ----
const sessions = {} // tabId -> resume session_id

ipcMain.handle('send-message', async (e, payload) => {
  const { tabId, projectPath, prompt, agent } = payload
  let s
  try { s = await loadSDK() } catch (err) {
    e.sender.send('stream', { tabId, type: 'error', text: 'SDK introuvable. Vérifie que Claude Code est installé + connecté. ' + err.message })
    return
  }

  const sysAppend = agent?.prompt
    ? `\n\nRÔLE NOVA: ${agent.prompt}`
    : ''

  const mcpServers = buildMcpServers()
  const options = {
    cwd: projectPath,
    permissionMode: 'bypassPermissions',
    includePartialMessages: true,
    systemPrompt: { type: 'preset', preset: 'claude_code', append: sysAppend },
  }
  if (Object.keys(mcpServers).length) options.mcpServers = mcpServers
  if (agent?.tools) {
    options.allowedTools = mcpServers.magic ? [...agent.tools, ...MAGIC_TOOLS] : agent.tools
  }
  if (sessions[tabId]) options.resume = sessions[tabId]

  try {
    const response = s.query({ prompt, options })
    for await (const msg of response) {
      if (msg.type === 'stream_event') {
        const ev = msg.event
        if (ev?.type === 'content_block_delta' && ev.delta?.text) {
          e.sender.send('stream', { tabId, type: 'token', text: ev.delta.text })
        }
      } else if (msg.type === 'assistant') {
        for (const block of msg.message?.content || []) {
          if (block.type === 'tool_use') {
            e.sender.send('stream', { tabId, type: 'tool', name: block.name, input: block.input })
          }
        }
      } else if (msg.type === 'result') {
        sessions[tabId] = msg.session_id
        e.sender.send('stream', { tabId, type: 'done', cost: msg.total_cost_usd, sessionId: msg.session_id })
      }
    }
  } catch (err) {
    e.sender.send('stream', { tabId, type: 'error', text: err.message })
  }
})

ipcMain.handle('reset-session', (_e, tabId) => { delete sessions[tabId]; return true })
ipcMain.on('open-external', (_e, url) => shell.openExternal(url))
