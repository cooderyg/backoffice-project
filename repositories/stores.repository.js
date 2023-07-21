const { Stores, Categories, Menus, Orders, Reviews } = require('../models');
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
      include: [
        { model: Categories, attributes: ['categoryName'] },
        { model: Menus, attributes: ['menuId', 'menuName', 'imageUrl', 'price'] },
        {
          model: Orders,
          include: [
            {
              model: Reviews,
              attributes: ['rating'],
            },
          ],
        },
      ],
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

  updateStore = async (storeId, storeName, CategoryId, address, imageUrl, isOpen) => {
    await Stores.update(
      { storeName, CategoryId, address, imageUrl, isOpen },
      { where: { storeId } },
    );
  };

  deleteStore = async (storeId) => {
    await Stores.destroy({ where: { storeId } });
    await Menus.destroy({ where: { StoreId: storeId } });
  };

  findAllStoresByString = async (searchString) => {
    const stores = await Stores.findAll({
      where: {
        storeName: { [Op.like]: `%${searchString}%` },
      },
      include: [
        { model: Categories, attributes: ['categoryName'] },
        {
          model: Orders,
          include: [
            {
              model: Reviews,
              attributes: ['rating'],
            },
          ],
        },
      ],
    });
    return stores;
  };

  findStoresByCategoryId = async (CategoryId) => {
    const stores = await Stores.findAll({
      where: { CategoryId },
      include: [
        {
          model: Orders,
          attributes: ['isDelivered'],
          include: [
            {
              model: Reviews,
              attributes: ['rating'],
            },
          ],
        },
      ],
    });
    return stores;
  };

  findAllStores = async () => {
    const stores = await Stores.findAll({
      include: [
        {
          model: Orders,
          attributes: ['isDelivered'],
          include: [
            {
              model: Reviews,
              attributes: ['rating'],
            },
          ],
        },
      ],
    });
    return stores;
  };
}
module.exports = StoreRepository;
