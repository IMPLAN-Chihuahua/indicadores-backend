const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const { Indicador } = require('./indicador');

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
        tableName: 'modulos',
        timestamps: true,
        createdAt: 'fechacreacion',
        updatedAt: false
    });

Modulo.hasMany(Indicador, { foreignKey: 'idModulo' });

module.exports = {
    Modulo
};

