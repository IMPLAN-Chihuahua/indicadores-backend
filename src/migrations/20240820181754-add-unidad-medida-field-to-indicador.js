'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn('Indicadores', 'unidadMedida', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
      }, {
        transaction
      });
      const MEDIDA_ID = 2;
      const [medidaValues] = await queryInterface.sequelize.query(`
        select i."id", cd."nombre" as "unidadMedida" from "Indicadores" i
        inner join "CatalogoDetailIndicadores" cdi on cdi."idIndicador" = i."id"
        inner join "CatalogoDetails" cd on cd."id" = cdi."idCatalogoDetail" 
        inner join "Catalogos" c on c."id" = cd."idCatalogo" 
        where c."id" = ${MEDIDA_ID}
        order by i."id"
      `, {
        transaction
      })

      await queryInterface.sequelize.query(`
        update "Indicadores" set "unidadMedida" = "data_table"."unidadMedida"
          from (
              select unnest(array[${medidaValues.map(m => `'${m.unidadMedida}'`).join(',')}]) as "unidadMedida",
                     unnest(array[${medidaValues.map(m => m.id).join(',')}]) as "idIndicador"
          ) as "data_table"
        where "Indicadores"."id" = "data_table"."idIndicador"
      `, {
        transaction
      })
      await transaction.commit();
    } catch (err) {
      console.log(err)
      await transaction.rollback();
    }
  },

  async down(queryInterface, Sequelize) {
    // await queryInterface.removeColumn('Indicadores', 'unidadMedida')
  }
};
