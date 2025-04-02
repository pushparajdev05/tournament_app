import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { failed, handleServiceResponse,} from "@/utils/httpHandlers";
import { StatusCodes } from "http-status-codes";
import { env } from "@/config/envConfig";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

const SECRET = env.JWT_SECRET; // Ensure your environment variable is set

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const resObj = failed("Unauthorized: No token provided", StatusCodes.UNAUTHORIZED);
    handleServiceResponse(resObj, res);
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET) as { id: string };

    if (!decoded.id) {
      const resObj = failed("Forbidden: Invalid token payload", StatusCodes.FORBIDDEN);
      handleServiceResponse(resObj, res);
      return; // Ensure function exits after sending response
    }

    req.user = { id: decoded.id }; //  Correctly attach user ID to request

    next(); //  Proceed to the next middleware
  } catch (error) {
    const resObj = failed("Forbidden: Invalid token", StatusCodes.FORBIDDEN);
    handleServiceResponse(resObj, res);
    return;
  }
};
