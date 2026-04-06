import { Router } from 'express';
import { DashboardController } from '../controllers/dashboardcontroller';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

// Protect all dashboard routes with the authentication middleware
router.use(requireAuth);
router.use(requireRole(['VIEWER', 'ANALYST', 'ADMIN']));

// Expose endpoints
router.get('/summary', DashboardController.getSummary);
router.get('/categories', DashboardController.getCategoryDistribution);
router.get('/trends', DashboardController.getTrends);

export default router;