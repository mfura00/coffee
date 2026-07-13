import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { menuAPI, healthAPI } from '../utils/api';
import { useLanguage } from '../context/LanguageContext';
import ProductCard from '../components/ProductCard';
import { FiGrid, FiList } from 'react-icons/fi';

const CATEGORIES = [
  { value: '', labelKey: 'All' },
  { value: 'espresso', labelKey: 'Espresso' },
  { value: 'brewed', labelKey: 'Brewed' },
  { value: 'cold', labelKey: 'Cold Drinks' },
  { value: 'specialty', labelKey: 'Specialty' },
  { value: 'pastry', labelKey: 'Pastries' },
];

const Menu = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [ratings, setRatings] = useState({});
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [view, setView] = useState('grid');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cat = searchParams.get('category') || '';
    setCategory(cat);
    const params = { available: true };
    if (cat) params.category = cat;
    Promise.all([
      menuAPI.getAll(params),
      healthAPI.getAll(),
    ]).then(([menuRes, healthRes]) => {
      setItems(menuRes.data);
      const map = {};
      healthRes.data.forEach(r => { map[r.menuItemId] = r; });
      setRatings(map);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [searchParams]);

  if (loading) return <div className="loading-spinner"><div className="spinner" /></div>;

  return (
    <div className="amz-page">
      <div className="amz-menu-top">
        <h1>{t('Coffee & Pastries')}</h1>
        <p>{items.length} {t('results')}</p>
      </div>

      <div className="amz-menu-controls">
        <div className="amz-menu-cats">
          {CATEGORIES.map(c => (
            <button key={c.value}
              className={`amz-cat-pill ${category === c.value ? 'active' : ''}`}
              onClick={() => {
                setCategory(c.value);
                const params = new URLSearchParams();
                if (c.value) params.set('category', c.value);
                window.history.replaceState({}, '', `/menu${params.toString() ? '?' + params : ''}`);
              }}
            >
              {t(c.labelKey)}
            </button>
          ))}
        </div>
        <div className="amz-view-toggle">
          <button className={`amz-view-btn ${view === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')}>
            <FiGrid />
          </button>
          <button className={`amz-view-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>
            <FiList />
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="amz-empty">
          <h3>{t('No items found')}</h3>
          <p>{t('Try a different category')}</p>
        </div>
      ) : (
        <div className={`amz-product-grid ${view === 'list' ? 'amz-list-view' : ''}`}>
          {items.map(item => (
            <ProductCard key={item.id} item={item} health={ratings[item.id]} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Menu;
