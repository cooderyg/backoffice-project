const MenuRepository = require('../repositories/menus.repository');

class MenuService {
  menuRepository = new MenuRepository();

  createMenu = async (storeId, menuName, menuImageUrl, price) => {
    await this.menuRepository.createMenu(storeId, menuName, menuImageUrl, price);
  };
}
module.exports = MenuService;
