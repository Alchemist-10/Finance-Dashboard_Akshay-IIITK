"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserRoleSchema = exports.updateUserStatusSchema = exports.createUserSchema = void 0;
// src/validators/userValidator.ts
const zod_1 = require("zod");
exports.createUserSchema = zod_1.z.object({
    email: zod_1.z.string().email({ message: "Invalid email address" }),
    password: zod_1.z.string().min(8, { message: "Password must be at least 8 characters" }),
    role: zod_1.z.enum(['VIEWER', 'ANALYST', 'ADMIN']).optional(),
});
exports.updateUserStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(['ACTIVE', 'INACTIVE']),
});
exports.updateUserRoleSchema = zod_1.z.object({
    role: zod_1.z.enum(['VIEWER', 'ANALYST', 'ADMIN']),
});
