// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'my-super-secret-dashboard-key';

export interface AuthRequest extends Request {
  user?: { id: string; role: string; status: string };
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  // 1. Get the Authorization header
  const authHeader = req.headers.authorization;

  // 2. Check if it exists and follows the "Bearer <token>" format
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }

  // 3. Extract the token
  const token = authHeader.split(' ')[1];

  try {
    // 4. Verify the token using our secret key
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    // 5. Attach the decoded payload to the request
    req.user = decoded;
    
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized: Token is expired or invalid' });
  }
};

export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
};