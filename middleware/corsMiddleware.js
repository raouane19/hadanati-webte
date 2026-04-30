const cors = require('cors');

// Allowed origins
const allowedOrigins = process.env.NODE_ENV === 'production'
    ? ['https://yourdomain.com', 'https://www.yourdomain.com']
    : [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:8080',
        'http://localhost:4200',
        'http://127.0.0.1:5500',
        'http://localhost:5500'
    ];

// CORS options
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        } else {
            console.log(`❌ CORS blocked origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['Authorization']
};

const simpleCors = cors();
const strictCors = cors(corsOptions);

const dynamicCors = (req, res, next) => {
    if (req.path === '/api/health' || req.path === '/test') {
        return simpleCors(req, res, next);
    }
    return strictCors(req, res, next);
};

const corsWithLogging = (req, res, next) => {
    const origin = req.headers.origin;
    console.log(`🌐 CORS request from origin: ${origin || 'unknown'}`);
    
    res.header('Access-Control-Allow-Origin', origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
};

module.exports = {
    corsOptions,
    simpleCors,
    strictCors,
    dynamicCors,
    corsWithLogging
};