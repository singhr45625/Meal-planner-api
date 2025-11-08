const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack', 'dessert'], // Added more options
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
    ingredient: String,  // Ingredient name as string
    quantity: String,
    unit: String
  }],
  prepTime: {
    type: Number, // in minutes
    required: true
  },
  difficulty: { // Add this field
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  calories: {
    type: Number,
    required: true
  },
  servings: { // Add this field
    type: Number,
    required: true,
    default: 1
  },
  image: { // Add this field
    type: String,
    default: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'
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

// Remove the calculateCalories method since we're not using Ingredient model for calories
// mealSchema.methods.calculateCalories = function() {
//   let totalCalories = 0;
//   this.ingredients.forEach(item => {
//     totalCalories += item.ingredient.calories;
//   });
//   return totalCalories;
// };

module.exports = mongoose.model('Meal', mealSchema);