const express = require('express');
const router = express.Router();

const MenuController = require('../controllers/menus.controller');
const menuController = new MenuController();

router.post('/stores/:storeId/menus', menuController.postMenu);

module.exports = router;
