const express = require('express');
const router = express.Router();

const {
    paramValidationRules,
    validate,
    generalFilterOptions,
    paginationValidationRules,
    generalSortValidationRules,
    idValidation,
} = require('../middlewares/validator/generalValidator');
const { determineModel } = require('../middlewares/determinePathway');
const { getInformation } = require('../controllers/generalController');
const { getMetasFromOds } = require('../controllers/odsController');


router.get('/',
    determineModel,
    generalFilterOptions(),
    paramValidationRules(),
    paginationValidationRules(),
    generalSortValidationRules(),
    validate,
    getInformation
);

router.get('/metas',
    idValidation(),
    paginationValidationRules(),
    generalSortValidationRules(),
    validate,
    getMetasFromOds
)

module.exports = router;