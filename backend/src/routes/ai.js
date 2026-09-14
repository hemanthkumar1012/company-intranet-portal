const express = require('express');
const Policy = require('../models/Policy');
const { auth } = require('../middleware/auth');
const router = express.Router();
router.post('/policy-ask', auth, async(req,res)=>{try{const question=String(req.body.question||'').trim();if(!question)return res.status(400).json({message:'question is required'});const policies=await Policy.find({companyId:req.user.companyId});const terms=question.toLowerCase().split(/\W+/).filter(Boolean);const scored=policies.map(p=>{const text=`${p.title} ${p.description}`.toLowerCase();return {...p.toObject(),score:terms.reduce((n,t)=>n+(text.includes(t)?1:0),0);}}).filter(p=>p.score>0).sort((a,b)=>b.score-a.score);if(!scored.length)return res.json({answer:'I could not find a matching company policy. Please contact your administrator.',sources:[]});res.json({answer:`According to ${scored[0].title}: ${scored[0].description}`,sources:scored.slice(0,3).map(p=>({title:p.title,description:p.description,fileUrl:p.fileUrl||null}))});}catch(e){res.status(500).json({message:e.message});}});
module.exports=router;
