import { Request, Response, NextFunction } from "express";
import { ZodError, type ZodSchema } from "zod";
import { User, passwordResetSchema, emailSchema, registerSchema } from "@/Schema/userAuthSchema/AuthSchema";
import { StatusCodes } from "http-status-codes";
import { ServiceResponse, handleServiceResponse } from "@/utils/httpHandlers";

// Zod middleware validator for request
export const validateRequest = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
	try {
		schema.parse(req.body);
		next();
	} catch (err) {
		const errorMessage = `Invalid input: ${(err as ZodError).errors.map((e) => e.message).join(", ")}`;
		console.log("zod errro msg :" + (err as ZodError).errors);
		const statusCode = StatusCodes.BAD_REQUEST;
		const serviceResponse = ServiceResponse.failure(errorMessage, null, statusCode);
		handleServiceResponse(serviceResponse, res);
	}
};

//user registration validation
export const validateRegister = validateRequest(registerSchema)

// Email validation middleware
export const validateEmailOnly = validateRequest(emailSchema);

//user profile input validation
export const validateUserProfile = validateRequest(User);

//user email and password validation
export const validatePasswordReset = validateRequest(passwordResetSchema);
