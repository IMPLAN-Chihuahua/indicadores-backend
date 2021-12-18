const { DataTypes }  = require('sequelize');
const { sequelize } = require('../config/db');
const { Rol } = require('./rol');
const { Usuario } = require('./usuario');

const UsuarioRol = sequelize.define('UsuarioRol',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        usuarioid: {
            type: DataTypes.INTEGER,
            references: {
                model: Usuario,
                key: 'id'
            }
        },

        rolid: {
            type: DataTypes.INTEGER,
            references: {
                model: Rol,
                key: 'id'
            }
        },

        observaciones: {
            type: DataTypes.STRING,
            allowNull: true
        },

        fechadesde: {
            type: DataTypes.DATEONLY,
            allowNull: true,

        },

        fechahasta: {
            type: DataTypes.DATEONLY,
            allowNull: true,

        },

        activo: {
            type: DataTypes.STRING(2),
            allowNull: false,
            defaultValue: 'SI',
            validate: {
                isIn: [["SI", "NO"]]
            }
        }
    },
    {
        tableName: 'usuariosroles',
        timestamps: true,
        createdAt: 'fechacreacion',
        updatedAt: 'fechamodificacion',

        validate: {
            validDateRange() {
                if (this.fechadesde > this.fechahasta) {
                    throw new Error("Fecha 'desde' es mayor que fecha 'hasta'");
                }
            }
        }
    });

Usuario.belongsToMany(Rol, { through: UsuarioRol });
Rol.belongsToMany(Usuario, { through: UsuarioRol });

module.exports = { UsuarioRol };