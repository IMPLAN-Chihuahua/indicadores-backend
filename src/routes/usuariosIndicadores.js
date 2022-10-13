const express = require('express');
const router = express.Router();

const {
    paramValidationRules,
    validate,
} = require('../middlewares/validator/generalValidator')

const { verifyJWT, verifyUserIsActive } = require('../middlewares/auth');


router.get(

)


module.exports = router;