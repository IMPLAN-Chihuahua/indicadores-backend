const express = require('express');
const { determineModel } = require('../middlewares/determinePathway');
const { generalFilterOptions, paramValidationRules, paginationValidationRules, generalSortValidationRules, validate } = require('../middlewares/validator/generalValidator');
const { getInformation } = require('../controllers/generalController');

const router = express.Router();

router.get('/info/general',
    determineModel,
    generalFilterOptions(),
    paramValidationRules(),
    paginationValidationRules(),
    generalSortValidationRules(),
    validate,
    getInformation
);

module.exports = router;