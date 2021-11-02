const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Indicador = sequelize.define('Indicador',
    {
        id: {},

        tema: {},

        indicador: {},

        codigotema: {},

        codigoobjecto: {},

        url: {},

        nombreindicador: {},

        definicionindicador: {},

        
    });

module.exports = { Indicador };