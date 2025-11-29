require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, mongoose } = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/forms', require('./routes/forms'));
app.use('/api/forms', require('./routes/responses'));
app.use('/api/airtable', require('./routes/airtable'));
app.use('/api/webhooks', require('./routes/webhooks'));

app.get('/api/health', async (req, res) => {
  try {
    await connectDB();
    const readyMap = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };
    res.json({ status: 'ok', mongodb: readyMap[mongoose.connection.readyState] || 'unknown' });
  } catch (err) {
    res.status(500).json({ status: 'error', mongodb: 'disconnected', error: err.message });
  }
});

module.exports = app;
