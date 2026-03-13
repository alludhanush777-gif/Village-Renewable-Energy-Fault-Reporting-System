const mongoose = require('mongoose');

const maintenanceLogSchema = new mongoose.Schema({
  faultID: { type: mongoose.Schema.Types.ObjectId, ref: 'FaultReport', required: true },
  technicianID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  partsReplaced: [{ type: String }],
  repairNotes: { type: String },
  completionPhoto: { type: String }, // URL
  completedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MaintenanceLog', maintenanceLogSchema);
