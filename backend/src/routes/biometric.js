const express = require('express');
const BiometricDevice = require('../models/BiometricDevice');
const User = require('../models/User');
const { auth, adminOnly } = require('../middleware/auth');
const { mark } = require('./attendance');
const router = express.Router();
router.get('/devices', auth, adminOnly, async(req,res)=>{ try{res.json(await BiometricDevice.find({companyId:req.user.companyId}).sort({createdAt:-1}));}catch(e){res.status(500).json({message:e.message});} });
router.post('/sync', async(req,res)=>{ try{
  const { companyId, deviceId, type='eSSL', events=[] }=req.body;
  if(!companyId||!deviceId||!['eSSL','Matrix'].includes(type)||!Array.isArray(events)) return res.status(400).json({message:'companyId, deviceId, type and events[] are required'});
  await BiometricDevice.findOneAndUpdate({companyId,deviceId},{companyId,deviceId,type,lastSync:new Date(),status:'online'},{upsert:true,new:true});
  const results=[];
  for(const event of events){ const user=await User.findOne({companyId,empId:String(event.empId||'')}); if(!user) continue; const action=String(event.action||event.type||'IN').toUpperCase(); const row=await mark(user._id,companyId,action==='OUT'?'OUT':'IN','biometric'); results.push(row); }
  res.json({ok:true,synced:results.length,attendance:results});
 }catch(e){res.status(500).json({message:e.message});} });
module.exports=router;
