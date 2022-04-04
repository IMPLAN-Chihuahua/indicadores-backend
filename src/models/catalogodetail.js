'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CatalogoDetail extends Model {
    static associate(models) {
      this.belongsToMany(models.Indicador, { through: models.CatalogoDetailIndicador, foreignKey: 'idCatalogoDetail' });
    }
  };
  CatalogoDetail.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    idCatalogo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Catalogos',
        key: 'id'
      }
    },
  }, {
    sequelize,
    timestamps: true,
    name: {
      singular: 'catalogoDetail',
      plural: 'catalogoDetails'
    },
    modelName: 'CatalogoDetail',
    tableName: 'CatalogoDetails'
  });
  return CatalogoDetail;
};