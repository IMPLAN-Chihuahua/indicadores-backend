'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Dimension extends Model {
        static associate(models) {
            this.belongsToMany(models.Indicador, {
                through: models.IndicadorObjetivo,
                foreignKey: 'idObjetivo',
            })
        }
    };
    Dimension.init(
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
                type: DataTypes.STRING(1000),
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
                singular: 'dimension',
                plural: 'dimensions'
            },
            modelName: 'Dimension',
            timestamps: true,
        });
    return Dimension;
};