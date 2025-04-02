import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

const SECRET = process.env.JWT_SECRET!; // Ensure your environment variable is set

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Unauthorized: No token provided" });
        return; 
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, SECRET) as { id: string };

        if (!decoded.id) {
            res.status(403).json({ message: "Forbidden: Invalid token payload" });
            return; // Ensure function exits after sending response
        }

        req.user = { id: decoded.id }; //  Correctly attach user ID to request

        next(); //  Proceed to the next middleware
    } catch (error) {
        res.status(403).json({ message: "Forbidden: Invalid token" });
        return; //  Ensure function exits
    }
};

//import logger from "../config/logger";