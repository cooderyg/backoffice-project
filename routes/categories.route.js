const express = require('express');
const router = express.Router();
const { Categories } = require('../models');

router.post('/categories', async (req, res) => {
  try {
    const { categoryName } = req.body;
    const category = await Categories.findOne({ where: { categoryName } });

    if (category)
      return res.status(409).json({ message: '이미 해당이름의 카테고리가 존재합니다.' });

    const result = await Categories.create({ categoryName });
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const categories = await Categories.findAll({});
    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
