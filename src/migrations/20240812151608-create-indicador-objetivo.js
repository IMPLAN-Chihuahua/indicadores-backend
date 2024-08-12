'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const t = await queryInterface.sequelize.transaction();

    try {

      await queryInterface.createTable('IndicadorObjetivos', {
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
        idObjetivo: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Dimensions',
            key: 'id'
          }
        },
        destacado: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn('NOW')
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn('NOW')
        },

      }, {
        transaction: t
      });

      await queryInterface.addIndex('IndicadorObjetivos', {
        name: 'indicadorObjetivo_unique',
        fields: ['idIndicador', 'idObjetivo'],
        type: 'UNIQUE',
        transaction: t
      });
      
      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('IndicadorObjetivos');
  }
};