'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Indicador extends Model {
        static associate(models) {
            this.belongsTo(models.Tema, { foreignKey: 'idTema' });
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

            this.belongsToMany(models.Dimension, {
                through: models.IndicadorObjetivo,
                foreignKey: 'idIndicador',
                as: 'objetivos'
            })
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
                type: DataTypes.DOUBLE,
                allowNull: false,
                defaultValue: -1
            },

            adornment: {
                type: DataTypes.STRING,
                allowNull: true
            },

            unidadMedida: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: ''
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
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
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

            owner: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: 1
            },

            archive: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },

            idTema: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'Temas',
                    key: 'id'
                },
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