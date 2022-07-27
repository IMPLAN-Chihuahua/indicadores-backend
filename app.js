const express = require('express');
require('dotenv').config();
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path')
const logger = require('./src/config/logger');
const logErrors = require('./src/middlewares/log');

const PORT = process.env.PORT || 8080;
const env = process.env.NODE_ENV || 'development';
const servers = [
  {
    url: 'https://indicadores-backend.chihuahuametrica.online/api/v1',
    description: 'Production Server'
  }
]

if (env === 'development') {
  servers.push({
    url: `http://localhost:${PORT}/api/v1`,
    description: 'Local setup'
  })
}

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Indicadores API',
      version: '1.0.0',
      description: `The Indicadores API follows the constraints of the 
      REST architectural style. This set of endpoints keep track of urban data.`
    },
    servers
  },
  apis: [`${__dirname}/src/routes/*.js`],

}

const swaggerSpec = swaggerJSDoc(options)

const app = express();

// Enable when behind a reverse proxy (Heroku, Bluemix, AWS ELB or API Gateway, Nginx, etc)
// See https://expressjs.com/en/guide/behind-proxies.html
app.set('trust proxy', 1);

// API throttling (prevent DoS attacks)
app.use(require('./src/middlewares/limiter'));

// Enable CORS for all requests
app.use(cors())

// Prevent common vulnerabilities
const cspDefaults = helmet.contentSecurityPolicy.getDefaultDirectives();
delete cspDefaults['upgrade-insecure-requests'];
app.use(helmet({
  contentSecurityPolicy: { directives: cspDefaults }
}));

// Log HTTP requests with Morgan and Winston
app.use(morgan(':method :url :status :response-time ms - :res[content-length]', {
  stream: { write: message => logger.http(message.trim()) }
}));

// Parse data from requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API documentation
app.use('/api/v1/documentation', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Define routes
app.use('/api/v1/auth', require('./src/routes/auth'));
app.use('/api/v1/usuarios', require('./src/routes/usuarios'));
app.use('/api/v1/roles', require('./src/routes/roles'));
app.use('/api/v1/modulos', require('./src/routes/modulos'));
app.use('/api/v1/indicadores', require('./src/routes/indicadores'));
app.use('/api/v1/catalogos', require('./src/routes/catalogos'));
app.use('/api/v1/documentos', require('./src/routes/documentos'));
app.use('/api/v1/me', require('./src/routes/me'));
app.use('/api/v1/historicos', require('./src/routes/historicos'));

app.use('/images', express.static(path.join(__dirname, 'uploads', 'images')));
app.use('/images/indicador', express.static(path.join(__dirname, 'uploads', 'indicadores/images')));
app.use('/images/temaInteres', express.static(path.join(__dirname, 'uploads', 'modules/images')));
app.use('/images/user', express.static(path.join(__dirname, 'uploads', 'users/images')));
app.use(logErrors)

const server = app.listen(PORT, () => logger.info(`App starting on port ${PORT}`));

module.exports = { server, app };