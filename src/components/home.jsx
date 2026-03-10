import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';  // ← add this
import './home.css';

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();  // ← add this

  return (
    <div className="home-container">
      <div className="hero-section">
        <span className="badge">{t('home.badge')}</span>
        
        <h1 className="main-title">
          {t('home.title')}<br />
          <span className="brand-name">{t('home.brand')}</span>
        </h1>
        
        <p className="description">
          {t('home.description')}
        </p>
        
        <div className="cta-buttons">
          <button className="btn-primary" onClick={() => navigate('/join')}>  {/* ← add onClick */}
            {t('home.btn1')}
          </button>
          <button className="btn-secondary">
            <span className="play-icon">▶</span> {t('home.btn2')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;