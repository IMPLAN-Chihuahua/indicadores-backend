'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Rol extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.hasMany(models.Usuario, { foreignKey: 'idRol' })
        }
    };
    Rol.init(
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },

            rol: {
                type: DataTypes.STRING(30),
                allowNull: false,
                unique: true
            },

            descripcion: {
                type: DataTypes.STRING,
                allowNull: true
            },

            activo: {
                type: DataTypes.STRING(2),
                allowNull: false,
                defaultValue: 'SI',
                validate: {
                    isIn: [['SI', 'NO']]
                }
            }
        },
        {
            sequelize,
            name: {
                singular: 'rol',
                plural: 'roles'
            },
            modelName: 'Rol',
            tableName: 'Roles',
            timestamps: true
        }
    );
    return Rol;
};