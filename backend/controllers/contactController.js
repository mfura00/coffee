const pool = require('../config/database');

exports.submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const result = await pool.query(
      'INSERT INTO contact_messages (name, email, subject, message) VALUES ($1,$2,$3,$4) RETURNING *',
      [name, email, subject, message]
    );
    res.status(201).json({ message: 'Message sent successfully', contact: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM contact_messages ORDER BY "createdAt" DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const result = await pool.query('UPDATE contact_messages SET "isRead" = TRUE WHERE id = $1 RETURNING *', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Message not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
