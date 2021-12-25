const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const { Variable } = require('./variable');

const Formula = sequelize.define('Formula',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        ecuacion: {
            type: DataTypes.STRING,
            defaultValue: 'No aplica'
        },

        descripcion: {
            type: DataTypes.STRING,
            defaultValue: 'No aplica'
        },

        descripcionNarrativa: {
            type: DataTypes.STRING,
            defaultValue: 'No aplica'
        }
    },
    {
        timestamps: false
    }
);

Formula.hasMany(Variable, { foreignKey: 'idFormula' });
Variable.belongsTo(Formula, {foreignKey: 'idFormula'});


module.exports = { Formula };