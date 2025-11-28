import React, { useState } from 'react';
import api from '../utils/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  const handleAirtableLogin = async () => {
    try {
      const res = await api.get('/auth/airtable/login');
      window.location.href = res.data.url;
    } catch (err) {
      setError('Failed to start Airtable login');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center' }}>Form Builder</h2>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      
      <button
        onClick={handleAirtableLogin}
        style={{
          width: '100%',
          padding: '12px',
          marginBottom: '20px',
          backgroundColor: '#1a73e8',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '16px',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        Login with Airtable
      </button>

      <div style={{ textAlign: 'center', marginBottom: '20px', color: '#666' }}>— Or —</div>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ display: 'block', marginBottom: '10px', padding: '8px', width: '100%', boxSizing: 'border-box' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: 'block', marginBottom: '10px', padding: '8px', width: '100%', boxSizing: 'border-box' }}
        />
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#34a853',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Login
        </button>
      </form>
      <p style={{ textAlign: 'center' }}>
        Don't have an account? <a href="/signup">Sign up</a>
      </p>
    </div>
  );
}