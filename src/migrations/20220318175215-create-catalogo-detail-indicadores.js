'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('CatalogoDetailIndicadores', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idIndicador: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Indicadores',
          key: 'id'
        }
      },
      idCatalogoDetail: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'CatalogoDetails',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('CatalogoDetailIndicadores');
  }
};