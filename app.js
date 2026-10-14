const messagesEl = document.getElementById('messages');
const form = document.getElementById('chatForm');
const input = document.getElementById('chatInput');
const chips = document.getElementById('chips');
const clearBtn = document.getElementById('clearBtn');

const STORE_KEY = 'rexy-chat-history-v1';

const jokes = [
  "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
  "Why did the developer go broke? He used up all his cache. 💸",
  "How does a computer get drunk? It takes screenshots. 📸",
  "Why was the JavaScript developer sad? He didn't Node how to Express himself. 💬",
  "There are only 10 kinds of people: those who understand binary and those who don't. 🔢"
];

function now() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function addMessage(who, text) {
  const div = document.createElement('div');
  div.className = `msg ${who}`;
  const label = document.createElement('span');
  label.className = 'who';
  label.textContent = who === 'bot' ? `Rexy · ${now()}` : `You · ${now()}`;
  const body = document.createElement('span');
  body.textContent = text;
  div.append(label, body);
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return div;
}

function showTyping() {
  const div = document.createElement('div');
  div.className = 'msg bot';
  div.id = 'typing';
  div.innerHTML = '<span class="who">Rexy · typing…</span><span class="typing"><i></i><i></i><i></i></span>';
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function hideTyping() {
  document.getElementById('typing')?.remove();
}

function getReply(raw) {
  const text = raw.toLowerCase().trim();

  if (!text) return "Say something and I'll do my best to answer! 🙂";
  if (/(^|\W)(hi|hello|hey|yo|hiya)(\W|$)/.test(text)) return "Hello! 👋 I'm Rexy. Ask me for help, the time, or a joke.";
  if (text.includes('what can you do') || text.includes('help') || text.includes('commands'))
    return "Here's what I can do right now:\n• Say hello\n• Tell a joke\n• Tell the time / date\n• Remember your name (try: my name is Sam)\n• Answer: who made you?";
  if (text.includes('joke')) return jokes[Math.floor(Math.random() * jokes.length)];
  if (text.includes('time')) return `It's ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} right now. ⏰`;
  if (text.includes('day') || text.includes('date') || text.includes('today'))
    return `Today is ${new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}. 📅`;
  if (text.includes('who made you') || text.includes('who created you') || text.includes('your creator'))
    return "I was created right here in this little website — built with plain HTML, CSS and JavaScript. 🛠️";
  if (text.includes('your name') || text.includes('who are you')) return "I'm Rexy — your friendly browser chat bot! 🤖";
  if (text.includes('my name is')) {
    const name = raw.split(/my name is/i)[1].trim().split(/\s+/).slice(0, 2).join(' ');
    if (name) { localStorage.setItem('rexy-name', name); return `Nice to meet you, ${name}! I'll remember that. 😊`; }
  }
  if (text.includes('my name') || text.includes('do you know my name')) {
    const name = localStorage.getItem('rexy-name');
    return name ? `Yes! You're ${name}. 🧠` : "I don't know your name yet — tell me with “my name is …”.";
  }
  if (text.includes('thank')) return "You're very welcome! Anything else? ✨";
  if (text.includes('bye')) return "Goodbye! I'll be right here whenever you want to chat. 👋";
  if (text.includes('weather')) return "I can't see the sky from inside your browser, but I hope it's nice where you are! ☀️";
  if (text.includes('love you') || text.includes('i like you')) return "Aww, I like chatting with you too! 💜";
  if (text.length > 200) return "That's a long one! Can you summarize it in one short sentence? 📝";

  const fallbacks = [
    `Hmm, I'm a simple demo bot so I didn't quite get “${raw.slice(0, 60)}”. Try “help” to see what I understand. 🤔`,
    "Interesting! I'm still learning — try asking me for a joke, the time, or type “help”. 💡"
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

function saveHistory() {
  const items = [...messagesEl.querySelectorAll('.msg')].slice(-50).map(el => ({
    who: el.classList.contains('bot') ? 'bot' : 'user',
    text: el.lastChild.textContent
  }));
  try { localStorage.setItem(STORE_KEY, JSON.stringify(items)); } catch {}
}

function loadHistory() {
  try {
    const items = JSON.parse(localStorage.getItem(STORE_KEY) || '[]');
    if (items.length) {
      items.forEach(m => addMessage(m.who, m.text));
      return true;
    }
  } catch {}
  return false;
}

function botRespond(userText) {
  showTyping();
  const delay = 500 + Math.min(userText.length * 12, 1200);
  setTimeout(() => {
    hideTyping();
    addMessage('bot', getReply(userText));
    saveHistory();
  }, delay);
}

function send(text) {
  const clean = text.trim();
  if (!clean) return;
  addMessage('user', clean);
  saveHistory();
  input.value = '';
  botRespond(clean);
}

form.addEventListener('submit', e => {
  e.preventDefault();
  send(input.value);
});

chips.addEventListener('click', e => {
  const btn = e.target.closest('button[data-q]');
  if (btn) send(btn.dataset.q);
});

clearBtn.addEventListener('click', () => {
  localStorage.removeItem(STORE_KEY);
  messagesEl.innerHTML = '';
  greet();
});

function greet() {
  const name = localStorage.getItem('rexy-name');
  addMessage('bot', name
    ? `Welcome back, ${name}! What shall we talk about? 😊`
    : "Hi, I'm Rexy! 👋 Ask me anything — or tap a suggestion below to start.");
}

if (!loadHistory()) greet();
input.focus();
