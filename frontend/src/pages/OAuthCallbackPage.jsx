import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';

export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');

        if (!code) {
          setError('No authorization code received');
          setLoading(false);
          return;
        }

        // Call backend OAuth callback
        const res = await api.get(`/auth/airtable/callback?code=${code}&state=${state}`);
        localStorage.setItem('token', res.data.token);
        window.location.href = '/dashboard';
      } catch (err) {
        setError(err.response?.data?.error || 'OAuth callback failed');
        setLoading(false);
      }
    };

    handleCallback();
  }, [searchParams]);

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Processing login...</div>;
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>
        <p>{error}</p>
        <a href="/login">Back to login</a>
      </div>
    );
  }

  return null;
}
