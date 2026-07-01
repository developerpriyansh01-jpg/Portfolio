const express = require('express');
const router = express.Router();
const { getCertificates, getAllCertificates, createCertificate, updateCertificate, deleteCertificate } = require('../controllers/certificateController');
const { protect } = require('../middleware/auth');
const { uploadImage } = require('../middleware/upload');

router.get('/', getCertificates);
router.get('/all', protect, getAllCertificates);
router.post('/', protect, uploadImage.single('image'), createCertificate);
router.put('/:id', protect, uploadImage.single('image'), updateCertificate);
router.delete('/:id', protect, deleteCertificate);

module.exports = router;
