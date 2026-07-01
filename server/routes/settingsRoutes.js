const express = require('express');
const router = express.Router();
const { getSettings, updateSettings, getActivityLogs } = require('../controllers/settingsController');
const { protect } = require('../middleware/auth');

router.get('/', getSettings);
router.put('/', protect, updateSettings);
router.get('/logs', protect, getActivityLogs);

module.exports = router;
