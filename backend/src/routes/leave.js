const express = require('express');
const Leave = require('../models/Leave');
const { auth, adminOnly } = require('../middleware/auth');
const router = express.Router();
router.post('/apply', auth, async (req,res)=>{ try { const { type, fromDate, toDate, reason }=req.body; if(!['sick','casual'].includes(type)||!fromDate||!toDate||!reason) return res.status(400).json({message:'type, fromDate, toDate and reason are required'}); if(new Date(toDate)<new Date(fromDate)) return res.status(400).json({message:'Invalid date range'}); res.status(201).json(await Leave.create({companyId:req.user.companyId,userId:req.user._id,type,fromDate,toDate,reason,status:'pending'})); } catch(e){res.status(500).json({message:e.message});} });
router.get('/list', auth, async (req,res)=>{ try { const filter={companyId:req.user.companyId}; if(req.user.role!=='admin') filter.userId=req.user._id; res.json(await Leave.find(filter).populate('userId','name empId email').sort({createdAt:-1})); } catch(e){res.status(500).json({message:e.message});} });
router.put('/:id/approve', auth, adminOnly, async(req,res)=>{ try { const row=await Leave.findOneAndUpdate({_id:req.params.id,companyId:req.user.companyId},{status:'approved'},{new:true}).populate('userId','name empId'); if(!row)return res.status(404).json({message:'Leave request not found'}); res.json(row); } catch(e){res.status(500).json({message:e.message});} });
module.exports=router;
