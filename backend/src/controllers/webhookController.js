const Response = require('../models/Response');

exports.handleWebhook = async (req, res) => {
  try {
    const { records } = req.body;
    if (!records) return res.json({ ok: true });

    for (const record of records) {
      const { id, createdTables, changedTables, destroyedTableIds } = record;

      // Handle field updates
      if (changedTables && changedTables.length > 0) {
        const responses = await Response.find({ airtableRecordId: id });
        responses.forEach(r => {
          r.updatedAt = new Date();
          r.save().catch(err => console.error('Error updating response:', err));
        });
      }

      // Handle deletions
      if (destroyedTableIds && destroyedTableIds.length > 0) {
        await Response.updateMany(
          { airtableRecordId: id },
          { deletedInAirtable: true, updatedAt: new Date() }
        );
      }
    }

    res.json({ ok: true });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).json({ error: err.message });
  }
};
