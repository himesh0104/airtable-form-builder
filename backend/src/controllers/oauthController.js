const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const AIRTABLE_AUTH_URL = 'https://airtable.com/oauth2/v1/authorize';
const AIRTABLE_TOKEN_URL = 'https://airtable.com/oauth2/v1/token';

exports.getLoginUrl = (req, res) => {
  const state = Math.random().toString(36).substring(7);
  const params = new URLSearchParams({
    client_id: process.env.AIRTABLE_CLIENT_ID,
    redirect_uri: process.env.AIRTABLE_REDIRECT_URI,
    response_type: 'code',
    scope: 'data.records:read data.records:write',
    state,
  });

  const url = `${AIRTABLE_AUTH_URL}?${params.toString()}`;
  res.json({ url, state });
};

exports.callback = async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ error: 'No authorization code' });
    }

    // Exchange code for access token
    const tokenRes = await axios.post(AIRTABLE_TOKEN_URL, {
      client_id: process.env.AIRTABLE_CLIENT_ID,
      client_secret: process.env.AIRTABLE_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: process.env.AIRTABLE_REDIRECT_URI,
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
