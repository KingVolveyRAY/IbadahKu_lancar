const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const { getQPlan, updateProgress } = require('../controllers/qplanController');
router.get('/', auth, getQPlan);
router.post('/progress', auth, updateProgress);
module.exports = router;