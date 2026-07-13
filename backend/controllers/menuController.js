const pool = require('../config/database');

exports.getMenuItems = async (req, res) => {
  try {
    let sql = 'SELECT * FROM menu_items WHERE 1=1';
    const params = [];
    if (req.query.category) { sql += ' AND category = $' + (params.length + 1); params.push(req.query.category); }
    if (req.query.featured) { sql += ' AND featured = $' + (params.length + 1); params.push(req.query.featured === 'true'); }
    if (req.query.available !== undefined) { sql += ' AND available = $' + (params.length + 1); params.push(req.query.available === 'true'); }
    sql += ' ORDER BY name';
    const result = await pool.query(sql, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMenuItem = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM menu_items WHERE id = $1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Menu item not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createMenuItem = async (req, res) => {
  try {
    const { name, category, description, price, ingredients, sizes, image, images } = req.body;
    const result = await pool.query(
      'INSERT INTO menu_items (name, category, description, price, ingredients, sizes, image, images) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
      [name, category, description || '', price, JSON.stringify(ingredients || []), JSON.stringify(sizes || []), image || '', JSON.stringify(images || [])]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const fields = []; const params = []; let i = 1;
    for (const key of ['name', 'category', 'description', 'price', 'available', 'featured', 'image']) {
      if (req.body[key] !== undefined) { fields.push(`"${key}" = $${i++}`); params.push(req.body[key]); }
    }
    if (req.body.ingredients) { fields.push(`ingredients = $${i++}`); params.push(JSON.stringify(req.body.ingredients)); }
    if (req.body.sizes) { fields.push(`sizes = $${i++}`); params.push(JSON.stringify(req.body.sizes)); }
    if (req.body.images) { fields.push(`images = $${i++}`); params.push(JSON.stringify(req.body.images)); }
    if (!fields.length) return res.status(400).json({ message: 'No fields to update' });
    params.push(req.params.id);
    const result = await pool.query(`UPDATE menu_items SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`, params);
    if (!result.rows.length) return res.status(404).json({ message: 'Menu item not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM menu_items WHERE id = $1 RETURNING *', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Menu item not found' });
    res.json({ message: 'Item removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
