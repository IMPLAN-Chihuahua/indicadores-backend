const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const { Modulo } = require('./modulo');
const { Formula } = require('./formula');
const { Usuario } = require('./usuario');
const { UsuarioIndicador } = require('./usuarioIndicador');
/*
const { Historico } = require('./historico');
const { Fuente } = require('./fuente');
const { Mapa } = require('./mapa');
*/


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
            type: DataTypes.TINYINT,
            allowNull: false
        },

        mapa: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 0
        },

        grafica: {
            type: DataTypes.TINYINT,
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
            allowNull: false
        },

    },
    {

        indexes: [
            {
                unique: false,
                fields: ['creador', 'editor']
            }
        ],

        timestamps: true,
        createdAt: 'fechaCreacion',
        updatedAt: 'fechaModificacion'
    }
);

Indicador.belongsTo(Modulo, { foreignKey: 'idModulo' });
Indicador.belongsToMany(Usuario, { through: UsuarioIndicador });

Indicador.hasOne(Formula, { foreignKey: 'idIndicador' });
Indicador.hasMany(Historico, { foreignKey: 'idHistorico', });
Indicador.hasmany(Fuente, { foreignKey: 'idFuente', });
Indicador.hasOne(Mapa, { foreignKey: 'idMapa', });

module.exports = { Indicador };