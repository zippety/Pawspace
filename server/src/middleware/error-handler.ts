import { Request, Response, NextFunction } from 'express';
import { AIServiceError } from '../ai/errors';

export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', error);

    if (error instanceof AIServiceError) {
        return res.status(500).json({
            error: error.message,
            code: error.code,
            details: process.env.NODE_ENV === 'development' ? error.details : undefined
        });
    }

    return res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
};
