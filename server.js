const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path'); 
const connectDB = require('./config/database');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Serve static files from uploads directory - FIXED PATH
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // ADD LIMIT FOR BASE64 IMAGES
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/upload', require('./routes/upload'));
// Remove the duplicate line: app.use('/uploads', express.static('uploads')); 

// Root route
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
      ingredients: '/api/ingredients',
      upload: '/api/upload' // ADD UPLOAD ENDPOINT TO DOCS
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
  console.log(`Uploads directory: ${path.join(__dirname, 'uploads')}`);
});