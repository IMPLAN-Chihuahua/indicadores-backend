const express = require('express');
const { determineModel } = require('../middlewares/determinePathway');
const { generalFilterOptions, paramValidationRules, paginationValidationRules, generalSortValidationRules, validate } = require('../middlewares/validator/generalValidator');
const { getInformation } = require('../controllers/generalController');
const { countIndicadoresByDimension, editDimension } = require('../controllers/dimensionController');
const { verifyJWT, verifyUserIsActive, verifyUserHasRoles } = require('../middlewares/auth');
const { uploadImage } = require('../middlewares/fileUpload');
const { DESTINATIONS } = require('../services/fileService');
const { updateDimensionValidationRules } = require('../middlewares/validator/dimensionValidator');
const { exists } = require('../middlewares/resourceExists');

const router = express.Router();

router.get('/info/general',
    determineModel,
    generalFilterOptions(),
    paramValidationRules(),
    paginationValidationRules(),
    generalSortValidationRules(),
    validate,
    countIndicadoresByDimension
);

router.patch('/:idDimension',
    verifyJWT,
    verifyUserIsActive,
    verifyUserHasRoles(['ADMIN']),
    uploadImage(DESTINATIONS.DIMENSIONES),
    updateDimensionValidationRules(),
    validate,
    exists('idDimension', 'Dimension'),
    editDimension

)

module.exports = router;