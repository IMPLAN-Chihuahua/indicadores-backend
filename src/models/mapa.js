const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Mapa = sequelize.define('Mapa',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        ubicacion: {
            type: DataTypes.STRING,
            allowNull: false
        },
    },
    {
        timestamps: false
    }
);

module.exports = { Mapa };