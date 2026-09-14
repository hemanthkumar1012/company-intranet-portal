require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const attendanceRoutes = require('./routes/attendance').router;
const leaveRoutes = require('./routes/leave');
const biometricRoutes = require('./routes/biometric');
const payslipRoutes = require('./routes/payslip');
const aiRoutes = require('./routes/ai');

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : true }));
app.use(express.json({ limit: '2mb' }));
app.get('/api/health', (_req,res)=>res.json({ok:true,service:'company-intranet-backend'}));
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/biometric', biometricRoutes);
app.use('/api/payslip', payslipRoutes);
app.use('/api/ai', aiRoutes);
app.use((err,_req,res,_next)=>res.status(500).json({message:err.message||'Internal server error'}));

const port = process.env.PORT || 5000;
connectDB().then(()=>app.listen(port,()=>console.log(`API listening on ${port}`))).catch(err=>{console.error(err);process.exit(1);});
