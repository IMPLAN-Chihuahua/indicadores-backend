const stream = require('stream');
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
    const { page, perPage, order, sortBy } = req.matchedData;

    try {
        const { data } = await UsuarioIndicadorService.getUsuariosIndicadores(page, perPage, order, sortBy);

        const { usuarios } = await getRelationInformation(data);

        const indicadorData = data.map(indicador => {
            const owner = usuarios.find(usuario => usuario.id === indicador.owner);

            return {
                ...indicador,
                owner: owner.nombres + ' ' + owner.apellidoPaterno
            }

        });

        return res.status(200).json({ data: indicadorData });
    } catch (err) {
        next(err);
    }
};

const getRelationUsers = async (req, res, next) => {
    const { idIndicador } = req.matchedData;
    const attributes = ['nombre']
    try {
        const { data, total } = await UsuarioIndicadorService.getRelationUsers(idIndicador);
        const { nombre } = await ProtectedIndicadorService.getIndicador(idIndicador, attributes);

        return res.status(200).json({ data, total, nombre });
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
    updateRelation
}