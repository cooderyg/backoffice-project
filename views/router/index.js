const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  return res.render('index', { login: 0 });
});

module.exports = router;
