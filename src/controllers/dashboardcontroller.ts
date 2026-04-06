import { Request, Response } from 'express';
import { dashboardService } from '../services/dashboardservice';
import { TransactionType } from '@prisma/client';

export class DashboardController {
  /**
   * GET /api/dashboard/summary
   * Fetches high-level dashboard data: totals, recent activity, and basic charts
   */
  static async getSummary(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { startDate, endDate } = req.query;

      const parsedStartDate = startDate ? new Date(startDate as string) : undefined;
      const parsedEndDate = endDate ? new Date(endDate as string) : undefined;

      // 1. Totals (Income, Expenses, Net)
      const totals = await dashboardService.getSummaryTotals(userId, parsedStartDate, parsedEndDate);

      // 2. Recent 5 Transactions
      const recentActivity = await dashboardService.getRecentActivity(userId, 5);

      res.status(200).json({
        success: true,
        data: {
          totals,
          recentActivity,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: 'Failed to fetch dashboard summary.' });
    }
  }

  /**
   * GET /api/dashboard/categories
   * Aggregation for pie-charts and category analysis
   */
  static async getCategoryDistribution(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { type, startDate, endDate } = req.query;

      const parsedStartDate = startDate ? new Date(startDate as string) : undefined;
      const parsedEndDate = endDate ? new Date(endDate as string) : undefined;
      const transactionType = type ? (type as TransactionType) : undefined;

      const categoryData = await dashboardService.getCategoryTotals(
        userId,
        transactionType,
        parsedStartDate,
        parsedEndDate
      );

      res.status(200).json({
        success: true,
        data: categoryData,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: 'Failed to fetch category distribution.' });
    }
  }

  /**
   * GET /api/dashboard/trends
   * Aggregation for bar/line charts showing income/expense over months
   */
  static async getTrends(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { year } = req.query;

      const filterYear = year ? parseInt(year as string, 10) : new Date().getFullYear();

      const trendData = await dashboardService.getMonthlyTrends(userId, filterYear);

      res.status(200).json({
        success: true,
        data: trendData,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: 'Failed to fetch trends data.' });
    }
  }
}