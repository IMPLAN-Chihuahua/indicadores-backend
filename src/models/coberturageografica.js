'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CoberturaGeografica extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasOne (models.Indicador, {foreignKey: 'idCobertura'});
    }
  };
  CoberturaGeografica.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      nombre: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'No aplica'
      }
    },
    {
      sequelize,
      name: {
        singular: 'coberturaGeografica',
        plural: 'coberturasGeograficas'
      },
      modelName: 'CoberturaGeografica',
      timestamps: false
    }
  );
  return CoberturaGeografica;
};