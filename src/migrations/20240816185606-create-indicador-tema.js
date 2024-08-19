'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const t = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.createTable('IndicadorTemas', {
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
        idTema: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Temas',
            key: 'id'
          }
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
      }, { transaction: t });

      await queryInterface.addIndex('IndicadorTemas', {
        name: 'indicadorTema_unique',
        fields: ['idIndicador', 'idTema'],
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
    const t = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.dropTable('IndicadorTemas', { transaction: t });
      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }
};
