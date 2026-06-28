const pool = require('../config/database');

exports.getImages = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM images ORDER BY uploaded_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createImage = async (req, res) => {
  try {
    const { file_name, file_url, public_id, mime_type, file_size } = req.body;
    const result = await pool.query(
      'INSERT INTO images (file_name, file_url, public_id, mime_type, file_size) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [file_name, file_url, public_id || null, mime_type || null, file_size || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM images WHERE id = $1 RETURNING *', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Image not found' });
    res.json({ message: 'Image deleted', image: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
