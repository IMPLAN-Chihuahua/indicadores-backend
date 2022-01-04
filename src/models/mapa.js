'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Mapa extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.belongsTo(models.Indicador, { foreignKey: 'idIndicador' });
        }
    };
    Mapa.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },

            ubicacion: {
                type: DataTypes.STRING,
                allowNull: false
            },
        },
        {
            sequelize,
            modelName: 'Mapa',
            timestamps: false
        }
    );
    return Mapa;
};