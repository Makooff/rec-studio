const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  // window
  minimize: () => ipcRenderer.send('win-minimize'),
  close: () => ipcRenderer.send('win-close'),
  openExternal: (url) => ipcRenderer.send('open-external', url),

  // projects
  listProjects: () => ipcRenderer.invoke('list-projects'),
  pickFolder: () => ipcRenderer.invoke('pick-folder'),

  // agents
  listAgents: (projectPath) => ipcRenderer.invoke('list-agents', projectPath),
  saveAgent: (projectPath, agent) => ipcRenderer.invoke('save-agent', projectPath, agent),
  deleteAgent: (projectPath, id) => ipcRenderer.invoke('delete-agent', projectPath, id),

  // first-run env gate
  checkEnv: () => ipcRenderer.invoke('check-env'),
  installClaude: () => ipcRenderer.invoke('install-claude'),
  loginClaude: () => ipcRenderer.invoke('login-claude'),
  onInstallLog: (cb) => { const fn = (_e, d) => cb(d); ipcRenderer.on('install-log', fn); return () => ipcRenderer.removeListener('install-log', fn) },

  // config / MCP
  getConfig: () => ipcRenderer.invoke('get-config'),
  saveConfig: (patch) => ipcRenderer.invoke('save-config', patch),

  // chat
  sendMessage: (payload) => ipcRenderer.invoke('send-message', payload),
  resetSession: (tabId) => ipcRenderer.invoke('reset-session', tabId),
  onStream: (cb) => {
    const fn = (_e, data) => cb(data)
    ipcRenderer.on('stream', fn)
    return () => ipcRenderer.removeListener('stream', fn)
  },
})
