const mongoose = require('mongoose');
module.exports = mongoose.model('BiometricDevice', new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  deviceId: { type: String, required: true },
  type: { type: String, enum: ['eSSL', 'Matrix'], required: true },
  lastSync: Date,
  status: { type: String, enum: ['online', 'offline'], default: 'offline' }
}, { timestamps: true }));
