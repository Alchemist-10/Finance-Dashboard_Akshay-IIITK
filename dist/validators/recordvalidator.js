"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRecordSchema = exports.createRecordSchema = void 0;
// src/validators/recordValidator.ts
const zod_1 = require("zod");
exports.createRecordSchema = zod_1.z.object({
    amount: zod_1.z.number().positive({ message: "Amount must be greater than 0" }),
    type: zod_1.z.enum(['INCOME', 'EXPENSE']),
    category: zod_1.z.string().min(1, { message: "Category is required" }),
    date: zod_1.z.string().datetime({ message: "Must be a valid ISO-8601 date string" }),
    notes: zod_1.z.string().optional(),
});
exports.updateRecordSchema = exports.createRecordSchema.partial(); // Makes all fields optional for updates
