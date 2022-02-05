'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Formula extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Variable, { foreignKey: 'idFormula' });
      this.belongsTo(models.Indicador, { foreignKey: 'idIndicador' });
    }
  };
  Formula.init(
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
    },
    {
      sequelize,
      modelName: 'Formula',
      timestamps: false
    }
  );
  return Formula;
};