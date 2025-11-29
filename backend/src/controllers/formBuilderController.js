const Form = require('../models/Form');

exports.createForm = async (req, res) => {
  try {
    const { title, description, airtableBaseId, airtableTableId, questions } = req.body;
    if (!title) return res.status(400).json({ error: 'Title required' });

    const form = new Form({
      title,
      description,
      airtableBaseId,
      airtableTableId,
      questions: questions || [],
      owner: req.userId,
    });

    await form.save();
    res.status(201).json(form);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.formId);
    if (!form) return res.status(404).json({ error: 'Form not found' });
    res.json(form);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateForm = async (req, res) => {
  try {
    const { title, description, questions } = req.body;
    const form = await Form.findById(req.params.formId);
    if (!form) return res.status(404).json({ error: 'Form not found' });
    if (String(form.owner) !== String(req.userId)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    form.title = title || form.title;
    form.description = description !== undefined ? description : form.description;
    if (questions) form.questions = questions;
    form.updatedAt = new Date();

    await form.save();
    res.json(form);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listForms = async (req, res) => {
  try {
    const forms = await Form.find({ owner: req.userId }).sort({ createdAt: -1 });
    res.json(forms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.formId);
    if (!form) return res.status(404).json({ error: 'Form not found' });
    if (String(form.owner) !== String(req.userId)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await Form.findByIdAndDelete(req.params.formId);
    res.json({ message: 'Form deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
