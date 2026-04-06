// src/services/recordService.ts
import { PrismaClient, TransactionType } from '@prisma/client';

const prisma = new PrismaClient();

export class RecordService {
  static async createRecord(userId: string, data: any) {
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
  static async getRecords(filters: { userId?: string; type?: TransactionType; category?: string }) {
    return prisma.record.findMany({
      where: filters,
      orderBy: { date: 'desc' }, // Newest first
    });
  }

  static async updateRecord(id: string, data: any) {
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

  static async deleteRecord(id: string) {
    return prisma.record.delete({
      where: { id },
    });
  }
}