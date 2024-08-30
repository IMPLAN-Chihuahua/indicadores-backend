'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const t = await queryInterface.sequelize.transaction();

    try {

      await queryInterface.createTable('Metas', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },

        idOds: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Ods',
            key: 'id'
          }
        },

        titulo: {
          allowNull: false,
          type: Sequelize.STRING
        },

        descripcion: {
          allowNull: true,
          type: Sequelize.STRING
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

      await t.commit();

    } catch (err) {
      console.error(err);
      await t.rollback();
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Metas');
  }
};
