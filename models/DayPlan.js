const mongoose = require('mongoose');

const dayPlanSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  meals: {
    breakfast: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Meal'
    },
    lunch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Meal'
    },
    dinner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Meal'
    }
  },
  totalCalories: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// FIXED: Calculate total calories for the day with null checks
dayPlanSchema.methods.calculateTotalCalories = async function() {
  const DayPlan = mongoose.model('DayPlan');
  const populatedPlan = await DayPlan.findById(this._id)
    .populate('meals.breakfast')
    .populate('meals.lunch')
    .populate('meals.dinner');
  
  let total = 0;
  
  // Safe checks for each meal
  if (populatedPlan.meals.breakfast && populatedPlan.meals.breakfast.calories) {
    total += populatedPlan.meals.breakfast.calories;
  }
  
  if (populatedPlan.meals.lunch && populatedPlan.meals.lunch.calories) {
    total += populatedPlan.meals.lunch.calories;
  }
  
  if (populatedPlan.meals.dinner && populatedPlan.meals.dinner.calories) {
    total += populatedPlan.meals.dinner.calories;
  }
  
  return total;
};

// Update total calories before saving
dayPlanSchema.pre('save', async function(next) {
  if (this.isModified('meals')) {
    try {
      this.totalCalories = await this.calculateTotalCalories();
    } catch (error) {
      console.error('Error calculating calories:', error);
      this.totalCalories = 0;
    }
  }
  next();
});

// Compound index to ensure one plan per user per day
dayPlanSchema.index({ date: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('DayPlan', dayPlanSchema);