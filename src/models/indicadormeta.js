'use strict'
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class IndicadorMetas extends Model {
        static associate(models) {
            this.belongsTo(models.Indicador, { foreignKey: 'idIndicador', targetKey: 'id' });
            this.belongsTo(models.Metas, { foreignKey: 'idMeta', targetKey: 'id' });
        }
    }

    IndicadorMetas.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        idIndicador: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Indicadores',
                key: 'id'
            }
        },

        idMeta: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Metas',
                key: 'id'
            }
        },

    }, {
        indexes: [{
            name: 'indicadorMeta_unique',
            fields: ['idIndicador', 'idMeta'],
            type: 'UNIQUE',
        }],
        sequelize,
        modelName: 'IndicadorMetas',
    });

    return IndicadorMetas;

}