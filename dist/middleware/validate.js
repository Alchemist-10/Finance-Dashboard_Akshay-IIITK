"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const validate = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                error: 'Validation error',
                details: (0, zod_1.flattenError)(result.error),
            });
        }
        req.body = result.data;
        next();
    };
};
exports.validate = validate;
