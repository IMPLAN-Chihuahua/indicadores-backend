'use strict'
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Ods extends Model {
        static associate(models) {
            this.hasMany(models.Indicador, {
                foreignKey: 'idOds'
            });
        }
    };

    Ods.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },

        posicion: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        },

        titulo: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },

        descripcion: {
            type: DataTypes.STRING(1000),
            allowNull: true
        },

        urlImagen: {
            type: DataTypes.STRING,
            allowNull: true
        },
    },
        {
            sequelize,
            name: {
                singular: 'ods',
                plural: 'odss',
            },
            modelName: 'Ods',
            timestamps: true,
        });

    return Ods;
}