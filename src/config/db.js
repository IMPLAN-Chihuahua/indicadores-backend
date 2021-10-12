const { Sequelize } = require('sequelize');
require('dotenv').config();


const sequelize = new Sequelize('indicadores', 'indicador', '***REMOVED***', {
    host: '***REMOVED***',
    dialect: 'postgres',
    port: '5432'
});

module.exports = { sequelize };