const express = require('express');
const router = express.Router();

const StoreController = require('../controllers/stores.controller');
const storeController = new StoreController();

//auth-middleware 있다 치자.
// 사장님의 ownerId를 전달하는 미들웨어를 등록, 수정 , 삭제에 넣는다.

// 가게 등록
router.post('/stores', storeController.postStore);

// 가게 정보 조회
router.get('/stores/:storeId', storeController.getStore);
// get에 파라미터가 필요할까?

// 가게 정보 수정
router.put('/stores/:storeId', storeController.updateStore);

// 가게 삭제
router.delete('/stores/:storeId', storeController.deleteStore);

module.exports = router;
