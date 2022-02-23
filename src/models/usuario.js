'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Usuario extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.belongsTo(models.Rol, { foreignKey: 'idRol' });
            this.belongsToMany(models.Indicador, {through: models.UsuarioIndicador, foreignKey: 'idUsuario'});
        }
    };
    Usuario.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },

            correo: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true
                }
            },

            clave: {
                type: DataTypes.STRING,
                allowNull: false
            },

            nombres: {
                type: DataTypes.STRING(160),
                allowNull: false
            },

            apellidoPaterno: {
                type: DataTypes.STRING(160),
                allowNull: false,
            },

            apellidoMaterno: {
                type: DataTypes.STRING(160),
                allowNull: true
            },

            avatar: {
                type: DataTypes.STRING,
                allowNull: true
            },

            activo: {
                type: DataTypes.STRING(2),
                allowNull: true,
                defaultValue: 'SI',
                validate: {
                    isIn: [['SI', 'NO']]
                }
            }
        },
        {
            sequelize,
            name: {
                singular: 'usuario',
                plural: 'usuarios'
            },
            modelName: 'Usuario',
            tableName: 'Usuarios',
            timestamps: true,
            scopes: {
                // use to select user (s) without showing their password
                withoutPassword: {
                    attributes: { exclude: ['clave'] }
                }
            },
        }
    );
    return Usuario;
};