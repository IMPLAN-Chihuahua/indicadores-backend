const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

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
},
{
    timestamps: false
})

module.exports = { Fuente };