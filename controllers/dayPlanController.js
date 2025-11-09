const DayPlan = require('../models/DayPlan');
const Meal = require('../models/Meal');

exports.createOrUpdateDayPlan = async (req, res) => {
  try {
    const { date, breakfast, lunch, dinner, notes } = req.body;
    
    // Validate that all meal IDs exist and belong to the user
    const mealsToCheck = [breakfast, lunch, dinner].filter(Boolean);
    
    if (mealsToCheck.length > 0) {
      const meals = await Meal.find({
        _id: { $in: mealsToCheck },
        createdBy: req.user._id
      });
      
      if (meals.length !== mealsToCheck.length) {
        return res.status(400).json({
          success: false,
          message: 'One or more meals not found or not owned by user'
        });
      }
    }
    
    let dayPlan = await DayPlan.findOne({
      date: new Date(date),
      user: req.user._id
    });
    
    if (dayPlan) {
      // Update existing plan
      if (breakfast !== undefined) dayPlan.meals.breakfast = breakfast;
      if (lunch !== undefined) dayPlan.meals.lunch = lunch;
      if (dinner !== undefined) dayPlan.meals.dinner = dinner;
      if (notes !== undefined) dayPlan.notes = notes;
      
      await dayPlan.save();
    } else {
      // Create new plan
      dayPlan = await DayPlan.create({
        date: new Date(date),
        user: req.user._id,
        meals: {
          breakfast: breakfast || null,
          lunch: lunch || null,
          dinner: dinner || null
        },
        notes: notes || ''
      });
    }
    
    const populatedPlan = await DayPlan.findById(dayPlan._id)
      .populate({
        path: 'meals.breakfast',
        select: 'name type description calories ingredients prepTime'
      })
      .populate({
        path: 'meals.lunch',
        select: 'name type description calories ingredients prepTime'
      })
      .populate({
        path: 'meals.dinner',
        select: 'name type description calories ingredients prepTime'
      });
    
    res.json({
      success: true,
      data: populatedPlan
    });
  } catch (error) {
    console.error('Error in createOrUpdateDayPlan:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getDayPlan = async (req, res) => {
  try {
    const { date } = req.params;
    
    const dayPlan = await DayPlan.findOne({
      date: new Date(date),
      user: req.user._id
    })
    .populate({
      path: 'meals.breakfast',
      select: 'name type description calories ingredients prepTime'
    })
    .populate({
      path: 'meals.lunch', 
      select: 'name type description calories ingredients prepTime'
    })
    .populate({
      path: 'meals.dinner',
      select: 'name type description calories ingredients prepTime'
    });
    
    if (!dayPlan) {
      return res.status(404).json({
        success: false,
        message: 'No plan found for this date'
      });
    }
    
    res.json({
      success: true,
      data: dayPlan
    });
  } catch (error) {
    console.error('Error in getDayPlan:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getWeekPlan = async (req, res) => {
  try {
    const { startDate } = req.params;
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + 6); // Get next 6 days for a week
    
    const weekPlans = await DayPlan.find({
      user: req.user._id,
      date: {
        $gte: start,
        $lte: end
      }
    })
    .populate('meals.breakfast')
    .populate('meals.lunch')
    .populate('meals.dinner')
    .sort({ date: 1 });
    
    // Create array for all 7 days, even if no plan exists
    const weekData = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(currentDate.getDate() + i);
      
      const existingPlan = weekPlans.find(plan => 
        plan.date.toDateString() === currentDate.toDateString()
      );
      
      weekData.push({
        date: currentDate,
        plan: existingPlan || null,
        totalCalories: existingPlan ? existingPlan.totalCalories : 0
      });
    }
    
    res.json({
      success: true,
      data: weekData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteDayPlan = async (req, res) => {
  try {
    const { date } = req.params;
    
    const dayPlan = await DayPlan.findOneAndDelete({
      date: new Date(date),
      user: req.user._id
    });
    
    if (!dayPlan) {
      return res.status(404).json({
        success: false,
        message: 'No plan found for this date'
      });
    }
    
    res.json({
      success: true,
      message: 'Day plan deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Add this to your dayPlanController.js
exports.updateDayPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { breakfast, lunch, dinner, notes } = req.body;
    
    // Validate that all meal IDs exist and belong to the user
    const mealsToCheck = [breakfast, lunch, dinner].filter(Boolean);
    
    if (mealsToCheck.length > 0) {
      const meals = await Meal.find({
        _id: { $in: mealsToCheck },
        createdBy: req.user._id
      });
      
      if (meals.length !== mealsToCheck.length) {
        return res.status(400).json({
          success: false,
          message: 'One or more meals not found or not owned by user'
        });
      }
    }
    
    const dayPlan = await DayPlan.findById(id);
    
    if (!dayPlan) {
      return res.status(404).json({
        success: false,
        message: 'Day plan not found'
      });
    }
    
    // Check if the day plan belongs to the user
    if (dayPlan.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this plan'
      });
    }
    
    // Update fields
    if (breakfast !== undefined) dayPlan.meals.breakfast = breakfast;
    if (lunch !== undefined) dayPlan.meals.lunch = lunch;
    if (dinner !== undefined) dayPlan.meals.dinner = dinner;
    if (notes !== undefined) dayPlan.notes = notes;
    
    await dayPlan.save();
    
    const populatedPlan = await DayPlan.findById(dayPlan._id)
      .populate({
        path: 'meals.breakfast',
        select: 'name type description calories ingredients prepTime'
      })
      .populate({
        path: 'meals.lunch',
        select: 'name type description calories ingredients prepTime'
      })
      .populate({
        path: 'meals.dinner',
        select: 'name type description calories ingredients prepTime'
      });
    
    res.json({
      success: true,
      data: populatedPlan
    });
  } catch (error) {
    console.error('Error in updateDayPlan:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};