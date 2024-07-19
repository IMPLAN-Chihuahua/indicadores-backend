const { isUsuarioAssignedToIndicador } = require("./usuarioIndicadorService");

/**
 * Only users with ADMIN role can execute any action,
 * however users with other roles, have to be assigned to the indicador 
 * with the id specified in the options object
 * @param {Object} options information about user and the indicador to be updated
 * @param {string} options.rol rol of user (ADMIN, USER)
 * @param {number} options.idUsuario 
 * @param {number} options.idIndicador
 * @param {onAllowedCallback} onAllowed function to execute if user is allowed
 * @param {onNotAllowedCallback} onNotAllowed function to execute if user is not allowed
 */
const validate = async ({ rol, idUsuario, idIndicador }, onAllowed, onNotAllowed) => {
  try {
    if (rol === 'ADMIN' || await isUsuarioAssignedToIndicador(idUsuario, idIndicador)) {
      return onAllowed();
    }
    return onNotAllowed();
  } catch (err) {
    throw err;
  }
}

module.exports = { validate }