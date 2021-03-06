'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CatalogoDetailIndicador extends Model {
    static associate(models) {
      this.belongsTo(models.CatalogoDetail, { foreignKey: 'idCatalogoDetail', targetKey: 'id' });
      this.belongsTo(models.Indicador, { foreignKey: 'idIndicador', targetKey: 'id' })
    }
  };

  CatalogoDetailIndicador.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    idIndicador: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Indicadores',
        key: 'id'
      }
    },
    idCatalogoDetail: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'CatalogoDetails',
        key: 'id'
      }
    }
  }, {
    sequelize,
    timestamps: true,
    name: {
      singular: 'catalogoDetailIndicador',
      plural: 'catalogoDetailIndicadores'
    },
    modelName: 'CatalogoDetailIndicador',
    tableName: 'CatalogoDetailIndicadores',
  });
  return CatalogoDetailIndicador;
};