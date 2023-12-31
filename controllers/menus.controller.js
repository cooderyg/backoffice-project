const MenuService = require('../services/menus.service');

class MenuController {
  menuService = new MenuService();

  postMenu = async (req, res) => {
    const { storeId } = req.params;
    const { menuName, imageUrl, price } = req.body;

    try {
      await this.menuService.createMenu(storeId, menuName, imageUrl, price);
      res.json({ message: '메뉴가 추가되었습니다.' });
    } catch (e) {
      if (e.errorCode) return res.status(e.errorCode).json({ message: e.message });
      res.status(500).json({ message: e.message });
    }
  };

  getMenu = async (req, res) => {
    const { storeId } = req.params;

    try {
      const menus = await this.menuService.findAllMenus(storeId);
      res.json({ menus });
    } catch (e) {
      if (e.errorCode) return res.status(e.errorCode).json({ message: e.message });
      res.status(500).json({ message: e.message });
    }
  };

  getOneMenu = async (req, res) => {
    const { menuId } = req.params;

    try {
      const menu = await this.menuService.findOneMenu(menuId);
      res.json({ menu });
    } catch (e) {
      if (e.errorCode) return res.status(e.errorCode).json({ message: e.message });
      res.status(500).json({ message: e.message });
    }
  };

  updateMenu = async (req, res) => {
    const { storeId, menuId } = req.params;
    const { ownerId } = res.locals.owner;
    const { menuName, imageUrl, price } = req.body;
    try {
      await this.menuService.updateMenu(storeId, menuId, ownerId, menuName, imageUrl, price);
      res.json({ message: '메뉴가 수정되었습니다.' });
    } catch (e) {
      if (e.errorCode) return res.status(e.errorCode).json({ message: e.message });
      res.status(500).json({ message: e.message });
    }
  };

  deleteMenu = async (req, res) => {
    const { storeId, menuId } = req.params;
    const { ownerId } = res.locals.owner;

    try {
      await this.menuService.deleteMenu(storeId, menuId, ownerId);
      res.json({ message: '메뉴가 삭제되었습니다.' });
    } catch (e) {
      if (e.errorCode) return res.status(e.errorCode).json({ message: e.message });
      res.status(500).json({ message: e.message });
    }
  };

  getMenus = async (req, res) => {
    const menulist = req.cookies.menus;
    // const menulist = [{ id: 1 }, { id: 2 }, { id: 4 }, { id: 6 }];
    const menuIds = menulist.map((item) => {
      return Number(item.id);
    });
    try {
      const menus = await this.menuService.getMenus(menuIds);
      res.json({ menus });
    } catch (e) {
      if (e.errorCode) return res.status(e.errorCode).json({ message: e.message });
      res.status(500).json({ message: e.message });
    }
  };
}
module.exports = MenuController;
