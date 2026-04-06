import { Router } from 'express';
import { RecordController } from '../controllers/recordcontroller';
import { requireAuth, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createRecordSchema, updateRecordSchema } from '../validators/recordvalidator';

const router = Router();

router.use(requireAuth);

router.get(
  '/', 
  requireRole(['ANALYST', 'ADMIN']), 
  RecordController.getAll
);
router.post(
  '/', 
  requireRole(['ADMIN']), 
  validate(createRecordSchema), 
  RecordController.create
);

router.patch(
  '/:id', 
  requireRole(['ADMIN']), 
  validate(updateRecordSchema), 
  RecordController.update
);

router.delete(
  '/:id', 
  requireRole(['ADMIN']), 
  RecordController.delete
);

export default router;