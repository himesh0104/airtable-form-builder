const axios = require('axios');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');

const pendingStates = global.pendingOauthStates || new Map();
if (!global.pendingOauthStates) {
  global.pendingOauthStates = pendingStates;
  const cleaner = setInterval(() => {
    const now = Date.now();
    for (const [state, { expiresAt }] of pendingStates.entries()) {
      if (expiresAt <= now) pendingStates.delete(state);
    }
  }, 60 * 1000);
  if (cleaner.unref) cleaner.unref();
}

function toBase64Url(buffer) {
  return buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function storeState(state, codeVerifier) {
  pendingStates.set(state, {
    codeVerifier,
    expiresAt: Date.now() + 5 * 60 * 1000,
  });
}

function consumeState(state) {
  const record = pendingStates.get(state);
  if (!record) return null;
  pendingStates.delete(state);
  if (record.expiresAt < Date.now()) return null;
  return record.codeVerifier;
}

const AIRTABLE_AUTH_URL = 'https://airtable.com/oauth2/v1/authorize';
const AIRTABLE_TOKEN_URL = 'https://airtable.com/oauth2/v1/token';

exports.getLoginUrl = (req, res) => {
  const state = crypto.randomBytes(16).toString('hex');
  const codeVerifier = toBase64Url(crypto.randomBytes(32));
  const codeChallenge = toBase64Url(crypto.createHash('sha256').update(codeVerifier).digest());

  storeState(state, codeVerifier);

  const params = new URLSearchParams({
    client_id: process.env.AIRTABLE_CLIENT_ID,
    redirect_uri: process.env.AIRTABLE_REDIRECT_URI,
    response_type: 'code',
    scope: 'data.records:read data.records:write',
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });

  const url = `${AIRTABLE_AUTH_URL}?${params.toString()}`;
  res.json({ url, state });
};

exports.callback = async (req, res) => {
  try {
    const { code, state } = req.query;

    if (!code) {
      return res.status(400).json({ error: 'No authorization code' });
    }

    const codeVerifier = consumeState(state);
    if (!codeVerifier) {
      return res.status(400).json({ error: 'Invalid or expired state parameter' });
    }

    // Exchange code for access token
    const tokenRes = await axios.post(AIRTABLE_TOKEN_URL, {
      client_id: process.env.AIRTABLE_CLIENT_ID,
      client_secret: process.env.AIRTABLE_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: process.env.AIRTABLE_REDIRECT_URI,
      code_verifier: codeVerifier,
    });

    const { access_token, refresh_token } = tokenRes.data;

    // Get user info from Airtable
    const userRes = await axios.get('https://api.airtable.com/v0/meta/whoami', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const { id: airtableUserId, email, name } = userRes.data;

    // Find or create user
    let user = await User.findOne({ airtableUserId });
    if (!user) {
      user = new User({
        airtableUserId,
        email,
        name,
        accessToken: access_token,
        refreshToken: refresh_token,
        loggedInAt: new Date(),
      });
    } else {
      user.accessToken = access_token;
      user.refreshToken = refresh_token;
      user.loggedInAt = new Date();
    }

    await user.save();

    // Generate JWT
    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ token: jwtToken, user: { id: user._id, email: user.email, name: user.name } });
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.status(500).json({ error: error.message });
  }
};
