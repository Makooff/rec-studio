/* global api */

const state = {
  project: null,        // { path, name }
  agent: null,          // active agent object or null
  agents: { nova: [], custom: [] },
  tabId: 'main',
  streaming: false,
}

const $ = (id) => document.getElementById(id)
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e }

// ---- window controls ----
$('btn-min').onclick = () => api.minimize()
$('btn-close').onclick = () => api.close()

// ---- projects ----
async function refreshProjects() {
  const projects = await api.listProjects()
  const list = $('project-list')
  list.innerHTML = ''
  for (const p of projects) {
    const item = el('div', 'project-item' + (state.project?.path === p.path ? ' active' : ''))
    item.innerHTML = `<span>📁</span><span>${escapeHtml(p.name)}</span>`
    item.title = p.path
    item.onclick = () => selectProject(p)
    list.appendChild(item)
  }
}

$('btn-pick').onclick = async () => {
  const p = await api.pickFolder()
  if (p) { await refreshProjects(); selectProject(p) }
}

async function selectProject(p) {
  state.project = p
  state.agent = null
  $('tb-project').textContent = '— ' + p.name
  $('chat-empty').style.display = 'none'
  $('composer').style.display = 'block'
  $('messages').innerHTML = ''
  await api.resetSession(state.tabId)
  await refreshProjects()
  await refreshAgents()
  updateActiveAgent()
  $('input').focus()
}

// ---- agents ----
async function refreshAgents() {
  if (!state.project) return
  state.agents = await api.listAgents(state.project.path)
  renderAgents()
}

function renderAgents() {
  const nova = $('nova-agents'); nova.innerHTML = ''
  for (const a of state.agents.nova) nova.appendChild(agentItem(a, false))
  const custom = $('custom-agents'); custom.innerHTML = ''
  if (!state.agents.custom.length) custom.appendChild(el('div', 'side-foot', 'Aucun. ＋ pour créer.'))
  for (const a of state.agents.custom) custom.appendChild(agentItem(a, true))
}

function agentItem(a, isCustom) {
  const item = el('div', 'agent-item' + (state.agent?.id === a.id ? ' active' : ''))
  item.innerHTML = `<span class="ic">${a.icon || '🤖'}</span><span>${escapeHtml(a.name)}</span>`
  item.onclick = () => { state.agent = (state.agent?.id === a.id) ? null : a; renderAgents(); updateActiveAgent(); $('input').focus() }
  if (isCustom) {
    const del = el('span', 'del', '✕')
    del.onclick = async (ev) => { ev.stopPropagation(); await api.deleteAgent(state.project.path, a.id); if (state.agent?.id === a.id) state.agent = null; await refreshAgents(); updateActiveAgent() }
    item.appendChild(del)
  }
  return item
}

function updateActiveAgent() {
  const box = $('active-agent')
  if (state.agent) box.innerHTML = `Agent actif : <span class="badge">${state.agent.icon || '🤖'} ${escapeHtml(state.agent.name)}</span>`
  else box.innerHTML = `Agent actif : <span class="badge">Claude (général)</span>`
}

// ---- create agent modal ----
$('btn-new-agent').onclick = () => { if (!state.project) return alert('Choisis un projet d\'abord.'); $('agent-modal').style.display = 'flex' }
$('ag-cancel').onclick = () => closeModal()
function closeModal() { $('agent-modal').style.display = 'none'; $('ag-name').value = ''; $('ag-icon').value = ''; $('ag-prompt').value = '' }
$('ag-save').onclick = async () => {
  const name = $('ag-name').value.trim()
  if (!name) return $('ag-name').focus()
  const tools = [...$('ag-tools').querySelectorAll('input:checked')].map(c => c.value)
  await api.saveAgent(state.project.path, {
    name, icon: $('ag-icon').value.trim() || '🤖', prompt: $('ag-prompt').value.trim(), tools,
  })
  closeModal(); await refreshAgents()
}

// ---- chat send ----
const input = $('input')
input.addEventListener('input', () => { input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight, 180) + 'px' })
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
})
$('btn-send').onclick = () => send()

let currentAssistantBody = null

