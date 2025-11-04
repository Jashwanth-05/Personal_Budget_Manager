import React, { useState } from 'react';

function Chat() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setResponse('');
    setError('');

    try {
      const res = await fetch('http://localhost:5556/api/chat', { // Your backend URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      setResponse(data.response);
    } catch (err) {
      setError('Failed to fetch response. Please check the console for more details.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h2>AI Chat</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Llama 2 anything..."
          style={{ width: 'calc(100% - 80px)', padding: '10px', marginRight: '10px' }}
        />
        <button type="submit" disabled={isLoading} style={{ padding: '10px' }}>
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {response && (
        <div style={{ marginTop: '20px', padding: '15px', background: '#f4f4f4', borderRadius: '5px' }}>
          <strong>Response:</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}

export default Chat;
