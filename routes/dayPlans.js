const express = require('express');
const { 
  createOrUpdateDayPlan, 
  getDayPlan, 
  getWeekPlan, 
  deleteDayPlan,
  updateDayPlan // ADD THIS
} = require('../controllers/dayPlanController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createOrUpdateDayPlan);

router.route('/date/:date')
  .get(getDayPlan)
  .delete(deleteDayPlan);

// ADD THIS ROUTE for updating by ID
router.route('/:id')
  .put(updateDayPlan);

router.route('/week/:startDate')
  .get(getWeekPlan);

module.exports = router;