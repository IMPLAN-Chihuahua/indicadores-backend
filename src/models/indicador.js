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

            this.hasOne(models.UnidadMedida, { foreignKey: 'idIndicador' })
            this.hasOne(models.CoberturaGeografica, { foreignKey: 'idIndicador' });
            this.hasOne(models.Ods, { foreignKey: 'idIndicador' });
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

            url: {
                type: DataTypes.STRING,
                validate: {
                    isUrl: true
                }
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

            createdBy: {
                type: DataTypes.INTEGER,
                allowNull: false
            },

            updatedBy: {
                type: DataTypes.INTEGER,
                allowNull: true
            },


        },
        {
            sequelize,
            indexes: [
                {
                    unique: false,
                    fields: ['createdBy', 'updatedBy']
                }
            ],
            tableName: 'Indicadores',
            timestamps: true
        }
    );
    return Indicador;
};
