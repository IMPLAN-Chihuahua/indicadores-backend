'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class UsuarioIndicador extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            UsuarioIndicador.belongsTo(models.Usuario, { foreignKey: 'idUsuario', targetKey: 'id' })
            UsuarioIndicador.belongsTo(models.Indicador, { foreignKey: 'idIndicador', targetKey: 'id' })
        }
    };
    UsuarioIndicador.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },

            idUsuario: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Usuarios',
                    key: 'id'
                },
            },

            idIndicador: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Indicadores',
                    key: 'id'
                },
            },

            fechaDesde: {
                type: DataTypes.DATEONLY,
                allowNull: true
            },

            fechaHasta: {
                type: DataTypes.DATEONLY,
                allowNull: true
            },

            createdBy: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            updatedBy: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            activo: {
                type: DataTypes.STRING(2),
                allowNull: true,
                defaultValue: 'SI',
                validate: {
                    isIn: [['SI', 'NO']]
                }
            },

            expires: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: 'SI',
                validate: {
                    isIn: [['SI', 'NO']]
                }
            }
        },
        {
            indexes: [
                {
                    unique: false,
                    fields: ['createdBy', 'updatedBy']
                }
            ],
            sequelize,
            name: {
                singular: 'usuarioIndicador',
                plural: 'usuarioIndicador'
            },
            modelName: 'UsuarioIndicador',
            tableName: 'UsuarioIndicadores',
            timestamps: true
        }
    );
    return UsuarioIndicador;
};