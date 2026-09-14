const mongoose = require('mongoose');
module.exports = mongoose.model('Company', new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  subdomain: { type: String, required: true, unique: true, lowercase: true, trim: true }
}, { timestamps: true }));
