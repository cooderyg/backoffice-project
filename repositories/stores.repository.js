const { Stores } = require('../models');

class StoreRepository {
  findStoreByOwnerId = async (OwnerId) => {
    const store = await Stores.findOne({ where: { OwnerId } });
    return store;
  };

  findStoreByStoreId = async (storeId) => {
    const store = await Stores.findOne({ where: { storeId } });
    return store;
  };

  createStore = async (OwnerId, CategoryId, storeName, address, storeImageUrl, isOpen) => {
    await Stores.create({
      OwnerId,
      CategoryId,
      storeName,
      address,
      storeImageUrl,
      isOpen,
    });
  };

  updateStore = async (storeId, storeName, address, storeImageUrl, isOpen) => {
    await Stores.update({ storeName, address, storeImageUrl, isOpen }, { where: { storeId } });
  };

  deleteStore = async (req, res) => {};
}
module.exports = StoreRepository;
