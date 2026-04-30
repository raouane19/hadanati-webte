const { body, param, query, validationResult } = require('express-validator');

// Middleware to check validation results
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

// Parent registration validation
const validateParentRegister = [
    body('first_name').trim().notEmpty().withMessage('First name is required').isLength({ min: 2, max: 50 }),
    body('last_name').trim().notEmpty().withMessage('Last name is required').isLength({ min: 2, max: 50 }),
    body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone').optional().trim(),
    validate
];

// Daycare registration validation
const validateDaycareRegister = [
    body('name').trim().notEmpty().withMessage('Daycare name is required').isLength({ min: 2, max: 100 }),
    body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }),
    body('phone').optional().trim(),
    body('address').optional().trim(),
    body('capacity').optional().isInt({ min: 1 }),
    body('price').optional().isFloat({ min: 0 }),
    validate
];

// Login validation
const validateLogin = [
    body('email').trim().notEmpty().withMessage('Email is required').isEmail(),
    body('password').notEmpty().withMessage('Password is required'),
    validate
];

// Child validation
const validateChild = [
    body('name').trim().notEmpty().withMessage('Child name is required').isLength({ min: 2, max: 100 }),
    body('age').notEmpty().withMessage('Age is required').isInt({ min: 0, max: 18 }),
    body('gender').optional().isIn(['male', 'female', 'other']),
    body('medical_issues').optional().trim(),
    validate
];

// Request validation
const validateRequest = [
    body('child_id').notEmpty().withMessage('Child ID is required').isInt(),
    body('daycare_id').notEmpty().withMessage('Daycare ID is required').isInt(),
    body('schedule_type').optional().isIn(['full-time', 'half-time']),
    validate
];

// Review validation
const validateReview = [
    body('comment').optional().trim().isLength({ max: 1000 }),
    body('rating').notEmpty().withMessage('Rating is required').isInt({ min: 1, max: 5 }),
    validate
];

// ID parameter validation
const validateIdParam = [
    param('id').notEmpty().withMessage('ID is required').isInt(),
    validate
];

// Email validation
const validateEmail = [
    body('email').trim().notEmpty().withMessage('Email is required').isEmail(),
    validate
];

// Password reset validation
const validatePasswordReset = [
    body('email').trim().notEmpty().withMessage('Email is required').isEmail(),
    body('code').notEmpty().withMessage('Verification code is required').isLength({ min: 6, max: 6 }),
    body('new_password').notEmpty().withMessage('New password is required').isLength({ min: 6 }),
    validate
];

module.exports = {
    validate,
    validateParentRegister,
    validateDaycareRegister,
    validateLogin,
    validateChild,
    validateRequest,
    validateReview,
    validateIdParam,
    validateEmail,
    validatePasswordReset
};