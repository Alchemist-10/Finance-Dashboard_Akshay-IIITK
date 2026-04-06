// src/services/userService.ts
import { Role, UserStatus } from '@prisma/client';
import bcrypt from 'bcrypt';
import { prisma } from '../db';

export class UserService {
  static async createUser(data: any) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash the password with a "salt" of 10 rounds (industry standard)
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword, // <-- Save the hashed password!
        role: data.role as Role,
      },
      // Exclude password from the returned result for security
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      }
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