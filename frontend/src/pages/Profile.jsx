import { useState } from 'react';
import { authAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Profile = () => {
  const { t } = useLanguage();
  const { user, login } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', address: user?.address || '' });
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await authAPI.updateProfile(form);
      setMsg(t('Profile updated'));
    } catch {
      setMsg(t('Error'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page profile-page">
      <section className="page-hero">
        <h1>{t('My Profile')}</h1>
      </section>
      <div className="profile-content">
        {msg && <div className="alert alert-success">{msg}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('Email')}</label>
            <input type="email" value={user?.email || ''} disabled />
          </div>
          <div className="form-group">
            <label>{t('Full Name')}</label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>{t('Phone')}</label>
            <input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="form-group">
            <label>{t('Address')}</label>
            <textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? t('Loading') : t('Update Profile')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
