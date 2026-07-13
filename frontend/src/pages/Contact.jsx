import { useState } from 'react';
import { contactAPI, subscribeAPI } from '../utils/api';
import { useLanguage } from '../context/LanguageContext';
import { FiMapPin, FiPhone, FiMail, FiClock, FiSend, FiArrowRight } from 'react-icons/fi';

const Contact = () => {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [subEmail, setSubEmail] = useState('');
  const [subMsg, setSubMsg] = useState('');

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = t('Name required');
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = t('Valid email required');
    if (!form.subject.trim()) errs.subject = t('Subject required');
    if (!form.message.trim()) errs.message = t('Message required');
    else if (form.message.length > 1000) errs.message = t('Max 1000 chars');
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSending(true);
    try {
      await contactAPI.submit(form);
      setSubmitted(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setErrors({ submit: t('Failed to send') });
    } finally {
      setSending(false);
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      const res = await subscribeAPI.subscribe(subEmail);
      setSubMsg(res.data.message);
      setSubEmail('');
    } catch { setSubMsg(t('sub_error')); }
  };

  return (
    <div className="page contact-page">
      <section className="page-hero">
        <h1>{t('Get In Touch')}</h1>
        <p>{t("We'd love to hear from you")}</p>
      </section>
      <div className="contact-grid">
        <div className="contact-info">
          <div className="info-item"><FiMapPin /> <div><h4>{t('Visit Us')}</h4><p>Kigali, Rwanda</p></div></div>
          <div className="info-item"><FiPhone /> <div><h4>{t('Call Us')}</h4><p>0795407244</p></div></div>
          <div className="info-item"><FiMail /> <div><h4>{t('Email')}</h4><p><a href="mailto:mfurakevin00@gmail.com">mfurakevin00@gmail.com</a></p></div></div>
          <div className="info-item"><FiClock /> <div><h4>{t('Hours')}</h4><p>{t('Mon-Sat: 6AM - 8PM')}<br />{t('Sunday: 7AM - 6PM')}</p></div></div>
        </div>

        <div className="contact-form-wrap">
          <h3>{t('Contact Form')}</h3>
          <form className="contact-form" onSubmit={handleSubmit}>
            {submitted && <div className="alert alert-success">{t('Message sent')}</div>}
            {errors.submit && <div className="alert alert-error">{errors.submit}</div>}
            <div className="form-group">
              <input type="text" placeholder={t('Your Name')} value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className={errors.name ? 'error' : ''} />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>
            <div className="form-group">
              <input type="email" placeholder={t('Your Email')} value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className={errors.email ? 'error' : ''} />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>
            <div className="form-group">
              <input type="text" placeholder={t('Subject')} value={form.subject}
                onChange={e => setForm({ ...form, subject: e.target.value })}
                className={errors.subject ? 'error' : ''} />
              {errors.subject && <span className="field-error">{errors.subject}</span>}
            </div>
            <div className="form-group">
              <textarea rows="5" placeholder={t('Your Message')} value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                className={errors.message ? 'error' : ''} />
              {errors.message && <span className="field-error">{errors.message}</span>}
            </div>
            <button type="submit" className="btn btn-primary" disabled={sending}>
              <FiSend /> {sending ? t('Sending') : t('Send Message')}
            </button>
          </form>

          <div className="contact-email-direct">
            <p>{t('Email us directly')}: <a href="mailto:mfurakevin00@gmail.com">mfurakevin00@gmail.com</a> <FiArrowRight /></p>
          </div>

          <div className="contact-subscribe">
            <h4>{t('Subscribe to our newsletter')}</h4>
            <form onSubmit={handleSubscribe} className="inline-sub-form">
              <input type="email" placeholder={t('sub_placeholder')} value={subEmail}
                onChange={e => setSubEmail(e.target.value)} required />
              <button type="submit">{t('sub_btn')}</button>
            </form>
            {subMsg && <p className="amz-sub-msg success">{subMsg}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
