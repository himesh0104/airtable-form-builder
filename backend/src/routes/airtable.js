const express = require('express');
const auth = require('../middlewares/auth');
const { getBases, getTables, getFields } = require('../controllers/airtableController');

const router = express.Router();

router.get('/bases', auth, getBases);
router.get('/tables', auth, getTables);
router.get('/fields', auth, getFields);

module.exports = router;