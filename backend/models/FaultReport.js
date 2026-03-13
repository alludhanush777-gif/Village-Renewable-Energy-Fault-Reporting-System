const mongoose = require('mongoose');

const faultReportSchema = new mongoose.Schema({
  reporterID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  technicianID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  villageID: { type: String, required: true },
  images: [{ type: String }], // URLs to stored images
  voiceNote: { type: String }, // URL to stored audio
  description: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [lng, lat]
  },
  status: { 
    type: String, 
    enum: ['PENDING', 'IN-PROGRESS', 'RESOLVED'], 
    default: 'PENDING' 
  },
  riskLevel: { 
    type: String, 
    enum: ['LOW', 'MEDIUM', 'CRITICAL'], 
    default: 'LOW' 
  },
  createdAt: { type: Date, default: Date.now }
});

faultReportSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('FaultReport', faultReportSchema);
