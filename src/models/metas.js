'use strict'
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Meta extends Model {
        static associate(models) {
            this.belongsToMany(models.Indicador, {
                through: models.IndicadorMeta,
                foreignKey: 'idMeta',
            })

            this.belongsTo(models.ODS, {
                foreignKey: 'idODS'
            })
        }
    };

    Meta.init({
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

        idODS: {
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
        modelName: 'Meta',
        timestamps: true,
    })

    return Meta;
}