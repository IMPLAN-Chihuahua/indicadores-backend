const { getIdIndicadorRelatedTo } = require("../services/indicadorService");
const { isUsuarioAssignedToIndicador } = require("../services/usuarioIndicadorService");
const { getRol } = require("../services/usuariosService");


const verifyUserIsAssignedToIndicador = ({ routeParam, relatedTo }) => async (req, res, next) => {
    const rol = req.rol || await getRol(req.sub)

    if (rol === 'ADMIN') {
        return next();
    }

    let idIndicador = req.matchedData[routeParam];

    if (!idIndicador) {
        const { model, pathId } = relatedTo;
        idIndicador = await getIdIndicadorRelatedTo(model, req.matchedData[pathId])
    }

    const userIsAssignedToIndicador = await isUsuarioAssignedToIndicador(req.sub, idIndicador)
    if (!userIsAssignedToIndicador) {
        return res.status(403).send('No tienes permiso para realizar esta operación')
    }

    return next();
}

const verifyUserIsOwnerOfIndicador = ({ routeParam, relatedTo }) => async (req, res, next) => {
    const rol = req.rol || await getRol(req.sub)

    if (rol === 'ADMIN') {
        return next();
    }

    let idIndicador = req.matchedData[routeParam];
    if (!idIndicador) {
        const { model, pathId } = relatedTo;
        idIndicador = await getIdIndicadorRelatedTo(model, req.matchedData[pathId])
    }

    const userIsOwner = await isUsuarioAssignedToIndicador(req.sub, idIndicador, { isOwner: true })
    if (!userIsOwner) {
        return res.status(403).send('No puedes realizar esta acción porque no estás asignado o no eres el responsable principal del indicador')
    }

    return next();
}


module.exports = {
    verifyUserIsAssignedToIndicador,
    verifyUserIsOwnerOfIndicador
}