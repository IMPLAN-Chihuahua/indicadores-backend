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
        //URL
        ubicacion: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }
)