// src/routes/authRoutes.ts
import { Router } from 'express';
import { AuthController } from '../controllers/authController';

const router = Router();

// Public route: No authentication required to hit this
router.post('/login', AuthController.login);

export default router;