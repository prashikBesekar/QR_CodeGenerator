import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from 'dotenv';
import connectDB from './config/database.js';
import errorHandler from './middleware/errorHandler.js';



//routes
import authRoutes from './router/auth.js';
import qrRoutes from './router/qr.js';
import analyticsRoutes from './router/analytics.js';
import paymentRoutes from './router/payment.js';

config();
const app = express();

//connect to the database
connectDB();

//Middleware
app.use(helmet());

// CORS configuration (dev): allow any localhost origin; credentials enabled
app.use(cors({
  origin: (origin, callback) => callback(null, true),
  credentials: true,
}));

// Extra headers for preflight
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Rating limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

//Routes
app.use('/api/auth', authRoutes);
app.use('/api/qr', qrRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/payment', paymentRoutes);


//QR code redirect
app.get('/qr/:shortCode', (req, res) => {
    
});

//Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});