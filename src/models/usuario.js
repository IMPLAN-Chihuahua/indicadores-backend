const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Usuario = sequelize.define('Usuario',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },

        correo: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },

        clave: {
            type: DataTypes.STRING,
            allowNull: false
        },

        nombres: {
            type: DataTypes.STRING(160),
            allowNull: false
        },

        apellidopaterno: {
            type: DataTypes.STRING(160),
            allowNull: false,
        },

        apellidomaterno: {
            type: DataTypes.STRING(160),
            allowNull: true
        },

        avatar: {
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
        }
    },
    {
        tableName: 'usuarios',
        timestamps: true,
        createdAt: 'fechacreacion',
        updatedAt: 'fechamodificacion',
        scopes: {
            // use to select user (s) without showing their password
            withoutPassword: {
                attributes: { exclude: ['clave'] }
            }
        },
    });

module.exports = { Usuario };