const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Indicador = sequelize.define('Indicador',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        tema: {
            type: DataTypes.STRING,
            allowNull: true
        },

        indicador: {
            type: DataTypes.STRING,
            allowNull: true
        },

        codigotema: {
            type: DataTypes.STRING,
            allowNull: true
        },

        codigoindicador: {
            type: DataTypes.STRING,
            allowNull: true
        },

        codigoobjecto: {
            type: DataTypes.STRING,
            allowNull: true
        },

        url: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: { isUrl: true }
        },

        nombreindicador: {
            type: DataTypes.STRING,
            allowNull: true
        },

        definicionindicador: {
            type: DataTypes.STRING,
            allowNull: true
        },

        ultimovalordisponible: {
            type: DataTypes.STRING,
            allowNull: true
        },

        anioultimovalordisponible: {
            type: DataTypes.STRING,
            allowNull: true
        },

        formulacalculo: {
            type: DataTypes.STRING,
            allowNull: true
        },
        
        descripcionformula: {
            type: DataTypes.STRING,
            allowNull: true
        },

        descripcionnarrativacalculo: {
            type: DataTypes.STRING,
            allowNull: true
        },

        unidadmedida: {
            type: DataTypes.STRING,
            allowNull: true
        },

        coberturageografica: {
            type: DataTypes.STRING,
            allowNull: true
        },

        fuentesinformacion: {
            type: DataTypes.STRING,
            allowNull: true
        },

        fuente: {
            type: DataTypes.STRING,
            allowNull: true
        },

        nombrevariable1: {
            type: DataTypes.STRING,
            allowNull: true
        },

        codigoatributovariable1: {
            type: DataTypes.STRING,
            allowNull: true
        },

        nombreatributo: {
            type: DataTypes.STRING,
            allowNull: true
        },

        datovariable1: {
            type: DataTypes.STRING,
            allowNull: true
        },

        unidadvariable1: {
            type: DataTypes.STRING,
            allowNull: true
        },

        aniovariable1: {
            type: DataTypes.STRING,
            allowNull: true
        },

        nombrevariable2: {
            type: DataTypes.STRING,
            allowNull: true
        },

        codigoatributovariable2: {
            type: DataTypes.STRING,
            allowNull: true
        },

        datovariable2: {
            type: DataTypes.STRING,
            allowNull: true
        },

        unidadvariable2: {
            type: DataTypes.STRING,
            allowNull: true
        },

        aniovariable2: {
            type: DataTypes.STRING,
            allowNull: true
        },

        nombrevariable3: {
            type: DataTypes.STRING,
            allowNull: true
        },

        codigoatributovariable3: {
            type: DataTypes.STRING,
            allowNull: true
        },

        datovariable3: {
            type: DataTypes.STRING,
            allowNull: true
        },

        unidadvariable3: {
            type: DataTypes.STRING,
            allowNull: true
        },

        aniovariable3: {
            type: DataTypes.STRING,
            allowNull: true
        },

        nombrevariable4: {
            type: DataTypes.STRING,
            allowNull: true
        },

        codigoatributovariable4: {
            type: DataTypes.STRING,
            allowNull: true
        },

        datovariable4: {
            type: DataTypes.STRING,
            allowNull: true
        },

        unidadvariable4: {
            type: DataTypes.STRING,
            allowNull: true
        },

        aniovariable4: {
            type: DataTypes.STRING,
            allowNull: true
        },

        nombrevariable5: {
            type: DataTypes.STRING,
            allowNull: true
        },

        codigoatributovariable5: {
            type: DataTypes.STRING,
            allowNull: true
        },

        datovariable5: {
            type: DataTypes.STRING,
            allowNull: true
        },

        unidadvariable5: {
            type: DataTypes.STRING,
            allowNull: true
        },

        aniovariable5: {
            type: DataTypes.STRING,
            allowNull: true
        },

        nombrevariable6: {
            type: DataTypes.STRING,
            allowNull: true
        },

        codigoatributovariable6: {
            type: DataTypes.STRING,
            allowNull: true
        },

        datovariable6: {
            type: DataTypes.STRING,
            allowNull: true
        },

        unidadvariable6: {
            type: DataTypes.STRING,
            allowNull: true
        },

        aniovariable6: {
            type: DataTypes.STRING,
            allowNull: true
        },

        nombrevariable7: {
            type: DataTypes.STRING,
            allowNull: true
        },

        codigoatributovariable7: {
            type: DataTypes.STRING,
            allowNull: true
        },

        datovariable7: {
            type: DataTypes.STRING,
            allowNull: true
        },

        unidadvariable7: {
            type: DataTypes.STRING,
            allowNull: true
        },

        aniovariable7: {
            type: DataTypes.STRING,
            allowNull: true
        },

        verificadorresultado: {
            type: DataTypes.STRING,
            allowNull: true
        },

        datohistorico1: {
            type: DataTypes.STRING,
            allowNull: true
        },

        aniodatohistorico1: {
            type: DataTypes.STRING,
            allowNull: true
        },

        fuentedatohistorico1: {
            type: DataTypes.STRING,
            allowNull: true
        },

        datohistorico2: {
            type: DataTypes.STRING,
            allowNull: true
        },

        aniodatohistorico2: {
            type: DataTypes.STRING,
            allowNull: true
        },

        fuentedatohistorico2: {
            type: DataTypes.STRING,
            allowNull: true
        },

        datohistorico3: {
            type: DataTypes.STRING,
            allowNull: true
        },

        aniodatohistorico3: {
            type: DataTypes.STRING,
            allowNull: true
        },

        fuentedatohistorico3: {
            type: DataTypes.STRING,
            allowNull: true
        },

        tendenciadeseable: {
            type: DataTypes.STRING,
            allowNull: true
        },

        parametroreferencia: {
            type: DataTypes.STRING,
            allowNull: true
        },

        fuenteparametroreferencia: {
            type: DataTypes.STRING,
            allowNull: true
        },

        mapa: {
            type: DataTypes.STRING,
            allowNull: true
        },

        grafica: {
            type: DataTypes.STRING,
            allowNull: true
        },

        ubicacioninformacion: {
            type: DataTypes.STRING,
            allowNull: true
        },

        ubicacionmapa: {
            type: DataTypes.STRING,
            allowNull: true
        },

        nombrearchivomapa: {
            type: DataTypes.STRING,
            allowNull: true
        },

        observaciones: {
            type: DataTypes.STRING,
            allowNull: true
        },

        activo: {
            type: DataTypes.STRING(2),
            allowNull: false,
            defaultValue: 'SI',
            validate: {
                isIn: [['SI', 'NO']]
            }
        }
    },
    {
        tableName: 'indicadores',
        timestamps: true,
        createdAt: 'fechacreacion',
        updatedAt: 'fechamodificacion'
    }
);

module.exports = { Indicador };