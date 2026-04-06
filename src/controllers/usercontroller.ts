// src/controllers/userController.ts
import { Request, Response } from 'express';
import { UserService } from '../services/userservice';
import { Role, UserStatus } from '@prisma/client';
import { updateUserRoleSchema, updateUserStatusSchema } from '../validators/uservalidator';

export class UserController {
  static async create(req: Request, res: Response) {
    try {
      const user = await UserService.createUser(req.body);
      return res.status(201).json(user);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const users = await UserService.getUsers();
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateRole(req: Request, res: Response) {
    try {
      const idParam = req.params.id;
      const id = Array.isArray(idParam) ? idParam[0] : idParam;
      if (!id) {
        return res.status(400).json({ error: 'Missing id parameter' });
      }

      const { role } = updateUserRoleSchema.parse(req.body);
      const updatedUser = await UserService.updateUserRole(id, role as Role);
      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(400).json({ error: 'Failed to update role' });
    }
  }

  static async updateStatus(req: Request, res: Response) {
    try {
      const idParam = req.params.id;
      const id = Array.isArray(idParam) ? idParam[0] : idParam;
      if (!id) {
        return res.status(400).json({ error: 'Missing id parameter' });
      }

      const { status } = updateUserStatusSchema.parse(req.body);
      const updatedUser = await UserService.updateUserStatus(id, status as UserStatus);
      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(400).json({ error: 'Failed to update status' });
    }
  }
}