'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UnidadMedida extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Indicador, { foreignKey: 'idIndicador' })
    }
  };
  UnidadMedida.init(
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
      },

    },
    {
      sequelize,
      modelName: 'UnidadMedida',
      timestamps: false
    }
  );
  return UnidadMedida;
};