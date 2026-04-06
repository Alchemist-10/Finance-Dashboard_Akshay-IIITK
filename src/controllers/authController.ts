import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../db';

// In a real app, always put this inside a .env file!
const JWT_SECRET = process.env.JWT_SECRET || 'my-super-secret-dashboard-key'; 

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // 1. Find the user
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // 2. Check if active
      if (user.status === 'INACTIVE') {
        return res.status(403).json({ error: 'Account is deactivated' });
      }

      // 3. Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // 4. Generate JWT
      const token = jwt.sign(
        { id: user.id, role: user.role, status: user.status },
        JWT_SECRET,
        { expiresIn: '24h' } // Token expires in 1 day
      );

      return res.status(200).json({
        message: 'Login successful',
        token,
        user: { id: user.id, email: user.email, role: user.role }
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error during login' });
    }
  }
}