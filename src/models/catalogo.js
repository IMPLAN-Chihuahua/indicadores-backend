'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Catalogo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Catalogo.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      unique: true
    }
  }, {
    sequelize,
    timestamps: true,
    name: {
      singular: 'catalogo',
      plural: 'catalogos'
    },
    modelName: 'Catalogo',
    tableName: 'Catalogos'
  });
  return Catalogo;
};