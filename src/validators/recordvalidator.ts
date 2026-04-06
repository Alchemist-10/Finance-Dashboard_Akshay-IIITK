// src/validators/recordValidator.ts
import { z } from 'zod';

export const createRecordSchema = z.object({
  amount: z.number().positive({ message: "Amount must be greater than 0" }),
  type: z.enum(['INCOME', 'EXPENSE']),
  category: z.string().min(1, { message: "Category is required" }),
  date: z.string().datetime({ message: "Must be a valid ISO-8601 date string" }),
  notes: z.string().optional(),
});

export const updateRecordSchema = createRecordSchema.partial(); // Makes all fields optional for updates