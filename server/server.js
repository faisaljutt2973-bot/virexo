import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Register all Mongoose models up front (required for .populate() to work
// regardless of which controller/route runs first)
import './models/User.js';
import './models/Product.js';
import './models/Category.js';
import './models/Order.js';
import './models/Review.js';

const app = express();
const PORT = process.env.PORT || 5000;

// =====================================================
// CORS CONFIGURATION
// =====================================================

const allowedOrigins = [
  'https://virexo-gilt.vercel.app',
  'https://virexo-p7n7ffu6y-ofc-me.vercel.app',
  'https://virexo-1uew0hqlg-ofc-me.vercel.app',
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests that don't have an Origin header
      // (for example, Postman or server-to-server requests)
      if (!origin) {
        return callback(null, true);
      }

      // Allow known Vercel frontend URLs
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log('Blocked CORS origin:', origin);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// =====================================================
// GENERAL MIDDLEWARE
// =====================================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================================================
// CONNECT TO MONGODB
// =====================================================

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✓ MongoDB connected'))
  .catch((err) => console.error('✗ MongoDB connection error:', err));

// =====================================================
// API ROUTES
// =====================================================

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);

// =====================================================
// HEALTH CHECK
// =====================================================

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
  });
});

// =====================================================
// 404 HANDLER
// =====================================================

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, () => {
  console.log(`✓ Virexo Backend running on http://localhost:${PORT}`);
});

export default app;