const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Ods = sequelize.define('Ods', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    nombre: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'No aplica'
    }

},
    {
        timestamps: false
    }
);


module.exports = { Ods };