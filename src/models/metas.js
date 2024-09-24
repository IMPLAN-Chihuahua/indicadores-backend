'use strict'
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Metas extends Model {
        static associate(models) {
            this.belongsToMany(models.Indicador, {
                through: models.IndicadorMetas,
                foreignKey: 'idMeta',
            })

            this.belongsTo(models.Ods, {
                foreignKey: 'idOds'
            })
        }
    };

    Metas.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },

        titulo: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        descripcion: {
            type: DataTypes.STRING(1000),
            allowNull: true
        },

        idOds: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'ODS',
                key: 'id'
            }
        },

    }, {
        sequelize,
        name: {
            singular: 'meta',
            plural: 'metas'
        },
        modelName: 'Metas',
        timestamps: true,
    })

    return Metas;
}