import { TransactionType } from '@prisma/client';
import { prisma } from '../db';

export class DashboardService {
  /**
   * Retrieves high-level totals: Income, Expenses, and Net Balance for a user within an optional date range
   */
  async getSummaryTotals(userId: string, startDate?: Date, endDate?: Date) {
    const records = await prisma.record.groupBy({
      by: ['type'],
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        amount: true,
      },
    });

    let totalIncome = 0;
    let totalExpense = 0;

    for (const record of records) {
      if (record.type === 'INCOME') {
        totalIncome = record._sum.amount || 0;
      } else if (record.type === 'EXPENSE') {
        totalExpense = record._sum.amount || 0;
      }
    }

    return {
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense,
    };
  }

  /**
   * Aggregates expenses and/or income by category
   */
  async getCategoryTotals(userId: string, type?: TransactionType, startDate?: Date, endDate?: Date) {
    const categoryTotals = await prisma.record.groupBy({
      by: ['category'],
      where: {
        userId,
        type, // Group by a specific type if provided (e.g., only EXPENSES)
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        amount: true,
      },
      orderBy: {
        _sum: {
          amount: 'desc',
        },
      },
    });

    return categoryTotals.map((item) => ({
      category: item.category,
      totalAmount: item._sum.amount || 0,
    }));
  }

  /**
   * Fetches the most recent transactions for the dashboard feed
   */
  async getRecentActivity(userId: string, limit: number = 5) {
    return prisma.record.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: limit,
      select: {
        id: true,
        amount: true,
        type: true,
        category: true,
        date: true,
        notes: true,
      },
    });
  }

  /**
   * Returns Monthly/Weekly trends by grouping records by date chunks
   * Using SQLite string functions for grouping as an example. 
   * (If using Postgres, date_trunc would be preferred)
   */
  async getMonthlyTrends(userId: string, year: number) {
    // For a SQL-agnostic or simple approach in Prisma SQLite without raw queries,
    // we can fetch the year's records and aggregate in memory. 
    // For large datasets, raw SQL is recommended here.
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31, 23, 59, 59);

    const records = await prisma.record.findMany({
      where: {
        userId,
        date: {
          gte: startOfYear,
          lte: endOfYear,
        },
      },
      select: { amount: true, type: true, date: true },
    });

    // Initialize 12 months with 0
    const monthlyTrends = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      income: 0,
      expense: 0,
    }));

    for (const record of records) {
      const monthIndex = record.date.getMonth(); // 0-11
      if (record.type === 'INCOME') {
        monthlyTrends[monthIndex].income += record.amount;
      } else {
        monthlyTrends[monthIndex].expense += record.amount;
      }
    }

    return monthlyTrends;
  }
}

export const dashboardService = new DashboardService();