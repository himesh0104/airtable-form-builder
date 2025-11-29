const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
  airtableRecordId: String,
  answers: { type: mongoose.Schema.Types.Mixed },
  status: { type: String, default: 'saved' },
  deletedInAirtable: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

responseSchema.index({ formId: 1 });

module.exports = mongoose.model('Response', responseSchema);
