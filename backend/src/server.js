require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
})
.then(() => {
  console.log('✓ MongoDB connected successfully');
})
.catch(err => {
  console.error('✗ MongoDB connection error:');
  if (err.message.includes('whitelisted')) {
    console.error('  → Your IP is not whitelisted in MongoDB Atlas');
    console.error('  → Run: npx open https://cloud.mongodb.com');
    console.error('  → Go to Network Access and add your IP');
  } else if (err.message.includes('authentication')) {
    console.error('  → Invalid username or password in MONGODB_URI');
  } else {
    console.error('  →', err.message);
  }
  console.error('\nFix: See MONGODB_FIX.md for detailed instructions');
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/forms', require('./routes/forms'));
app.use('/api/forms', require('./routes/responses'));
app.use('/api/airtable', require('./routes/airtable'));
app.use('/api/webhooks', require('./routes/webhooks'));
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  if (!process.env.JWT_SECRET) {
    console.warn('⚠ Warning: JWT_SECRET not set in .env');
  }
});