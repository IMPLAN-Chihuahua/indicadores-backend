const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const UnidadVariable = sequelize.define('UnidadVariable', {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    nombre: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'No aplica'
    },

},
    {
        timestamps: false
    }
)


module.exports = { UnidadVariable };