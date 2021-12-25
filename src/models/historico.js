const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Historico = sequelize.define('Historico',
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

        anio: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },

        fuente: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'No aplica'
        }
    },
    {
        timestamps: false
    }
);

module.exports = { Historico };