import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { FiSearch, FiSun, FiMoon, FiUser, FiLogOut, FiPackage, FiMenu, FiX, FiChevronDown, FiGlobe } from 'react-icons/fi';

const CATEGORIES = [
  { value: '', labelKey: 'All' },
  { value: 'espresso', labelKey: 'Espresso' },
  { value: 'brewed', labelKey: 'Brewed' },
  { value: 'cold', labelKey: 'Cold Drinks' },
  { value: 'specialty', labelKey: 'Specialty' },
  { value: 'pastry', labelKey: 'Pastries' },
];

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'kin', label: 'Kinyarwanda' },
  { code: 'fr', label: 'French' },
  { code: 'sw', label: 'Kiswahili' },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const { cartCount, setCartOpen } = useCart();
  const { lang, setLang, t } = useLanguage();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef();

  useEffect(() => {
    const handleClick = (e) => { if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/menu?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false); };

  const currentLang = LANGUAGES.find(l => l.code === lang);

  return (
    <>
      <header className="amz-header">
        <div className="amz-header-row">
          <button className="amz-mobile-menu" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>

          <Link to="/" className="amz-logo">
            <svg width="36" height="36" viewBox="0 0 400 400" fill="none">
              <circle cx="200" cy="200" r="190" fill="none" stroke="white" strokeWidth="6"/>
              <circle cx="200" cy="200" r="175" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="6 6"/>
              <g transform="translate(200,210)">
                <path d="M-6,-65 C-30,-55 -50,-30 -48,0 C-46,30 -30,55 -6,65 C-12,40 -14,0 -12,-30 C-10,-50 -8,-60 -6,-65Z" fill="white" opacity="0.9"/>
                <path d="M6,-65 C30,-55 50,-30 48,0 C46,30 30,55 6,65 C12,40 14,0 12,-30 C10,-50 8,-60 6,-65Z" fill="#F3A847" opacity="0.9"/>
              </g>
              <g opacity="0.6">
                <path d="M165,160 C150,130 140,100 155,70 C165,50 180,45 185,60" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round"/>
                <path d="M235,160 C250,130 260,100 245,70 C235,50 220,45 215,60" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round"/>
              </g>
              <path d="M100,300 C100,290 140,285 200,285 C260,285 300,290 300,300 C300,310 260,315 200,315 C140,315 100,310 100,300Z" fill="none" stroke="white" strokeWidth="3"/>
              <text x="200" y="305" textAnchor="middle" fontFamily="Georgia,serif" fontSize="22" fontWeight="bold" fill="white" letterSpacing="5">B&amp;B</text>
            </svg>
            <span className="amz-logo-text">Brew<span className="amz-logo-dot">.</span>Bean</span>
          </Link>

          <form className="amz-search" onSubmit={handleSearch}>
            <select className="amz-search-cat" defaultValue="all">
              <option value="all">{t('All')}</option>
              {CATEGORIES.filter(c => c.value).map(c => (
                <option key={c.value} value={c.value}>{t(c.labelKey)}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder={t('search_placeholder')}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button type="submit"><FiSearch /></button>
          </form>

          <div className="amz-header-right">
            <div className="amz-lang-selector" ref={langRef}>
              <button className="amz-icon-btn amz-lang-btn" onClick={() => setLangOpen(!langOpen)} title={t('Language')}>
                <FiGlobe /> <span className="amz-lang-current">{currentLang?.label?.slice(0, 3) || 'EN'}</span>
              </button>
              {langOpen && (
                <div className="amz-lang-dropdown">
                  {LANGUAGES.map(l => (
                    <button key={l.code} className={`amz-lang-option ${lang === l.code ? 'active' : ''}`}
                      onClick={() => { setLang(l.code); setLangOpen(false); }}>
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button className="amz-icon-btn" onClick={toggleTheme} title="Toggle theme">
              {dark ? <FiSun /> : <FiMoon />}
            </button>

            {user ? (
              <Link to="/profile" className="amz-nav-item">
                <span className="amz-nav-line1">{user.name?.split(' ')[0]}</span>
                <span className="amz-nav-line2">{t('Account')}</span>
              </Link>
            ) : (
              <Link to="/login" className="amz-nav-item">
                <span className="amz-nav-line1">{t('hello_sign_in')}</span>
                <span className="amz-nav-line2">{t('Account')}</span>
              </Link>
            )}

            <Link to="/orders" className="amz-nav-item">
              <span className="amz-nav-line1">{t('Returns')}</span>
              <span className="amz-nav-line2">{t('Orders')}</span>
            </Link>

            <button className="amz-cart-btn" onClick={() => setCartOpen(true)}>
              <div className="amz-cart-icon-wrap">
                <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                {cartCount > 0 && <span className="amz-cart-badge">{cartCount}</span>}
              </div>
              <div className="amz-cart-text">
                <span className="amz-nav-line1">{t('Cart')}</span>
                {cartCount > 0 && <span className="amz-nav-line2">{cartCount} {t('items')}</span>}
              </div>
            </button>

            {user?.role === 'admin' && (
              <Link to="/admin" className="amz-nav-item">
                <span className="amz-nav-line1">{t('Admin')}</span>
                <span className="amz-nav-line2">{t('Panel')}</span>
              </Link>
            )}

            {user && (
              <button className="amz-icon-btn" onClick={handleLogout} title={t('Sign out')}>
                <FiLogOut />
              </button>
            )}
          </div>
        </div>
      </header>

      <nav className="amz-subnav">
        <div className={`amz-subnav-inner ${menuOpen ? 'active' : ''}`}>
          {CATEGORIES.filter(c => c.value).map(c => (
            <Link key={c.value} to={`/menu${c.value ? `?category=${c.value}` : ''}`}
              className="amz-subnav-link" onClick={() => setMenuOpen(false)}>
              {t(c.labelKey)}
            </Link>
          ))}
          <Link to="/about" className="amz-subnav-link" onClick={() => setMenuOpen(false)}>{t('About')}</Link>
          <Link to="/health" className="amz-subnav-link" onClick={() => setMenuOpen(false)}>{t('Health')}</Link>
          <Link to="/contact" className="amz-subnav-link" onClick={() => setMenuOpen(false)}>{t('Contact')}</Link>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
