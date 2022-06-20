'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('UsuarioIndicadores', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },

        idUsuario: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Usuarios',
            key: 'id'
          },
        },

        idIndicador: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Indicadores',
            key: 'id'
          },
        },

        fechaDesde: {
          allowNull: false,
          type: Sequelize.DATEONLY
        },

        fechaHasta: {
          allowNull: false,
          type: Sequelize.DATEONLY
        },

        createdBy: {
          allowNull: false,
          type: Sequelize.INTEGER
        },

        updatedBy: {
          allowNull: true,
          type: Sequelize.INTEGER
        },

        activo: {
          allowNull: false,
          defaultValue: 'SI',
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
        }
      });

      await queryInterface.addIndex('UsuarioIndicadores',
        {
          fields: ['createdBy', 'updatedBy'],
          using: 'BTREE',
          transaction
        });

      await queryInterface.addIndex('UsuarioIndicadores',
        {
          fields: ['idUsuario', 'idIndicador'],
          type: 'UNIQUE',
          transaction
        });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('UsuarioIndicadores');
  }
};