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

  if (loading) return <div className="loading">Loading form...</div>;
  if (error) return <div className="error-message" style={{ maxWidth: '600px', margin: '40px auto' }}>{error}</div>;

  return (
    <div className="form-container">
      <h2>Edit Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            id="title"
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            style={{ minHeight: '100px', resize: 'vertical' }}
          />
        </div>

        <div className="section">
          <div className="section-title">Assigned Questions ({form.questions.length})</div>
          {form.questions.length === 0 ? (
            <p style={{ color: '#9ca3af', fontSize: '14px' }}>No questions assigned yet.</p>
          ) : (
            <div className="checkbox-group">
              {form.questions.map((q, i) => (
                <div key={i} className="checkbox-item" style={{ cursor: 'default' }}>
                  <span style={{ color: '#667eea', marginRight: '8px' }}>✓</span>
                  <label style={{ cursor: 'default' }}>
                    <strong>{q.label}</strong>
                    <span className="field-type">{q.type}{q.required ? ' - Required' : ''}</span>
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
          <button type="submit" className="btn btn-primary" disabled={saving} style={{ flex: 1 }}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button type="button" onClick={() => navigate('/dashboard')} className="btn btn-secondary" style={{ flex: 1 }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}