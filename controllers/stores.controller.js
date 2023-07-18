const StoreService = require('../services/stores.service');

class StoreController {
  storeService = new StoreService();

  // 가게 정보 조회
  getStore = async (req, res) => {
    // const { ownerId } = res.locals.owner;
    const { ownerId } = req.body;

    try {
      const store = await this.storeService.findStoreByOwnerId(ownerId);
      res.json({ store });
    } catch (e) {
      if (e.errorCode) return res.status(e.errorCode).json(e.message);

      res.status(500).json(e.message);
    }
  };

  // 가게 정보 등록
  postStore = async (req, res) => {
    // const { ownerId } = res.locals.owner
    const { ownerId, categoryId, storeName, address, imageUrl, isOpen } = req.body;

    try {
      await this.storeService.createStore(
        ownerId,
        categoryId,
        storeName,
        address,
        imageUrl,
        isOpen,
      );

      res.json({ message: '가게가 등록되었습니다.' });
    } catch (e) {
      if (e.errorCode) return res.status(e.errorCode).json(e.message);
      res.status(500).json(e.message);
    }
  };

  updateStore = async (req, res) => {
    // const { ownerId } = res.locals.owner;
    const { storeId } = req.params;
    const { ownerId, storeName, address, imageUrl, isOpen } = req.body;

    try {
      await this.storeService.updateStore(ownerId, storeId, storeName, address, imageUrl, isOpen);
      res.json({ message: '가게 정보가 수정되었습니다.' });
    } catch (e) {
      if (e.errorCode) return res.status(e.errorCode).json(e.message);
      res.status(500).json(e.message);
    }
  };

  deleteStore = async (req, res) => {
    // const { ownerId } = res.locals.owner;
    const { storeId } = req.params;
    const { ownerId } = req.body;

    try {
      await this.storeService.deleteStore(ownerId, storeId);
      res.json({ message: '가게 정보가 삭제되었습니다.' });
    } catch (e) {
      if (e.errorCode) return res.status(e.errorCode).json(e.message);
      res.status(500).json(e.message);
    }
  };

  searchStores = async (req, res) => {
    const { searchString } = req.body;

    try {
      const stores = await this.storeService.findStores(searchString);
      res.json({ stores });
    } catch (e) {
      if (e.errorCode) return res.status(e.errorCode).json(e.message);
      res.status(500).json(e.message);
    }
  };
}
module.exports = StoreController;
