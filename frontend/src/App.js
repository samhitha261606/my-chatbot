import React, { useState } from 'react';
import './styles.css';

const App = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! I am your Gemini-powered chatbot. Ask me anything!' }
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { from: 'user', text: input }]);
    setLoading(true);

    try {
      const response = await fetch('https://my-chatbot-umw6.onrender.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await response.json();
      setMessages(prev => [...prev, { from: 'bot', text: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { from: 'bot', text: 'Something went wrong' }]);
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="container">
      <h1>Gemini Chatbot</h1>
      <div className="chat-window">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`message ${msg.from === 'user' ? 'user-message' : 'bot-message'}`}
          >
            {msg.text}
          </div>
        ))}
        {loading && <div className="message bot-message">Typing...</div>}
      </div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message and hit Enter..."
      />
      <button onClick={sendMessage} disabled={loading}>Send</button>
    </div>
  );
};

export default App;
