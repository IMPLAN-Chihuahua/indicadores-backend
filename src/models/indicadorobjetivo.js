'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class IndicadorObjetivo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Indicador, { foreignKey: 'idIndicador', targetKey: 'id' });
      this.belongsTo(models.Dimension, { foreignKey: 'idObjetivo', targetKey: 'id' });
    }
  }
  IndicadorObjetivo.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    idIndicador: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Indicadores',
        key: 'id'
      }
    },
    idObjetivo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Dimensions',
        key: 'id'
      }
    },
    destacado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    indexes: [{
      name: 'indicadorObjetivo_unique',
      fields: ['idIndicador', 'idObjetivo'],
      type: 'UNIQUE',
    }],
    sequelize,
    modelName: 'IndicadorObjetivo',
  });
  return IndicadorObjetivo;
};