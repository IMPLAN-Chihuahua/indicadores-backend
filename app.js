const express = require('express');
const app = express();
const port = 8081;

app.listen(port, () => {
    console.log(`app starting at port ${port}`);
});