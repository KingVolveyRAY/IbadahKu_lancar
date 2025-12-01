const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const { getFastingData, trackFasting } = require('../controllers/fastingController');
router.get('/', auth, getFastingData);
router.post('/', auth, trackFasting);
module.exports = router;