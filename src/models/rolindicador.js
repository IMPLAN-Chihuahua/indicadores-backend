const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const { Rol } = require('./rol');
const { Indicador } = require('./indicador');

const RolIndicador = sequelize.define('RolIndicador',
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },

        rolid: {
            type: DataTypes.INTEGER,
            references: {
                model: Rol,
                key: 'id'
            }
        },

        indicadorid: {
            type: DataTypes.INTEGER,
            references: {
                model: Indicador,
                key: 'id'
            }
        },

        observaciones: {
            type: DataTypes.STRING,
            allowNull: true
        },

        fechadesde: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },

        fechahasta: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },

        activo: {
            type: DataTypes.STRING(2),
            allowNull: false,
            defaultValue: 'SI',
            validate: {
                isIn: [['SI', 'NO']]
            }
        }
    },
    {
        tableName: 'rolesindicadores',
        timestamps: true,
        createdAt: 'fechacreacion',
        updatedAt: 'fechamodificacion',
        validate: {
            validDateRange() {
                if (this.fechadesde > this.fechahasta) {
                    throw new Error("Fecha 'desde' es mayor que fecha 'hasta'");
                }
            }
        },
    }
);

module.exports = { RolIndicador };