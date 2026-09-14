const express = require('express');
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const WhatsAppLog = require('../models/WhatsAppAttendanceLog');
const { auth, adminOnly } = require('../middleware/auth');
const router = express.Router();
const today = () => new Date().toISOString().slice(0, 10);

async function mark(userId, companyId, action, source = 'manual') {
  const date = today();
  let row = await Attendance.findOne({ companyId, userId, date });
  if (!row) row = await Attendance.create({ companyId, userId, date, source, status: 'present' });
  if (action === 'IN') { if (!row.checkIn) row.checkIn = new Date(); }
  else if (!row.checkOut) row.checkOut = new Date();
  row.source = source; await row.save(); return row;
}
router.post('/checkin', auth, async (req,res) => { try { res.json(await mark(req.user._id, req.user.companyId, 'IN')); } catch(e) { res.status(500).json({message:e.message}); } });
router.post('/checkout', auth, async (req,res) => { try { res.json(await mark(req.user._id, req.user.companyId, 'OUT')); } catch(e) { res.status(500).json({message:e.message}); } });
router.get('/my', auth, async (req,res) => { try { res.json(await Attendance.find({ companyId: req.user.companyId, userId: req.user._id }).sort({ date: -1 }).limit(90)); } catch(e) { res.status(500).json({message:e.message}); } });
router.get('/today-all', auth, adminOnly, async (req,res) => { try { const rows = await Attendance.find({ companyId: req.user.companyId, date: today() }).populate('userId','name email empId department'); res.json(rows); } catch(e) { res.status(500).json({message:e.message}); } });
router.post('/whatsapp/webhook', async (req,res) => {
  try {
    const phone = String(req.body.phone || req.body.From || '').replace(/^whatsapp:/, '').trim();
    const message = String(req.body.message || req.body.Body || '').trim().toUpperCase();
    if (!phone || !['IN','OUT'].includes(message)) return res.status(400).json({ message: 'phone and message IN/OUT are required' });
    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: 'Employee not found for phone number' });
    await WhatsAppLog.create({ companyId: user.companyId, userId: user._id, phone, message, timestamp: new Date() });
    const row = await mark(user._id, user.companyId, message, 'whatsapp');
    res.json({ ok: true, attendance: row, reply: `Attendance ${message === 'IN' ? 'check-in' : 'check-out'} recorded.` });
  } catch(e) { res.status(500).json({message:e.message}); }
});
router.post('/_internal/biometric-event', async (req,res) => { res.status(410).json({ message: 'Use /api/biometric/sync' }); });
module.exports = { router, mark };
