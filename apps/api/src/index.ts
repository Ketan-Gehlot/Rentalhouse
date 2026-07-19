import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import propertyRoutes from './routes/propertyRoutes';
import visitRoutes from './routes/visitRoutes';
import adminRoutes from './routes/adminRoutes';
import paymentRoutes from './routes/paymentRoutes';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/visits', visitRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'RentMate API is running' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

setInterval(() => {}, 1000 * 60 * 60);
