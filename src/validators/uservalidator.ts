// src/validators/userValidator.ts
import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  role: z.enum(['VIEWER', 'ANALYST', 'ADMIN']).optional(),
});

export const updateUserStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'INACTIVE']),
});

export const updateUserRoleSchema = z.object({
  role: z.enum(['VIEWER', 'ANALYST', 'ADMIN']),
});