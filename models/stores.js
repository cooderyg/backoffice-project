'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Stores extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Menus, {
        sourceKey: 'storeId',
        foreignKey: 'StoreId',
      });
      this.hasMany(models.Orders, {
        sourceKey: 'storeId',
        foreignKey: 'StoreId',
      });
      this.belongsTo(models.Categories, {
        targetKey: 'categoryId',
        foreignKey: 'CategoryId',
      });
      this.belongsTo(models.Owners, {
        targetKey: 'ownerId',
        foreignKey: 'OwnerId',
      });
    }
  }
  Stores.init(
    {
      storeId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      OwnerId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      CategoryId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      storeName: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      address: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      imageUrl: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      isOpen: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
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
      modelName: 'Stores',
    },
  );
  return Stores;
};
