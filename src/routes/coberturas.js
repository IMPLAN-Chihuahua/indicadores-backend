const promisedRouter = require('express-promise-router');
const express = require('express');
const { determineModel } = require('../middlewares/determinePathway');
const { generalFilterOptions, paramValidationRules, paginationValidationRules, generalSortValidationRules, validate } = require('../middlewares/validator/generalValidator');
const { verifyUserHasRoles } = require('../middlewares/auth');
const { getInformation } = require('../controllers/generalController');
const router = promisedRouter()

router.get('/info/general',
    determineModel,
    generalFilterOptions(),
    paramValidationRules(),
    paginationValidationRules(),
    generalSortValidationRules(),
    validate,
    // verifyUserHasRoles(['ADMIN', 'USER']),
    getInformation
)

module.exports = router;