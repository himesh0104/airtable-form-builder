import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useParams, useNavigate } from 'react-router-dom';

export default function FormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', fields: [] });
  const [loading, setLoading] = useState(id && id !== 'new');
  const [bases, setBases] = useState([]);
  const [tables, setTables] = useState([]);
  const [selectedBase, setSelectedBase] = useState('');
  const [selectedTable, setSelectedTable] = useState('');
  const [availableFields, setAvailableFields] = useState([]);
  const [selectedFieldIds, setSelectedFieldIds] = useState(new Set());

  useEffect(() => {
    if (id && id !== 'new') {
      fetchForm();
    } else {
      fetchBases();
    }
  }, [id]);

  const fetchForm = async () => {
    try {
      const res = await api.get(`/forms/${id}`);
      setForm(res.data);
    } catch (err) {
      console.error('Failed to fetch form:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id && id !== 'new') {
        await api.put(`/forms/${id}`, form);
      } else {
        const selected = availableFields
          .filter(f => selectedFieldIds.has(f.id))
          .map(f => ({ id: f.id, label: f.name, type: f.type }));
        const payload = { ...form, fields: selected.length ? selected : form.fields };
        await api.post('/forms', payload);
      }
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to save form:', err);
    }
  };

  const addField = () => {
    const newField = {
      id: Date.now().toString(),
      label: '',
      type: 'text',
      required: false,
    };
    setForm({ ...form, fields: [...form.fields, newField] });
  };

  const updateField = (index, updatedField) => {
    const newFields = [...form.fields];
    newFields[index] = { ...newFields[index], ...updatedField };
    setForm({ ...form, fields: newFields });
  };

  const removeField = (index) => {
    setForm({ ...form, fields: form.fields.filter((_, i) => i !== index) });
  };

  const fetchBases = async () => {
    try {
      const res = await api.get('/airtable/bases');
      setBases(res.data.bases || []);
    } catch (err) {
      console.error('Failed to fetch bases:', err);
    }
  };

  const fetchTables = async (baseId) => {
    if (!baseId) return;
    try {
      const res = await api.get(`/airtable/tables?baseId=${baseId}`);
      setTables(res.data.tables || []);
    } catch (err) {
      console.error('Failed to fetch tables:', err);
    }
  };

  const fetchFields = async (baseId, tableId) => {
    if (!baseId || !tableId) return;
    try {
      const res = await api.get(`/airtable/fields?baseId=${baseId}&tableId=${tableId}`);
      setAvailableFields(res.data.fields || []);
      setSelectedFieldIds(new Set());
    } catch (err) {
      console.error('Failed to fetch fields:', err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto' }}>
      <h2>{id === 'new' ? 'Create Form' : 'Edit Form'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Form Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          style={{ display: 'block', marginBottom: '10px', padding: '8px', width: '100%' }}
          required
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          style={{ display: 'block', marginBottom: '10px', padding: '8px', width: '100%' }}
          rows="3"
        />
        
        <h3>Fields</h3>
        {id === 'new' && (
          <div style={{ marginBottom: '15px' }}>
            <div style={{ marginBottom: '8px' }}>
              <label>Base:</label>
              <select value={selectedBase} onChange={(e) => { setSelectedBase(e.target.value); setTables([]); setSelectedTable(''); setAvailableFields([]); fetchTables(e.target.value); }} style={{ marginLeft: '8px' }}>
                <option value="">— pick a base —</option>
                {bases.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <label>Table:</label>
              <select value={selectedTable} onChange={(e) => { setSelectedTable(e.target.value); fetchFields(selectedBase, e.target.value); }} style={{ marginLeft: '8px' }}>
                <option value="">— pick a table —</option>
                {tables.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>

            {availableFields.length > 0 ? (
              <div style={{ padding: '10px', border: '1px solid #eee' }}>
                <div style={{ marginBottom: '8px' }}>Choose fields to include:</div>
                {availableFields.map(f => (
                  <label key={f.id} style={{ display: 'block', marginBottom: '6px' }}>
                    <input type="checkbox" checked={selectedFieldIds.has(f.id)} onChange={(e) => {
                      const set = new Set(selectedFieldIds);
                      if (e.target.checked) set.add(f.id); else set.delete(f.id);
                      setSelectedFieldIds(set);
                    }} />{' '}
                    {f.name} <small style={{ color: '#666' }}>({f.type})</small>
                  </label>
                ))}
              </div>
            ) : (
              <div style={{ padding: '10px', color: '#666' }}>
                {selectedBase && selectedTable ? 'No supported fields found in this table.' : 'Select a base and table to see fields.'}
              </div>
            )}
          </div>
        )}

        {form.fields.map((field, index) => (
          <div key={field.id} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ddd' }}>
            <input
              type="text"
              placeholder="Field Label"
              value={field.label}
              onChange={(e) => updateField(index, { label: e.target.value })}
              style={{ display: 'block', marginBottom: '8px', padding: '8px', width: '100%' }}
            />
            <select
              value={field.type}
              onChange={(e) => updateField(index, { type: e.target.value })}
              style={{ display: 'block', marginBottom: '8px', padding: '8px', width: '100%' }}
            >
              <option value="text">Text</option>
              <option value="email">Email</option>
              <option value="textarea">Textarea</option>
              <option value="checkbox">Checkbox</option>
              <option value="select">Select</option>
            </select>
            <label style={{ marginRight: '10px' }}>
              <input
                type="checkbox"
                checked={field.required}
                onChange={(e) => updateField(index, { required: e.target.checked })}
              />
              Required
            </label>
            <button onClick={() => removeField(index)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>
              Remove
            </button>
          </div>
        ))}
        
        <button type="button" onClick={addField} style={{ marginBottom: '20px', padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
          Add Field
        </button>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" style={{ flex: 1, padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
            Save Form
          </button>
          <button type="button" onClick={() => navigate('/dashboard')} style={{ flex: 1, padding: '10px', backgroundColor: '#6c757d', color: 'white', border: 'none', cursor: 'pointer' }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}