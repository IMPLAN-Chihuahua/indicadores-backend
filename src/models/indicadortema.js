'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class IndicadorTema extends Model {
        static associate(models) {
            this.belongsTo(models.Indicador, { foreignKey: 'idIndicador', targetKey: 'id' });
            this.belongsTo(models.Tema, { foreignKey: 'idTema', targetKey: 'id' });
        }
    }

    IndicadorTema.init({
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
        idTema: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Temas',
                key: 'id'
            }
        },
    }, {
        indexes: [{
            name: 'indicadorTema_unique',
            fields: ['idIndicador', 'idTema'],
            type: 'UNIQUE',
        }],
        sequelize,
        modelName: 'IndicadorTema',
    });

    return IndicadorTema;
}