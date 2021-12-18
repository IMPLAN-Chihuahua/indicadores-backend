const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const { Formula } = require('./formula');

const Variable = sequelize.define("Variable", {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },

    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },

    codigoAtributo: {
        type: DataTypes.STRING,
        allowNull: false
    },

    nombreAtributo: {
        type: DataTypes.STRING,
        allowNull: false
    },

    formulaCalculo: {
        type: DataTypes.STRING,
        allowNull: false
    },

    datoVariable: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'No aplica'
    },

    unidad: {
        type: DataTypes.STRING,
        allowNull: false
    },

    anio: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
});

Variable.belongsTo(Formula);

module.exports = { Variable }