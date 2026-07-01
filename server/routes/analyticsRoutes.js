const express = require('express');
const router = express.Router();
const { trackVisit, getDashboardStats } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.post('/track', trackVisit);
router.get('/dashboard', protect, getDashboardStats);

module.exports = router;
