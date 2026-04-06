"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/userRoutes.ts
const express_1 = require("express");
const usercontroller_1 = require("../controllers/usercontroller");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const uservalidator_1 = require("../validators/uservalidator");
const router = (0, express_1.Router)();
// Only ADMINs can view all users, create users, or change roles/statuses
router.get('/', (0, auth_1.requireRole)(['ADMIN']), usercontroller_1.UserController.getAll);
router.post('/', (0, auth_1.requireRole)(['ADMIN']), (0, validate_1.validate)(uservalidator_1.createUserSchema), usercontroller_1.UserController.create);
router.patch('/:id/role', (0, auth_1.requireRole)(['ADMIN']), (0, validate_1.validate)(uservalidator_1.updateUserRoleSchema), usercontroller_1.UserController.updateRole);
router.patch('/:id/status', (0, auth_1.requireRole)(['ADMIN']), (0, validate_1.validate)(uservalidator_1.updateUserStatusSchema), usercontroller_1.UserController.updateStatus);
exports.default = router;
