const { app, PORT } = require('../../app');

const mochaGlobalSetup = function () {
    this.server = app.listen(PORT, () => {
        console.log(`App has started on port ${PORT}`);
    })
};

const mochaGlobalTeardown = function () {
    this.server.close(() => {
        console.log('App has stopped');
    });
};

module.exports = { mochaGlobalSetup, mochaGlobalTeardown };