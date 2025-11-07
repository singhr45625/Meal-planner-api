const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  recipe: {
    type: String,
    required: true
  },
  ingredients: [{
    ingredient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ingredient',
      required: true
    },
    quantity: String
  }],
  prepTime: {
    type: Number, // in minutes
    required: true
  },
  calories: {
    type: Number,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Calculate total calories from ingredients
mealSchema.methods.calculateCalories = function() {
  let totalCalories = 0;
  this.ingredients.forEach(item => {
    totalCalories += item.ingredient.calories;
  });
  return totalCalories;
};

module.exports = mongoose.model('Meal', mealSchema);