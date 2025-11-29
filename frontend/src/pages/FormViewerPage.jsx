import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { shouldShowQuestion } from '../utils/conditional';

export default function FormViewerPage() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchForm();
  }, [formId]);

  const fetchForm = async () => {
    try {
      const res = await api.get(`/forms/${formId}`);
      setForm(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load form');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (questionKey, value) => {
    setAnswers({ ...answers, [questionKey]: value });
  };

  const validate = () => {
    const msgs = [];
    form.questions?.forEach(q => {
      const show = shouldShowQuestion(q.conditionalRules, answers);
      if (show && q.required && !answers[q.questionKey]) {
        msgs.push(`${q.label} is required`);
      }
    });
    return msgs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const msgs = validate();
    if (msgs.length) {
      setError(msgs.join(', '));
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post(`/forms/${formId}/submit`, { answers });
      navigate(`/forms/${formId}/responses`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading form...</div>;
  if (!form) return <div style={{ padding: '20px', color: 'red' }}>Form not found</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px' }}>
      <h2>{form.title}</h2>
      {form.description && <p>{form.description}</p>}

      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        {form.questions?.map(q => {
          const show = shouldShowQuestion(q.conditionalRules, answers);
          if (!show) return null;

          return (
            <div key={q.questionKey} style={{ marginBottom: '15px' }}>
              <label style={{ fontWeight: 'bold' }}>
                {q.label}
                {q.required && <span style={{ color: 'red' }}> *</span>}
              </label>
              {renderInput(q, answers[q.questionKey], (val) => handleInputChange(q.questionKey, val))}
            </div>
          );
        })}

        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '20px',
          }}
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}

function renderInput(question, value, onChange) {
  const { type } = question;
  const style = { width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' };

  if (type?.includes('long')) {
    return <textarea value={value || ''} onChange={(e) => onChange(e.target.value)} style={{ ...style, minHeight: '100px' }} />;
  }

  if (type?.includes('select')) {
    const isMulti = type?.includes('multi');
    if (isMulti) {
      const selected = Array.isArray(value) ? value : [];
      return (
        <div>
          {['option1', 'option2', 'option3'].map(opt => (
            <label key={opt} style={{ display: 'block', marginTop: '5px' }}>
              <input type="checkbox" checked={selected.includes(opt)} onChange={(e) => {
                const updated = e.target.checked ? [...selected, opt] : selected.filter(s => s !== opt);
                onChange(updated);
              }} /> {opt}
            </label>
          ))}
        </div>
      );
    }
    return (
      <select value={value || ''} onChange={(e) => onChange(e.target.value)} style={style}>
        <option value="">-- Select --</option>
        {['option1', 'option2', 'option3'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    );
  }

  return <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} style={style} />;
}
