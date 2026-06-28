const router = require('express').Router();
const { getHealthRatings, getHealthRating, createOrUpdateHealthRating } = require('../controllers/healthController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getHealthRatings);
router.get('/:id', getHealthRating);
router.put('/:id', protect, adminOnly, createOrUpdateHealthRating);

module.exports = router;
