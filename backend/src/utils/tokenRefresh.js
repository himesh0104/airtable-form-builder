const axios = require('axios');
const User = require('../models/User');

async function refreshAirtableToken(userId) {
  try {
    const user = await User.findById(userId);
    if (!user || !user.refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post('https://airtable.com/oauth2/v1/token', {
      client_id: process.env.AIRTABLE_CLIENT_ID,
      client_secret: process.env.AIRTABLE_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: user.refreshToken,
    });

    user.accessToken = response.data.access_token;
    user.refreshToken = response.data.refresh_token || user.refreshToken;
    user.loggedInAt = new Date();
    await user.save();

    return user.accessToken;
  } catch (err) {
    console.error('Token refresh failed:', err.message);
    throw err;
  }
}

module.exports = { refreshAirtableToken };
