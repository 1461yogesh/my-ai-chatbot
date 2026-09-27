const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const chatBox = document.getElementById('chatBox');

let conversation = [];

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = userInput.value.trim();
  if (!text) return;

  // Add user prompt to screen
  addMessage(text, 'user');
  conversation.push({ role: 'user', content: text });
  userInput.value = '';

  // Placeholder while model thinks
  const loading = addMessage('Thinking...', 'assistant');

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: conversation })
    });
    
    const data = await res.json();
    if (res.ok) {
      loading.textContent = data.reply;
      conversation.push({ role: 'assistant', content: data.reply });
    } else {
      loading.textContent = data.error || 'Something went wrong.';
    }
  } catch (err) {
    loading.textContent = 'Network error. Try again.';
  }

  chatBox.scrollTop = chatBox.scrollHeight;
});

function addMessage(text, type) {
  const el = document.createElement('div');
  el.className = `msg ${type}`;
  el.textContent = text;
  chatBox.appendChild(el);
  chatBox.scrollTop = chatBox.scrollHeight;
  return el;
}
