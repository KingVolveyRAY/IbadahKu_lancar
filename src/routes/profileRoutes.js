const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const { getProfile, changePassword } = require('../controllers/profileController');
router.get('/', auth, getProfile);
router.put('/password', auth, changePassword);
module.exports = router;