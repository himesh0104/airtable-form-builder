const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionKey: { type: String, required: true }, // internal key
  airtableFieldId: { type: String, required: true },
  label: { type: String, required: true },
  type: { type: String, required: true },
  required: { type: Boolean, default: false },
  conditionalRules: { type: mongoose.Schema.Types.Mixed, default: null },
});

const formSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  airtableBaseId: String,
  airtableTableId: String,
  questions: [questionSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

formSchema.index({ owner: 1 });

module.exports = mongoose.model('Form', formSchema);