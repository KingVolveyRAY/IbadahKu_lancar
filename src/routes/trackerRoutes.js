const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const { getTrackerPage, togglePrayer, toggleHabit, updateQuran, addAmalan } = require('../controllers/trackerController');

router.get('/', auth, getTrackerPage);
router.post('/prayer', auth, togglePrayer);
router.post('/habit', auth, toggleHabit);
router.post('/quran', auth, updateQuran);
router.post('/amalan', auth, addAmalan);

module.exports = router;