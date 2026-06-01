import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './joinpage.css';

const JoinPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="join-container">
      <div className="join-header">
        <h1 className="join-title">{t('join.title')}</h1>
        <p className="join-subtitle">{t('join.subtitle')}</p>
      </div>

      <div className="join-cards">

        <div className="join-card">
          <div className="join-card-icon parent-icon">
            <img src="/parent (1).png" alt="parent" className="card-icon-img" />
          </div>
          <h2 className="join-card-title">{t('join.parentTitle')}</h2>
          <p className="join-card-desc">{t('join.parentDesc')}</p>
          <button className="btn-primary join-btn" onClick={() => navigate('/register-parent')}>
            {t('join.parentBtn')}
          </button>
        </div>

        <div className="join-card">
          <div className="join-card-icon nursery-icon">
            <img src="/daycare (1).png" alt="daycare" className="card-icon-img" />
          </div>
          <h2 className="join-card-title">{t('join.nurseryTitle')}</h2>
          <p className="join-card-desc">{t('join.nurseryDesc')}</p>
          <button className="btn-primary join-btn" onClick={() => navigate('/register-nursery')}>
            {t('join.nurseryBtn')}
          </button>
        </div>

      </div>

      <button className="join-back" onClick={() => navigate('/')}>
        ← {t('join.back')}
      </button>
    </div>
  );
};

export default JoinPage;