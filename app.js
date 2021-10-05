const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();
const port = process.env.APP_PORT || 8081;

const app = express();

// seguridad basica
app.use(cors());
app.use(helmet());

// obtener objetos de la informacion en las peticiones
app.use(express.json());
app.use(express.urlencoded());

app.listen(port, () => {
    console.log(`app starting on port ${port}`);
});
