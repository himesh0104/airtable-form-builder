const axios = require('axios');
const User = require('../models/User');
const { refreshAirtableToken } = require('../utils/tokenRefresh');

const META_BASE = 'https://api.airtable.com/v0/meta';

function ensureToken(user) {
  const token = user?.accessToken;
  if (!token) throw new Error('No Airtable token available for this user');
  return token;
}

async function makeAirtableRequest(fn, userId) {
  try {
    return await fn();
  } catch (err) {
    if (err.response?.status === 401) {
      const newToken = await refreshAirtableToken(userId);
      return await fn(newToken);
    }
    throw err;
  }
}

exports.getBases = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const token = ensureToken(user);

    const result = await makeAirtableRequest(
      async (newToken) => {
        return await axios.get(`${META_BASE}/bases`, {
          headers: { Authorization: `Bearer ${newToken || token}` },
        });
      },
      req.userId
    );

    const bases = (result.data?.bases || []).map(b => ({ id: b.id, name: b.name }));
    res.json({ bases });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getTables = async (req, res) => {
  try {
    const { baseId } = req.query;
    if (!baseId) return res.status(400).json({ error: 'baseId is required' });

    const user = await User.findById(req.userId);
    const token = ensureToken(user);

    const result = await makeAirtableRequest(
      async (newToken) => {
        return await axios.get(`${META_BASE}/bases/${baseId}/tables`, {
          headers: { Authorization: `Bearer ${newToken || token}` },
        });
      },
      req.userId
    );

    const tables = (result.data?.tables || []).map(t => ({ id: t.id, name: t.name }));
    res.json({ tables });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getFields = async (req, res) => {
  try {
    const { baseId, tableId } = req.query;
    if (!baseId || !tableId) return res.status(400).json({ error: 'baseId and tableId required' });

    const user = await User.findById(req.userId);
    const token = ensureToken(user);

    const result = await makeAirtableRequest(
      async (newToken) => {
        return await axios.get(`${META_BASE}/bases/${baseId}/tables/${tableId}`, {
          headers: { Authorization: `Bearer ${newToken || token}` },
        });
      },
      req.userId
    );

    const fields = (result.data?.fields || []).filter(f => {
      const t = (f.type || '').toLowerCase();
      return t.includes('text') || t.includes('select') || t.includes('attach');
    }).map(f => ({ id: f.id, name: f.name, type: f.type }));

    res.json({ fields });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};