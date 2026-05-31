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

  // shot 3: onboarding gate (simulated states)
  await win.webContents.executeJavaScript(`
    document.getElementById('onboarding').style.display = 'flex';
    function S(id,st,val){var e=document.getElementById('step-'+id);e.classList.add(st);
      e.querySelector('.onb-ic').textContent= st==='ok'?'✓':'✕';
      document.getElementById('val-'+id).textContent=val;}
    S('node','ok','v20.11.0');
    S('claude','ok','2.0.1 (Claude Code)');
    S('auth','fail','pas connecté');
    document.getElementById('onb-actions').innerHTML =
      '<button class="btn-primary">Se connecter à Claude</button>' +
      '<button class="btn-muted">J\\'ai terminé — Réessayer</button>' +
      '<p class="onb-sub">Une fenêtre terminal s\\'ouvre. Connecte-toi (Pro/Max), puis reviens et clique « Réessayer ».</p>';
  `)
  await new Promise(r => setTimeout(r, 800))
  fs.writeFileSync(path.join(OUT, 'app-onboarding.png'), (await win.webContents.capturePage()).toPNG())
  console.log('✓ app-onboarding.png')

  app.quit()
})
