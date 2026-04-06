"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
// src/services/userService.ts
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
class UserService {
    static async createUser(data) {
        const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
        if (existingUser) {
            throw new Error('Email is already in use');
        }
        const hashedPassword = await bcrypt_1.default.hash(data.password, 10);
        return prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                role: data.role || client_1.Role.VIEWER,
            },
            select: { id: true, email: true, role: true, status: true, createdAt: true } // Omit password
        });
    }
    static async getUsers() {
        return prisma.user.findMany({
            select: { id: true, email: true, role: true, status: true, createdAt: true }
        });
    }
    static async updateUserRole(id, role) {
        return prisma.user.update({
            where: { id },
            data: { role },
            select: { id: true, email: true, role: true }
        });
    }
    static async updateUserStatus(id, status) {
        return prisma.user.update({
            where: { id },
            data: { status },
            select: { id: true, email: true, status: true }
        });
    }
}
exports.UserService = UserService;
