const Meal = require('../models/Meal');
const Ingredient = require('../models/Ingredient');

exports.createMeal = async (req, res) => {
  try {
    const { name, type, description, recipe, ingredients, prepTime } = req.body;
    
    // Calculate total calories from ingredients
    let totalCalories = 0;
    const ingredientDocs = [];
    
    for (const ing of ingredients) {
      const ingredient = await Ingredient.findById(ing.ingredient);
      if (ingredient) {
        totalCalories += ingredient.calories;
        ingredientDocs.push({
          ingredient: ing.ingredient,
          quantity: ing.quantity
        });
      }
    }
    
    const meal = await Meal.create({
      name,
      type,
      description,
      recipe,
      ingredients: ingredientDocs,
      prepTime,
      calories: totalCalories,
      createdBy: req.user._id
    });
    
    const populatedMeal = await Meal.findById(meal._id).populate('ingredients.ingredient');
    
    res.status(201).json({
      success: true,
      data: populatedMeal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getUserMeals = async (req, res) => {
  try {
    const meals = await Meal.find({ createdBy: req.user._id })
      .populate('ingredients.ingredient')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: meals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getMealById = async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id).populate('ingredients.ingredient');
    
    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found'
      });
    }
    
    res.json({
      success: true,
      data: meal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateMeal = async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);
    
    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found'
      });
    }
    
    if (meal.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this meal'
      });
    }
    
    const updatedMeal = await Meal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('ingredients.ingredient');
    
    res.json({
      success: true,
      data: updatedMeal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteMeal = async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);
    
    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found'
      });
    }
    
    if (meal.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this meal'
      });
    }
    
    await Meal.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Meal deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};