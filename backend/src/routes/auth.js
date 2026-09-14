const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Company = require('../models/Company');
const User = require('../models/User');
const Policy = require('../models/Policy');
const { auth, adminOnly } = require('../middleware/auth');
const router = express.Router();
const tokenFor = user => jwt.sign({ userId: user._id.toString(), role: user.role, companyId: user.companyId.toString() }, process.env.JWT_SECRET, { expiresIn: '7d' });

router.post('/company-register', async (req,res) => {
  try {
    const { name, subdomain, adminName, email, password, phone } = req.body;
    if (!name || !subdomain || !adminName || !email || !password) return res.status(400).json({ message: 'name, subdomain, adminName, email and password are required' });
    const cleanSub = subdomain.toLowerCase().trim().replace(/[^a-z0-9-]/g, '');
    if (!cleanSub) return res.status(400).json({ message: 'Invalid subdomain' });
    if (await Company.exists({ subdomain: cleanSub })) return res.status(409).json({ message: 'Subdomain already registered' });
    const company = await Company.create({ name, subdomain: cleanSub });
    const user = await User.create({ companyId: company._id, name: adminName, email: email.toLowerCase(), passwordHash: await bcrypt.hash(password, 12), role: 'admin', empId: 'ADM-001', phone });
    await Policy.insertMany([
      { companyId: company._id, title: 'Attendance Policy', description: 'Employees should check in and out daily. Attendance can be recorded manually, by WhatsApp, or by supported biometric devices.' },
      { companyId: company._id, title: 'Leave Policy', description: 'Sick and casual leave requests are submitted by employees and approved by an administrator.' }
    ]);
    res.status(201).json({ token: tokenFor(user), companyId: company._id, role: user.role, user: { id: user._id, name: user.name, email: user.email } });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/login', async (req,res) => {
  try {
    const { subdomain, email, password } = req.body;
    const company = await Company.findOne({ subdomain: String(subdomain || '').toLowerCase() });
    const user = company && await User.findOne({ companyId: company._id, email: String(email || '').toLowerCase() });
    if (!company || !user || !(await bcrypt.compare(password || '', user.passwordHash))) return res.status(401).json({ message: 'Invalid subdomain, email, or password' });
    res.json({ token: tokenFor(user), companyId: company._id, role: user.role, user: { id: user._id, name: user.name, email: user.email, empId: user.empId, department: user.department } });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/add-employee', auth, adminOnly, async (req,res) => {
  try {
    const { name, email, password, empId, phone, department } = req.body;
    if (!name || !email || !password || !empId) return res.status(400).json({ message: 'name, email, password and empId are required' });
    const user = await User.create({ companyId: req.user.companyId, name, email: email.toLowerCase(), passwordHash: await bcrypt.hash(password, 12), role: 'employee', empId, phone, department });
    res.status(201).json({ id: user._id, name: user.name, email: user.email, empId: user.empId, department: user.department });
  } catch (e) { res.status(500).json({ message: e.message }); }
});
module.exports = router;
