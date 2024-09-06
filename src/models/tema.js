'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tema extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.Indicador,
        {
          through: models.IndicadorTema,
          foreignKey: 'idTema'
        });
    }
  };
  Tema.init(
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
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
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
        singular: 'Tema',
        plural: 'temas'
      },
      modelName: 'Tema',
      timestamps: true,
      scopes: {
        withoutActivo: {
          attributes: {
            exclude: ['activo']
          }
        }
      }
    });
  return Tema;
};