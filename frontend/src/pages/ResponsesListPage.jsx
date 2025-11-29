import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';

export default function ResponsesListPage() {
  const { formId } = useParams();
  const [responses, setResponses] = useState([]);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [formId]);

  const fetchData = async () => {
    try {
      const [formRes, responsesRes] = await Promise.all([
        api.get(`/forms/${formId}`),
        api.get(`/forms/${formId}/responses`),
      ]);
      setForm(formRes.data);
      setResponses(responsesRes.data);
    } catch (err) {
      console.error('Failed to fetch:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPreviewText = (answers) => {
    const entries = Object.entries(answers).slice(0, 2);
    return entries.map(([k, v]) => `${k}: ${String(v).slice(0, 30)}`).join(' • ');
  };

  if (loading) return <div className="loading">Loading responses...</div>;

  return (
    <div className="responses-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2>{form?.title}</h2>
          <p style={{ color: '#9ca3af', fontSize: '14px' }}>Total responses: {responses.length}</p>
        </div>
        <Link to="/dashboard" className="btn btn-secondary" style={{ maxWidth: '150px' }}>
          ← Back
        </Link>
      </div>

      {responses.length === 0 ? (
        <div className="empty-state">
          <h3>No responses yet</h3>
          <p>Share your form to start collecting responses</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {responses.map(r => (
            <div key={r._id} className="response-item">
              <div className="response-header">
                <span className="response-date">
                  {new Date(r.createdAt).toLocaleDateString()} at {new Date(r.createdAt).toLocaleTimeString()}
                </span>
                <span className={`response-status${r.deletedInAirtable ? ' deleted' : ''}`}>
                  {r.deletedInAirtable ? '🗑️ Deleted' : '✓ ' + r.status}
                </span>
              </div>
              <div className="response-preview">
                {getPreviewText(r.answers) || 'No answers recorded'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
