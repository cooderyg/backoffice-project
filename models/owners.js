'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Owners extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.Stores, {
        sourceKey: 'ownerId',
        foreignKey: 'OwnerId',
      });
    }
  }
  Owners.init(
    {
      ownerId: {
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
      point: {
        allowNull: false,
        type: DataTypes.INTEGER,
        defaultValue: 0,
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
      modelName: 'Owners',
    },
  );
  return Owners;
};
