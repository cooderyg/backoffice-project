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

  createStore = async (OwnerId, CategoryId, storeName, address, imageUrl, isOpen) => {
    await Stores.create({
      OwnerId,
      CategoryId,
      storeName,
      address,
      imageUrl,
      isOpen,
    });
  };

  updateStore = async (storeId, storeName, address, imageUrl, isOpen) => {
    await Stores.update({ storeName, address, imageUrl, isOpen }, { where: { storeId } });
  };

  deleteStore = async (storeId) => {
    await Stores.destroy({ where: { storeId } });
  };
}
module.exports = StoreRepository;
