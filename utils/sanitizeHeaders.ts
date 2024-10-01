export const sanitizeHeaders = (headers: { [key: string]: unknown }) => {
    return Object.keys(headers).reduce((acc, key) => {
        acc[key] = key.toLowerCase() === 'authorization' ? '[REDACTED]' : headers[key];
        return acc;
    }, {} as { [key: string]: unknown });
};