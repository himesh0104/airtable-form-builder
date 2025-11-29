const Form = require('../models/Form');
const Response = require('../models/Response');
const axios = require('axios');
const User = require('../models/User');
const { refreshAirtableToken } = require('../utils/tokenRefresh');

async function validateSelectOptions(baseId, tableId, fieldId, value, token) {
  try {
    const response = await axios.get(
      `https://api.airtable.com/v0/meta/bases/${baseId}/tables/${tableId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const field = response.data.fields.find(f => f.id === fieldId);
    if (!field || !field.options?.choices) return true;

    const allowedValues = field.options.choices.map(c => c.name);
    const valuesArray = Array.isArray(value) ? value : [value];
    
    return valuesArray.every(v => allowedValues.includes(v));
  } catch (err) {
    console.error('Option validation error:', err.message);
    return true;
  }
}

exports.submitResponse = async (req, res) => {
  try {
    const { formId } = req.params;
    const { answers } = req.body;

    const form = await Form.findById(formId);
    if (!form) return res.status(404).json({ error: 'Form not found' });

    let user = await User.findById(form.owner);
    if (!user?.accessToken) {
      return res.status(400).json({ error: 'Form owner has no Airtable connection' });
    }

    let token = user.accessToken;

    // Map answers to Airtable field format
    const airtableRecord = {};
    form.questions?.forEach(q => {
      if (answers[q.questionKey] != null) {
        airtableRecord[q.airtableFieldId] = answers[q.questionKey];
      }
    });

    // Create record in Airtable
    let airtableRecordId;
    try {
      const res = await axios.post(
        `https://api.airtable.com/v0/${form.airtableBaseId}/${form.airtableTableId}`,
        { fields: airtableRecord },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      airtableRecordId = res.data.id;
    } catch (err) {
      if (err.response?.status === 401) {
        token = await refreshAirtableToken(form.owner);
        const res = await axios.post(
          `https://api.airtable.com/v0/${form.airtableBaseId}/${form.airtableTableId}`,
          { fields: airtableRecord },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        airtableRecordId = res.data.id;
      } else {
        console.error('Airtable API error:', err.response?.data || err.message);
        return res.status(400).json({ error: 'Failed to save to Airtable' });
      }
    }

    // Save response in DB
    const response = new Response({
      formId,
      airtableRecordId,
      answers,
      status: 'saved',
    });

    await response.save();
    res.status(201).json({ responseId: response._id, airtableRecordId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getResponses = async (req, res) => {
  try {
    const { formId } = req.params;
    const responses = await Response.find({ formId }).sort({ createdAt: -1 });
    res.json(responses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};