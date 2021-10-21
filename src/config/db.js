const { Sequelize } = require('sequelize');

require('dotenv').config();

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env

const sequelize = new Sequelize('', '', '', {
    host: 'host',
    dialect: 'postgres',
    port: 'port'

});

module.exports = { sequelize };
