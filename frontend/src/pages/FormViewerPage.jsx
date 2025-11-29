import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import { shouldShowQuestion } from '../utils/conditional';

export default function FormViewerPage() {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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
      await api.post(`/forms/${formId}/submit`, { answers });
      setSubmitted(true);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading form...</div>;
  if (!form) return <div className="form-viewer"><div className="form-viewer-card"><div className="error-message">Form not found</div></div></div>;

  if (submitted) {
    return (
      <div className="form-viewer">
        <div className="form-viewer-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>✓</div>
          <h2 style={{ color: '#065f46' }}>Thank You!</h2>
          <p style={{ color: '#6b7280', marginBottom: '20px' }}>Your response has been received and saved successfully.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="form-viewer">
      <div className="form-viewer-card">
        <h2>{form.title}</h2>
        {form.description && <p className="form-description">{form.description}</p>}

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {form.questions?.map(q => {
            const show = shouldShowQuestion(q.conditionalRules, answers);
            if (!show) return null;

            return (
              <div key={q.questionKey} className="question-group">
                <div className="question-label">
                  {q.label}
                  {q.required && <span className="required-badge">*</span>}
                </div>
                {renderInput(q, answers[q.questionKey], (val) => handleInputChange(q.questionKey, val))}
              </div>
            );
          })}

          <div className="submit-buttons">
            <button type="submit" className="btn btn-primary" disabled={submitting} style={{ flex: 1 }}>
              {submitting ? 'Submitting...' : 'Submit Response'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function renderInput(question, value, onChange) {
  const { type } = question;

  if (type?.includes('long')) {
    return <textarea value={value || ''} onChange={(e) => onChange(e.target.value)} className="question-input" style={{ minHeight: '120px', resize: 'vertical' }} />;
  }

  if (type?.includes('select')) {
    const isMulti = type?.includes('multi');
    if (isMulti) {
      const selected = Array.isArray(value) ? value : [];
      return (
        <div className="checkbox-group">
          {['option1', 'option2', 'option3'].map(opt => (
            <div key={opt} className="checkbox-item">
              <input 
                type="checkbox" 
                id={opt}
                checked={selected.includes(opt)} 
                onChange={(e) => {
                  const updated = e.target.checked ? [...selected, opt] : selected.filter(s => s !== opt);
                  onChange(updated);
                }} 
              />
              <label htmlFor={opt}>{opt}</label>
            </div>
          ))}
        </div>
      );
    }
    return (
      <select value={value || ''} onChange={(e) => onChange(e.target.value)} className="question-input">
        <option value="">-- Select an option --</option>
        {['option1', 'option2', 'option3'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    );
  }

  return <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} className="question-input" />;
}
