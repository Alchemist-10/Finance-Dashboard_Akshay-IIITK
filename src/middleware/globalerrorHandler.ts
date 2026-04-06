
import { Request, Response, NextFunction } from 'express';

// Express recognizes a middleware with 4 arguments as an error handler
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[Error]:', err.message || err);

  // Handle specific Prisma database errors
  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'Conflict: Unique constraint failed. Record already exists.' });
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Not Found: The requested record does not exist.' });
  }

  // Fallback for unhandled errors
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: statusCode === 500 ? 'Internal Server Error' : err.message,
    // Only show detailed stacks in development mode for security
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};