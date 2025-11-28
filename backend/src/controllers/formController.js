const Form = require('../models/Form');

exports.getForms = async (req, res) => {
  try {
    const forms = await Form.find({ owner: req.userId });
    res.json(forms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    res.json(form);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createForm = async (req, res) => {
  try {
    const { title, description, fields } = req.body;
    const form = new Form({
      title,
      description,
      fields: fields || [],
      owner: req.userId,
    });
    await form.save();
    res.status(201).json(form);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateForm = async (req, res) => {
  try {
    const { title, description, fields } = req.body;
    const form = await Form.findByIdAndUpdate(
      req.params.id,
      { title, description, fields, updatedAt: new Date() },
      { new: true }
    );
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    res.json(form);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteForm = async (req, res) => {
  try {
    const form = await Form.findByIdAndDelete(req.params.id);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    res.json({ message: 'Form deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
