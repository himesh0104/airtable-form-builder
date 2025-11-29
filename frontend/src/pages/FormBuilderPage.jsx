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
      setError('Failed to fetch bases. Make sure you\'re logged in with Airtable.');
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
    setError('');
    if (baseId) fetchTables(baseId);
  };

  const handleTableChange = (tableId) => {
    setSelectedTable(tableId);
    setAvailableFields([]);
    setSelectedFieldIds(new Set());
    setError('');
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
    <div className="form-container">
      <h2>Create New Form</h2>
      
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Form Title *</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Customer Feedback Form"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell users what this form is about"
            style={{ minHeight: '100px', resize: 'vertical' }}
          />
        </div>

        <div className="section">
          <div className="section-title">Connect to Airtable</div>
          
          <div className="form-group">
            <label htmlFor="base">Base *</label>
            <select 
              id="base"
              value={selectedBase} 
              onChange={(e) => handleBaseChange(e.target.value)}
            >
              <option value="">— Select a base —</option>
              {bases.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="table">Table *</label>
            <select 
              id="table"
              value={selectedTable} 
              onChange={(e) => handleTableChange(e.target.value)}
              disabled={!selectedBase}
            >
              <option value="">— Select a table —</option>
              {tables.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
        </div>

        {availableFields.length > 0 && (
          <div className="section">
            <div className="section-title">Select Fields *</div>
            <div className="checkbox-group">
              {availableFields.map(f => (
                <div key={f.id} className="checkbox-item">
                  <input
                    type="checkbox"
                    id={f.id}
                    checked={selectedFieldIds.has(f.id)}
                    onChange={(e) => {
                      const set = new Set(selectedFieldIds);
                      if (e.target.checked) set.add(f.id); 
                      else set.delete(f.id);
                      setSelectedFieldIds(set);
                    }}
                  />
                  <label htmlFor={f.id}>
                    <strong>{f.name}</strong>
                    <span className="field-type">{f.type}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
            {loading ? 'Creating...' : 'Create Form'}
          </button>
          <button type="button" onClick={() => navigate('/dashboard')} className="btn btn-secondary" style={{ flex: 1 }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
