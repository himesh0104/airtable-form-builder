const express = require('express');
const { login, signup } = require('../controllers/authController');
const { getLoginUrl, callback } = require('../controllers/oauthController');

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.get('/airtable/login', getLoginUrl);
router.get('/airtable/callback', callback);

module.exports = router;