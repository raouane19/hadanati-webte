const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

// Create logs directory
const logDir = './logs';
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

// Create write streams
const accessLogStream = fs.createWriteStream(
    path.join(logDir, 'access.log'),
    { flags: 'a' }
);

const errorLogStream = fs.createWriteStream(
    path.join(logDir, 'error.log'),
    { flags: 'a' }
);

// Custom token for request body (excluding sensitive data)
morgan.token('body', (req) => {
    if (!req.body || Object.keys(req.body).length === 0) return '';
    const safeBody = { ...req.body };
    delete safeBody.password;
    delete safeBody.new_password;
    return JSON.stringify(safeBody);
});

// Custom token for colored status
morgan.token('colored-status', (req, res) => {
    const status = res.statusCode;
    const color = status >= 500 ? '\x1b[31m' :
                  status >= 400 ? '\x1b[33m' :
                  status >= 300 ? '\x1b[36m' :
                  status >= 200 ? '\x1b[32m' : '\x1b[0m';
    return `${color}${status}\x1b[0m`;
});

// Development logging format
const devFormat = ':method :url :colored-status :response-time ms';

// Production logging format
const prodFormat = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms';

// Morgan middleware
const devLogger = morgan(devFormat, {
    skip: (req, res) => process.env.NODE_ENV === 'production',
    stream: process.stdout
});

const prodLogger = morgan(prodFormat, {
    skip: (req, res) => process.env.NODE_ENV !== 'production',
    stream: accessLogStream
});

// Request logger middleware
const requestLogger = (req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
        const duration = Date.now() - start;
        const logEntry = {
            timestamp: new Date().toISOString(),
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip || req.connection.remoteAddress
        };
        
        if (res.statusCode >= 400) {
            errorLogStream.write(JSON.stringify(logEntry) + '\n');
        }
        
        if (process.env.NODE_ENV !== 'production') {
            const statusColor = res.statusCode >= 400 ? '\x1b[31m' : '\x1b[32m';
            console.log(`${statusColor}[${logEntry.timestamp}] ${logEntry.method} ${logEntry.url} - ${logEntry.status} - ${logEntry.duration}\x1b[0m`);
        }
    });
    
    next();
};

const logQuery = (query, params) => {
    if (process.env.NODE_ENV === 'development') {
        console.log('\x1b[36m[SQL]\x1b[0m', query);
        if (params && params.length) {
            console.log('\x1b[90m[Params]\x1b[0m', params);
        }
    }
};

module.exports = {
    devLogger,
    prodLogger,
    requestLogger,
    logQuery
};