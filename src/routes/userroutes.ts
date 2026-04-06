// src/routes/userRoutes.ts
import { Router } from 'express';
import { UserController } from '../controllers/usercontroller';
import { requireRole } from '../middleware/auth';
import { validate } from '../middleware/validate'; 
import { createUserSchema, updateUserRoleSchema, updateUserStatusSchema } from '../validators/uservalidator';

const router = Router();

// Only ADMINs can view all users, create users, or change roles/statuses
router.get(
  '/', 
  requireRole(['ADMIN']), 
  UserController.getAll
);

router.post(
  '/', 
  requireRole(['ADMIN']), 
  validate(createUserSchema), 
  UserController.create
);

router.patch(
  '/:id/role', 
  requireRole(['ADMIN']), 
  validate(updateUserRoleSchema), 
  UserController.updateRole
);

router.patch(
  '/:id/status', 
  requireRole(['ADMIN']), 
  validate(updateUserStatusSchema), 
  UserController.updateStatus
);

export default router;