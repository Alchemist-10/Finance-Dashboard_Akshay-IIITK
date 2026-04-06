// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  // This matches the payload we expect from a logged-in user
  user?: { id: string; role: string; status: string };
}


export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized: Please log in to access this resource.' });
  }

  if (user.status === 'INACTIVE') {
    return res.status(403).json({ error: 'Forbidden: Your account has been deactivated.' });
  }

  next();
};

/**
 * 2. Authorize Guard: Checks if the user's role is in the allowed list.
 * @param allowedRoles Array of roles permitted to access the route.
 */
export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    // Safety check in case requireAuth was accidentally omitted
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ 
        error: 'Forbidden: Insufficient permissions.',
        message: `This action requires one of the following roles: ${allowedRoles.join(', ')}.`,
        yourRole: user.role
      });
    }

    next();
  };
};