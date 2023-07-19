const { Stores, Categories } = require('../models');
const { Op } = require('sequelize');

class StoreRepository {
  findStoreByOwnerId = async (OwnerId) => {
    const store = await Stores.findOne({
      where: { OwnerId },
      include: [{ model: Categories, attributes: ['categoryName'] }],
    });
    return store;
  };

  findStoreByStoreId = async (storeId) => {
    const store = await Stores.findOne({
      where: { storeId },
      include: [{ model: Categories, attributes: ['categoryName'] }],
    });
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

  findAllStoresByString = async (searchString) => {
    const stores = await Stores.findAll({
      where: {
        storeName: { [Op.like]: `%${searchString}%` },
      },
      include: [{ model: Categories, attributes: ['categoryName'] }],
    });
    return stores;
  };
}
module.exports = StoreRepository;
