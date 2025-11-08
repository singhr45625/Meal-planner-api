// routes/meals.js - FIXED
const express = require('express');
const { 
  createMeal, 
  getUserMeals, 
  getMealById, 
  updateMeal, 
  deleteMeal,
  getPublicMeals,
  getMealsByType,
  getAllMeals // Now this exists and is fixed
} = require('../controllers/mealController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Use getAllMeals for the main route to get both user's meals AND public meals
router.get('/', protect, getAllMeals); // CHANGED: from getUserMeals to getAllMeals

// Your existing routes...
router.post('/', protect, createMeal);
router.get('/my-meals', protect, getUserMeals); // This gets ONLY user's meals
router.get('/public', getPublicMeals); // This gets ONLY public meals
router.get('/type/:type', protect, getMealsByType);
router.get('/:id', protect, getMealById);
router.put('/:id', protect, updateMeal);
router.delete('/:id', protect, deleteMeal);

module.exports = router;