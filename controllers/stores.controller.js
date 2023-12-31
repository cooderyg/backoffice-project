const StoreService = require('../services/stores.service');

class StoreController {
  storeService = new StoreService();

  // 가게 정보 조회

  getStoreByOwnerId = async (req, res) => {
    const { ownerId } = res.locals.owner;

    try {
      const store = await this.storeService.findStoreByOwnerId(ownerId);
      res.json({ store });
    } catch (e) {
      if (e.errorCode) return res.status(e.errorCode).json({ message: e.message });
      res.status(500).json({ message: e.message });
    }
  };
  getStoreByStoreId = async (req, res) => {
    const { storeId } = req.params;

    try {
      const store = await this.storeService.findStoreByStoreId(storeId);
      res.json({ store });
    } catch (e) {
      if (e.errorCode) return res.status(e.errorCode).json({ message: e.message });
      res.status(500).json({ message: e.message });
    }
  };

  // 가게 정보 등록
  postStore = async (req, res) => {
    const { ownerId } = res.locals.owner;
    const { categoryId, storeName, address, imageUrl, isOpen } = req.body;
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
      if (e.errorCode) return res.status(e.errorCode).json({ message: e.message });
      res.status(500).json({ message: e.message });
    }
  };

  updateStore = async (req, res) => {
    const { ownerId } = res.locals.owner;
    const { storeId } = req.params;
    const { storeName, CategoryId, address, imageUrl, isOpen } = req.body;

    try {
      await this.storeService.updateStore(
        ownerId,
        storeId,
        storeName,
        CategoryId,
        address,
        imageUrl,
        isOpen,
      );
      res.json({ message: '가게 정보가 수정되었습니다.' });
    } catch (e) {
      if (e.errorCode) return res.status(e.errorCode).json({ message: e.message });
      res.status(500).json({ message: e.message });
    }
  };

  deleteStore = async (req, res) => {
    const { ownerId } = res.locals.owner;
    const { storeId } = req.params;

    try {
      await this.storeService.deleteStore(ownerId, storeId);
      res.json({ message: '가게 정보가 삭제되었습니다.' });
    } catch (e) {
      if (e.errorCode) return res.status(e.errorCode).json({ message: e.message });
      res.status(500).json({ message: e.message });
    }
  };

  searchStores = async (req, res) => {
    const { searchString } = req.query;

    try {
      const stores = await this.storeService.findStores(searchString);
      res.json({ stores });
    } catch (e) {
      if (e.errorCode) return res.status(e.errorCode).json({ message: e.message });
      res.status(500).json({ message: e.message });
    }
  };

  getStoresByCategoryId = async (req, res) => {
    const { categoryId } = req.params;

    try {
      const stores = await this.storeService.findStoresByCategoryId(categoryId);
      res.json({ stores });
    } catch (e) {
      if (e.errorCode) return res.status(e.errorCode).json({ message: e.message });
      res.status(500).json({ message: e.message });
    }
  };

  getAllStores = async (req, res) => {
    try {
      const stores = await this.storeService.findAllStores();
      res.json({ stores });
    } catch (e) {
      if (e.errorCode) return res.status(e.errorCode).json({ message: e.message });
      res.status(500).json({ message: e.message });
    }
  };
}
module.exports = StoreController;
