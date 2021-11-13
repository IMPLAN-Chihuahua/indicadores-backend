// TODO: Add relationship with modulo and rol
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const { Rol } = require('./rol');
const { Modulo } = require('./modulo');

const RolModulo = sequelize.define('RolModulo',
    {
        id: {
            type: DataTypes.INTEGER,
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

        moduloid: {
            type: DataTypes.INTEGER,
            references: {
                model: Modulo,
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
        tableName: 'rolesmodulos',

        validate: {
            validDateRange() {
                if (this.fechadesde > this.fechahasta) {
                    throw new Error("Fecha 'desde' es mayor que fecha 'hasta'");
                }
            }
        },

    }
);

Rol.belongsToMany(Modulo, { through: RolModulo });
Modulo.belongsToMany(Rol, { through: RolModulo });

module.exports = { RolModulo };