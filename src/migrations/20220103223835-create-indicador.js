'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('Indicadores',
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },

          urlImagen: {
            allowNull: true,
            type: Sequelize.STRING(1000)
          },

          nombre: {
            allowNull: false,
            type: Sequelize.STRING(1000)
          },

          definicion: {
            allowNull: false,
            defaultValue: 'No aplica',
            type: Sequelize.STRING(1000)
          },

          codigo: {
            allowNull: false,
            type: Sequelize.STRING(1000)
          },

          codigoObjeto: {
            allowNull: false,
            type: Sequelize.STRING(1000)
          },

          ultimoValorDisponible: {
            allowNull: false,
            type: Sequelize.STRING(1000)
          },

          anioUltimoValorDisponible: {
            allowNull: false,
            type: Sequelize.INTEGER
          },

          tendenciaActual: {
            allowNull: false,
            defaultValue: 'No aplica',
            type: Sequelize.STRING(1000)
          },

          tendenciaDeseada: {
            allowNull: false,
            defaultValue: 'No aplica',
            type: Sequelize.STRING(1000)
          },

          mapa: {
            allowNull: false,
            defaultValue: 0,
            type: Sequelize.SMALLINT
          },

          observaciones: {
            allowNull: false,
            defaultValue: 'No existen observaciones',
            type: Sequelize.STRING(1000)
          },

          createdBy: {
            allowNull: false,
            type: Sequelize.INTEGER
          },

          updatedBy: {
            allowNull: true,
            type: Sequelize.INTEGER
          },

          idModulo: {
            type: Sequelize.INTEGER,
            references: {
              model: 'Modulos',
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
          }
        }
      );

      await queryInterface.addIndex('Indicadores', ['createdBy'], { unique: false });
      await queryInterface.addIndex('Indicadores', ['updatedBy'], { unique: false });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Indicadores');
  }
};