const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    sparse: true,
    unique: true,
  },
  password: String,
  name: String,
  airtableUserId: String,
  accessToken: String,
  refreshToken: String,
  loggedInAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);