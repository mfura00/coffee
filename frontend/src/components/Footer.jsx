import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { FiMapPin, FiPhone, FiMail, FiChevronUp } from 'react-icons/fi';

const Footer = () => {
  const { t, tDynamic } = useLanguage();
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="amz-footer">
      <button className="amz-footer-top" onClick={scrollTop}>
        <FiChevronUp /> {t('Back to top')}
      </button>

      <div className="amz-footer-links">
        <div className="amz-footer-col">
          <h4>{t('Get to Know Us')}</h4>
          <Link to="/about">{t('About Brew & Bean')}</Link>
          <Link to="/about">{t('Our Story')}</Link>
          <Link to="/careers">{t('Careers')}</Link>
          <Link to="/press">{t('Press Center')}</Link>
        </div>
        <div className="amz-footer-col">
          <h4>{t('Connect With Us')}</h4>
          <p><FiMapPin /> Kigali, Rwanda</p>
          <p><FiPhone /> 0795407244</p>
          <p><FiMail /> hello@brewandbean.com</p>
          <div className="amz-social">
            <span>Facebook</span> <span>Instagram</span> <span>Twitter</span>
          </div>
        </div>
        <div className="amz-footer-col">
          <h4>{t('Let Us Help You')}</h4>
          <Link to="/account">{t('Your Account')}</Link>
          <Link to="/orders">{t('Your Orders')}</Link>
          <Link to="/contact">{t('Contact Us')}</Link>
          <Link to="/help">{t('Help Center')}</Link>
        </div>
        <div className="amz-footer-col">
          <h4>{t('Make Money')}</h4>
          <Link to="/sell">{t('Sell on Brew & Bean')}</Link>
          <Link to="/partner">{t('Partner Program')}</Link>
          <Link to="/affiliate">{t('Affiliate')}</Link>
          <Link to="/wholesale">{t('Wholesale')}</Link>
        </div>
      </div>

      <div className="amz-footer-divider" />

      <div className="amz-footer-bottom">
        <Link to="/" className="amz-footer-logo">
          <svg width="28" height="28" viewBox="0 0 400 400" fill="none">
            <circle cx="200" cy="200" r="190" fill="none" stroke="white" strokeWidth="6"/>
            <circle cx="200" cy="200" r="175" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="6 6"/>
            <g transform="translate(200,210)">
              <path d="M-6,-65 C-30,-55 -50,-30 -48,0 C-46,30 -30,55 -6,65 C-12,40 -14,0 -12,-30 C-10,-50 -8,-60 -6,-65Z" fill="white" opacity="0.9"/>
              <path d="M6,-65 C30,-55 50,-30 48,0 C46,30 30,55 6,65 C12,40 14,0 12,-30 C10,-50 8,-60 6,-65Z" fill="#F3A847" opacity="0.9"/>
            </g>
            <g opacity="0.5">
              <path d="M165,160 C150,130 140,100 155,70" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round"/>
              <path d="M235,160 C250,130 260,100 245,70" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round"/>
            </g>
            <text x="200" y="305" textAnchor="middle" fontFamily="Georgia,serif" fontSize="22" fontWeight="bold" fill="white" letterSpacing="4">B&amp;B</text>
          </svg>
          Brew & Bean
        </Link>
        <p className="amz-footer-copy">
          {tDynamic('footer_rights', { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
