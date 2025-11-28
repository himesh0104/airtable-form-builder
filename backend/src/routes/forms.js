const express = require('express');
const auth = require('../middlewares/auth');
const { getForms, getForm, createForm, updateForm, deleteForm } = require('../controllers/formController');
const router = express.Router();

router.get('/', auth, getForms);
router.get('/:id', getForm);
router.post('/', auth, createForm);
router.put('/:id', auth, updateForm);
router.delete('/:id', auth, deleteForm);

module.exports = router;