import { useState, useEffect } from 'react';
import { adminAPI, menuAPI, orderAPI, contactAPI, healthAPI, uploadAPI, imageAPI } from '../utils/api';
import { useLanguage } from '../context/LanguageContext';
import { FiUsers, FiShoppingBag, FiDollarSign, FiMessageSquare, FiCoffee, FiActivity } from 'react-icons/fi';

const toRWF = (price) => `RWF ${Number(price).toLocaleString()}`;

const AdminDashboard = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [menuItems, setMenuItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [healthRatings, setHealthRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editForm, setEditForm] = useState({ name: '', price: '', category: '', description: '', available: true, image: '', images: [] });
  const [showAddForm, setShowAddForm] = useState(false);
  const [healthForm, setHealthForm] = useState({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const results = await Promise.allSettled([
        adminAPI.getDashboard(), menuAPI.getAll(), adminAPI.getUsers(),
        orderAPI.getAll(), contactAPI.getAll(), healthAPI.getAll(),
      ]);
      if (results[0].status === 'fulfilled') setStats(results[0].value.data);
      if (results[1].status === 'fulfilled') setMenuItems(results[1].value.data);
      if (results[2].status === 'fulfilled') setUsers(results[2].value.data);
      if (results[3].status === 'fulfilled') setAllOrders(results[3].value.data);
      if (results[4].status === 'fulfilled') setMessages(results[4].value.data);
      if (results[5].status === 'fulfilled') setHealthRatings(results[5].value.data);
      results.filter(r => r.status === 'rejected').forEach(r => console.error('Admin load error:', r.reason));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const updateStatus = async (id, status) => { await orderAPI.updateStatus(id, status); loadData(); };
  const toggleAvailability = async (id, available) => { await menuAPI.update(id, { available: !available }); loadData(); };
  const updateRole = async (id, role) => { await adminAPI.updateUserRole(id, role); loadData(); };
  const deleteMenuItem = async (id) => { if (window.confirm('Delete this item?')) { await menuAPI.delete(id); loadData(); } };
  const markRead = async (id) => { await contactAPI.markRead(id); loadData(); };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await uploadAPI.upload(fd);
      const url = res.data.url;
      setEditForm(prev => ({ ...prev, image: url, images: [...(prev.images || []), url] }));
    } catch (err) { console.error('Upload error:', err); alert('Upload failed'); }
    finally { setUploading(false); }
  };

  const addMenuItem = async (e) => {
    e.preventDefault();
    const price = parseFloat(editForm.price);
    if (isNaN(price) || price <= 0) { alert('Please enter a valid price'); return; }
    try {
      await menuAPI.create({
        ...editForm,
        price,
        sizes: [],
        images: editForm.images && editForm.images.length ? editForm.images : [],
      });
      setShowAddForm(false);
      setEditForm({ name: '', price: '', category: '', description: '', available: true, image: '', images: [] });
      loadData();
    } catch (err) { console.error('Add item error:', err.response?.data || err.message); alert('Failed to add item'); }
  };

  const updateHealthRating = async (menuId) => {
    try {
      const data = healthForm[menuId];
      await healthAPI.update(menuId, data);
      loadData();
    } catch (err) { alert('Failed to update health rating'); }
  };

  const getStatusBadge = (status) => {
    const cls = {
      pending: 'admin-badge-gold', confirmed: 'admin-badge-blue',
      preparing: 'admin-badge-blue', ready: 'admin-badge-green',
      delivered: 'admin-badge-green', cancelled: 'admin-badge-red',
    }[status] || 'admin-badge-gold';
    return <span className={`admin-badge ${cls}`}>{status}</span>;
  };

  if (loading) return <div className="loading-spinner"><div className="spinner" /></div>;

  const tabs = [
    { key: 'dashboard', label: t('Dashboard'), icon: FiActivity },
    { key: 'menu', label: `${t('Menu')} (${menuItems.length})`, icon: FiCoffee },
    { key: 'orders', label: `${t('Orders')} (${allOrders.length})`, icon: FiShoppingBag },
    { key: 'users', label: `${t('Users')} (${users.length})`, icon: FiUsers },
    { key: 'messages', label: `${t('Messages')} (${messages.filter(m => !m.read).length})`, icon: FiMessageSquare },
    { key: 'health', label: t('Health Ratings'), icon: FiActivity },
  ];

  const adminBtn = (onClick, label, cls = '') =>
    <button className={`amz-btn amz-btn-sm ${cls}`} onClick={onClick}
      style={{ padding: '6px 14px', fontSize: '0.78rem', borderRadius: '6px' }}>{label}</button>;

  return (
    <div className="admin-page">
      <div className="amz-page-hero" style={{ padding: '28px 20px', margin: 0, background: 'linear-gradient(135deg, var(--amz-plant-dark), var(--amz-plant))', color: 'white', borderRadius: '0 0 12px 12px' }}>
        <h1 style={{ color: 'white', fontFamily: 'var(--font-heading)' }}>{t('Admin Dashboard')}</h1>
        <p style={{ color: 'rgba(255,255,255,0.85)' }}>Manage your Brew & Bean coffee shop</p>
      </div>

      <div className="admin-tabs">
        {tabs.map(tab => (
          <button key={tab.key} className={`admin-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}>{tab.label}</button>
        ))}
      </div>

      {activeTab === 'dashboard' && stats && (
        <>
          <div className="stats-grid">
            <div className="stat-card"><FiUsers /><div><h3>{stats.totalUsers}</h3><p>{t('Total Users')}</p></div></div>
            <div className="stat-card"><FiShoppingBag /><div><h3>{stats.totalOrders}</h3><p>{t('Total Orders')}</p></div></div>
            <div className="stat-card"><FiDollarSign /><div><h3>{toRWF(stats.totalRevenue)}</h3><p>{t('Total Revenue')}</p></div></div>
            <div className="stat-card"><FiMessageSquare /><div><h3>{stats.unreadMessages}</h3><p>{t('Unread Messages')}</p></div></div>
          </div>
          <div className="admin-section">
            <div className="admin-section-header"><h3>{t('Recent Orders')}</h3></div>
            <table className="admin-table">
              <thead><tr><th>ID</th><th>{t('Status')}</th><th>{t('Total')}</th></tr></thead>
              <tbody>
                {stats.recentOrders?.map(o => (
                  <tr key={o.id}>
                    <td><strong>#{o.id?.toString().slice(-8)}</strong></td>
                    <td>{getStatusBadge(o.status)}</td>
                    <td>{toRWF(o.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === 'menu' && (
        <div className="admin-section">
          <div className="admin-section-header">
            <h3>{t('Menu Items')}</h3>
            <button className="amz-btn amz-btn-add" style={{ width: 'auto', padding: '8px 20px', margin: 0 }}
              onClick={() => setShowAddForm(!showAddForm)}>
              {showAddForm ? 'Cancel' : t('Add Item')}
            </button>
          </div>
          {showAddForm && (
            <form onSubmit={addMenuItem} style={{ padding: '16px 20px', borderBottom: '1px solid var(--amz-border)' }}>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
                <input placeholder={t('Name')} value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} required
                  style={{ padding: '8px 12px', border: '1px solid var(--amz-border)', borderRadius: '6px', background: 'var(--amz-input-bg)', color: 'var(--amz-text)' }} />
                <input placeholder={t('Price')} type="number" step="0.01" value={editForm.price} onChange={e => setEditForm({ ...editForm, price: e.target.value })} required
                  style={{ padding: '8px 12px', border: '1px solid var(--amz-border)', borderRadius: '6px', width: '100px', background: 'var(--amz-input-bg)', color: 'var(--amz-text)' }} />
                <select value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })} required
                  style={{ padding: '8px 12px', border: '1px solid var(--amz-border)', borderRadius: '6px', background: 'var(--amz-input-bg)', color: 'var(--amz-text)' }}>
                  <option value="">{t('Category')}</option>
                  {['espresso','brewed','cold','specialty','pastry'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input placeholder={t('Description')} value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} required
                  style={{ padding: '8px 12px', border: '1px solid var(--amz-border)', borderRadius: '6px', flex: '1', minWidth: '200px', background: 'var(--amz-input-bg)', color: 'var(--amz-text)' }} />
              </div>
              <div className="admin-img-upload-wrap">
                {editForm.image && <img src={editForm.image} alt="" className="admin-img-preview" />}
                <label className="admin-img-upload-btn">
                  {uploading ? 'Uploading...' : 'Upload Image'}
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                </label>
                {editForm.images?.length > 0 && (
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {editForm.images.map((img, i) => (
                      <img key={i} src={img} alt="" style={{ width: '35px', height: '35px', objectFit: 'cover', borderRadius: '4px' }} />
                    ))}
                  </div>
                )}
              </div>
              <button type="submit" className="amz-btn amz-btn-add" style={{ width: 'auto', padding: '8px 20px', margin: '10px 0 0' }}>{t('Save')}</button>
            </form>
          )}
          <table className="admin-table">
            <thead><tr><th>{t('Image')}</th><th>{t('Name')}</th><th>{t('Category')}</th><th>{t('Price')}</th><th>{t('Status')}</th><th>{t('Actions')}</th></tr></thead>
            <tbody>
              {menuItems.map(item => (
                <tr key={item.id}>
                  <td>
                    <img src={item.image || ''} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                      onError={e => { e.target.style.display = 'none'; }} />
                  </td>
                  <td><strong>{item.name}</strong><br /><small style={{ color: 'var(--amz-text-secondary)' }}>{item.description?.slice(0, 40)}</small></td>
                  <td><span className="admin-badge admin-badge-blue">{item.category}</span></td>
                  <td>{toRWF(item.price)}</td>
                  <td>{item.available
                    ? <span className="admin-badge admin-badge-green">{t('Available')}</span>
                    : <span className="admin-badge admin-badge-red">{t('Unavailable')}</span>}
                  </td>
                  <td className="admin-actions">
                    {adminBtn(() => toggleAvailability(item.id, item.available), item.available ? t('Disable') : t('Enable'))}
                    {adminBtn(() => deleteMenuItem(item.id), t('Delete'), 'amz-btn-danger')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="admin-section">
          <div className="admin-section-header"><h3>{t('All Orders')}</h3></div>
          <table className="admin-table">
            <thead><tr><th>Order ID</th><th>{t('Users')}</th><th>{t('Items')}</th><th>{t('Total')}</th><th>{t('Status')}</th><th>Update</th></tr></thead>
            <tbody>
              {allOrders.map(order => (
                <tr key={order.id}>
                  <td><strong>#{order.id?.toString().slice(-8)}</strong></td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--amz-text-secondary)' }}>{order.user}</td>
                  <td>{order.items?.length} items</td>
                  <td><strong>{toRWF(order.total)}</strong></td>
                  <td>{getStatusBadge(order.status)}</td>
                  <td>
                    <select value={order.status} onChange={e => updateStatus(order.id, e.target.value)} className="size-select">
                      {['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="admin-section">
          <div className="admin-section-header"><h3>{t('Users')}</h3></div>
          <table className="admin-table">
            <thead><tr><th>{t('Name')}</th><th>{t('Email')}</th><th>Role</th><th>Change Role</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td><strong>{u.name}</strong></td>
                  <td style={{ color: 'var(--amz-text-secondary)' }}>{u.email}</td>
                  <td><span className={`admin-badge ${u.role === 'admin' ? 'admin-badge-green' : 'admin-badge-blue'}`}>{u.role}</span></td>
                  <td>
                    <select value={u.role} onChange={e => updateRole(u.id, e.target.value)} className="size-select">
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'messages' && (
        <div className="admin-section">
          <div className="admin-section-header"><h3>{t('Contact Messages')}</h3></div>
          {messages.map(m => (
            <div key={m.id} className={`admin-row ${!m.read ? 'unread' : ''}`} style={{ borderBottom: '1px solid var(--amz-border)' }}>
              <div style={{ flex: 1 }}>
                <strong>{m.name}</strong> <span style={{ color: 'var(--amz-text-secondary)', fontSize: '0.82rem' }}>({m.email})</span>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, margin: '4px 0' }}>{m.subject}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--amz-text-secondary)' }}>{m.message}</div>
              </div>
              {!m.read && adminBtn(() => markRead(m.id), t('Mark Read'))}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'health' && (
        <div className="admin-section">
          <div className="admin-section-header"><h3>{t('Health Ratings')}</h3></div>
          <table className="admin-table">
            <thead><tr><th>Drink</th><th>{t('Caffeine')}</th><th>{t('Calories')}</th><th>{t('Antioxidants')}</th><th>{t('Sugar')}</th><th>{t('Fat')}</th><th>Score</th><th>{t('Edit')}</th></tr></thead>
            <tbody>
              {healthRatings.map(r => {
                const item = menuItems.find(m => m.id === r.menuItemId);
                const f = healthForm[r.menuItemId] || r;
                const isEditing = healthForm[r.menuItemId];
                return (
                  <tr key={r.id}>
                    <td><strong>{item?.name || 'Unknown'}</strong></td>
                    <td>{isEditing
                      ? <input type="number" value={f.caffeine} onChange={e => setHealthForm({ ...healthForm, [r.menuItemId]: { ...f, caffeine: +e.target.value } })}
                          style={{ width: '60px', padding: '4px 6px', border: '1px solid var(--amz-border)', borderRadius: '4px', background: 'var(--amz-input-bg)', color: 'var(--amz-text)' }} />
                      : <span>{r.caffeine}mg</span>}
                    </td>
                    <td>{isEditing
                      ? <input type="number" value={f.calories} onChange={e => setHealthForm({ ...healthForm, [r.menuItemId]: { ...f, calories: +e.target.value } })}
                          style={{ width: '60px', padding: '4px 6px', border: '1px solid var(--amz-border)', borderRadius: '4px', background: 'var(--amz-input-bg)', color: 'var(--amz-text)' }} />
                      : <span>{r.calories}</span>}
                    </td>
                    <td>{isEditing
                      ? <input type="number" value={f.antioxidants} onChange={e => setHealthForm({ ...healthForm, [r.menuItemId]: { ...f, antioxidants: +e.target.value } })}
                          style={{ width: '60px', padding: '4px 6px', border: '1px solid var(--amz-border)', borderRadius: '4px', background: 'var(--amz-input-bg)', color: 'var(--amz-text)' }} />
                      : <span>{r.antioxidants}%</span>}
                    </td>
                    <td>{isEditing
                      ? <input type="number" value={f.sugar} onChange={e => setHealthForm({ ...healthForm, [r.menuItemId]: { ...f, sugar: +e.target.value } })}
                          style={{ width: '60px', padding: '4px 6px', border: '1px solid var(--amz-border)', borderRadius: '4px', background: 'var(--amz-input-bg)', color: 'var(--amz-text)' }} />
                      : <span>{r.sugar || 0}g</span>}
                    </td>
                    <td>{isEditing
                      ? <input type="number" value={f.fat} onChange={e => setHealthForm({ ...healthForm, [r.menuItemId]: { ...f, fat: +e.target.value } })}
                          style={{ width: '60px', padding: '4px 6px', border: '1px solid var(--amz-border)', borderRadius: '4px', background: 'var(--amz-input-bg)', color: 'var(--amz-text)' }} />
                      : <span>{r.fat || 0}g</span>}
                    </td>
                    <td><span className={`admin-badge ${r.healthScore >= 75 ? 'admin-badge-green' : r.healthScore >= 50 ? 'admin-badge-gold' : 'admin-badge-red'}`}>{r.healthScore}%</span></td>
                    <td className="admin-actions">
                      {isEditing
                        ? <>{adminBtn(() => updateHealthRating(r.menuItemId), 'Save')}{adminBtn(() => setHealthForm({ ...healthForm, [r.menuItemId]: undefined }), 'Cancel')}</>
                        : adminBtn(() => setHealthForm({ ...healthForm, [r.menuItemId]: { ...r } }), 'Edit')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
