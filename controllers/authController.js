const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d'
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  
  // Remove password from output
  user.password = undefined;
  
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      dailyCalorieTarget: user.dailyCalorieTarget,
      mealsCooked: user.mealsCooked,
      cookingStreak: user.cookingStreak,
      dietaryPreferences: user.dietaryPreferences,
      favoriteRecipes: user.favoriteRecipes,
      createdAt: user.createdAt
    }
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, dailyCalorieTarget, profileImage } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }
    
    const user = await User.create({
      name,
      email,
      password,
      profileImage: profileImage || null,
      dailyCalorieTarget: dailyCalorieTarget || 2000
    });
    
    createSendToken(user, 201, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }
    
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect email or password'
      });
    }
    
    createSendToken(user, 200, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Add this new controller for updating user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, dailyCalorieTarget, profileImage, dietaryPreferences } = req.body;
    const userId = req.user.id;
    
    const user = await User.findByIdAndUpdate(
      userId,
      {
        name,
        dailyCalorieTarget,
        profileImage,
        dietaryPreferences
      },
      { new: true, runValidators: true }
    );
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        dailyCalorieTarget: user.dailyCalorieTarget,
        dietaryPreferences: user.dietaryPreferences,
        mealsCooked: user.mealsCooked,
        cookingStreak: user.cookingStreak,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};