const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, uploadAvatar: uploadAvatarCtrl, uploadResume: uploadResumeCtrl } = require('../controllers/profileController');
const { protect } = require('../middleware/auth');
const { uploadImage, uploadDoc } = require('../middleware/upload');

router.get('/', getProfile);
router.put('/', protect, updateProfile);
router.post('/avatar', protect, uploadImage.single('avatar'), uploadAvatarCtrl);
router.post('/resume', protect, uploadDoc.single('resume'), uploadResumeCtrl);

module.exports = router;
