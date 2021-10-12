const { Sequelize } = require('sequelize');
require('dotenv').config();


const sequelize = new Sequelize('', '', '', {
    host: 'host',
    dialect: 'postgres',
    port: 'port'
});

module.exports = { sequelize };
