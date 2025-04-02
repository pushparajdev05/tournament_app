import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

// Reusable validation error handler
const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;  // Ensure function exits after sending a response
    }
    next();  // Call next only if there are no validation errors
};

// Registration validation middleware
export const validateRegistration = [
    body("username")
        .trim()
        .notEmpty().withMessage("Username is required")
        .isLength({ min: 3 }).withMessage("Username must be at least 3 characters long")
        .escape(),
    
    body("email")
        .trim()
        .isEmail().withMessage("Valid email is required")
        .normalizeEmail(),
    
    body("password")
        .isString()
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
        .matches(/\d/).withMessage("Password must contain at least one number")
        .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter"),
    
    handleValidationErrors,
];
