'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Indicador extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.belongsTo(models.Modulo, { foreignKey: 'idModulo' });
            this.belongsToMany(models.Usuario, { through: models.UsuarioIndicador, foreignKey: 'idIndicador' });
            this.belongsTo(models.Ods, { foreignKey: 'idOds' });
            this.belongsTo(models.CoberturaGeografica, { foreignKey: 'idCobertura' });
            this.belongsTo(models.UnidadMedida, { foreignKey: 'idUnidadMedida' })

            this.hasOne(models.Formula, { foreignKey: 'idIndicador' });
            this.hasMany(models.Historico, { foreignKey: 'idIndicador' });
            this.hasMany(models.Fuente, { foreignKey: 'idIndicador' });
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

            codigoObjeto: {
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

            idOds: {
                type: DataTypes.INTEGER,
                allowNull: false
            },

            idCobertura: {
                type: DataTypes.INTEGER,
                allowNull: false
            },

            idUnidadMedida: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
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
                    fields: ['createdBy', 'updatedBy', 'idOds', 'idCobertura', 'idUnidadMedida']
                }
            ],
            modelName: 'Indicador',
            tableName: 'Indicadores',
            timestamps: true
        }
    );
    return Indicador;
};