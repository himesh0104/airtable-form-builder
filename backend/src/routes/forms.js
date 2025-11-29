const express = require('express');
const auth = require('../middlewares/auth');
const { createForm, getForm, updateForm, listForms, deleteForm } = require('../controllers/formBuilderController');
const router = express.Router();

router.get('/', auth, listForms);
router.get('/:formId', getForm);
router.post('/', auth, createForm);
router.put('/:formId', auth, updateForm);
router.delete('/:formId', auth, deleteForm);

module.exports = router;