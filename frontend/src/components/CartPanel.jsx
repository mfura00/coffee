import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { orderAPI } from '../utils/api';
import { FiX, FiMinus, FiPlus, FiShoppingCart, FiCheckCircle } from 'react-icons/fi';
import { useState } from 'react';

const toRWF = (price) => `RWF ${Number(price).toLocaleString()}`;

const CartPanel = () => {
  const { cartItems, cartCount, cartTotal, cartOpen, setCartOpen, updateQty, getItemPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [guestForm, setGuestForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [orderSuccess, setOrderSuccess] = useState(false);

  const placeOrder = async () => {
    if (!user) {
      if (!guestForm.name.trim() || !guestForm.phone.trim()) {
        alert(t('Please fill in your name and phone number.'));
        return;
      }
    }
    setPlacing(true);
    try {
      const itemsData = cartItems.map(item => ({
        menuItem: item.id, name: item.name, quantity: item.qty,
        size: item.selectedSize || '', price: getItemPrice(item),
      }));
      const subtotal = cartTotal;
      const tax = Math.round(subtotal * 0.08 * 100) / 100;
      const payload = {
        items: itemsData, subtotal, tax, total: subtotal + tax,
        deliveryAddress: guestForm.address,
      };
      if (!user) {
        payload.guestName = guestForm.name;
        payload.guestEmail = guestForm.email;
        payload.guestPhone = guestForm.phone;
      }
      await orderAPI.create(payload);
      clearCart();
      if (user) {
        setCartOpen(false);
        navigate('/orders');
      } else {
        setOrderSuccess(true);
      }
    } catch {
      alert(t('Failed to place order.'));
    } finally {
      setPlacing(false);
    }
  };

  const handleGuestChange = (e) => {
    setGuestForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <>
      <div className={`amz-cart-overlay ${cartOpen ? 'active' : ''}`} onClick={() => setCartOpen(false)} />
      <aside className={`amz-cart-panel ${cartOpen ? 'active' : ''}`}>
        <div className="amz-cart-header">
          <h2><FiShoppingCart /> {t('Your Cart')} ({cartCount})</h2>
          <button className="amz-cart-close" onClick={() => { setCartOpen(false); setOrderSuccess(false); }}><FiX /></button>
        </div>

        {orderSuccess ? (
          <div className="amz-cart-empty">
            <FiCheckCircle size={48} style={{ color: '#22c55e' }} />
            <h3>{t('Order placed successfully!')}</h3>
            <p>{t('We will contact you shortly.')}</p>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button className="amz-btn amz-btn-checkout" onClick={() => { setCartOpen(false); setOrderSuccess(false); }}>
                {t('Continue shopping')}
              </button>
              <Link to="/login" className="amz-btn" onClick={() => { setCartOpen(false); setOrderSuccess(false); }}
                style={{ textAlign: 'center', textDecoration: 'none' }}>
                {t('Sign in to track orders')}
              </Link>
            </div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="amz-cart-empty">
            <FiShoppingCart size={48} />
            <p>{t('Your cart is empty')}</p>
          </div>
        ) : (
          <>
            <div className="amz-cart-items">
              {cartItems.map(item => (
                <div key={item.id} className="amz-cart-item">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=80&h=80&fit=crop'}
                    alt={item.name}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                  <div className="amz-cart-item-body">
                    <h4>{item.name}</h4>
                    {item.selectedSize && <span className="amz-cart-size">{item.selectedSize}</span>}
                    <div className="amz-cart-item-bottom">
                      <div className="amz-cart-qty">
                        <button onClick={() => updateQty(item.id, -1)}><FiMinus /></button>
                        <span>{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)}><FiPlus /></button>
                      </div>
                      <span className="amz-cart-price">{toRWF(getItemPrice(item) * item.qty)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {!user && (
              <div className="amz-guest-form" style={{ padding: '12px 16px', borderTop: '1px solid var(--border, #e5e7eb)' }}>
                <p style={{ fontSize: 13, marginBottom: 8, opacity: 0.7 }}>
                  {t('Signing in is optional')} — {t('fill in your details to order as guest')}
                </p>
                <input name="name" placeholder={t('Your name') + ' *'} value={guestForm.name} onChange={handleGuestChange}
                  style={{ width: '100%', padding: '8px 10px', marginBottom: 6, borderRadius: 6, border: '1px solid var(--border, #ddd)', fontSize: 14, boxSizing: 'border-box' }} />
                <input name="phone" placeholder={t('Phone number') + ' *'} value={guestForm.phone} onChange={handleGuestChange}
                  style={{ width: '100%', padding: '8px 10px', marginBottom: 6, borderRadius: 6, border: '1px solid var(--border, #ddd)', fontSize: 14, boxSizing: 'border-box' }} />
                <input name="email" type="email" placeholder={t('Email (optional)')} value={guestForm.email} onChange={handleGuestChange}
                  style={{ width: '100%', padding: '8px 10px', marginBottom: 6, borderRadius: 6, border: '1px solid var(--border, #ddd)', fontSize: 14, boxSizing: 'border-box' }} />
                <input name="address" placeholder={t('Delivery address (optional)')} value={guestForm.address} onChange={handleGuestChange}
                  style={{ width: '100%', padding: '8px 10px', marginBottom: 0, borderRadius: 6, border: '1px solid var(--border, #ddd)', fontSize: 14, boxSizing: 'border-box' }} />
              </div>
            )}

            <div className="amz-cart-footer">
              <div className="amz-cart-subtotal">
                <span>{t('Subtotal')} ({cartCount} {t('items')}):</span>
                <strong>{toRWF(cartTotal)}</strong>
              </div>
              <button className="amz-btn amz-btn-checkout" onClick={placeOrder} disabled={placing}>
                {placing ? t('Processing') : user ? t('Place Order') : t('Order as Guest')}
              </button>
              {!user && (
                <Link to="/login" onClick={() => setCartOpen(false)}
                  style={{ display: 'block', textAlign: 'center', marginTop: 8, fontSize: 13, color: 'var(--accent, #f3a847)' }}>
                  {t('Already have an account?')} {t('Sign in')}
                </Link>
              )}
            </div>
          </>
        )}
      </aside>
    </>
  );
};

export default CartPanel;
