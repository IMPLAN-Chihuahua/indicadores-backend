const { getIdIndicadorRelatedTo } = require("../services/indicadorService");
const { isUsuarioAssignedToIndicador } = require("../services/usuarioIndicadorService");
const { getRol } = require("../services/usuariosService");


const verifyUserCanPerformActionOnIndicador = ({ indicadorPathId, relatedTo }) => async (req, res, next) => {
    const rol = req.rol || await getRol(req.sub)

    if (rol === 'ADMIN') {
        next();
    }

    let idIndicador = req.matchedData[indicadorPathId];

    if (!idIndicador) {
        const { model, pathId } = relatedTo;
        idIndicador = await getIdIndicadorRelatedTo(model, req.matchedData[pathId])
    }

    const userIsAssignedToIndicador = await isUsuarioAssignedToIndicador(req.sub, idIndicador)
    if (!userIsAssignedToIndicador) {
        return res.status(403).send('No tienes permiso para realizar esta operación')
    }

    next();
}


module.exports = {
    verifyUserCanPerformActionOnIndicador
}