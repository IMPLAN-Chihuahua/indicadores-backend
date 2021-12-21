const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const { Indicador } = require('./Indicador');

const Fuente = sequelize.define('Fuente', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    bibliografia: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'No aplica'
    },

    // referencia: {
    //     type: DataTypes.STRING,
    //     allowNull: true,
    //     defaultValue: 'No aplica'
    // }
})

Fuente.belongsTo(Indicador);
module.exports = { Fuente };