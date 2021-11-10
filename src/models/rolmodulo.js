// TODO: Add relationship with modulo and rol
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const RolModulo = sequelize.define('RolModulo',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        observaciones: {
            type: DataTypes.STRING,
            allowNull: true
        },

        fechadesde: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },

        fechahasta: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },

        activo: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            defaultValue: 'SI',
            validate: {
                isIn: [['SI', 'NO']]
            }
        }
    }, 
    {
        tableName: ''
    }
);