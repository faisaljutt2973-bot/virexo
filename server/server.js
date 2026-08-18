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

// Register all Mongoose models up front
// Required for .populate() to work regardless of
// which controller/route runs first
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

// Your permanent/production Vercel domain
const allowedOrigins = [
  'https://virexo-gilt.vercel.app',
];

app.use(
  cors({
    origin: function (origin, callback) {

      // -------------------------------------------------
      // Allow requests without an Origin header
      // Examples: Postman, server-to-server requests
      // -------------------------------------------------
      if (!origin) {
        return callback(null, true);
      }

      // -------------------------------------------------
      // Allow your production Vercel domain
      // -------------------------------------------------
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // -------------------------------------------------
      // Allow Vercel preview/deployment URLs
      //
      // This prevents CORS problems when Vercel creates
      // a new deployment URL such as:
      //
      // https://virexo-abc123-ofc-me.vercel.app
      // -------------------------------------------------
      if (
        origin.endsWith('.vercel.app') &&
        origin.includes('virexo')
      ) {
        console.log('Allowed Vercel origin:', origin);
        return callback(null, true);
      }

      // -------------------------------------------------
      // Allow localhost during development
      // -------------------------------------------------
      if (
        origin.startsWith('http://localhost:') ||
        origin.startsWith('http://127.0.0.1:')
      ) {
        return callback(null, true);
      }

      // -------------------------------------------------
      // Block unknown origins
      // -------------------------------------------------
      console.log('Blocked CORS origin:', origin);

      return callback(new Error('Not allowed by CORS'));
    },

    // Required if your frontend sends credentials/cookies
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
  .then(() => {
    console.log('✓ MongoDB connected');
  })
  .catch((err) => {
    console.error('✗ MongoDB connection error:', err);
  });


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
  console.log(
    `✓ Virexo Backend running on http://localhost:${PORT}`
  );
});


// =====================================================
// EXPORT APP
// =====================================================

export default app;