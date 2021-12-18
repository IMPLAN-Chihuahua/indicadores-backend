const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const { Indicador } = require('./indicador');
const { Usuario } = require('./usuario');

const UsuarioIndicador = sequelize.define('UsuarioIndicador',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },

        idUsuario: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Usuario,
                key: 'id'
            }
        },

        idIndicador: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Indicador,
                key: 'id'
            }
        },

        fechaDesde: {
            type: DataTypes.DATE,
            allowNull: false
        },

        fechaHasta: {
            type: DataTypes.DATE,
            allowNull: false
        },

        creador: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        editor: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        activo: {
            type: DataTypes.STRING(2),
            allowNull: true,
            defaultValue: 'SI',
            validate: {
                isIn: [['SI', 'NO']]
            }
        }
    },
    {
        indexes: [
            {
                unique: false,
                fields: ['creador', 'editor']
            }
        ],

        timestamps: true,
        createdAt: 'fechaCreacion',
        updatedAt: 'fechaModificacion'
    }
)


module.exports = { UsuarioIndicador };