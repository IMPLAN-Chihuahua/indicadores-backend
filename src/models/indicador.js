'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Indicador extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Indicador.init(    {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    url: {
        type: DataTypes.STRING,
        validate: {
            isUrl: true
        }
    },

    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },

    definicion: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: 'No aplica'
    },

    anioUltimoValorDisponible: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },

    unidadMedida: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'No aplica'
    },

    coberturaGeografica: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'No aplica'
    },

    tendenciaActual: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'No aplica'
    },

    tendenciaDeseada: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'No aplica'
    },

    mapa: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 0
    },

    grafica: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 0
    },

    observaciones: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: 'No existen observaciones'
    },

    creador: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    editor: {
        type: DataTypes.INTEGER,
        allowNull: true
    },

},
{

    indexes: [
        {
            unique: false,
            fields: ['creador', 'editor']
        }
    ],
    tableName: 'Indicadores',
    timestamps: true,
    createdAt: 'fechaCreacion',
    updatedAt: 'fechaModificacion'
});

  return Indicador;
};