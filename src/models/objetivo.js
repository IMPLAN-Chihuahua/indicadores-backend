'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Objetivo extends Model {
        static associate(models) {
            this.belongsToMany(models.Indicador, {
                through: models.IndicadorObjetivo,
                foreignKey: 'idObjetivo',
            })
        }
    };
    Objetivo.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },

            titulo: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },

            descripcion: {
                type: DataTypes.TEXT,
                allowNull: true
            },

            urlImagen: {
                type: DataTypes.STRING,
                allowNull: true
            },

            color: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: '#ffffff'
            },

            alias: {
                type: DataTypes.STRING,
                allowNull: true
            },

            summary: {
                type: DataTypes.TEXT,
                allowNull: true
            }

        },
        {
            sequelize,
            name: {
                singular: 'objetivo',
                plural: 'objetivos'
            },
            modelName: 'Objetivo',
            timestamps: true,
        });
    return Objetivo;
};