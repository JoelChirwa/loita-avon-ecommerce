import dotenv from 'dotenv';

// Load environment variables FIRST before any other imports
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';

// Import routes
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'https://loita-avon-ecommerce.vercel.app',
      'https://loitashop.vercel.app',
      process.env.FRONTEND_URL
    ].filter(Boolean);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Debug route to check configuration
app.get('/api/debug-config', (req, res) => {
  res.json({
    status: 'online',
    env: process.env.NODE_ENV,
    mongoConnected: mongoose.connection.readyState === 1,
    mongoState: mongoose.connection.readyState,
    frontendUrl: process.env.FRONTEND_URL,
    timestamp: new Date().toISOString()
  });
});

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4, skip trying IPv6
      tls: true,
      tlsAllowInvalidCertificates: false,
      tlsAllowInvalidHostnames: false,
    });
    
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('❌ Full error details:');
    console.error('   - Error name:', error.name);
    console.error('   - Connection string host:', process.env.MONGODB_URI?.split('@')[1]?.split('/')[0]);
    
    if (error.name === 'MongoServerSelectionError') {
      console.error('\n🔧 TROUBLESHOOTING STEPS:');
      console.error('   1. Check MongoDB Atlas Network Access - Whitelist your IP');
      console.error('   2. Verify username and password in connection string');
      console.error('   3. Ensure database user has proper permissions');
      console.error('   4. Try accessing MongoDB Atlas dashboard to confirm cluster is running');
    }
    
    throw error;
  }
};

// Initialize database connection for serverless
let dbConnectionPromise = null;

const ensureDbConnected = async () => {
  const currentState = mongoose.connection.readyState;
  console.log('🔍 Current DB state:', currentState, '(0=disconnected, 1=connected, 2=connecting, 3=disconnecting)');
  
  if (currentState === 1) {
    console.log('✅ DB already connected');
    return; // Already connected
  }
  
  if (!dbConnectionPromise) {
    console.log('🔄 Creating new DB connection promise');
    dbConnectionPromise = connectDB();
  }
  
  try {
    await dbConnectionPromise;
  } catch (error) {
    // Reset promise on failure so next request can retry
    dbConnectionPromise = null;
    throw error;
  }
};

// Middleware to ensure DB connection in serverless (before routes)
app.use(async (req, res, next) => {
  try {
    console.log(`📥 ${req.method} ${req.path}`);
    await ensureDbConnected();
    next();
  } catch (error) {
    console.error('❌ DB Connection Error in middleware:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Database connection failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/contact', contactRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  });
}

export default app;
