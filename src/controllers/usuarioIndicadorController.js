const stream = require('stream');
const UsuarioIndicadorService = require('../services/usuarioIndicadorService');
const { getUsuariosByBulk } = require('../services/usuariosService');

const createRelation = async (req, res, next) => {
    const { idIndicador, idUsuario, usuarios, desde, hasta, indicadores } = req.matchedData;

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

const getIndicadoresRelations = async (req, res, next) => {
    const { page, perPage, order, sortBy } = req.matchedData;

    try {
        const { data } = await UsuarioIndicadorService.getUsuariosIndicadores(page, perPage, order, sortBy);

        // Iterate through data and retrieve only their id. If the ID repeats, ommitting repeated values
        const ownersIds = [...new Set(data.map(indicador => indicador.owner))];

        const { usuarios } = await getUsuariosByBulk(ownersIds);

        // Generate a new array with the data and the owner's name
        const dataWithOwners = data.map(indicador => {
            const owner = usuarios.find(usuario => usuario.id === indicador.owner);
            return {
                ...indicador,
                owner: owner.nombres + ' ' + owner.apellidoPaterno
            }
        });

        return res.status(200).json({ data: dataWithOwners });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    createRelation,
    getIndicadoresRelations,
}