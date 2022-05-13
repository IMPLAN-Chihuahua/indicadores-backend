'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Historico extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Indicador, { foreignKey: 'idIndicador' })
    }
  };
  Historico.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      valor: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'No aplica'
      },

      fuente: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'No aplica'
      },

      ecuacion: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'No aplica'
      },

      descripcionEcuacion: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'No aplica'
      },

      fechaIngreso: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
    },
    {
      sequelize,
      name: {
        singular: 'historico',
        plural: 'historicos'
      },
      modelName: 'Historico',
      timestamps: true,
      updatedAt: 'date'
    }
  );
  return Historico;
};