(function () {
  document.getElementById('tb-project').textContent = '— spot-client';
  document.getElementById('chat-empty').style.display = 'none';
  document.getElementById('composer').style.display = 'block';

  document.getElementById('project-list').innerHTML =
    '<div class="project-item active"><span>📁</span><span>spot-client</span></div>' +
    '<div class="project-item"><span>📁</span><span>site-resto-liege</span></div>';

  document.getElementById('nova-agents').innerHTML =
    '<div class="agent-item active"><span class="ic">🎬</span><span>Spot publicitaire</span></div>' +
    '<div class="agent-item"><span class="ic">📈</span><span>Campagne Ads</span></div>' +
    '<div class="agent-item"><span class="ic">🌐</span><span>Site web</span></div>' +
    '<div class="agent-item"><span class="ic">📍</span><span>SEO local</span></div>';

  document.getElementById('custom-agents').innerHTML =
    '<div class="agent-item"><span class="ic">🎯</span><span>Closer Nova</span><span class="del">✕</span></div>';

  document.getElementById('active-agent').innerHTML =
    'Agent actif : <span class="badge">🎬 Spot publicitaire</span>';

  document.getElementById('messages').innerHTML =
    '<div class="msg user"><div class="role"><span class="rec-dot"></span> Toi</div>' +
    '<div class="body">Crée un spot 30s pour une boulangerie artisanale, format Reels</div></div>' +

    '<div class="tool-call"><span class="chip">⚙ <span class="tname">Write</span> {"path":"script-spot.md"…}</span></div>' +

    '<div class="msg assistant"><div class="role">Claude</div><div class="body">' +
    'Voici le concept du spot <strong>Boulangerie</strong> (9:16, 30s) :\n\n' +
    '<strong>Hook (0–3s)</strong>\nGros plan ralenti sur une miche qui sort du four — vapeur, lumière dorée.\n\n' +
    '<strong>Problème (3–8s)</strong>\n« Le pain industriel, sans âme ? »\n\n' +
    '<strong>Solution (8–22s)</strong>\nMains du boulanger qui pétrissent à l’aube. Voix off chaleureuse.\n\n' +
    '<strong>CTA (22–30s)</strong>\nLogo + « Goûtez la différence. » + adresse.\n\n' +
    'Script écrit dans <code>script-spot.md</code>. Je génère les visuels avec Pika :' +
    '</div></div>' +

    '<div class="tool-call"><span class="chip">⚙ <span class="tname">Bash</span> curl api.pika.art/v1/generate…</span></div>';

  document.getElementById('input').value = '';
})();
