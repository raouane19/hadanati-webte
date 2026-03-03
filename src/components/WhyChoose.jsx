import React from 'react';
import { useTranslation } from 'react-i18next';
import './WhyChoose.css';

const WhyChoose = () => {
  const { t } = useTranslation();

  return (
    <section className="why-choose-section">
      <h2 className="section-title">{t('whyChoose.title')}</h2>
      <div className="underline"></div>
      
      <p className="section-subtitle">
        {t('whyChoose.subtitle')}
      </p>

      <div className="features-grid">
        <div className="feature-card">
          <div className="icon-wrapper">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="feature-title">{t('whyChoose.safety.title')}</h3>
          <p className="feature-description">
            {t('whyChoose.safety.description')}
          </p>
        </div>

        <div className="feature-card">
          <div className="icon-wrapper">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 12v5c3 3 9 3 12 0v-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="feature-title">{t('whyChoose.curriculum.title')}</h3>
          <p className="feature-description">
            {t('whyChoose.curriculum.description')}
          </p>
        </div>

        <div className="feature-card">
          <div className="icon-wrapper">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="9" cy="7" r="4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="feature-title">{t('whyChoose.community.title')}</h3>
          <p className="feature-description">
            {t('whyChoose.community.description')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;