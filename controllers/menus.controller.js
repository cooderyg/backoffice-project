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
      if (e.errorCode) return res.status(e.errorCode).json(e.message);
      res.status(500).json(e.message);
    }
  };

  getMenu = async (req, res) => {
    const { storeId } = req.params;
    const { ownerId } = req.body;

    try {
      const menus = await this.menuService.findAllMenus(ownerId, storeId);
      res.json({ menus });
    } catch (e) {
      if (e.errorCode) return res.status(e.errorCode).json(e.message);
      res.status(500).json(e.message);
    }
  };

  updateMenu = async (req, res) => {
    const { storeId, menuId } = req.params;
    const { ownerId, menuName, imageUrl, price } = req.body;
    try {
      const updatedMenu = await this.menuService.updateMenu(
        storeId,
        menuId,
        ownerId,
        menuName,
        imageUrl,
        price,
      );
      res.json({ message: '메뉴가 수정되었습니다.' });
    } catch (e) {
      if (e.errorCode) return res.status(e.errorCode).json(e.message);
      res.status(500).json(e.message);
    }
  };

  deleteMenu = async (req, res) => {
    const { storeId, menuId } = req.params;
    const { ownerId } = req.body;
  };
}
module.exports = MenuController;
