import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { menuAPI, healthAPI, subscribeAPI } from '../utils/api';
import { useLanguage } from '../context/LanguageContext';
import ProductCard from '../components/ProductCard';
import { FiMail, FiX } from 'react-icons/fi';

const HERO_BANNERS = [
  { titleKey: 'Fresh Coffee Delivered', subtitleKey: 'From Kigali to your door', ctaKey: 'Shop Now', link: '/menu', img: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1400&h=500&fit=crop' },
  { titleKey: 'Health Rated Drinks', subtitleKey: 'Every drink scored', ctaKey: 'View Ratings', link: '/health', img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1400&h=500&fit=crop' },
  { titleKey: 'Shop by Category', subtitleKey: 'Limited batch from the highlands of Rwanda', ctaKey: 'Explore Menu', link: '/menu?category=brewed', img: 'https://images.unsplash.com/photo-1559526324-593bc073d938?w=1400&h=500&fit=crop' },
];

const Home = () => {
  const { t } = useLanguage();
  const [featured, setFeatured] = useState([]);
  const [ratings, setRatings] = useState({});
  const [bannerIdx, setBannerIdx] = useState(0);
  const [subEmail, setSubEmail] = useState('');
  const [subMsg, setSubMsg] = useState('');
  const [subStatus, setSubStatus] = useState('');
  const [showSubPopup, setShowSubPopup] = useState(false);

  useEffect(() => {
    Promise.all([
      menuAPI.getAll({ featured: true, available: true }),
      healthAPI.getAll(),
    ]).then(([menuRes, healthRes]) => {
      setFeatured(menuRes.data);
      const map = {};
      healthRes.data.forEach(r => { map[r.menuItemId] = r; });
      setRatings(map);
    }).catch(() => {});
    const interval = setInterval(() => {
      setBannerIdx(prev => (prev + 1) % HERO_BANNERS.length);
    }, 5000);
    const subTimer = setTimeout(() => setShowSubPopup(true), 15000);
    return () => { clearInterval(interval); clearTimeout(subTimer); };
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      const res = await subscribeAPI.subscribe(subEmail);
      setSubMsg(res.data.message);
      setSubStatus('success');
      setSubEmail('');
    } catch {
      setSubMsg(t('sub_error'));
      setSubStatus('error');
    }
  };

  const banner = HERO_BANNERS[bannerIdx];

  return (
    <div className="amz-home">
      <section className="amz-hero" style={{ backgroundImage: `url(${banner.img})` }}>
        <div className="amz-hero-content">
          <div className="amz-hero-text">
            <h1>{t(banner.titleKey)}</h1>
            <p>{t(banner.subtitleKey)}</p>
            <Link to={banner.link} className="amz-btn amz-btn-hero">{t(banner.ctaKey)}</Link>
          </div>
        </div>
        <div className="amz-hero-dots">
          {HERO_BANNERS.map((_, i) => (
            <button key={i} className={`amz-hero-dot ${i === bannerIdx ? 'active' : ''}`}
              onClick={() => setBannerIdx(i)} />
          ))}
        </div>
      </section>

      <div className="amz-home-content">
        {featured.length > 0 && (
          <section className="amz-section">
            <div className="amz-section-header">
              <h2>{t('Featured Drinks')}</h2>
              <Link to="/menu" className="amz-see-all">{t('See all')}</Link>
            </div>
            <div className="amz-product-row">
              {featured.map(item => (
                <ProductCard key={item.id} item={item} health={ratings[item.id]} />
              ))}
            </div>
          </section>
        )}

        <section className="amz-section">
          <div className="amz-section-header">
            <h2>{t('Shop by Category')}</h2>
          </div>
          <div className="amz-category-grid">
            {[
              { nameKey: 'Espresso', slug: 'espresso', img: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=300&h=300&fit=crop' },
              { nameKey: 'Cold Drinks', slug: 'cold', img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&h=300&fit=crop' },
              { nameKey: 'Specialty', slug: 'specialty', img: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=300&h=300&fit=crop' },
              { nameKey: 'Pastries', slug: 'pastry', img: 'https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=300&h=300&fit=crop' },
            ].map(cat => (
              <Link key={cat.slug} to={`/menu?category=${cat.slug}`} className="amz-cat-card">
                <img src={cat.img} alt={t(cat.nameKey)} loading="lazy" />
                <span>{t(cat.nameKey)}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="amz-section">
          <div className="amz-section-header">
            <h2>{t('Why Brew & Bean?')}</h2>
          </div>
          <div className="amz-why-grid">
            <div className="amz-why-card">
              <h3>{t('Premium Beans')}</h3>
              <p>{t('Sourced from finest farms')}</p>
            </div>
            <div className="amz-why-card">
              <h3>{t('Health Rated')}</h3>
              <p>{t('Every drink scored')}</p>
            </div>
            <div className="amz-why-card">
              <h3>{t('Fast Delivery')}</h3>
              <p>{t('30 min delivery in Kigali')}</p>
            </div>
          </div>
        </section>

        <section className="amz-section amz-subscribe-section">
          <div className="amz-subscribe-card">
            <h3><FiMail /> {t('Subscribe for 10% off')}</h3>
            <form onSubmit={handleSubscribe} className="amz-subscribe-form">
              <input type="email" placeholder={t('sub_placeholder')} value={subEmail}
                onChange={e => setSubEmail(e.target.value)} required />
              <button type="submit">{t('sub_button')}</button>
            </form>
            {subMsg && <p className={`amz-sub-msg ${subStatus}`}>{subMsg}</p>}
          </div>
        </section>
      </div>

      {showSubPopup && (
        <div className="amz-sub-popup-overlay" onClick={() => setShowSubPopup(false)}>
          <div className="amz-sub-popup" onClick={e => e.stopPropagation()}>
            <button className="amz-sub-popup-close" onClick={() => setShowSubPopup(false)}><FiX /></button>
            <h3>{t('sub_title')}</h3>
            <p>{t('sub_body')}</p>
            <form onSubmit={(e) => { handleSubscribe(e); setShowSubPopup(false); }}>
              <input type="email" placeholder={t('sub_email')} value={subEmail}
                onChange={e => setSubEmail(e.target.value)} required />
              <button type="submit">{t('sub_btn')}</button>
            </form>
            <button className="amz-sub-dismiss" onClick={() => setShowSubPopup(false)}>{t('sub_dismiss')}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
