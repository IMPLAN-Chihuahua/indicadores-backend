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
            type: Sequelize.STRING
          },
          
          nombre: {
            allowNull: false,
            type: Sequelize.STRING
          },

          definicion: {
            allowNull: false,
            defaultValue: 'No aplica',
            type: Sequelize.STRING
          },

          codigo: {
            allowNull: false,
            type: Sequelize.STRING
          },

          codigoObjeto: {
            allowNull: false,
            type: Sequelize.STRING
          },

          ultimoValorDisponible: {
            allowNull: false,
            type: Sequelize.STRING
          },
          
          anioUltimoValorDisponible: {
            allowNull: false,
            type: Sequelize.INTEGER
          },

          tendenciaActual: {
            allowNull: false,
            defaultValue: 'No aplica',
            type: Sequelize.STRING
          },

          tendenciaDeseada: {
            allowNull: false,
            defaultValue: 'No aplica',
            type: Sequelize.STRING
          },

          mapa: {
            allowNull: false,
            defaultValue: 0,
            type: Sequelize.SMALLINT
          },

          observaciones: {
            allowNull: false,
            defaultValue: 'No existen observaciones',
            type: Sequelize.TEXT
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
            type: Sequelize.DATE
          },

          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE
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