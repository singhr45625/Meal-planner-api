const express = require('express');
const { 
  createMeal, 
  getUserMeals, 
  getMealById, 
  updateMeal, 
  deleteMeal 
} = require('../controllers/mealController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createMeal)
  .get(getUserMeals);

router.route('/:id')
  .get(getMealById)
  .put(updateMeal)
  .delete(deleteMeal);

module.exports = router;