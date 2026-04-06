// src/controllers/recordController.ts
import { Request, Response } from 'express';
import { RecordService } from '../services/recordservice';
import { TransactionType } from '@prisma/client';

export class RecordController {
  static async create(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id; // From our auth middleware
      const record = await RecordService.createRecord(userId, req.body);
      return res.status(201).json(record);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      // Extract optional query parameters for filtering (e.g., ?type=INCOME&category=Salary)
      const { type, category } = req.query;
      
      const filters = {
        type: type as TransactionType | undefined,
        category: category as string | undefined,
      };

      const records = await RecordService.getRecords(filters);
      return res.status(200).json(records);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch records' });
    }
  }

  static async update(req: Request<{ id: string }>, res: Response) {
    try {
      const record = await RecordService.updateRecord(req.params.id, req.body);
      return res.status(200).json(record);
    } catch (error) {
      return res.status(400).json({ error: 'Failed to update record' });
    }
  }

  static async delete(req: Request<{ id: string }>, res: Response) {
    try {
      await RecordService.deleteRecord(req.params.id);
      return res.status(204).send(); // 204 No Content is standard for successful deletion
    } catch (error) {
      return res.status(400).json({ error: 'Failed to delete record' });
    }
  }
}