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

// Root route - FIXES THE DEPLOYMENT ISSUE
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Meal Planner API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      meals: '/api/meals',
      dayPlans: '/api/day-plans',
      calendar: '/api/calendar',
      ingredients: '/api/ingredients'
    },
    documentation: 'API is ready for use!'
  });
});

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
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Handle undefined routes
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    suggestion: 'Check available endpoints at the root route (/)'
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
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Visit: http://localhost:${PORT}`);
});