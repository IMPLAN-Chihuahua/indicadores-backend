const UsuarioIndicadorService = require('../services/usuarioIndicadorService');
const ProtectedIndicadorService = require('../services/protectedIndicadorService');
const { getUsuariosByBulk } = require('../services/usuariosService');

const createRelationUI = async (req, res, next) => {
    const { relationIds, desde, hasta, id, relationType, expires } = req.matchedData;
    const updatedBy = req.sub;
    const createdBy = req.sub;
    try {
        if (relationType === 'usuarios') {
            await UsuarioIndicadorService.createRelation(
                [...relationIds],
                [id],
                {
                    fechaDesde: desde ? desde : null,
                    fechaHasta: hasta ? hasta : null,
                    updatedBy,
                    createdBy,
                    expires
                });
        } else if (relationType === 'indicadores') {
            await UsuarioIndicadorService.createRelation(
                [id],
                [...relationIds],
                {
                    fechaDesde: desde ? desde : null,
                    fechaHasta: hasta ? hasta : null,
                    updatedBy,
                    createdBy,
                    expires
                });
        } else if (relationType === 'modulos') {
            const indicadores = await UsuarioIndicadorService.createRelationWithModules(id);
            const indicadoresId = indicadores.map(indicador => indicador.id);
            await UsuarioIndicadorService.createRelation(
                [...relationIds],
                indicadoresId,
                {
                    fechaDesde: desde ? desde : null,
                    fechaHasta: hasta ? hasta : null,
                    updatedBy,
                    createdBy,
                    expires
                });
        }
        return res.sendStatus(201);

    } catch (err) {
        next(err)
    }
};

const getRelationInformation = async (data) => {
    const ownersIds = [...new Set(data.map(indicador => indicador.owner))];
    const { usuarios } = await getUsuariosByBulk(ownersIds);
    return { usuarios };
};

const getIndicadoresRelations = async (req, res, next) => {
    const page = req.matchedData.page || 1;
    const perPage = req.matchedData.perPage || 10;
    try {
        const { data } = await UsuarioIndicadorService.getUsuariosIndicadores(page, perPage, req.matchedData);
        const { usuarios } = await getRelationInformation(data);
        const indicadorData = data.map(indicador => {
            const owner = usuarios.find(usuario => usuario.id === indicador.owner);
            return {
                ...indicador,
                owner: owner.nombres + ' ' + owner.apellidoPaterno
            }
        });
        // Paginate indicadorData
        const total = indicadorData.length;
        const paginatedData = indicadorData.slice((page - 1) * perPage, page * perPage);
        return res.status(200).json({ data: paginatedData, total });
    } catch (err) {
        next(err);
    }
};

const getRelationUsers = async (req, res, next) => {
    const { idIndicador } = req.matchedData;
    const attributes = ['nombre']

    const page = req.matchedData.page || 1;
    const perPage = req.matchedData.perPage || 25;

    try {
        const { data, total } = await UsuarioIndicadorService.getRelationUsers(perPage, (page - 1) * perPage, idIndicador);

        const totalPages = Math.ceil(total / perPage);

        const { nombre } = await ProtectedIndicadorService.getIndicador(idIndicador, attributes);

        return res.status(200).json({ data, page, perPage, total, totalPages, nombre });
    } catch (err) {
        next(err);
    }
};

const getUsuarios = async (req, res, next) => {
    const { idIndicador } = req.matchedData;
    try {
        const result = await UsuarioIndicadorService.getUsuariosThatDoesntHaveIndicador(idIndicador);
        return res.status(200).json(result);
    }
    catch (err) {
        next(err);
    }
};

const deleteRelation = async (req, res, next) => {
    const { idRelacion } = req.matchedData;
    try {
        await UsuarioIndicadorService.deleteRelation(idRelacion);
        return res.sendStatus(204);
    } catch (err) {
        next(err);
    }
};

const updateRelation = async (req, res, next) => {
    const { idRelacion, desde, hasta, expires } = req.matchedData;

    const updatedBy = req.sub;
    try {
        await UsuarioIndicadorService.updateRelation(idRelacion, {
            fechaDesde: desde ? desde : null,
            fechaHasta: hasta ? hasta : null,
            updatedBy,
            expires
        });
        return res.sendStatus(204);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createRelationUI,
    getIndicadoresRelations,
    getRelationUsers,
    getUsuarios,
    deleteRelation,
    updateRelation,
}