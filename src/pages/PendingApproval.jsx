import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, getUser } from '../api/auth';
import { useTranslation } from 'react-i18next';

const PendingApproval = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const currentUser = getUser();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en');
  };

  return (
    <>
      <div className="search-navbar">
        <div className="search-logo">
          <img className="logo" src="/logo.png" alt="HADANATI" />
        </div>
        <div className="search-nav-links">
          <span onClick={() => navigate('/')}>{t('navbar.home')}</span>
          <span onClick={() => navigate('/about')}>{t('navbar.about')}</span>
          <span onClick={() => navigate('/help')}>{t('navbar.help')}</span>
        </div>
        <div className="search-nav-right">
          <div className="language-toggle" onClick={toggleLanguage}>
            <span className="language-label">{t('navbar.language')}</span>
            <div className="lang-switch">
              <span className={i18n.language === 'en' ? 'lang-active' : ''}>EN</span>
              <span>/</span>
              <span className={i18n.language === 'ar' ? 'lang-active' : ''}>AR</span>
            </div>
          </div>
          <div className="search-user">
            <span className="search-user-name">
              {currentUser?.name || currentUser?.email || 'Daycare'}
              <br /><small>Daycare Member</small>
            </span>
          </div>
        </div>
      </div>

      <div style={{ background: '#fbf6fb', minHeight: '100vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif", padding: '40px 20px' }}>
        <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #e2e5ef',
          padding: '56px 48px', maxWidth: '520px', width: '100%', textAlign: 'center',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>

          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#f0f2f8',
            border: '1px solid #e2e5ef', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 28px' }}>
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#6B8E9E" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#f0f2f8',
            border: '1px solid #e2e5ef', borderRadius: '999px', padding: '6px 16px', fontSize: '12px',
            fontWeight: '600', color: '#4a5568', marginBottom: '20px' }}>
            ⏳ Pending Review
          </div>

          <h1 style={{ fontSize: '1.9rem', fontWeight: '800', color: '#4a5568', margin: '0 0 12px' }}>
            Application Submitted!
          </h1>
          <p style={{ fontSize: '1rem', color: '#6b7280', lineHeight: '1.7', margin: '0 0 36px' }}>
            Your daycare profile has been submitted successfully. Our admin team is reviewing your certification and will activate your account soon.
          </p>

          {[
            { icon: '✓', label: 'Profile submitted', done: true },
            { icon: '⏳', label: 'Admin review in progress', done: false },
            { icon: '🔔', label: 'You will be notified once approved', done: false },
          ].map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px',
              background: step.done ? '#f0f2f8' : '#fafafa', border: `1px solid ${step.done ? '#d0d5e8' : '#e5e7eb'}`,
              borderRadius: '12px', padding: '14px 18px', marginBottom: '10px', textAlign: 'left' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%',
                background: step.done ? '#6B8E9E' : '#f0f2f8', display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                <span style={{ color: step.done ? 'white' : '#4a5568' }}>{step.icon}</span>
              </div>
              <span style={{ fontSize: '14px', fontWeight: '600', color: step.done ? '#4a5568' : '#9ca3af' }}>
                {step.label}
              </span>
            </div>
          ))}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '32px' }}>
            <button onClick={() => navigate('/help')}
              style={{ padding: '14px', borderRadius: '12px', background: '#6B8E9E', color: 'white',
                border: 'none', fontSize: '15px', fontWeight: '700', cursor: 'pointer' }}>
              Contact Support
            </button>
            <button onClick={() => navigate('/hadanati-login')}
          style={{ padding: '14px', borderRadius: '12px', background: 'transparent',
            color: '#9ca3af', border: '1.5px solid #e5e7eb', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
          Login as Nursery
        </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PendingApproval;