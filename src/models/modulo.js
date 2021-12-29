const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Modulo = sequelize.define('Modulo',
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
        timestamps: true,
        createdAt: 'fechacreacion',
        updatedAt: false
    }
);

module.exports = {
    Modulo
};

