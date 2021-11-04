const express = require('express');
const db = require('./src/config/db');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Verify connection to database
db.sequelize.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error: ' + err))

// Init middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define routes
app.use('/api/v1', require('./src/routes/auth'));
app.use('/api/v1/usuarios', require('./src/routes/index'));

const PORT = process.env.APP_PORT || 8081;

app.listen(PORT, () => console.log(`app starting on port ${PORT}`));
