const crypto = require('crypto');
const Response = require('../models/Response');

function verifyWebhookSignature(req) {
  const secret = process.env.WEBHOOK_SECRET;
  if (!secret) return true;

  const signature = req.headers['x-airtable-content-mac'];
  if (!signature) return false;

  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(req.body);
  const expected = 'v0=' + hmac.digest('base64');

  return crypto.timingSafeEqual(signature, expected);
}

exports.handleWebhook = async (req, res) => {
  try {
    if (!verifyWebhookSignature(req)) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

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
