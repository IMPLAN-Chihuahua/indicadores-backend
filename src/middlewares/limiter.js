const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 200
});

module.exports = limiter;