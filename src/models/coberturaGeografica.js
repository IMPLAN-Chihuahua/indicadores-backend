const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const CoberturaGeografica = sequelize.define('CoberturaGeografica', {

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


module.exports = { CoberturaGeografica };