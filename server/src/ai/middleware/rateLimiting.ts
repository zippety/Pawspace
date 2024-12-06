import { Request, Response, NextFunction } from 'express';
import { RateLimiter } from '../utils/rateLimiter';
import { createAIError } from '../utils/ErrorHandler';

const rateLimiter = new RateLimiter(
    parseInt(process.env.HF_RATE_LIMIT_PER_MINUTE || '60'),
    60000
);

export const aiRateLimiter = (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip; // Use IP as the rate limit key
    
    if (rateLimiter.isRateLimited(key)) {
        const timeUntilReset = rateLimiter.getTimeUntilReset(key);
        
        // Add rate limit headers
        res.set({
            'X-RateLimit-Remaining': rateLimiter.getRemainingRequests(key).toString(),
            'X-RateLimit-Reset': Math.ceil(timeUntilReset / 1000).toString()
        });

        next(createAIError(
            'RATE_LIMIT_EXCEEDED',
            `Rate limit exceeded. Try again in ${Math.ceil(timeUntilReset / 1000)} seconds`
        ));
        return;
    }

    // Add rate limit headers
    res.set({
        'X-RateLimit-Remaining': rateLimiter.getRemainingRequests(key).toString(),
        'X-RateLimit-Reset': Math.ceil(rateLimiter.getTimeUntilReset(key) / 1000).toString()
    });

    next();
};
