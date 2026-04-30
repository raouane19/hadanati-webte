// Global error handler middleware
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.stack);
    
    let statusCode = err.status || 500;
    let message = err.message || 'Internal server error';
    
    // Handle specific error types
    if (err.code === 'ER_DUP_ENTRY') {
        statusCode = 400;
        message = 'Duplicate entry. This record already exists.';
    }
    
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        statusCode = 400;
        message = 'Invalid reference. The related record does not exist.';
    }
    
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
        statusCode = 400;
        message = 'Cannot delete. This record is referenced by other records.';
    }
    
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token. Please login again.';
    }
    
    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired. Please login again.';
    }
    
    if (err.name === 'MulterError') {
        statusCode = 400;
        if (err.code === 'LIMIT_FILE_SIZE') {
            message = 'File too large. Max size is 5MB.';
        } else {
            message = 'File upload error.';
        }
    }
    
    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

// 404 Not Found handler
const notFound = (req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
};

// Async wrapper to avoid try-catch in controllers
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
    errorHandler,
    notFound,
    asyncHandler
};