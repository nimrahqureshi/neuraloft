/* chatbot.js - Neuralofty Mobile-Friendly */
(function () {
  const MARKUP = `
  <div id="neuralofty-chatbot" aria-hidden="false">
    <button id="neuralofty-toggle" aria-label="Open Neuralofty AI Chat">💬<span class="pulse-ring"></span></button>

    <div id="neuralofty-window" class="hidden" aria-hidden="true" role="dialog" aria-label="Neuralofty chat">
      <div class="chat-header">
        <div class="avatar">
          <img src="/assets/logo.svg" onerror="this.src='/assets/logo.png'" width="40" height="40" alt="Neuralofty">
        </div>
        <div>
          <strong>Neuralofty</strong>
          <div class="status">● Online • Ready to help</div>
        </div>
        <div style="margin-left:auto;display:flex;gap:.5rem;align-items:center;">
          <button id="download-log" title="Download full chat log" aria-label="Download log">⬇️</button>
          <button id="neuralofty-close" aria-label="Close chat">✕</button>
        </div>
      </div>

      <div id="chat-messages" role="log" aria-live="polite"></div>

      <div class="chat-input">
        <input type="text" id="user-input" placeholder="Type your message..." autocomplete="off" aria-label="Type your message">
        <button id="send-btn" aria-label="Send">Send</button>
      </div>
    </div>
  </div>
  `;

  const MOBILE_STYLE = `
    #neuralofty-chatbot { position:fixed; bottom:20px; right:20px; z-index:2000; }
    #neuralofty-toggle {
      width:60px; height:60px; border-radius:50%; font-size:1.5rem;
      background:var(--accent); color:#000; border:none; box-shadow:0 8px 18px rgba(192,140,255,0.35); cursor:pointer;
    }
    #neuralofty-window {
      position:fixed; bottom:90px; right:20px; width:360px; max-width:95vw;
      max-height:80vh; background:var(--gray-900); border-radius:16px;
      box-shadow:0 22px 40px rgba(0,0,0,0.6); display:flex; flex-direction:column; overflow:hidden; z-index:2100;
    }
    #neuralofty-window.hidden { display:none; }
    #neuralofty-window.active { display:flex; }
    .chat-header { display:flex; align-items:center; padding:0.8rem 1rem; background:rgba(0,0,0,0.9); border-bottom:1px solid var(--accent-focus); gap:0.5rem; }
    .chat-header .avatar img { border-radius:50%; width:40px; height:40px; object-fit:cover; }
    #chat-messages { flex:1; overflow-y:auto; padding:0.8rem; display:flex; flex-direction:column; gap:0.6rem; }
    .message { display:flex; }
    .message.bot .bubble { background:var(--gray-800); color:#fff; padding:0.65rem 1rem; border-radius:12px; max-width:80%; word-wrap:break-word; }
    .message.user { justify-content:flex-end; }
    .message.user .bubble { background:var(--accent); color:#000; }
    .chat-input { display:flex; padding:0.6rem; gap:0.5rem; border-top:1px solid var(--accent-focus); }
    .chat-input input { flex:1; padding:0.6rem 1rem; border-radius:12px; border:1px solid rgba(255,255,255,0.08); background:var(--gray-800); color:#fff; }
    .chat-input button { padding:0.6rem 1rem; background:var(--accent); border:none; border-radius:12px; color:#000; font-weight:700; cursor:pointer; }
    @media (max-width:480px){
      #neuralofty-window { width:90vw; bottom:80px; max-height:75vh; }
    }
  `;

  function inject() {
    if (document.getElementById('neuralofty-chatbot')) return;
    const container = document.createElement('div');
    container.innerHTML = MARKUP;
    document.body.appendChild(container);

    // Inject mobile CSS
    const styleEl = document.createElement('style');
    styleEl.textContent = MOBILE_STYLE;
    document.head.appendChild(styleEl);

    init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }

  function init() {
    const toggle = document.getElementById('neuralofty-toggle');
    const chatWindow = document.getElementById('neuralofty-window');
    const closeBtn = document.getElementById('neuralofty-close');
    const sendBtn = document.getElementById('send-btn');
    const input = document.getElementById('user-input');
    const messages = document.getElementById('chat-messages');
    const downloadLogBtn = document.getElementById('download-log');

    if (!toggle || !chatWindow || !closeBtn || !sendBtn || !input || !messages) return;

    const CONFIG = {
      CONTACT_PHONE: '+92 343 2817289',
      CONTACT_EMAIL: 'neuraloft@gmail.com',
      PORTFOLIO_LINK: '/portfolio.html',
      UPWORK_LINK: 'https://www.upwork.com',
      FIVERR_LINK: 'https://www.fiverr.com'
    };

    const KNOWLEDGE_BASE = {
      'what is neuraloft': `Neuraloft builds AI-powered web & mobile apps, automation systems, and short-form video ads. We also help freelancers optimize Upwork/Fiverr gigs.`,
      'services': `We offer: MVP & Product Development, AI & Automation, Web & Mobile apps, UI/UX, Video Editing & Ads (CapCut).`,
      'how to hire': `To hire: 1) Share a short brief, 2) Budget range, 3) Desired timeline — we’ll respond with a proposal.`
    };

    const LOG_KEY = 'neuralofty_chat_log_v1';
    function loadLog(){ try { return JSON.parse(localStorage.getItem(LOG_KEY) || '[]'); } catch(e){ return []; } }
    function saveLog(log){ localStorage.setItem(LOG_KEY, JSON.stringify(log)); }
    function logMessage(who, text){ const log = loadLog(); log.push({who, text, ts: new Date().toISOString()}); saveLog(log); }
    function escapeHtml(s){ return String(s).replace(/[&<>"']/g, (c)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
    function appendMessage(text, who='bot', allowHtml=false){ 
      const wrap = document.createElement('div'); 
      wrap.className = `message ${who}`; 
      const bubble = document.createElement('div'); 
      bubble.className = 'bubble'; 
      bubble.innerHTML = allowHtml ? text : escapeHtml(text); 
      wrap.appendChild(bubble); 
      messages.appendChild(wrap); 
      messages.scrollTop = messages.scrollHeight; 
      logMessage(who, text); 
    }

    let mailStep = 0, mailData = {};

    function botReply(raw){
      const user = (raw||'').trim();
      const msg = user.toLowerCase();
      if (!msg) return "Type a message or 'send mail' to contact us.";
      if (mailStep > 0) {
        if (mailStep === 1){ mailData.name = user; mailStep++; return "Got it! Please enter your email:"; }
        if (mailStep === 2){ mailData.email = user; mailStep++; return "Thanks! Now type your message:"; }
        if (mailStep === 3){ mailData.message = user; mailStep = 0;
          return `✅ Ready to send!<br>Name: <strong>${mailData.name}</strong><br>Email: <strong>${mailData.email}</strong><br>Message: <strong>${mailData.message}</strong><br><br>You can send it to: <a href="mailto:${CONFIG.CONTACT_EMAIL}?subject=New%20Message%20from%20${encodeURIComponent(mailData.name)}&body=${encodeURIComponent(mailData.message)}">Click here to send mail</a>`;
        }
      }

      if (msg.includes('send mail') || msg.includes('contact us')){
        mailStep = 1;
        mailData = {};
        return "Sure! First, please tell me your name:";
      }

      for (const k in KNOWLEDGE_BASE){ if (msg.includes(k)) return KNOWLEDGE_BASE[k]; }
      if (/\b(hi|hello|hey|greetings|good morning|good afternoon)\b/.test(msg)) return "Hello! 👋 I can help with pricing, timeline, samples, portfolio links, or 'send mail' to contact us.";
      if (/\b(contact|phone|number|whatsapp|call me|contact me)\b/.test(msg)) return `You can reach us at: <strong>${CONFIG.CONTACT_PHONE}</strong><br>Email: <a class="chat-link" href="mailto:${CONFIG.CONTACT_EMAIL}">${CONFIG.CONTACT_EMAIL}</a>`;
      if (/\b(sample|samples|portfolio|work|projects|examples)\b/.test(msg)) return `Live work & examples:<br>• Portfolio: <a class="chat-link" href="${CONFIG.PORTFOLIO_LINK}">${CONFIG.PORTFOLIO_LINK}</a><br>• Upwork: <a class="chat-link" href="${CONFIG.UPWORK_LINK}" target="_blank">Upwork</a><br>• Fiverr: <a class="chat-link" href="${CONFIG.FIVERR_LINK}" target="_blank">Fiverr</a>`;
      if (/\b(price|cost|how much|quote|estimate)\b/.test(msg)) return "Check our pricing options or share your budget to get suggestions.";
      return "I didn't understand that. Try 'services', 'send mail', or 'samples'.";
    }

    function sendMessage(){
      const text = input.value.trim();
      if (!text) return;
      appendMessage(text, 'user');
      input.value = '';
      appendMessage('typing…', 'bot');
      setTimeout(()=> {
        const bots = messages.querySelectorAll('.message.bot');
        if (bots.length) { const lastBot = bots[bots.length-1]; if (lastBot && lastBot.querySelector('.bubble').textContent.trim() === 'typing…') lastBot.remove(); }
        const reply = botReply(text);
        appendMessage(reply, 'bot', true);
      }, 500 + Math.random()*500);
    }

    function downloadLog(){
      const log = loadLog();
      const blob = new Blob([JSON.stringify(log, null, 2)], {type:'application/json'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `neuralofty-log-${new Date().toISOString().slice(0,19).replace(/:/g,'')}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }

    toggle.addEventListener('click', () => {
      chatWindow.classList.toggle('active');
      chatWindow.classList.toggle('hidden');
      if (chatWindow.classList.contains('active')) input.focus();
    });
    closeBtn.addEventListener('click', ()=>{ chatWindow.classList.remove('active'); chatWindow.classList.add('hidden'); toggle.focus(); });
    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keydown', (e)=> { if (e.key === 'Enter') { e.preventDefault(); sendMessage(); } });
    downloadLogBtn.addEventListener('click', downloadLog);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && chatWindow.classList.contains('active')) { chatWindow.classList.remove('active'); chatWindow.classList.add('hidden'); } });

    // Seed initial message
    (function seedLogOnce(){ 
      const log = loadLog(); 
      if (!log.length) appendMessage("Hey! I'm <strong>Neuralofty</strong>. Ask me about services, pricing, timelines, portfolio, or type 'send mail' to contact us.", 'bot', true); 
    })();
  }
})();
