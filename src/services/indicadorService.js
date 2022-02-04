const { Indicador } = require('../models');

const getIndicadores = async () => {
    return await Indicador.findAndCountAll();
};

const serviceGetIndicador = async (idIndicador, Format) => {
    if (typeof format != 'undefined'){
      return generateFile(format, res, indicador)
    }
    return await Indicador.findOne({
      where: {
        id: idIndicador,
      },
      include: [
        {
          model: UnidadMedida,
          required: true,
          attributes: [],
        },
        {
          model: Modulo,
          required: true,
          attributes: ["id", "temaIndicador", "color"],
        },
        {
          model: CoberturaGeografica,
          required: true,
          attributes: ["nombre"],
        },
        {
          model: Historico,
          required: true,
          attributes: ["anio", "valor", "fuente"],
          limit: 10,
          order: [["anio", "DESC"]],
        },
        {
          model: Mapa,
          required: false
        },
        {
          model: Formula,
          required: false,
          include: [
            {
              model: Variable,
              required: true,
              include: [{
                model: UnidadMedida,
                required: true,
              }],
              attributes: ['nombre', 'nombreAtributo', 'dato', 'idUnidad', [sequelize.literal('"Formula->Variables->UnidadMedida"'), "Unidad"],],
            }
          ]
        }
      ],
      attributes: [
        "id",
        "urlImagen",
        "nombre",
        "definicion",
        "ultimoValorDisponible",
        "anioUltimoValorDisponible",
        "tendenciaActual",
        "tendenciaDeseada",
        "mapa",
        [sequelize.literal('"UnidadMedida"."nombre"'), "Unidad"],
      ],
    });
}

module.exports = { getIndicadores, serviceGetIndicador };