'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Modulo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Indicador, { foreignKey: 'idModulo' });
    }
  };
  Modulo.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },

      temaIndicador: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },

      codigo: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /[\d]{3,}/g
        }
      },

      observaciones: {
        type: DataTypes.STRING,
        allowNull: true
      },

      activo: {
        type: DataTypes.STRING(2),
        allowNull: true,
        defaultValue: 'SI',
        validate: {
          isIn: [['SI', 'NO']]
        }
      },
    },
    {
      sequelize,
      modelName: 'Modulo',
      timestamps: true,
      updatedAt: false
    });
  return Modulo;
};