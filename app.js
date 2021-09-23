const express = require('express');
const app = express();
const port = 8081;
const { sequelize } = require('./config/db');
require('dotenv').config();

console.log(sequelize.config);
sequelize.authenticate()
    .then(() => console.log('connection has been established successfully'))
    .catch(err => console.error(err));

app.get('/', (req, res) => {
    res.json({ msg: "test" });
})

app.listen(port, () => {
    console.log(`app starting on port ${port}`);
});
