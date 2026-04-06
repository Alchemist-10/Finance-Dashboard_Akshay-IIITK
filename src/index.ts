import express, { Express, Request, Response } from 'express';
import userRoutes from './routes/userroutes';
import recordRoutes from './routes/recordroutes';
import dashboardRoutes from './routes/dashboardroutes';
import { errorHandler } from './middleware/globalerrorHandler';
import authRoutes from './routes/authroutes';
import rateLimit from 'express-rate-limit';

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'Server is running normally' });
});
//since it is public ( no token needed )
app.use('/api/auth', authRoutes);

app.use('/api/users', userRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/dashboard', dashboardRoutes);
// Global error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

