const { app, BrowserWindow } = require('electron')
const path = require('path')
const fs = require('fs')
const OUT = path.join(__dirname, '..', 'docs', 'screens')
fs.mkdirSync(OUT, { recursive: true })

app.whenReady().then(async () => {
  const win = new BrowserWindow({ width: 1180, height: 760, show: true, frame: false,
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true } })
  win.showInactive()
  await win.loadFile(path.join(__dirname, 'src', 'index.html'))
  await new Promise(r => setTimeout(r, 1200))

  // shot 1: empty
  fs.writeFileSync(path.join(OUT, 'app-empty.png'), (await win.webContents.capturePage()).toPNG())
  console.log('✓ app-empty.png')

  // shot 2: static markup demo (capture can't reach app internals' scope)
  const demo = fs.readFileSync(path.join(__dirname, 'capture-demo.js'), 'utf8')
  await win.webContents.executeJavaScript(demo)
  await new Promise(r => setTimeout(r, 1200))
  fs.writeFileSync(path.join(OUT, 'app-chat.png'), (await win.webContents.capturePage()).toPNG())
  console.log('✓ app-chat.png')

  app.quit()
})
