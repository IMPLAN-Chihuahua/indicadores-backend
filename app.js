const express = require('express');
require('dotenv').config();
const db = require('./src/config/db');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Test",
      version: "1.0.0",
      description: "Test Description"
    },
    servers: [
      {
        url: "http://localhost:8080/api/v1"
      }
    ],

  },
  apis: [`${__dirname}/src/routes/*.js`]
}

console.log(__dirname);

const swaggerSpec = swaggerJSDoc(options)

const app = express();

// Verify connection to database
db.sequelize.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error: ' + err));

/*
db.sequelize.sync({ force: true, match: /_test$/ })
  .then(() => console.log('Tables created'))
  .catch(err => console.log('There was an error'));
*/

// enable when behind a reverse proxy (Heroku, Bluemix, AWS ELB or API Gateway, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);

// API rate limiter (prevent DoS attacks)
app.use(require('./src/middlewares/limiter'));

// enable CORS for all requests
app.use(cors());

// Prevent common vulnerabilities
app.use(helmet());

// log HTTP request
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Define routes
app.use('/api/v1', require('./src/routes/auth'));
app.use('/api/v1/usuarios', require('./src/routes/index'));

const PORT = process.env.APP_PORT || 8081;

app.listen(PORT, () => console.log(`App starting on port ${PORT}`));
