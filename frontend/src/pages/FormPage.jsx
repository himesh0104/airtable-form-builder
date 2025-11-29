import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useParams, useNavigate } from 'react-router-dom';

export default function FormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', questions: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) fetchForm();
  }, [id]);

  const fetchForm = async () => {
    try {
      const res = await api.get(`/forms/${id}`);
      setForm(res.data);
    } catch (err) {
      setError('Failed to load form');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/forms/${id}`, {
        title: form.title,
        description: form.description,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save form');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px' }}>
      <h2>Edit Form</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Title *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            style={{ display: 'block', width: '100%', padding: '8px', boxSizing: 'border-box' }}
            required
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            style={{ display: 'block', width: '100%', padding: '8px', minHeight: '60px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f5f5f5' }}>
          <h4>Questions ({form.questions.length})</h4>
          {form.questions.length === 0 ? (
            <p style={{ color: '#666' }}>No questions assigned to this form.</p>
          ) : (
            form.questions.map((q, i) => (
              <div key={i} style={{ marginBottom: '8px', padding: '8px', backgroundColor: '#fff', border: '1px solid #ddd' }}>
                <strong>{q.label}</strong> <small style={{ color: '#666' }}>({q.type})</small>
                {q.required && <span style={{ color: 'red', marginLeft: '8px' }}>*</span>}
              </div>
            ))
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" disabled={saving} style={{ flex: 1, padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button type="button" onClick={() => navigate('/dashboard')} style={{ flex: 1, padding: '10px', backgroundColor: '#6c757d', color: 'white', border: 'none', cursor: 'pointer' }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}