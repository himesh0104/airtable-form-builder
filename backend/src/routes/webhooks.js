const express = require('express');
const { handleWebhook } = require('../controllers/webhookController');

const router = express.Router();

router.post('/airtable', handleWebhook);

module.exports = router;
