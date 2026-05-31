const { app, BrowserWindow, ipcMain, shell, dialog } = require('electron')
const { exec } = require('child_process')
const path = require('path')
const fs = require('fs')

// Repo root = one level above installer-app/ (dev) or resources (packaged)
function repoRoot() {
  const dev = path.join(__dirname, '..')
  if (fs.existsSync(path.join(dev, 'CLAUDE.md'))) return dev
  return process.resourcesPath || dev
}

function createWindow() {
  const win = new BrowserWindow({
    width: 540,
    height: 680,
    frame: false,
    resizable: false,
    center: true,
    backgroundColor: '#0a0a0f',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })
  win.loadFile('src/index.html')
}

app.whenReady().then(createWindow)
app.on('window-all-closed', () => app.quit())

ipcMain.handle('run-command', async (event, command) => {
  return new Promise((resolve) => {
    exec(command, { timeout: 120000 }, (error, stdout, stderr) => {
      resolve({
        success: !error,
        stdout: stdout?.trim(),
        stderr: stderr?.trim(),
        error: error?.message
      })
    })
  })
})

ipcMain.handle('open-claude', async (event, cwd) => {
  const opts = cwd ? { cwd } : {}
  const platform = process.platform
  if (platform === 'win32') {
    exec('start cmd /k claude', opts, () => {})
  } else if (platform === 'darwin') {
    // open Terminal in the project dir and run claude
    if (cwd) {
      exec(`osascript -e 'tell app "Terminal" to do script "cd \\"${cwd}\\" && claude"'`, () => {})
    } else {
      exec('open -a "Claude"', (err) => { if (err) exec('claude', () => {}) })
    }
  } else {
    exec('claude', opts, () => {})
  }
})

ipcMain.handle('pick-folder', async () => {
  const res = await dialog.showOpenDialog({
    properties: ['openDirectory', 'createDirectory'],
    title: 'Choisir le dossier projet'
  })
  if (res.canceled || !res.filePaths.length) return null
  return res.filePaths[0]
})

function copyRecursive(src, dest) {
  const stat = fs.statSync(src)
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true })
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry))
    }
  } else {
    fs.copyFileSync(src, dest)
  }
}

ipcMain.handle('setup-project', async (event, projectDir) => {
  try {
    const root = repoRoot()
    fs.mkdirSync(projectDir, { recursive: true })

    // Copy .claude/, CLAUDE.md, .mcp.json
    for (const item of ['.claude', 'CLAUDE.md', '.mcp.json']) {
      const src = path.join(root, item)
      if (fs.existsSync(src)) copyRecursive(src, path.join(projectDir, item))
    }

    // .env.example -> .env.local if absent
    const srcEnv = path.join(root, '.env.example')
    const destEnv = path.join(projectDir, '.env.local')
    if (fs.existsSync(srcEnv) && !fs.existsSync(destEnv)) {
      fs.copyFileSync(srcEnv, destEnv)
    }

    // .gitignore += .env.local
    const gi = path.join(projectDir, '.gitignore')
    let giContent = fs.existsSync(gi) ? fs.readFileSync(gi, 'utf8') : ''
    if (!/\.env\.local/.test(giContent)) {
      fs.writeFileSync(gi, giContent + (giContent.endsWith('\n') || !giContent ? '' : '\n') + '.env.local\n')
    }

    // Merge bypassPermissions into project .claude/settings.json
    const settingsPath = path.join(projectDir, '.claude', 'settings.json')
    let settings = {}
    if (fs.existsSync(settingsPath)) {
      try { settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8')) } catch (e) { settings = {} }
    }
    settings.permissions = Object.assign({}, settings.permissions, { defaultMode: 'bypassPermissions' })
    fs.mkdirSync(path.dirname(settingsPath), { recursive: true })
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2))

    return { success: true }
  } catch (e) {
    return { success: false, error: e.message }
  }
})

ipcMain.on('close-app', () => app.quit())
ipcMain.on('minimize-app', (event) => {
  BrowserWindow.fromWebContents(event.sender).minimize()
})
