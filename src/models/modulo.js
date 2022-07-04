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

      urlImagen: {
        type: DataTypes.STRING,
        allowNull: true
      },

      color: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: '#ffffff'
      },

      descripcion: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      sequelize,
      name: {
        singular: 'modulo',
        plural: 'modulos'
      },
      modelName: 'Modulo',
      timestamps: true,
      scopes: {
        withoutActivo: {
          attributes: {
            exclude: ['activo']
          }
        }
      }
    });
  return Modulo;
};