"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = void 0;
const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized: No user session found.' });
        }
        if (user.status === 'INACTIVE') {
            return res.status(403).json({ error: 'Forbidden: User account is inactive.' });
        }
        if (!allowedRoles.includes(user.role)) {
            return res.status(403).json({ error: `Forbidden: Requires one of roles: ${allowedRoles.join(', ')}.` });
        }
        next(); // User passes all checks, proceed to controller
    };
};
exports.requireRole = requireRole;
