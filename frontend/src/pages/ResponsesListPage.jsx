import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: '900px', margin: '20px auto', padding: '20px' }}>
      <h2>{form?.title} — Responses</h2>

      {responses.length === 0 ? (
        <p>No responses yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ccc' }}>
              <th style={{ textAlign: 'left', padding: '10px' }}>Submitted</th>
              <th style={{ textAlign: 'left', padding: '10px' }}>Status</th>
              <th style={{ padding: '10px' }}>Preview</th>
            </tr>
          </thead>
          <tbody>
            {responses.map(r => (
              <tr key={r._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}>{new Date(r.createdAt).toLocaleString()}</td>
                <td style={{ padding: '10px' }}>
                  <span style={{ fontSize: '12px', color: r.deletedInAirtable ? 'red' : 'green' }}>
                    {r.deletedInAirtable ? 'Deleted' : r.status}
                  </span>
                </td>
                <td style={{ padding: '10px', fontSize: '12px', color: '#666' }}>
                  {JSON.stringify(r.answers).slice(0, 80)}...
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <a href="/dashboard" style={{ marginTop: '20px', display: 'inline-block' }}>
        Back to Dashboard
      </a>
    </div>
  );
}
