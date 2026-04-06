// src/services/userService.ts
import { PrismaClient, Role, UserStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export class UserService {
  static async createUser(data: any) {
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      throw new Error('Email is already in use');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        role: data.role || Role.VIEWER,
      },
      select: { id: true, email: true, role: true, status: true, createdAt: true } // Omit password
    });
  }

  static async getUsers() {
    return prisma.user.findMany({
      select: { id: true, email: true, role: true, status: true, createdAt: true }
    });
  }

  static async updateUserRole(id: string, role: Role) {
    return prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, email: true, role: true }
    });
  }

  static async updateUserStatus(id: string, status: UserStatus) {
    return prisma.user.update({
      where: { id },
      data: { status },
      select: { id: true, email: true, status: true }
    });
  }
}