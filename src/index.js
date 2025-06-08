import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/db.config.js';
import { handleError } from './utils/error.utils.js';
import dotenv from 'dotenv';
dotenv.config();

// Import routes
import authRoutes from './routes/auth.routes.js';
import bookRoutes from './routes/book.routes.js';
import reviewRoutes from './routes/review.routes.js';
// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/', authRoutes);
app.use('/books', bookRoutes);
app.use('/', reviewRoutes);

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  handleError(err, res);
});

// Handle 404
app.use((req, res) => {
  console.log(`404 - Not Found: ${req.method} ${req.url}`);
  res.status(404).json({
    error: {
      message: 'Route not found',
      code: 'ROUTE_NOT_FOUND',
    },
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
