'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.OrderMenus, {
        sourceKey: 'orderId',
        foreignKey: 'OrderId',
      });
      this.hasOne(models.Reviews, {
        sourceKey: 'orderId',
        foreignKey: 'OrderId',
      });
      this.belongsTo(models.Stores, {
        targetKey: 'storeId',
        foreignKey: 'StoreId',
      });
      this.belongsTo(models.Users, {
        targetKey: 'userId',
        foreignKey: 'UserId',
      });
    }
  }
  Orders.init(
    {
      orderId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      StoreId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      UserId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      address: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      isDelivered: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      totalPrice: {
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
      modelName: 'Orders',
    },
  );
  return Orders;
};
