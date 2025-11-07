const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: String,
    required: true
  },
  unit: {
    type: String,
    required: true
  },
  calories: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Ingredient', ingredientSchema);