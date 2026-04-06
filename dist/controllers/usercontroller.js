"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const userservice_1 = require("../services/userservice");
const uservalidator_1 = require("../validators/uservalidator");
class UserController {
    static async create(req, res) {
        try {
            const user = await userservice_1.UserService.createUser(req.body);
            return res.status(201).json(user);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
    static async getAll(req, res) {
        try {
            const users = await userservice_1.UserService.getUsers();
            return res.status(200).json(users);
        }
        catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    static async updateRole(req, res) {
        try {
            const idParam = req.params.id;
            const id = Array.isArray(idParam) ? idParam[0] : idParam;
            if (!id) {
                return res.status(400).json({ error: 'Missing id parameter' });
            }
            const { role } = uservalidator_1.updateUserRoleSchema.parse(req.body);
            const updatedUser = await userservice_1.UserService.updateUserRole(id, role);
            return res.status(200).json(updatedUser);
        }
        catch (error) {
            return res.status(400).json({ error: 'Failed to update role' });
        }
    }
    static async updateStatus(req, res) {
        try {
            const idParam = req.params.id;
            const id = Array.isArray(idParam) ? idParam[0] : idParam;
            if (!id) {
                return res.status(400).json({ error: 'Missing id parameter' });
            }
            const { status } = uservalidator_1.updateUserStatusSchema.parse(req.body);
            const updatedUser = await userservice_1.UserService.updateUserStatus(id, status);
            return res.status(200).json(updatedUser);
        }
        catch (error) {
            return res.status(400).json({ error: 'Failed to update status' });
        }
    }
}
exports.UserController = UserController;
