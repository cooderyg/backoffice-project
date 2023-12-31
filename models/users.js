'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Reviews, {
        sourceKey: 'userId',
        foreignKey: 'UserId',
      });
      this.hasMany(models.Orders, {
        sourceKey: 'userId',
        foreignKey: 'UserId',
      });
      this.hasMany(models.PointTransactions, {
        sourceKey: 'userId',
        foreignKey: 'UserId',
      });
    }
  }
  Users.init(
    {
      userId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      userName: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      nickname: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      age: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      gender: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      point: {
        allowNull: false,
        type: DataTypes.INTEGER,
        defaultValue: 1000000,
      },
      address: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      phoneNumber: {
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
      emailVerify: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'Users',
    },
  );
  return Users;
};
