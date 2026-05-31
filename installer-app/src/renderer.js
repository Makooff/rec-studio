// ============================================================
//  Rec. Studio — renderer.js
// ============================================================

/* global api */
// `api` injected by preload.js via contextBridge

// --- State ---
let currentScreen = 1
let pikaKey = ''
let magicKey = ''
let obsidianKey = ''
let openAfterInstall = true
let checksOk = false

// --- DOM helpers ---
const $ = (id) => document.getElementById(id)

// ============================================================
//  Screen transitions
// ============================================================
function goTo(screenNum) {
  const current = $(`screen-${currentScreen}`)
  const next = $(`screen-${screenNum}`)

  current.classList.add('exit-left')
  current.classList.remove('active')

  setTimeout(() => { current.classList.remove('exit-left') }, 350)
  setTimeout(() => {
    next.classList.add('active')
    currentScreen = screenNum
  }, 50)
}

// ============================================================
//  Title bar
// ============================================================
$('btn-close').addEventListener('click', () => api.close())
$('btn-minimize').addEventListener('click', () => api.minimize())

// ============================================================
//  Screen 1 — Welcome
// ============================================================
$('btn-start').addEventListener('click', () => {
  goTo(2)
  runChecks()
})

// ============================================================
//  Screen 2 — Prerequisites
// ============================================================
const CHECKS = [
  {
    id: 'node',
    name: 'Node.js',
    cmd: 'node --version',
    parse: (out) => {
      if (!out) return { ok: false, detail: 'non détecté' }
      const match = out.match(/v(\d+)/)
      if (!match) return { ok: false, detail: 'version inconnue' }
      const major = parseInt(match[1])
      return major >= 18
        ? { ok: true, detail: out.trim() }
        : { ok: false, detail: `v${major} — Node.js 18+ requis` }
    },
    linkId: 'link-node'
  },
  {
    id: 'claude',
    name: 'Claude Code',
    cmd: 'claude --version',
    parse: (out, err) => {
      const combined = out || err || ''
      if (combined.includes('claude') || combined.match(/\d+\.\d+/)) {
        return { ok: true, detail: combined.split('\n')[0] || 'détecté' }
      }
      return { ok: false, detail: 'non détecté' }
    },
    linkId: 'link-claude'
  },
  {
    id: 'gh',
    name: 'GitHub CLI (gh)',
    cmd: 'gh --version',
    parse: (out) => {
      if (!out) return { ok: false, detail: 'non détecté — sera installé' }
      return { ok: true, detail: out.split('\n')[0] }
    },
    linkId: null,
    optional: true
  }
]

async function runChecks() {
  const list = $('checks-list')
  list.innerHTML = ''
  let allOk = true

  for (const check of CHECKS) {
    const item = document.createElement('div')
    item.className = 'check-item'
    item.id = `check-item-${check.id}`
    item.innerHTML = `
      <div class="check-status pending" id="check-status-${check.id}">
        <div class="spinner"></div>
      </div>
      <div class="check-info">
        <div class="check-name">${check.name}</div>
        <div class="check-detail" id="check-detail-${check.id}">Vérification...</div>
      </div>
    `
    list.appendChild(item)

    await new Promise(r => setTimeout(r, 300))
    const result = await api.runCommand(check.cmd)
    const parsed = check.parse(result.stdout, result.stderr)

    const statusEl = $(`check-status-${check.id}`)
    const detailEl = $(`check-detail-${check.id}`)
    const itemEl   = $(`check-item-${check.id}`)

    if (parsed.ok) {
      statusEl.innerHTML = '✓'
      statusEl.className = 'check-status success'
      itemEl.classList.add('success')
      detailEl.textContent = parsed.detail
    } else {
      statusEl.innerHTML = check.optional ? '~' : '✗'
      statusEl.className = `check-status ${check.optional ? 'warning' : 'error'}`
      itemEl.classList.add(check.optional ? 'warning' : 'error')
      detailEl.textContent = parsed.detail
      if (!check.optional) allOk = false
      if (check.linkId) {
        const linkEl = $(check.linkId)
        if (linkEl) linkEl.style.display = 'flex'
      }
    }
  }

  checksOk = allOk

  if (allOk) {
    await new Promise(r => setTimeout(r, 800))
    goTo(3)
  } else {
    $('prereq-links').classList.add('visible')
    $('prereq-actions').style.display = 'flex'
  }
}

