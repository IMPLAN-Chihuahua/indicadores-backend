const express = require('express');
const app = express();
const port = 8081;

app.get('/', (req, res) => {
    res.json({ msg: "test" });
})

app.listen(port, () => {
    console.log(`app starting on port ${port}`);
});
