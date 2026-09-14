const mongoose = require('mongoose');
module.exports = mongoose.model('WhatsAppAttendanceLog', new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  phone: { type: String, required: true },
  message: { type: String, enum: ['IN', 'OUT'], required: true },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true }));