$('btn-retry').addEventListener('click', () => {
  $('prereq-links').classList.remove('visible')
  $('prereq-actions').style.display = 'none'
  $('link-node').style.display = 'none'
  $('link-claude').style.display = 'none'
  runChecks()
})

$('btn-skip-prereq').addEventListener('click', () => goTo(3))

// ============================================================
//  Screen 3 — Configuration
// ============================================================
$('btn-install').addEventListener('click', () => {
  pikaKey = $('input-pika-key').value.trim()
  magicKey = $('input-magic-key').value.trim()
  obsidianKey = $('input-obsidian-key').value.trim()
  openAfterInstall = $('check-open-claude').checked
  goTo(4)
  runInstallation()
})

$('btn-skip-config').addEventListener('click', () => {
  pikaKey = ''
  magicKey = ''
  obsidianKey = ''
  openAfterInstall = false
  goTo(4)
  runInstallation()
})

$('checkbox-group').addEventListener('click', (e) => {
  if (e.target.tagName !== 'INPUT') {
    const cb = $('check-open-claude')
    cb.checked = !cb.checked
  }
})

// ============================================================
//  Screen 4 — Installation
// ============================================================
function logLine(text, type = 'success') {
  const logArea = $('log-area')
  const line = document.createElement('span')
  line.className = `log-line ${type}`
  line.textContent = text
  logArea.appendChild(line)
  logArea.appendChild(document.createElement('br'))
  logArea.scrollTop = logArea.scrollHeight
}

function setProgress(percent, label) {
  $('progress-bar').style.width = percent + '%'
  $('step-percent').textContent = percent + '%'
  $('step-label').textContent = label
}

function buildSteps() {
  const officialPlugins = [
    'superpowers', 'code-review', 'github', 'vercel', 'supabase',
    'stripe', 'claude-mem', 'caveman', 'claude-md-management',
    'context7', 'skill-creator', 'playwright'
  ]

  const wshobsonPlugins = [
    'comprehensive-review', 'debugging-toolkit', 'unit-testing',
    'security-scanning', 'full-stack-orchestration', 'frontend-mobile-development',
    'ui-design', 'cicd-automation', 'agent-orchestration', 'application-performance'
  ]

  const steps = [
    { label: 'Vérification de l\'environnement', fake: 800, cmd: null },
    { label: 'Ajout marketplace caveman', cmd: 'claude plugin marketplace add JuliusBrussee/caveman' },
    { label: 'Ajout marketplace wshobson/agents', cmd: 'claude plugin marketplace add wshobson/agents' }
  ]

  for (const p of officialPlugins) {
    steps.push({ label: `Installation plugin ${p}`, cmd: `claude plugin install ${p}` })
  }

  for (const p of wshobsonPlugins) {
    steps.push({ label: `Installation agent-pack ${p}`, cmd: `claude plugin install ${p}@agents` })
  }

  steps.push(
    { label: 'Configuration MCP context7', cmd: 'claude mcp add context7 --scope user -- npx -y @upstash/context7-mcp' },
    { label: 'Configuration MCP playwright', cmd: 'claude mcp add playwright --scope user -- npx @playwright/mcp@latest' },
    { label: 'Installation Hyperframes (motion design)', cmd: 'npm install -g hyperframes' },
    {
      label: 'Installation GitHub CLI (gh)',
      cmd: process.platform === 'win32'
        ? 'winget install --id GitHub.cli -e --source winget'
        : 'brew install gh'
    }
  )

  if (pikaKey) {
    steps.push({ label: 'Configuration Pika API key', fake: 400, cmd: null })
  }

  if (magicKey) {
    steps.push({
      label: 'Configuration MCP magic',
      cmd: `claude mcp add magic --scope user --env API_KEY="${magicKey}" -- npx -y @21st-dev/magic@latest`
    })
  }

  steps.push(
    { label: 'Vérification plugins installés', cmd: 'claude plugin list' },
    { label: 'Vérification MCPs configurés', cmd: 'claude mcp list' },
    { label: 'Finalisation...', fake: 600, cmd: null }
  )

  return steps
}

