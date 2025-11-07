const DayPlan = require('../models/DayPlan');

exports.getCalendarOverview = async (req, res) => {
  try {
    const { year, month } = req.params;
    
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0); // Last day of the month
    
    const monthPlans = await DayPlan.find({
      user: req.user._id,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).select('date totalCalories');
    
    // Create calendar data
    const calendarData = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const plan = monthPlans.find(p => 
        p.date.toDateString() === currentDate.toDateString()
      );
      
      calendarData.push({
        date: new Date(currentDate),
        hasPlan: !!plan,
        totalCalories: plan ? plan.totalCalories : 0,
        mealCount: plan ? 
          [plan.meals.breakfast, plan.meals.lunch, plan.meals.dinner].filter(Boolean).length : 0
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Calculate monthly statistics
    const totalCalories = monthPlans.reduce((sum, plan) => sum + plan.totalCalories, 0);
    const averageCalories = monthPlans.length > 0 ? totalCalories / monthPlans.length : 0;
    const daysPlanned = monthPlans.length;
    
    res.json({
      success: true,
      data: {
        calendar: calendarData,
        statistics: {
          totalCalories,
          averageCalories: Math.round(averageCalories),
          daysPlanned,
          totalDays: endDate.getDate()
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getWeeklySummary = async (req, res) => {
  try {
    const { startDate } = req.params;
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    
    const weekPlans = await DayPlan.find({
      user: req.user._id,
      date: {
        $gte: start,
        $lte: end
      }
    }).select('date totalCalories meals');
    
    const weeklyStats = weekPlans.map(plan => ({
      date: plan.date,
      totalCalories: plan.totalCalories,
      mealCount: [plan.meals.breakfast, plan.meals.lunch, plan.meals.dinner].filter(Boolean).length
    }));
    
    const totalWeeklyCalories = weekPlans.reduce((sum, plan) => sum + plan.totalCalories, 0);
    const averageDailyCalories = weekPlans.length > 0 ? totalWeeklyCalories / weekPlans.length : 0;
    
    res.json({
      success: true,
      data: {
        weeklyStats,
        summary: {
          totalWeeklyCalories,
          averageDailyCalories: Math.round(averageDailyCalories),
          daysPlanned: weekPlans.length
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};