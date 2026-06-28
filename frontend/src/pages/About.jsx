import { useLanguage } from '../context/LanguageContext';
import { FiMapPin, FiHeart, FiAward } from 'react-icons/fi';

const About = () => {
  const { t } = useLanguage();

  return (
    <div className="page about-page">
      <section className="page-hero">
        <h1>{t('About Brew & Bean')}</h1>
        <p>{t('Our Story')}</p>
      </section>

      <div className="about-content">
        <div className="about-mission">
          <h2>Brew & Bean Coffee Co.</h2>
          <p>Founded in Kigali, Rwanda, Brew & Bean is dedicated to serving the finest coffee while promoting health and wellness. Every drink we serve is carefully crafted and nutritionally scored so you know exactly what you're consuming.</p>
          <p>We source our beans from local Rwandan farmers and international partners, ensuring fair trade and exceptional quality in every cup.</p>
        </div>

        <div className="about-values">
          <div className="about-value-card">
            <FiMapPin size={32} />
            <h3>Kigali, Rwanda</h3>
            <p>Proudly serving our community from the heart of Rwanda.</p>
          </div>
          <div className="about-value-card">
            <FiHeart size={32} />
            <h3>Health First</h3>
            <p>Every drink rated for nutrition. Know your health score.</p>
          </div>
          <div className="about-value-card">
            <FiAward size={32} />
            <h3>Premium Quality</h3>
            <p>Only the finest beans, expertly roasted and brewed.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
