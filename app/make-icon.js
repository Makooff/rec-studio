// Render a 256x256 PNG icon via Electron offscreen (no external converters needed)
const { app, BrowserWindow } = require('electron')
const path = require('path')
const fs = require('fs')

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  html,body{margin:0;padding:0;width:256px;height:256px;background:transparent;overflow:hidden}
  .box{width:256px;height:256px;border-radius:48px;background:#0f0f0f;display:flex;
    align-items:center;justify-content:center;font-family:Arial,sans-serif}
  .r{font-weight:900;font-size:150px;color:#f5f5f5;letter-spacing:-6px;line-height:1}
  .dot{color:#FF3B3B}
</style></head><body><div class="box"><span class="r">R<span class="dot">.</span></span></div></body></html>`

app.commandLine.appendSwitch('force-device-scale-factor', '1')
app.disableHardwareAcceleration()

app.whenReady().then(async () => {
  const win = new BrowserWindow({ width: 256, height: 256, show: true, frame: false,
    transparent: true, backgroundColor: '#00000000', useContentSize: true,
    webPreferences: { offscreen: false } })
  win.showInactive()
  await win.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(html))
  await new Promise(r => setTimeout(r, 800))
  const img = await win.webContents.capturePage()
  const out = path.join(__dirname, 'assets', 'icon.png')
  fs.mkdirSync(path.dirname(out), { recursive: true })
  fs.writeFileSync(out, img.resize({ width: 256, height: 256 }).toPNG())
  console.log('✓ icon.png 256x256 written:', out)
  app.quit()
})
