import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const res = await api.get('/forms');
      setForms(res.data);
    } catch (err) {
      console.error('Failed to fetch forms:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/forms/${id}`);
      setForms(forms.filter(f => f._id !== id));
    } catch (err) {
      console.error('Failed to delete form:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>My Forms</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <Link to="/form/new" style={{ marginBottom: '20px', display: 'inline-block', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
        Create New Form
      </Link>
      {forms.length === 0 ? (
        <p>No forms yet. Create one to get started!</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #ccc' }}>
              <th style={{ textAlign: 'left', padding: '10px' }}>Title</th>
              <th style={{ textAlign: 'left', padding: '10px' }}>Created</th>
              <th style={{ padding: '10px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {forms.map(form => (
              <tr key={form._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}>{form.title}</td>
                <td style={{ padding: '10px' }}>{new Date(form.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>
                  <Link to={`/form/${form._id}`} style={{ marginRight: '10px', color: '#007bff' }}>Edit</Link>
                  <button onClick={() => handleDelete(form._id)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}