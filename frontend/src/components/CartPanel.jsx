import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { orderAPI } from '../utils/api';
import { FiX, FiMinus, FiPlus, FiShoppingCart } from 'react-icons/fi';
import { useState } from 'react';

const toRWF = (price) => `RWF ${Number(price).toLocaleString()}`;

const CartPanel = () => {
  const { cartItems, cartCount, cartTotal, cartOpen, setCartOpen, updateQty, getItemPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);

  const placeOrder = async () => {
    if (!user) { setCartOpen(false); navigate('/login'); return; }
    setPlacing(true);
    try {
      const itemsData = cartItems.map(item => ({
        menuItem: item.id, name: item.name, quantity: item.qty,
        size: item.selectedSize || '', price: getItemPrice(item),
      }));
      const subtotal = cartTotal;
      const tax = Math.round(subtotal * 0.08 * 100) / 100;
      await orderAPI.create({ items: itemsData, subtotal, tax, total: subtotal + tax });
      clearCart();
      setCartOpen(false);
      navigate('/orders');
    } catch {
      alert('Failed to place order.');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <>
      <div className={`amz-cart-overlay ${cartOpen ? 'active' : ''}`} onClick={() => setCartOpen(false)} />
      <aside className={`amz-cart-panel ${cartOpen ? 'active' : ''}`}>
        <div className="amz-cart-header">
          <h2><FiShoppingCart /> {t('Your Cart')} ({cartCount})</h2>
          <button className="amz-cart-close" onClick={() => setCartOpen(false)}><FiX /></button>
        </div>

        {cartItems.length === 0 ? (
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

            <div className="amz-cart-footer">
              <div className="amz-cart-subtotal">
                <span>{t('Subtotal')} ({cartCount} {t('items')}):</span>
                <strong>{toRWF(cartTotal)}</strong>
              </div>
              <button className="amz-btn amz-btn-checkout" onClick={placeOrder} disabled={placing}>
                {placing ? t('Processing') : t('Proceed to Checkout')}
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
};

export default CartPanel;
