const router = require('express').Router();
const { getImages, createImage, deleteImage } = require('../controllers/imageController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, adminOnly, getImages);
router.post('/', protect, adminOnly, createImage);
router.delete('/:id', protect, adminOnly, deleteImage);

module.exports = router;
