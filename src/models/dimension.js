'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Dimension extends Model {
        static associate(models) {
            this.hasMany(models.Indicador, { foreignKey: 'idDimension' });
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