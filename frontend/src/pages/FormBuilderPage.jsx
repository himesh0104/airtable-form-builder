import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

export default function FormBuilderPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [bases, setBases] = useState([]);
  const [tables, setTables] = useState([]);
  const [selectedBase, setSelectedBase] = useState('');
  const [selectedTable, setSelectedTable] = useState('');
  const [availableFields, setAvailableFields] = useState([]);
  const [selectedFieldIds, setSelectedFieldIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBases();
  }, []);

  const fetchBases = async () => {
    try {
      const res = await api.get('/airtable/bases');
      setBases(res.data.bases || []);
    } catch (err) {
      setError('Failed to fetch bases. Make sure you\' re logged in with Airtable.');
    }
  };

  const fetchTables = async (baseId) => {
    if (!baseId) return;
    try {
      const res = await api.get(`/airtable/tables?baseId=${baseId}`);
      setTables(res.data.tables || []);
    } catch (err) {
      setError('Failed to fetch tables');
    }
  };

  const fetchFields = async (baseId, tableId) => {
    if (!baseId || !tableId) return;
    try {
      const res = await api.get(`/airtable/fields?baseId=${baseId}&tableId=${tableId}`);
      setAvailableFields(res.data.fields || []);
    } catch (err) {
      setError('Failed to fetch fields');
    }
  };

  const handleBaseChange = (baseId) => {
    setSelectedBase(baseId);
    setTables([]);
    setSelectedTable('');
    setAvailableFields([]);
    setSelectedFieldIds(new Set());
    if (baseId) fetchTables(baseId);
  };

  const handleTableChange = (tableId) => {
    setSelectedTable(tableId);
    setAvailableFields([]);
    setSelectedFieldIds(new Set());
    if (tableId) fetchFields(selectedBase, tableId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      setError('Title required');
      return;
    }
    if (!selectedBase || !selectedTable) {
      setError('Select base and table');
      return;
    }
    if (!selectedFieldIds.size) {
      setError('Select at least one field');
      return;
    }

    setLoading(true);
    try {
      const questions = availableFields
        .filter(f => selectedFieldIds.has(f.id))
        .map(f => ({
          questionKey: `q_${f.id}`,
          airtableFieldId: f.id,
          label: f.name,
          type: f.type,
          required: false,
          conditionalRules: null,
        }));

      const res = await api.post('/forms', {
        title,
        description,
        airtableBaseId: selectedBase,
        airtableTableId: selectedTable,
        questions,
      });

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px' }}>
      <h2>Create Form</h2>
      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ display: 'block', width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ display: 'block', width: '100%', padding: '8px', minHeight: '60px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Base *</label>
          <select value={selectedBase} onChange={(e) => handleBaseChange(e.target.value)} style={{ display: 'block', width: '100%', padding: '8px' }}>
            <option value="">— Select a base —</option>
            {bases.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Table *</label>
          <select value={selectedTable} onChange={(e) => handleTableChange(e.target.value)} style={{ display: 'block', width: '100%', padding: '8px' }}>
            <option value="">— Select a table —</option>
            {tables.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>

        {availableFields.length > 0 && (
          <div style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ddd' }}>
            <label>Fields * (select at least one)</label>
            {availableFields.map(f => (
              <label key={f.id} style={{ display: 'block', marginTop: '8px' }}>
                <input
                  type="checkbox"
                  checked={selectedFieldIds.has(f.id)}
                  onChange={(e) => {
                    const set = new Set(selectedFieldIds);
                    if (e.target.checked) set.add(f.id); else set.delete(f.id);
                    setSelectedFieldIds(set);
                  }}
                />
                {' '}{f.name} <small style={{ color: '#666' }}>({f.type})</small>
              </label>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" disabled={loading} style={{ flex: 1, padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
            {loading ? 'Creating...' : 'Create Form'}
          </button>
          <button type="button" onClick={() => navigate('/dashboard')} style={{ flex: 1, padding: '10px', backgroundColor: '#6c757d', color: 'white', border: 'none', cursor: 'pointer' }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
