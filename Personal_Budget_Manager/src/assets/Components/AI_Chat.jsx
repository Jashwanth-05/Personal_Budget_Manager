import React, { useState, useEffect, useRef } from 'react';
import '../Styles/AIChatPopup.css'

const AIChatPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const user=JSON.parse(localStorage.getItem("user"))

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5556/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: input,userId:user.id }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const aiMessage = { sender: 'ai', text: data.response };
      setMessages((prev) => [...prev, aiMessage]);

    } catch (error) {
      console.error("Failed to get AI response:", error);
      const errorMessage = { sender: 'ai', text: 'Sorry, I am having trouble connecting.' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="chat-button"
        aria-label={isOpen ? 'Close Chat' : 'Open Chat'}
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {isOpen && (
        <div className="popup-window">
          <div className="chat-header">
            <h3>AI Assistant</h3>
          </div>
          <div className="messages-container">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`message ${msg.sender === 'user' ? 'user-message' : 'ai-message'}`}
              >
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="message ai-message typing-indicator">
                <span></span><span></span><span></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything..."
              className="chat-input"
            />
            <button
              onClick={handleSendMessage}
              className="send-button"
              disabled={isLoading}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatPopup;
