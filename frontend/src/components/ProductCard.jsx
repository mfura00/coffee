import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { FiShoppingCart, FiChevronDown, FiChevronUp, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const toRWF = (price) => `RWF ${Number(price).toLocaleString()}`;

const ProductCard = ({ item, health }) => {
  const { addToCart, cart, setSize } = useCart();
  const { t } = useLanguage();
  const [showDetails, setShowDetails] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const cartItem = cart[item.id];

  const images = item.images?.length > 0
    ? item.images
    : [item.image || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop'];

  const healthScore = health?.healthScore;
  const getHealthDot = () => {
    if (!healthScore) return null;
    if (healthScore >= 75) return 'green';
    if (healthScore >= 50) return 'gold';
    return 'red';
  };
  const hDot = getHealthDot();

  const nextImg = (e) => { e.stopPropagation(); setImgIdx(prev => (prev + 1) % images.length); };
  const prevImg = (e) => { e.stopPropagation(); setImgIdx(prev => (prev - 1 + images.length) % images.length); };

  const renderPrice = (price) => toRWF(price);

  return (
    <div className={`amz-product-card ${showDetails ? 'expanded' : ''}`}>
      <div className="amz-product-img-wrap" onClick={() => setShowDetails(!showDetails)}
        style={{ position: 'relative' }}>
        {images.length > 1 && (
          <>
            <button className="amz-img-nav amz-img-prev" onClick={prevImg}><FiChevronLeft /></button>
            <button className="amz-img-nav amz-img-next" onClick={nextImg}><FiChevronRight /></button>
            <div className="amz-img-dots">
              {images.map((_, i) => (
                <span key={i} className={`amz-img-dot ${i === imgIdx ? 'active' : ''}`}
                  onClick={(e) => { e.stopPropagation(); setImgIdx(i); }} />
              ))}
            </div>
          </>
        )}
        <img
          src={images[imgIdx]}
          alt={item.name}
          loading="lazy"
          onError={e => { e.target.style.display = 'none'; }}
        />
        {item.featured && <span className="amz-badge">{t('Featured')}</span>}
        {healthScore !== undefined && (
          <span className={`amz-badge amz-badge-health ${hDot}`}>
            {healthScore}% {t('Health')}
          </span>
        )}
      </div>

      <div className="amz-product-body">
        <span className="amz-product-cat">{t(item.category)}</span>
        <h3 className="amz-product-title" onClick={() => setShowDetails(!showDetails)}>
          {item.name}
        </h3>

        {healthScore !== undefined && (
          <div className="amz-health-inline">
            <span className={`amz-dot ${hDot}`} />
            <span>{t('Health Score')}: <strong>{healthScore}%</strong></span>
          </div>
        )}

        {showDetails && item.description && (
          <p className="amz-product-desc">{item.description}</p>
        )}

        <div className="amz-product-rating">
          <div className="amz-stars">
            {[1, 2, 3, 4, 5].map(s => (
              <span key={s} className="amz-star">&#9733;</span>
            ))}
          </div>
          <span className="amz-rating-count">(24)</span>
        </div>

        <div className="amz-product-price">
          {item.sizes?.length > 0 ? (
            <select
              className="amz-size-select"
              value={cartItem?.selectedSize || item.sizes[0]?.name || ''}
              onChange={e => setSize(item.id, e.target.value)}
              onClick={e => e.stopPropagation()}
            >
              {item.sizes.map(s => (
                <option key={s.name} value={s.name}>{renderPrice(s.price)} - {s.name}</option>
              ))}
            </select>
          ) : (
            <span className="amz-price">{renderPrice(item.price)}</span>
          )}
        </div>

        <button className="amz-btn amz-btn-add" onClick={() => addToCart(item)}>
          <FiShoppingCart /> {t('Add to Cart')}
        </button>

        {images.length > 1 && (
          <div className="amz-thumb-row">
            {images.map((img, i) => (
              <img key={i} src={img} alt="" className={`amz-thumb ${i === imgIdx ? 'active' : ''}`}
                onClick={(e) => { e.stopPropagation(); setImgIdx(i); }} />
            ))}
          </div>
        )}

        <button className="amz-details-toggle" onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? <><FiChevronUp /> {t('Show less')}</> : <><FiChevronDown /> {t('More details')}</>}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
