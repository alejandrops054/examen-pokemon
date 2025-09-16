const rateLimit = require('express-rate-limit');

const throttle = rateLimit({
    windowMs: 60000, 
    max: 5,
    message: 'Límite alcanzado. Por favor espera 1 minuto antes de volver a intentarlo.',
    headerss: {
        'X-Rate-Limit-Remaining': 'remaining',
        'X-Rate-Limit-Reset': 'reset'
    },
    skipFailedRequests: false,
    keyGenerator: (req) => {
        return req.ip || 'unknown';
    }
});

module.exports = throttle;