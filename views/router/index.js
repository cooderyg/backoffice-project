const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  return res.render('index');
});

router.get('/payment', (req, res) => {
  return res.render('payment');
});

router.get('/login', (req, res) => {
  return res.render('login');
});

router.get('/reviewWrite', (req, res) => {
  return res.render('reviewWrite');
});

router.get('/reviewList', (req, res) => {
  return res.render('reviewList');
});

router.get('/cart', (req, res) => {
  return res.render('cart');
});

module.exports = router;
