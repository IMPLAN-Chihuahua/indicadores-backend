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

        observaciones: {
            type: DataTypes.STRING,
            allowNull: true
        },

        activo: {
            type: DataTypes.STRING(2),
            allowNull: false,
            default: 'SI',
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

