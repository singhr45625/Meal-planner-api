const Meal = require('../models/Meal');

exports.createMeal = async (req, res) => {
  try {
    const { 
      name, 
      type, 
      description, 
      recipe, 
      ingredients, 
      prepTime, 
      difficulty, 
      calories, 
      servings, 
      image, 
      isPublic 
    } = req.body;
    
    // DEBUG: Check what image data we're receiving
    console.log('Received image data:', image);
    console.log('Image length:', image ? image.length : 0);
    
    // Validate required fields
    if (!name || !type || !description || !recipe || !prepTime || !calories || !servings) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, type, description, recipe, prepTime, calories, servings'
      });
    }

    // Validate ingredients
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one ingredient'
      });
    }

    // Validate each ingredient
    for (const ing of ingredients) {
      if (!ing.ingredient || !ing.quantity || !ing.unit) {
        return res.status(400).json({
          success: false,
          message: 'Each ingredient must have ingredient name, quantity, and unit'
        });
      }
    }

    // FIXED: Better image handling
    let finalImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'; // default
    
    // Check if image exists and is not empty
    if (image && image.trim() !== '' && image !== 'default-image-url') {
      finalImage = image.trim();
      console.log('Using uploaded image:', finalImage);
    } else {
      console.log('No valid image provided, using default');
    }

    const meal = await Meal.create({
      name: name.trim(),
      type: type.toLowerCase(),
      description: description.trim(),
      recipe: recipe.trim(),
      ingredients: ingredients.map(ing => ({
        ingredient: ing.ingredient.trim(),
        quantity: ing.quantity.trim(),
        unit: ing.unit.trim()
      })),
      prepTime: parseInt(prepTime),
      calories: parseInt(calories),
      servings: parseInt(servings),
      image: finalImage, // Use the properly handled image
      isPublic: isPublic || false,
      createdBy: req.user._id
    });
    
    console.log('Meal created with image:', meal.image);
    
    res.status(201).json({
      success: true,
      data: meal
    });
  } catch (error) {
    console.error('Create meal error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ... rest of your functions remain the same
exports.getUserMeals = async (req, res) => {
  try {
    const meals = await Meal.find({ createdBy: req.user._id })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: meals
    });
  } catch (error) {
    console.error('Get user meals error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getMealById = async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id)
      .populate('createdBy', 'name email');
    
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
    console.error('Get meal by ID error:', error);
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

    // Handle ingredient updates if provided
    if (req.body.ingredients && Array.isArray(req.body.ingredients)) {
      req.body.ingredients = req.body.ingredients.map(ing => ({
        ingredient: ing.ingredient.trim(),
        quantity: ing.quantity.trim(),
        unit: ing.unit.trim()
      }));
    }
    
    const updatedMeal = await Meal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');
    
    res.json({
      success: true,
      data: updatedMeal
    });
  } catch (error) {
    console.error('Update meal error:', error);
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
    console.error('Delete meal error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all public meals
exports.getPublicMeals = async (req, res) => {
  try {
    const meals = await Meal.find({ isPublic: true })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: meals
    });
  } catch (error) {
    console.error('Get public meals error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getAllMeals = async (req, res) => {
  try {
    const meals = await Meal.find({
      $or: [
        { createdBy: req.user._id },
        { isPublic: true }
      ]
    })
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: meals.length,
      data: meals
    });
  } catch (error) {
    console.error('Get all meals error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

exports.getMealsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const meals = await Meal.find({ 
      type: type.toLowerCase(),
      $or: [
        { isPublic: true },
        { createdBy: req.user._id }
      ]
    })
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: meals
    });
  } catch (error) {
    console.error('Get meals by type error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};