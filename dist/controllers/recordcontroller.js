"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordController = void 0;
const recordservice_1 = require("../services/recordservice");
class RecordController {
    static async create(req, res) {
        try {
            const userId = req.user.id; // From our auth middleware
            const record = await recordservice_1.RecordService.createRecord(userId, req.body);
            return res.status(201).json(record);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
    static async getAll(req, res) {
        try {
            // Extract optional query parameters for filtering (e.g., ?type=INCOME&category=Salary)
            const { type, category } = req.query;
            const filters = {
                type: type,
                category: category,
            };
            const records = await recordservice_1.RecordService.getRecords(filters);
            return res.status(200).json(records);
        }
        catch (error) {
            return res.status(500).json({ error: 'Failed to fetch records' });
        }
    }
    static async update(req, res) {
        try {
            const record = await recordservice_1.RecordService.updateRecord(req.params.id, req.body);
            return res.status(200).json(record);
        }
        catch (error) {
            return res.status(400).json({ error: 'Failed to update record' });
        }
    }
    static async delete(req, res) {
        try {
            await recordservice_1.RecordService.deleteRecord(req.params.id);
            return res.status(204).send(); // 204 No Content is standard for successful deletion
        }
        catch (error) {
            return res.status(400).json({ error: 'Failed to delete record' });
        }
    }
}
exports.RecordController = RecordController;
