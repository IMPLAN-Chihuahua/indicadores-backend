const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const { Formula } = require('./formula');
const { Historico } = require('./historico');
const { Fuente } = require('./fuente');
const { Mapa } = require('./mapa');
const { Modulo } = require('./modulo');
const { Ods } = require('./ods');
const { UnidadMedida } = require('./unidadMedida');
const { UnidadVariable } = require('./unidadVariable');
const { CoberturaGeografica } = require('./coberturaGeografica');

const Indicador = sequelize.define('Indicador',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        url: {

            type: DataTypes.STRING,
            validate: {
                isUrl: true
            }
        },

        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },

        definicion: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: 'No aplica'
        },

        codigo: {
            type: DataTypes.STRING,
            allowNull: false
        },

        codigoObjeto: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: /[\d]{3,}.[\d]{3,}.[\d]{3}/g
            }
        },

        anioUltimoValorDisponible: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },

        unidadMedida: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'No aplica'
        },

        coberturaGeografica: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'No aplica'
        },

        tipoTendencia: {
            type: DataTypes.SMALLINT,
            allowNull: false
        },

        mapa: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            defaultValue: 0
        },

        grafica: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            defaultValue: 0
        },

        observaciones: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: 'No existen observaciones'
        },

        creador: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        editor: {
            type: DataTypes.INTEGER,
            allowNull: true
        },

    },
    {

        indexes: [
            {
                unique: false,
                fields: ['creador', 'editor']
            }
        ],
        tableName: 'Indicadores',
        timestamps: true,
        createdAt: 'fechaCreacion',
        updatedAt: 'fechaModificacion'
    }
);

Indicador.belongsTo(Modulo, { foreignKey: 'idModulo' });
Modulo.hasMany(Indicador, { foreignKey: 'idModulo' });

Indicador.hasOne(Formula, { foreignKey: 'idIndicador' });
Formula.belongsTo(Indicador, { foreignKey: 'idIndicador' });

Indicador.hasMany(Historico, { foreignKey: 'idIndicador', });
Historico.belongsTo(Indicador, { foreignKey: 'idIndicador', });

Indicador.hasMany(Fuente, { foreignKey: 'idIndicador', });
Fuente.belongsTo(Indicador, { foreignKey: 'idIndicador', });

Indicador.hasOne(Mapa, { foreignKey: 'idIndicador', });
Mapa.belongsTo(Indicador, { foreignKey: 'idIndicador', });

module.exports = { Indicador };