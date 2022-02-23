'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Ods extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.hasOne(models.Indicador, { foreignKey: 'idOds' })
        }
    };
    Ods.init(
        {
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
            sequelize,
            name: {
                singular: 'ods',
                plural: 'ods'
            },
            modelName: 'Ods',
            timestamps: false
        }
    );
    return Ods;
};