"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const express_1 = __importDefault(require("express"));
const userroutes_1 = __importDefault(require("./routes/userroutes"));
const recordroutes_1 = __importDefault(require("./routes/recordroutes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware to parse incoming JSON bodies
app.use(express_1.default.json());
// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'Server is running normally' });
});
// Mount the user routes under the /api/users path
app.use('/api/users', userroutes_1.default);
app.use('/api/records', recordroutes_1.default);
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
