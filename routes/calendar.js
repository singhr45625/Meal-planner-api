const express = require('express');
const { 
  getCalendarOverview, 
  getWeeklySummary 
} = require('../controllers/calendarController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/month/:year/:month', getCalendarOverview);
router.get('/weekly-summary/:startDate', getWeeklySummary);

module.exports = router;