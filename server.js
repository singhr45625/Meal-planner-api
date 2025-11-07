const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/meals', require('./routes/meals'));
app.use('/api/day-plans', require('./routes/dayPlans'));
app.use('/api/calendar', require('./routes/calendar'));
app.use('/api/ingredients', require('./routes/ingredients'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Meal Planner API is running',
    timestamp: new Date().toISOString()
  });
});

// Handle undefined routes - FIXED for Express 5
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});