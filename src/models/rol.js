const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Rol = sequelize.define('Rol',
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },

        rol: {
            type: DataTypes.STRING(30),
            allowNull: false,
            unique: true
        },

        descripcion: {
            type: DataTypes.STRING,
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
        tableName: 'Roles',        
        timestamps: true,
        createdAt: 'fechacreacion',
        updatedAt: 'fechamodificacion'
    });

module.exports = { Rol };