const mongoose = require('mongoose');
const schema = new mongoose.Schema({ companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true }, title: { type: String, required: true }, description: { type: String, required: true }, fileUrl: String }, { timestamps: true });
module.exports = mongoose.model('Policy', schema);
