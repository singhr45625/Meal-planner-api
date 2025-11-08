// routes/meals.js - ADD THIS ROUTE
const express = require('express');
const { 
  createMeal, 
  getUserMeals, 
  getMealById, 
  updateMeal, 
  deleteMeal,
  getPublicMeals,
  getMealsByType,
  getAllMeals 
} = require('../controllers/mealController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// ADD THIS LINE - Basic GET /meals route
router.get('/', protect, getAllMeals); // or getAllMeals if you want all user's meals
router.get('/', protect, getUserMeals);
// Your existing routes...
router.post('/', protect, createMeal);
router.get('/my-meals', protect, getUserMeals);
router.get('/public', getPublicMeals);
router.get('/type/:type', protect, getMealsByType);
router.get('/:id', protect, getMealById);
router.put('/:id', protect, updateMeal);
router.delete('/:id', protect, deleteMeal);

module.exports = router;