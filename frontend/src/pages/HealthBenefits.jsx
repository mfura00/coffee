import { useState, useEffect } from 'react';
import { healthAPI, menuAPI } from '../utils/api';
import { useLanguage } from '../context/LanguageContext';
import HealthRating from '../components/HealthRating';

const HealthBenefits = () => {
  const { t } = useLanguage();
  const [ratings, setRatings] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([healthAPI.getAll(), menuAPI.getAll()])
      .then(([rRes, mRes]) => {
        setRatings(rRes.data);
        setMenuItems(mRes.data);
        if (rRes.data.length > 0) setSelected(rRes.data[0]);
      }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const getItemName = (menuItemId) => {
    const item = menuItems.find(m => m.id === menuItemId);
    return item?.name || `Item #${menuItemId}`;
  };

  if (loading) return <div className="loading-spinner"><div className="spinner" /></div>;

  return (
    <div className="page health-page">
      <section className="page-hero">
        <h1>{t('Health Benefits')}</h1>
        <p>{t('health_desc')}</p>
      </section>

      <div className="health-grid">
        <div className="health-list">
          <h3>{t('Coffee & Pastries')}</h3>
          {ratings.map(r => (
            <div key={r.id} className={`health-list-item ${selected?.menuItemId === r.menuItemId ? 'active' : ''}`}
              onClick={() => setSelected(r)}>
              <div className="health-list-score" style={{
                background: r.healthScore >= 75 ? '#2e7d32' : r.healthScore >= 50 ? '#f9a825' : '#c62828'
              }}>{r.healthScore}%</div>
              <div>
                <strong>{getItemName(r.menuItemId)}</strong>
                <small>{r.caffeine}mg {t('Caffeine')}</small>
              </div>
            </div>
          ))}
        </div>
        <div className="health-detail">
          {selected ? <HealthRating rating={selected} /> : <p>Select a drink</p>}
        </div>
      </div>
    </div>
  );
};

export default HealthBenefits;