async function send() {
  const text = input.value.trim()
  if (!text || state.streaming || !state.project) return
  input.value = ''; input.style.height = 'auto'
  addMessage('user', text)
  state.streaming = true; $('btn-send').disabled = true

  // assistant placeholder
  const m = addMessage('assistant', '')
  currentAssistantBody = m.querySelector('.body')
  currentAssistantBody.innerHTML = '<span class="cursor"></span>'

  await api.sendMessage({
    tabId: state.tabId,
    projectPath: state.project.path,
    prompt: text,
    agent: state.agent,
  })
}

// ---- stream handler ----
let rawBuffer = ''
api.onStream((data) => {
  if (data.tabId !== state.tabId) return
  if (data.type === 'token') {
    if (rawBuffer === '' ) currentAssistantBody.innerHTML = ''
    rawBuffer += data.text
    currentAssistantBody.innerHTML = renderMarkdown(rawBuffer) + '<span class="cursor"></span>'
    scrollBottom()
  } else if (data.type === 'tool') {
    addToolCall(data.name, data.input)
    scrollBottom()
  } else if (data.type === 'done') {
    currentAssistantBody.innerHTML = renderMarkdown(rawBuffer)
    rawBuffer = ''
    state.streaming = false; $('btn-send').disabled = false
    scrollBottom()
  } else if (data.type === 'error') {
    currentAssistantBody.innerHTML = `<span style="color:var(--accent)">⚠ ${escapeHtml(data.text)}</span>`
    rawBuffer = ''
    state.streaming = false; $('btn-send').disabled = false
  }
})

function addMessage(role, text) {
  const wrap = el('div', 'msg ' + role)
  const label = role === 'user' ? '<span class="rec-dot"></span> Toi' : 'Claude'
  wrap.innerHTML = `<div class="role">${label}</div><div class="body">${role === 'user' ? escapeHtml(text) : renderMarkdown(text)}</div>`
  $('messages').appendChild(wrap)
  scrollBottom()
  return wrap
}

function addToolCall(name, inputObj) {
  const wrap = el('div', 'tool-call')
  let detail = ''
  try { const s = JSON.stringify(inputObj); detail = s.length > 60 ? s.slice(0, 60) + '…' : s } catch {}
  wrap.innerHTML = `<span class="chip">⚙ <span class="tname">${escapeHtml(name)}</span> ${escapeHtml(detail)}</span>`
  // insert before current assistant message
  const msgs = $('messages')
  const lastAssistant = [...msgs.querySelectorAll('.msg.assistant')].pop()
  if (lastAssistant) msgs.insertBefore(wrap, lastAssistant)
  else msgs.appendChild(wrap)
}

function scrollBottom() { const m = $('messages'); m.scrollTop = m.scrollHeight }

// ---- helpers ----
function escapeHtml(s) { return (s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])) }

function renderMarkdown(md) {
  let h = escapeHtml(md)
  h = h.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, l, code) => `<pre>${code.replace(/\n$/, '')}</pre>`)
  h = h.replace(/`([^`]+)`/g, '<code>$1</code>')
  h = h.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  h = h.replace(/^### (.+)$/gm, '<strong>$1</strong>')
  h = h.replace(/^## (.+)$/gm, '<strong>$1</strong>')
  return h
}

// ---- settings / MCP 21st ----
$('btn-settings').onclick = async () => {
  const cfg = await api.getConfig()
  $('set-status').innerHTML = cfg.hasMagic
    ? '<span class="ok">✓ MCP 21st actif</span>'
    : '<span class="off">○ MCP 21st inactif</span>'
  $('settings-modal').style.display = 'flex'
}
$('set-cancel').onclick = () => { $('settings-modal').style.display = 'none'; $('set-magic').value = '' }
$('set-save').onclick = async () => {
  const key = $('set-magic').value.trim()
  const cfg = await api.saveConfig(key ? { magicKey: key } : {})
  $('set-status').innerHTML = cfg.hasMagic ? '<span class="ok">✓ MCP 21st actif</span>' : '<span class="off">○ MCP 21st inactif</span>'
  $('set-magic').value = ''
}

// external links
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="http"]')
  if (a) { e.preventDefault(); api.openExternal(a.href) }
})

// init
refreshProjects()
