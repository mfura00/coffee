const pool = require('../config/database');

exports.createOrder = async (req, res) => {
  try {
    const { items, subtotal, tax, total, paymentMethod, deliveryAddress, notes } = req.body;
    const result = await pool.query(
      'INSERT INTO orders ("userId", items, subtotal, tax, total, "paymentMethod", "deliveryAddress", notes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
      [req.user.id, JSON.stringify(items), subtotal || 0, tax || 0, total, paymentMethod || 'cash', deliveryAddress || '', notes || '']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders WHERE "userId" = $1 ORDER BY "createdAt" DESC', [req.user.id]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders WHERE id = $1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Order not found' });
    const order = result.rows[0];
    if (order.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const result = await pool.query('UPDATE orders SET status = $1 WHERE id = $2 RETURNING *', [status, req.params.id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Order not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    let sql = 'SELECT o.*, u.name AS "userName", u.email AS "userEmail" FROM orders o JOIN users u ON o."userId" = u.id';
    const params = [];
    if (req.query.status) { sql += ' WHERE o.status = $1'; params.push(req.query.status); }
    sql += ' ORDER BY o."createdAt" DESC';
    const result = await pool.query(sql, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
