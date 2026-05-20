import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './AllReviews.css';

const AllReviews = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // get reviews passed via navigate state, fallback to empty
  const reviews = location.state?.reviews || [];

  // merge with any pending localStorage reviews
  const pending = JSON.parse(localStorage.getItem('pendingReviews') || '[]');
  const allReviews = [
    ...reviews.map(r => ({
      id: r.id,
      score: r.score,
      text: t(r.textKey),
      author: t(r.authorKey),
    })),
    ...pending.map(r => ({
      id: r.id,
      score: r.rating + '.0',
      text: r.quote.replace(/"/g, ''),
      author: r.parent,
    })),
  ];

  return (
  <div className="ar-page">
  <div className="ar-header">
    <button className="ar-back" onClick={() => navigate(-1)}>{t('allReviews.back')}</button>
    <div>
      <h1 className="ar-title">{t('allReviews.title')}</h1>
      <p className="ar-sub">{allReviews.length} {t('allReviews.subtitle')}</p>
    </div>
  </div>

  <div className="ar-list">
    {allReviews.length === 0 && (
      <p style={{ color: '#aaa', textAlign: 'center', marginTop: '40px' }}>
        {t('allReviews.noReviews')}
      </p>
    )}
    {allReviews.map((r) => (
      <div className="ar-card" key={r.id}>
        <div className="ar-card-top">
          <div className="ar-stars-row">
            {[1,2,3,4,5].map((s) => (
              <span key={s} style={{ color: s <= parseFloat(r.score) ? '#F5A623' : '#ddd', fontSize: '18px' }}>★</span>
            ))}
            <span className="ar-score">{r.score}</span>
          </div>
          <span className="ar-author">{r.author}</span>
        </div>
        <p className="ar-text">{r.text}</p>
      </div>
    ))}
  </div>
</div>
  );
};

export default AllReviews;