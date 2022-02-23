'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Fuente extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Fuente.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    bibliografia: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'No aplica'
    },
  },
    {

      sequelize,
      name: {
        singular: 'fuente',
        plural: 'fuentes'
      },
      modelName: 'Fuente',
      timestamps: false
    });
  return Fuente;
};