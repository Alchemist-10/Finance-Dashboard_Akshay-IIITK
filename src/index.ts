import express, { Express, Request, Response } from 'express';
import userRoutes from './routes/userroutes';
import recordRoutes from './routes/recordroutes';
import dashboardRoutes from './routes/dashboardroutes';
import { errorHandler } from './middleware/globalerrorHandler';

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'Server is running normally' });
});

app.use('/api/users', userRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/dashboard', dashboardRoutes);
// Global error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

