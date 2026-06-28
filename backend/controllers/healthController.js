const pool = require('../config/database');

const calculateHealthScore = (caffeine, calories, antioxidants, sugar, fat) => {
  let score = 50;
  score -= Math.min(caffeine / 10, 20);
  score -= Math.min(calories / 20, 15);
  score -= Math.min(sugar / 5, 10);
  score -= Math.min(fat / 3, 10);
  score += Math.min(antioxidants * 0.7, 20);
  return Math.max(0, Math.min(100, Math.round(score)));
};

exports.getHealthRatings = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM health_ratings');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getHealthRating = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM health_ratings WHERE "menuItemId" = $1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Health rating not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createOrUpdateHealthRating = async (req, res) => {
  try {
    const { caffeine, calories, antioxidants, sugar, fat, summary } = req.body;
    const menuCheck = await pool.query('SELECT id FROM menu_items WHERE id = $1', [req.params.id]);
    if (!menuCheck.rows.length) return res.status(404).json({ message: 'Menu item not found' });
    const healthScore = calculateHealthScore(caffeine, calories, antioxidants, sugar || 0, fat || 0);
    const result = await pool.query(
      `INSERT INTO health_ratings ("menuItemId", caffeine, calories, antioxidants, sugar, fat, "healthScore", summary)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       ON CONFLICT ("menuItemId") DO UPDATE SET caffeine=$2, calories=$3, antioxidants=$4, sugar=$5, fat=$6, "healthScore"=$7, summary=$8
       RETURNING *`,
      [parseInt(req.params.id), caffeine, calories, antioxidants, sugar || 0, fat || 0, healthScore, summary || '']
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
