const mongoose = require('mongoose');
module.exports = mongoose.model('Attendance', new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  date: { type: String, required: true },
  checkIn: Date,
  checkOut: Date,
  status: { type: String, enum: ['present', 'absent', 'half-day'], default: 'present' },
  source: { type: String, enum: ['biometric', 'whatsapp', 'manual'], default: 'manual' }
}, { timestamps: true }));
