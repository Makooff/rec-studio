const { app, BrowserWindow } = require('electron')
const path = require('path')
const fs = require('fs')

const OUT = path.join(__dirname, '..', 'docs', 'screens')
fs.mkdirSync(OUT, { recursive: true })

const W = 540, H = 680

// each: [screenId, filename, optional setup JS run before capture]
const shots = [
  ['screen-1', 'welcome'],
  ['screen-2', 'prereq', `
    const list = document.getElementById('checks-list');
    list.innerHTML = '';
    const items = [
      ['Node.js', '20.11.0', true],
      ['Claude Code', 'installé', true],
      ['Git', '2.43.0', true],
    ];
    for (const [name, val, ok] of items) {
      const el = document.createElement('div');
      el.className = 'check-item';
      el.innerHTML = '<div class="check-icon ok">✓</div><div class="check-info"><div class="check-name">'+name+'</div><div class="check-value">'+val+'</div></div>';
      list.appendChild(el);
    }
  `],
  ['screen-3', 'config'],
  ['screen-4', 'install', `
    document.getElementById('step-label').textContent = 'Installation des plugins Nova...';
    document.getElementById('step-percent').textContent = '64%';
    document.getElementById('progress-bar').style.width = '64%';
    const log = document.getElementById('log-area');
    log.innerHTML = [
      '<span class="log-line info">› Rec. — configuration Nova en cours</span>',
      '<span class="log-line success">✓ wshobson/agents — 191 agents installés</span>',
      '<span class="log-line success">✓ claude-mem — mémoire activée</span>',
      '<span class="log-line success">✓ skills Nova (ads, meta, seo, web) copiés</span>',
      '<span class="log-line info">› installation Pika + Hyperframes...</span>',
    ].join('');
  `],
  ['screen-5', 'project', `
    document.getElementById('project-path').style.display = 'block';
    document.getElementById('project-path').textContent = 'C:/Nova/spot-client-2026';
    document.getElementById('btn-setup-project').style.display = 'inline-flex';
  `],
  ['screen-6', 'done'],
]

function showScreen(win, id, setup) {
  return win.webContents.executeJavaScript(`
    (function(){
      document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
      document.getElementById('${id}').classList.add('active');
      ${setup || ''}
      return true;
    })();
  `)
}

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    width: W, height: H,
    show: false,
    webPreferences: { offscreen: false },
  })
  await win.loadFile(path.join(__dirname, 'src', 'index.html'))
  await new Promise(r => setTimeout(r, 1500)) // fonts + grain

  // kill all transitions/animations so screens don't overlap mid-fade
  await win.webContents.insertCSS(`
    *, *::before, *::after { transition: none !important; animation: none !important; }
    .screen:not(.active) { display: none !important; }
    .log-line { display: block !important; }
    .checkmark-circle, .checkmark-path {
      stroke-dashoffset: 0 !important; opacity: 1 !important;
    }
    .checkmark-wrap { opacity: 1 !important; transform: none !important; }
  `)

  for (const [id, name, setup] of shots) {
    await showScreen(win, id, setup)
    await new Promise(r => setTimeout(r, 700))
    const img = await win.webContents.capturePage()
    fs.writeFileSync(path.join(OUT, name + '.png'), img.toPNG())
    console.log('✓', name + '.png')
  }
  app.quit()
})
