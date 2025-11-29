import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Link, useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [airtableStatus, setAirtableStatus] = useState({ connected: false, checking: true });
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchForms();
    fetchMe();
  }, []);

  const fetchForms = async () => {
    try {
      const res = await api.get('/forms');
      setForms(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        console.error('Failed to fetch forms:', err);
        setErrorMsg('Unable to load forms. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchMe = async () => {
    try {
      const res = await api.get('/auth/me');
      setAirtableStatus({ connected: !!res.data.user?.airtableConnected, checking: false });
    } catch (err) {
      setAirtableStatus({ connected: false, checking: false });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this form?')) {
      try {
        await api.delete(`/forms/${id}`);
        setForms(forms.filter(f => f._id !== id));
      } catch (err) {
        console.error('Failed to delete form:', err);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) return <div className="loading">Loading your forms...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h2>My Forms</h2>
          <div className={`status-badge ${airtableStatus.connected ? 'connected' : 'disconnected'}`}>
            {airtableStatus.checking ? '⏳ Checking Airtable...' : airtableStatus.connected ? '✓ Airtable Connected' : '✗ Airtable Disconnected'}
          </div>
        </div>
        <div className="btn-group">
          <Link to="/form/builder" className="btn btn-primary">
            + Create New Form
          </Link>
          <button onClick={handleLogout} className="btn btn-secondary">
            Logout
          </button>
        </div>
      </div>

      {errorMsg && <div className="error-message">{errorMsg}</div>}

      {forms.length === 0 ? (
        <div className="empty-state">
          <h3>No forms yet</h3>
          <p>Create your first form to get started</p>
          <Link to="/form/builder" className="btn btn-primary" style={{ display: 'inline-block', marginTop: '20px', maxWidth: '200px' }}>
            Create Your First Form
          </Link>
        </div>
      ) : (
        <div className="form-table">
          <table>
            <thead>
              <tr>
                <th>Form Title</th>
                <th>Created</th>
                <th>Responses</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {forms.map(form => (
                <tr key={form._id}>
                  <td>
                    <strong>{form.title}</strong>
                    <br />
                    <small style={{ color: '#9ca3af' }}>{form.description}</small>
                  </td>
                  <td>{new Date(form.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/forms/${form._id}/responses`} className="btn-edit" style={{ textDecoration: 'none', display: 'inline-block' }}>
                      View Responses
                    </Link>
                  </td>
                  <td>
                    <div className="actions" style={{ justifyContent: 'flex-end' }}>
                      <Link to={`/form/${form._id}`} className="btn-edit">Edit</Link>
                      <button onClick={() => handleDelete(form._id)} className="btn-delete">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}