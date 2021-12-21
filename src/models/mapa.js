const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const { Indicador } = require('./Indicador');

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
    }
);

Mapa.belongsTo(Indicador);
module.exports = { Mapa };