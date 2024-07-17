const express = require('express');
const { generalFilterOptions, paramValidationRules, paginationValidationRules, generalSortValidationRules, validate } = require('../middlewares/validator/generalValidator');
const { countIndicadoresByDimension, editDimension, getDimension } = require('../controllers/dimensionController');
const { verifyJWT, verifyUserIsActive, verifyUserHasRoles } = require('../middlewares/auth');
const { uploadImage } = require('../middlewares/fileUpload');
const { DESTINATIONS } = require('../services/fileService');
const { updateDimensionValidationRules } = require('../middlewares/validator/dimensionValidator');
const { exists } = require('../middlewares/resourceExists');

const { getIndicadores } = require('../controllers/indicadorController');
const {
    filterIndicadoresValidationRules,
    sortValidationRules,
} = require('../middlewares/validator/indicadorValidator')
const { determinePathway, SITE_PATH, determineModel } = require('../middlewares/determinePathway');

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

router.route('/indicadores')
    .get(
        paginationValidationRules(),
        paramValidationRules(),
        sortValidationRules(),
        filterIndicadoresValidationRules(),
        validate,
        determinePathway(SITE_PATH),
        getIndicadores
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
);

router.get('/:idDimension',
    paramValidationRules(),
    validate,
    getDimension
)


module.exports = router;