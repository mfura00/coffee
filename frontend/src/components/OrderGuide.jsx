import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { FiHelpCircle, FiX, FiSearch, FiCoffee, FiShoppingCart, FiCreditCard, FiPackage, FiArrowRight } from 'react-icons/fi';

const STEPS = [
  { icon: FiSearch, titleKey: 'Browse Menu', descKey: 'order_step1_desc' },
  { icon: FiCoffee, titleKey: 'Select & Customize', descKey: 'order_step2_desc' },
  { icon: FiShoppingCart, titleKey: 'Add to Cart', descKey: 'order_step3_desc' },
  { icon: FiCreditCard, titleKey: 'Checkout', descKey: 'order_step4_desc' },
  { icon: FiPackage, titleKey: 'Track & Enjoy', descKey: 'order_step5_desc' },
];

const OrderGuide = () => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="order-guide-btn" onClick={() => setOpen(true)} title={t('How to Order')}>
        <FiHelpCircle size={22} />
        <span>{t('Help')}</span>
      </button>

      {open && (
        <div className="order-guide-overlay" onClick={() => setOpen(false)}>
          <div className="order-guide-modal" onClick={e => e.stopPropagation()}>
            <div className="order-guide-header">
              <h2>{t('How to Order')}</h2>
              <button className="order-guide-close" onClick={() => setOpen(false)}><FiX /></button>
            </div>
            <div className="order-guide-steps">
              {STEPS.map((step, i) => (
                <div key={i} className="order-guide-step">
                  <div className="order-guide-step-num">{i + 1}</div>
                  <div className="order-guide-step-icon-wrap">
                    <step.icon size={20} />
                  </div>
                  <div className="order-guide-step-body">
                    <h3>{t(step.titleKey)}</h3>
                    <p>{t(step.descKey)}</p>
                  </div>
                  {i < STEPS.length - 1 && <FiArrowRight className="order-guide-arrow" />}
                </div>
              ))}
            </div>
            <div className="order-guide-footer">
              <button className="amz-btn" onClick={() => setOpen(false)}>{t('Got it')}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderGuide;
