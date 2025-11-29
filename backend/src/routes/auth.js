const express = require('express');
const { login, signup, me } = require('../controllers/authController');
const { getLoginUrl, callback } = require('../controllers/oauthController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.get('/airtable/login', getLoginUrl);
router.get('/airtable/callback', callback);
router.get('/me', auth, me);

module.exports = router;