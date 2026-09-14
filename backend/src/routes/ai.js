const express = require('express');
const Policy = require('../models/Policy');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/policy-ask', auth, async (req, res) => {
  try {
    const question = String(req.body.question || '').trim();
    if (!question) {
      return res.status(400).json({ message: 'question is required' });
    }

    const policies = await Policy.find({ companyId: req.user.companyId });
    const terms = question.toLowerCase().split(/\W+/).filter(Boolean);

    const scored = policies
      .map((policy) => {
        const text = `${policy.title} ${policy.description}`.toLowerCase();
        const score = terms.reduce((count, term) => count + (text.includes(term) ? 1 : 0), 0);
        return { ...policy.toObject(), score };
      })
      .filter((policy) => policy.score > 0)
      .sort((a, b) => b.score - a.score);

    if (!scored.length) {
      return res.json({
        answer: 'I could not find a matching company policy. Please contact your administrator.',
        sources: [],
      });
    }

    return res.json({
      answer: `According to ${scored[0].title}: ${scored[0].description}`,
      sources: scored.slice(0, 3).map((policy) => ({
        title: policy.title,
        description: policy.description,
        fileUrl: policy.fileUrl || null,
      })),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
