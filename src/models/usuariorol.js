const { DataTypes } = require('sequelize');
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
            validRange() {
                if (this.fechadesde > this.fechahasta) {
                    throw new Error("Fecha 'desde' es mayor que la fecha 'hasta'");
                }
            }
        }
    });

Usuario.belongsToMany(Rol, { through: UsuarioRol, foreignKey: 'usuarioid' });
Rol.belongsToMany(Usuario, { through: UsuarioRol, foreignKey: 'rolid' });

module.exports = { UsuarioRol };