const stream = require('stream');
const UsuarioIndicadorService = require('../services/usuarioIndicadorService');

const createRelation = async (req, res, next) => {
    const { idIndicador, usuarios, desde, hasta, idUser: idUsuario, indicadores } = req.matchedData;

    const updatedBy = req.sub;
    const createdBy = req.sub;

    try {
        if (idIndicador) {
            await createRelation(
                [...usuarios],
                [idIndicador],
                {
                    fechaDesde: desde,
                    fechaHasta: hasta,
                    updatedBy,
                    createdBy
                });
            return res.sendStatus(201);
        } else if (idUsuario) {
            await createRelation(
                [idUsuario],
                [...indicadores],
                {
                    fechaDesde: desde,
                    fechaHasta: hasta,
                    createdBy,
                    updatedBy
                });
            return res.sendStatus(201);
        }

    } catch (err) {
        next(err)
    }
}


module.exports = {
    createRelation
}