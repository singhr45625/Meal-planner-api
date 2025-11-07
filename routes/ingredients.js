const express = require('express');
const Ingredient = require('../models/Ingredient');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

// Create ingredient
router.post('/', async (req, res) => {
  try {
    const { name, quantity, unit, calories } = req.body;
    
    const ingredient = await Ingredient.create({
      name,
      quantity,
      unit,
      calories
    });
    
    res.status(201).json({
      success: true,
      data: ingredient
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get all ingredients
router.get('/', async (req, res) => {
  try {
    const ingredients = await Ingredient.find().sort({ name: 1 });
    
    res.json({
      success: true,
      data: ingredients
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;