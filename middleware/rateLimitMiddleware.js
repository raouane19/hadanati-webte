// Simple in-memory rate limiter
const rateLimitMap = new Map();

const rateLimit = (options = {}) => {
    const {
        windowMs = 15 * 60 * 1000,
        max = 100,
        message = 'Too many requests, please try again later.'
    } = options;
    
    return (req, res, next) => {
        const ip = req.ip || req.connection.remoteAddress;
        const key = `${ip}-${req.path}`;
        const now = Date.now();
        
        if (!rateLimitMap.has(key)) {
            rateLimitMap.set(key, {
                count: 1,
                resetTime: now + windowMs
            });
            return next();
        }
        
        const record = rateLimitMap.get(key);
        
        if (now > record.resetTime) {
            record.count = 1;
            record.resetTime = now + windowMs;
            rateLimitMap.set(key, record);
            return next();
        }
        
        if (record.count >= max) {
            return res.status(429).json({
                success: false,
                message,
                retryAfter: Math.ceil((record.resetTime - now) / 1000)
            });
        }
        
        record.count++;
        rateLimitMap.set(key, record);
        next();
    };
};

// Stricter limiter for auth routes
const authRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many authentication attempts. Please try again after 15 minutes.'
});

// General API limiter
const apiRateLimit = rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    message: 'Too many requests. Please slow down.'
});

module.exports = {
    rateLimit,
    authRateLimit,
    apiRateLimit
};