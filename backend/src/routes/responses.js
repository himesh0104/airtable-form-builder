const express = require('express');
const { submitResponse, getResponses } = require('../controllers/responseController');

const router = express.Router();

router.post('/:formId/submit', submitResponse);
router.get('/:formId/responses', getResponses);

module.exports = router;
