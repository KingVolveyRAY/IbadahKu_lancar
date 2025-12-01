const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const { getDailyTimeline } = require('../controllers/calendarController');
router.get('/timeline', auth, getDailyTimeline);
module.exports = router;