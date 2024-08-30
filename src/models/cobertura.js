'use strict'
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Cobertura extends Model {
        static associate(models) {
            this.hasMany(models.Indicador, {
                foreignKey: 'idCobertura'
            });
        }
    };

    Cobertura.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },

        tipo: {
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
                singular: 'cobertura',
                plural: 'cobertura',
            },
            modelName: 'Cobertura',
            timestamps: true,
        });

    return Cobertura;
}