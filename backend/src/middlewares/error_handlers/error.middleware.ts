import { Request, Response, NextFunction } from 'express'; // Importing the logger
import { logger } from '@/server';
// Global error handling middleware
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    // Log the error
    logger.error(err.message || 'Internal Server Error');

    // Send a standardized error response
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
};

export default errorHandler;
