'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Usuarios', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      correo: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },

      clave: {
        allowNull: false,
        type: Sequelize.STRING,
      },

      nombres: {
        allowNull: false,
        type: Sequelize.STRING
      },

      apellidoPaterno: {
        allowNull: false,
        type: Sequelize.STRING
      },

      apellidoMaterno: {
        allowNull: true,
        type: Sequelize.STRING
      },

      avatar: {
        allowNull: true,
        type: Sequelize.STRING
      },

      activo: {
        allowNull: false,
        defaultValue: 'SI',
        type: Sequelize.STRING(2)
      },

      idRol: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Roles',
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
    await queryInterface.dropTable('Usuarios');
  }
};