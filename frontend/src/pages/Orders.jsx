import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../utils/api';
import { useLanguage } from '../context/LanguageContext';
import { FiPackage } from 'react-icons/fi';

const toRWF = (price) => `RWF ${Number(price).toLocaleString()}`;

const ORDERS = [];

const Orders = () => {
  const { t } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getMyOrders()
      .then(res => setOrders(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-spinner"><div className="spinner" /></div>;

  return (
    <div className="page orders-page">
      <section className="page-hero">
        <h1>{t('My Orders')}</h1>
      </section>
      <div className="orders-content">
        {orders.length === 0 ? (
          <div className="amz-empty">
            <FiPackage size={48} />
            <h3>{t('No orders yet')}</h3>
            <Link to="/menu" className="btn btn-primary">{t('Start shopping')}</Link>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <span className={`order-status status-${order.status}`}>{order.status}</span>
                <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                <strong className="order-total">{toRWF(order.total)}</strong>
              </div>
              <div className="order-items">
                {order.items?.map((item, i) => (
                  <span key={i}>{item.name} x{item.quantity}{i < order.items.length - 1 ? ', ' : ''}</span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
