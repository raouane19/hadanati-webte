import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import HowItWorks from './HowItWorks';
import './home.css';

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  return (
    <div className="home-container">
      <div className="hero-section">

        {/* LEFT — text */}
        <div className="hero-text">
          <span className="badge">{t('home.badge')}</span>

          <h1 className="main-title">
            {t('home.title')}<br />
            <span className="brand-name">{t('home.brand')}</span>
          </h1>

          <p className="description">{t('home.description')}</p>

          <div className="cta-buttons">
            <button className="btn-primary" onClick={() => navigate('/join')}>
              {t('home.btn1')}
            </button>
            <button className="btn-secondary" onClick={() => setShowHowItWorks(true)}>
              <span className="play-icon">▶</span> {t('home.btn2')}
            </button>
          </div>
        </div>

        {/* RIGHT — illustrations */}
        <div className="hero-illustration">
          <img src="/sun.jpg" alt="sun" className="sun-img" />
          <img src="/children.jpg" alt="children playing" className="children-img" />
        </div>

      </div>

      {showHowItWorks && (
        <HowItWorks onClose={() => setShowHowItWorks(false)} />
      )}
    </div>
  );
};

export default Home;