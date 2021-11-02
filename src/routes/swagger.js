const router = require('express').Router();
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../../swagger.json');
const swaggerSpec = swaggerJSDoc({ swaggerDefinition: swaggerDocument, apis: ['./auth.js'] })

router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerSpec));

module.exports = router;