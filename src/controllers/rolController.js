const { Rol } = require('../models');

const getRoles = async (_, res, next) => {
  try {
    const roles = await Rol.findAll();
    return res.status(200).json({
      data: roles
    });

  } catch (err) {
    next(err)
  }
};

module.exports = { getRoles };