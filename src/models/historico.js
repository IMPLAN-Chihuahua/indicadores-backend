const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const { Indicador } = require('./Indicador');

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
    }
);

Historico.belongsTo(Indicador);
module.exports = { Historico };