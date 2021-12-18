const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const { Variable } = require('./variable');
const { Indicador } = require('./indicador');

const Formula = sequelize.define('Formula',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        ecuacion: {
            type: DataTypes.STRING,
            defaultValue: 'No aplica'
        },

        descripcion: {
            type: DataTypes.STRING,
            defaultValue: 'No aplica'
        },

        descripcionNarrativa: {
            type: DataTypes.STRING,
            defaultValue: 'No aplica'
        }
    }
);

Formula.hasMany(Variable);
Formula.belongsTo(Indicador)

module.exports = { Formula };