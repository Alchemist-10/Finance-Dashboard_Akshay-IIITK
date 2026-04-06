"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/recordRoutes.ts
const express_1 = require("express");
const recordcontroller_1 = require("../controllers/recordcontroller");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const recordvalidator_1 = require("../validators/recordvalidator");
const router = (0, express_1.Router)();
// Everyone can view records
router.get('/', (0, auth_1.requireRole)(['VIEWER', 'ANALYST', 'ADMIN']), recordcontroller_1.RecordController.getAll);
// Only ADMINs can create, update, or delete records
router.post('/', (0, auth_1.requireRole)(['ADMIN']), (0, validate_1.validate)(recordvalidator_1.createRecordSchema), recordcontroller_1.RecordController.create);
router.patch('/:id', (0, auth_1.requireRole)(['ADMIN']), (0, validate_1.validate)(recordvalidator_1.updateRecordSchema), recordcontroller_1.RecordController.update);
router.delete('/:id', (0, auth_1.requireRole)(['ADMIN']), recordcontroller_1.RecordController.delete);
exports.default = router;
