// routes/meals.js
const express = require('express');
const { 
  createMeal, 
  getUserMeals, 
  getMealById, 
  updateMeal, 
  deleteMeal,
  getPublicMeals,
  getMealsByType 
} = require('../controllers/mealController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, createMeal);
router.get('/my-meals', protect, getUserMeals);
router.get('/public', getPublicMeals);
router.get('/type/:type', protect, getMealsByType);
router.get('/:id', protect, getMealById);
router.put('/:id', protect, updateMeal);
router.delete('/:id', protect, deleteMeal);

module.exports = router;