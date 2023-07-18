const { Menus } = require('../models');

class MenuRepository {
  createMenu = async (StoreId, menuName, imageUrl, price) => {
    await Menus.create({ StoreId, menuName, imageUrl, price });
  };

  findMenuByMenuName = async (menuName) => {
    const menu = await Menus.findOne({ where: { menuName } });
    return menu;
  };

  findAllMenus = async (StoreId) => {
    const menus = await Menus.findAll({ where: { StoreId } });
    return menus;
  };

  findOneMenu = async (menuId) => {
    const menu = await Menus.findOne({ where: { menuId } });
    return menu;
  };

  updateMenu = async (menuId, menuName, imageUrl, price) => {
    await Menus.update({ menuName, imageUrl, price }, { where: { menuId } });
  };

  deleteMenu = async (menuId) => {
    await Menus.destroy({ where: { menuId } });
  };
}
module.exports = MenuRepository;
