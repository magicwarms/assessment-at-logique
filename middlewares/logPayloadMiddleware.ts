import { Request, Response, NextFunction } from 'express';
import logger from '../logger';
import { sanitizeHeaders } from '../utils/sanitizeHeaders';

// Custom middleware to log request and response payloads
export function logPayloadMiddleware(req: Request, res: Response, next: NextFunction) {
    const { method, url, headers, body: requestBody } = req;
    const sanitizedHeaders = sanitizeHeaders(headers);

    // Log request payload
    logger.info('Request', {
        method,
        url,
        headers: sanitizedHeaders,
        requestBody
    });

    const originalSend = res.send.bind(res);

    res.send = (body) => {
        // Log response payload
        logger.info('Response', {
            method,
            url,
            statusCode: res.statusCode,
            headers: res.getHeaders(), // Optionally sanitize response headers if needed
            responseBody: body
        });

        return originalSend(body);
    };

    next();
}