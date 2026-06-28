const pool = require('../config/database');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = (await pool.query('SELECT COUNT(*) FROM users')).rows[0].count;
    const totalOrders = (await pool.query('SELECT COUNT(*) FROM orders')).rows[0].count;
    const revenue = await pool.query("SELECT COALESCE(SUM(total),0) FROM orders WHERE status != 'cancelled'");
    const totalRevenue = parseFloat(revenue.rows[0].coalesce);
    const unread = await pool.query('SELECT COUNT(*) FROM contact_messages WHERE "isRead" = FALSE');
    const unreadMessages = parseInt(unread.rows[0].count);
    const recentOrders = (await pool.query('SELECT o.*, u.name AS "userName" FROM orders o JOIN users u ON o."userId" = u.id ORDER BY o."createdAt" DESC LIMIT 5')).rows;
    const ordersByStatusRaw = await pool.query('SELECT status, COUNT(*) FROM orders GROUP BY status');
    const ordersByStatus = {};
    ordersByStatusRaw.rows.forEach(r => { ordersByStatus[r.status] = parseInt(r.count); });
    res.json({ totalUsers: parseInt(totalUsers), totalOrders: parseInt(totalOrders), totalRevenue, recentOrders, unreadMessages: parseInt(unreadMessages), ordersByStatus });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, role, phone, address FROM users ORDER BY "createdAt" DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) return res.status(400).json({ message: 'Invalid role' });
    const result = await pool.query('UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role, phone, address', [role, req.params.id]);
    if (!result.rows.length) return res.status(404).json({ message: 'User not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
