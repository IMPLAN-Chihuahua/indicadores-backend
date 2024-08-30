'use strict'
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ODS extends Model {
        static associate(models) {
            this.hasMany(models.Meta, {
                foreignKey: 'idODS'
            });
        }
    };

    ODS.init({
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
            modelName: 'ODS',
            timestamps: true,
        });

    return ODS;
}