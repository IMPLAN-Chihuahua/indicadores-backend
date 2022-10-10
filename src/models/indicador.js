'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Indicador extends Model {
        static associate(models) {
            this.belongsTo(models.Modulo, { foreignKey: 'idModulo' });
            this.belongsToMany(models.Usuario, { through: models.UsuarioIndicador, foreignKey: 'idIndicador' });
            this.belongsToMany(models.CatalogoDetail, {
                through: models.CatalogoDetailIndicador,
                foreignKey: 'idIndicador',
                as: 'catalogos'
            })
            this.belongsToMany(models.CatalogoDetail, {
                through: models.CatalogoDetailIndicador,
                foreignKey: 'idIndicador',
                as: 'catalogosFilters'
            })
            this.hasOne(models.Formula, { foreignKey: 'idIndicador' });
            this.hasMany(models.Historico, { foreignKey: 'idIndicador' });
            this.hasOne(models.Mapa, { foreignKey: 'idIndicador' });
        }
    };
    Indicador.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },

            urlImagen: {
                type: DataTypes.STRING,
            },

            codigo: {
                allowNull: false,
                type: DataTypes.STRING
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

            ultimoValorDisponible: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: 'NA'
            },

            anioUltimoValorDisponible: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },

            tendenciaActual: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: 'No aplica'
            },

            tendenciaDeseada: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: 'No aplica'
            },

            observaciones: {
                type: DataTypes.TEXT,
                allowNull: false,
                defaultValue: 'No existen observaciones'
            },

            createdBy: {
                type: DataTypes.INTEGER,
                allowNull: false
            },

            updatedBy: {
                type: DataTypes.INTEGER,
                allowNull: true
            },

            activo: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: 'SI'
            },

            fuente: {
                type: DataTypes.STRING(1000),
                allowNull: true,
                defaultValue: null
            },

            periodicidad: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: null
            },
        },
        {
            sequelize,
            name: {
                singular: 'indicador',
                plural: 'indicadores'
            },
            indexes: [
                {
                    unique: false,
                    fields: ['createdBy', 'updatedBy']
                }
            ],
            modelName: 'Indicador',
            tableName: 'Indicadores',
            timestamps: true
        }
    );
    return Indicador;
};