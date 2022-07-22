const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 200,
    message: {
        status: 429,
        message: 'Too many requests, please try again later.'
    }
});

module.exports = limiter;