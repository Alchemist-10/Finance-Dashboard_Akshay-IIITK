"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordService = void 0;
// src/services/recordService.ts
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class RecordService {
    static async createRecord(userId, data) {
        return prisma.record.create({
            data: {
                userId,
                amount: data.amount,
                type: data.type,
                category: data.category,
                date: new Date(data.date), // Convert string to Date object
                notes: data.notes,
            },
        });
    }
    // Includes filtering capabilities!
    static async getRecords(filters) {
        return prisma.record.findMany({
            where: filters,
            orderBy: { date: 'desc' }, // Newest first
        });
    }
    static async updateRecord(id, data) {
        // If date is provided, convert it
        const updateData = { ...data };
        if (updateData.date) {
            updateData.date = new Date(updateData.date);
        }
        return prisma.record.update({
            where: { id },
            data: updateData,
        });
    }
    static async deleteRecord(id) {
        return prisma.record.delete({
            where: { id },
        });
    }
}
exports.RecordService = RecordService;
