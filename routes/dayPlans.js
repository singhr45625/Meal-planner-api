const express = require('express');
const { 
  createOrUpdateDayPlan, 
  getDayPlan, 
  getWeekPlan, 
  deleteDayPlan 
} = require('../controllers/dayPlanController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createOrUpdateDayPlan);

router.route('/date/:date')
  .get(getDayPlan)
  .delete(deleteDayPlan);

router.route('/week/:startDate')
  .get(getWeekPlan);

module.exports = router;