const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true 
  },
  meals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meal'
  }]
}, {
  timestamps: true
});


favoriteSchema.index({ user: 1 });

module.exports = mongoose.model('Favorite', favoriteSchema);