const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const chatBox = document.getElementById('chatBox');
let conversationHistory = [];

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const messageText = userInput.value.trim();
  if (!messageText) return;

  appendMessage(messageText, 'user-message');
  conversationHistory.push({ role: 'user', content: messageText });
  userInput.value = '';

  const loadingElement = appendMessage('Thinking...', 'assistant-message');

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: conversationHistory })
    });

    const data = await response.json();

    if (response.ok) {
      loadingElement.textContent = data.reply;
      conversationHistory.push({ role: 'assistant', content: data.reply });
    } else {
      loadingElement.textContent = `Error: ${data.error || 'Failed to generate response'}`;
    }
  } catch (err) {
    loadingElement.textContent = 'Error connecting to backend.';
  }

  chatBox.scrollTop = chatBox.scrollHeight;
});

function appendMessage(text, className) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message', className);
  msgDiv.textContent = text;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msgDiv;
}
