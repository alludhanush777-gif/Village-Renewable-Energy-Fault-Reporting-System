const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  performer: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, required: true }
  },
  target: {
    type: { type: String }, // e.g., 'Ticket', 'Technician', 'System'
    id: { type: String }
  },
  details: { type: mongoose.Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AuditLog', AuditLogSchema);
