import { Request, Response, NextFunction } from "express";
import { ZodError, type ZodSchema } from "zod";
import { User, passwordResetSchema, emailSchema } from "@/Schema/userAuth_schema/AuthSchema";

// Generic Zod validation middleware
const validateRequest = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({ errors: error.errors });
                return; // Explicitly return to prevent further execution
            }
            res.status(500).json({ error: "Server error" });
            return;
        }
    };
};


// Email validation middleware
export const validateEmailOnly = validateRequest(emailSchema);

// Apply the validation schemas
export const validateUserProfile = validateRequest(User);
export const validatePasswordReset = validateRequest(passwordResetSchema);
