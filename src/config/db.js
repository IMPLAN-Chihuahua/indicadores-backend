const { Sequelize } = require('sequelize');
require('dotenv').config();


const sequelize = new Sequelize('', '', '', {
    host: '',
    dialect: '',
    port: ''
});

module.exports = { sequelize };