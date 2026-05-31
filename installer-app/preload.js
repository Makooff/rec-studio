const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  runCommand: (command) => ipcRenderer.invoke('run-command', command),
  openClaude: (cwd) => ipcRenderer.invoke('open-claude', cwd),
  pickFolder: () => ipcRenderer.invoke('pick-folder'),
  setupProject: (projectDir) => ipcRenderer.invoke('setup-project', projectDir),
  close: () => ipcRenderer.send('close-app'),
  minimize: () => ipcRenderer.send('minimize-app')
})
