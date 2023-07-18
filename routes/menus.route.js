const express = require('express');
const router = express.Router();

const MenuController = require('../controllers/menus.controller');
const menuController = new MenuController();

// 메뉴 등록
router.post('/stores/:storeId/menus', menuController.postMenu);

// 메뉴 목록 조회
router.get('/stores/:storeId/menus', menuController.getMenu);

// 메뉴 수정
router.put('/stores/:storeId/menus/:menuId', menuController.updateMenu);

// 메뉴 삭제
router.delete('/stores/:storeId/menus/:menuId', menuController.deleteMenu);

module.exports = router;
