const express = require('express');
const router = express.Router();
const { Users } = require('../models');
const authMiddleware = require('../middlewares/auth-middleware');

router.get('/users-info', authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  try {
    const user = await Users.findOne({
      where: { userId },
      attributes: ['userId', 'point'],
    });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
