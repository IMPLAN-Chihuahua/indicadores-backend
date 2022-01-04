const { Rol } = require('../models');

const getRoles = async (_, res) => {
    try {
        const roles = await Rol.findAll();
        return res.status(200).json({
            data: roles 
        });

    } catch(err) {
        console.log(err)
        res.sendStatus(500);
    }
};

module.exports = { getRoles };