'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const t = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.removeIndex('Indicadores', 'Indicadores_idDimension_fkey', { transaction: t });
      await queryInterface.removeColumn('Indicadores', 'idDimension', { transaction: t });
      await t.commit();
    } catch (err) {
      process.stderr(`${err}\n`);
      await t.rollback();
    }
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.addColumn('Indicadores', 'idDimension', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
      references: {
        model: 'Dimensions',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    })
  }
};
