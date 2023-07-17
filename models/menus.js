'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Menus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.OrderMenus, {
        sourceKey: 'menuId',
        foreignKey: 'MenuId',
      });
      this.belongsTo(models.Stores, {
        targetKey: 'storeId',
        foreignKey: 'StoreId',
      });
    }
  }
  Menus.init(
    {
      menuId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      StoreId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      menuName: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      imageUrl: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      price: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Menus',
    },
  );
  return Menus;
};
