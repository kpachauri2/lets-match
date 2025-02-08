// frontend/src/App.js
import React, { useState } from 'react';
import './App.css';

const API_URL = 'http://localhost:5000'; // Update this when deployed

function App() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showHeartbreak, setShowHeartbreak] = useState(false);

  const handleUnlock = async () => {
    setError('');
    setShowHeartbreak(false);
    const response = await fetch(`${API_URL}/unlock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, password })
    });
    const data = await response.json();
    if (data.success) {
      setMessage(data.message);
    } else {
      setMessage('');
      setError(data.message);
      setShowHeartbreak(true);
    }
  };

  return (
    <div className="container">
      <h1>💌 Propose Day Special 💌</h1>
      <input 
        type="text" 
        placeholder="Enter recipient's name" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
      />
      <input 
        type="password" 
        placeholder="Enter password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <button onClick={handleUnlock}>Unlock Message</button>
      {message && <p className="message">💖 {message} 💖</p>}
      {error && <p className="error">{error}</p>}
      {showHeartbreak && <p className="heartbreak">💔 Match Failed 💔</p>}
    </div>
  );
}

export default App;
