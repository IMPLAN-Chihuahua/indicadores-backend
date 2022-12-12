require('dotenv').config();
const rateLimit = require('express-rate-limit');
const MINUTES = process.env.WINDOW_MINUTES || 10;
const MAX_REQUESTS = process.env.MAX_REQUESTS || 200;

const limiter = rateLimit({
    windowMs: MINUTES * 60 * 1000,
    max: MAX_REQUESTS,
    message: {
        status: 429,
        message: 'Too many requests, please try again later.'
    }
});

module.exports = limiter;