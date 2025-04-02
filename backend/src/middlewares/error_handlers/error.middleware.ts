import { Request, Response, NextFunction } from 'express'; // Importing the logger
import { logger } from '@/server';
import { failed, handleServiceResponse } from '@/utils/httpHandlers';
import { StatusCodes } from 'http-status-codes';
// Global error handling middleware
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    // Log the error
    logger.error(err.message || 'Internal Server Error');

    // Send a standardized error response
    const resObj = failed(err.message || 'Internal Server Error', err.status || StatusCodes.INTERNAL_SERVER_ERROR);
    handleServiceResponse(resObj, res);
};

export default errorHandler;
