const mongoose = require('mongoose');
module.exports = mongoose.model('User', new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'employee'], default: 'employee' },
  empId: { type: String, required: true },
  phone: { type: String, trim: true },
  department: { type: String, trim: true }
}, { timestamps: true }));