async function runInstallation() {
  const steps = buildSteps()
  const total = steps.length
  let installErrors = 0

  logLine('› Rec. — configuration Nova en cours', 'info')

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i]
    const percent = Math.round((i / total) * 100)

    setProgress(percent, step.label)
    logLine('')
    logLine(`[${i + 1}/${total}] ${step.label}`, 'info')

    if (step.fake) {
      logLine('  ✓ OK', 'success')
      await sleep(step.fake)
    } else if (step.cmd) {
      logLine(`  $ ${step.cmd}`, 'info')
      const result = await api.runCommand(step.cmd)

      if (result.stdout) {
        result.stdout.split('\n').forEach(line => {
          if (line.trim()) logLine(`  ${line}`, 'success')
        })
      }
      if (result.stderr) {
        result.stderr.split('\n').forEach(line => {
          if (line.trim()) {
            logLine(`  ${line}`, result.success === false ? 'error' : 'warning')
          }
        })
      }

      if (result.success) {
        logLine('  ✓ Terminé', 'success')
      } else {
        logLine(`  ✗ Erreur: ${result.error || 'commande échouée'}`, step.optional ? 'warning' : 'error')
        if (!step.optional) installErrors++
      }

      await sleep(200)
    }
  }

  setProgress(100, 'Installation terminée !')
  await sleep(500)

  if (installErrors > 0) {
    logLine('')
    logLine(`Installation terminée avec ${installErrors} erreur(s).`, 'warning')
    logLine('Vérifiez les logs ci-dessus.', 'warning')
  } else {
    logLine('')
    logLine('✓ Rec. Studio configuré avec succès !', 'success')
  }

  await sleep(800)
  goTo(5)
}

// ============================================================
//  Screen 5 — Project picker
// ============================================================
let selectedProject = ''

$('btn-pick-folder').addEventListener('click', async () => {
  const dir = await api.pickFolder()
  if (!dir) return
  selectedProject = dir
  $('project-path').textContent = dir
  $('project-path').style.display = 'block'
  $('btn-setup-project').style.display = 'inline-flex'
})

$('btn-setup-project').addEventListener('click', async () => {
  if (!selectedProject) return
  $('btn-setup-project').disabled = true
  const projLog = $('project-log')
  projLog.textContent = 'Copie de la configuration Nova...'
  const res = await api.setupProject(selectedProject)
  if (res.success) {
    projLog.textContent = '✓ Configuration copiée — agent ultra activé. Ouverture de Claude Code...'
    await api.openClaude(selectedProject)
    await sleep(600)
    goTo(6)
    triggerCheckmarkAnimation()
  } else {
    projLog.textContent = '✗ Erreur: ' + (res.error || 'copie échouée')
    $('btn-setup-project').disabled = false
  }
})

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

// ============================================================
//  Screen 6 — Done
// ============================================================
function triggerCheckmarkAnimation() {
  const circle = document.querySelector('.checkmark-circle')
  const path = document.querySelector('.checkmark-path')
  if (circle && path) {
    circle.style.animation = 'none'
    path.style.animation = 'none'
    void circle.offsetWidth
    circle.style.animation = ''
    path.style.animation = ''
  }
}

$('btn-open-claude').addEventListener('click', async () => {
  await api.openClaude()
  setTimeout(() => api.close(), 500)
})

$('btn-close-done').addEventListener('click', () => api.close())
