const express = require('express');
require('dotenv').config();
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Indicadores API",
      version: "1.0.0",
      description: "Set of endpoints to keep track of urban data."
    },
    servers: [
      {
        url: "http://localhost:8080/api/v1"
      }
    ],

  },
  apis: [`${__dirname}/src/routes/*.js`]
}

const swaggerSpec = swaggerJSDoc(options)

const app = express();

// Enable when behind a reverse proxy (Heroku, Bluemix, AWS ELB or API Gateway, Nginx, etc)
// See https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);

// API rate limiter (prevent DoS attacks)
app.use(require('./src/middlewares/limiter'));

// Enable CORS for all requests
app.use(cors());

// Prevent common vulnerabilities
app.use(helmet());

// Log HTTP requests 
app.use(morgan('dev'));

// Parse data from requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API documentation
app.use('/api/v1/documentation', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Define routes
app.use('/api/v1', require('./src/routes/auth'));
app.use('/api/v1/usuarios', require('./src/routes/usuarios'));
app.use('/api/v1/roles', require('./src/routes/roles'));
app.use('/api/v1/modulos', require('./src/routes/modulos'));
app.use('/api/v1/indicadores', require('./src/routes/indicadores'));
app.use('/api/v1/catalogos', require('./src/routes/catalogos'));

const PORT = 8080;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`App starting on port ${PORT}`);
  });
}

module.exports = { app, PORT };