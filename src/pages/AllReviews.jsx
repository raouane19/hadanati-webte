import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaRegUser } from 'react-icons/fa';
import './AllReviews.css';
import ParentProfile from './parentprfile';
import { getUser } from '../api/auth';

const AllReviews = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = getUser();

  const [showProfile, setShowProfile] = useState(false);
  const [navAvatar,   setNavAvatar]   = useState(null);
  const [reviews,     setReviews]     = useState([]);
  const [loading,     setLoading]     = useState(true);

  // ── Load avatar ────────────────────────────────────────────────────────────
  useEffect(() => {
    const u = getUser();
    const img = u?.profile_image || u?.Profile_image || u?.profileImage || null;
    if (!img) return;
    const BASE_URL = import.meta.env.VITE_API_URL;
    const url = img.startsWith('http') ? img
      : img.startsWith('/uploads/') ? `${BASE_URL}${img}`
      : `${BASE_URL}/uploads/${img}`;
    fetch(url, { headers: { 'ngrok-skip-browser-warning': 'true' } })
      .then(r => r.ok ? r.blob() : null)
      .then(blob => blob && setNavAvatar(URL.createObjectURL(blob)))
      .catch(() => {});
  }, []);

  // ── Fetch reviews from backend ─────────────────────────────────────────────
  useEffect(() => {
    if (!currentUser?.id) {
      setLoading(false);
      return;
    }
    const BASE_URL = import.meta.env.VITE_API_URL;
    fetch(`${BASE_URL}/parents/${currentUser.id}/reviews`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'ngrok-skip-browser-warning': 'true',
      },
    })
      .then(r => r.json())
      .then(data => {
        setReviews(Array.isArray(data) ? data : []);
      })
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, [currentUser?.id]);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en');
  };

  const refreshAvatar = () => {
    const u = getUser();
    const img = u?.profile_image || u?.Profile_image || u?.profileImage || null;
    if (!img) return;
    const BASE_URL = import.meta.env.VITE_API_URL;
    const url = img.startsWith('http') ? img
      : img.startsWith('/uploads/') ? `${BASE_URL}${img}`
      : `${BASE_URL}/uploads/${img}`;
    fetch(url, { headers: { 'ngrok-skip-browser-warning': 'true' } })
      .then(r => r.ok ? r.blob() : null)
      .then(blob => blob && setNavAvatar(URL.createObjectURL(blob)))
      .catch(() => {});
  };

  return (
    <>
      {/* ── NAVBAR ── */}
      <div className="search-navbar">
        <div className="search-logo">
          <img className="logo" src="/public/logo.png" alt="HADANATI" />
        </div>
        <div className="search-nav-links">
          <span>{t('navbar.home')}</span>
          <span>{t('navbar.about')}</span>
          <span>{t('navbar.help')}</span>
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
              {currentUser
                ? `${currentUser.first_name || ''} ${currentUser.last_name || ''}`.trim() || 'Parent'
                : 'Guest'}
              <br /><small>Parent Member</small>
            </span>
            <div className="search-avatar" onClick={() => setShowProfile(true)}>
              {navAvatar
                ? <img src={navAvatar} alt="avatar"
                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                : <FaRegUser />
              }
              {showProfile && (
                <ParentProfile onClose={() => {
                  setShowProfile(false);
                  refreshAvatar();
                }} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── PAGE ── */}
      <div className="ar-page">
        <div className="ar-header">
          <button className="ar-back" onClick={() => navigate(-1)}>
            {t('allReviews.back')}
          </button>
          <div>
            <h1 className="ar-title">{t('allReviews.title')}</h1>
            <p className="ar-sub">{reviews.length} {t('allReviews.subtitle')}</p>
          </div>
        </div>

        <div className="ar-list">
          {loading && (
            <p style={{ color: '#aaa', textAlign: 'center', marginTop: '40px' }}>
              Loading...
            </p>
          )}

          {!loading && reviews.length === 0 && (
            <p style={{ color: '#aaa', textAlign: 'center', marginTop: '40px' }}>
              {t('allReviews.noReviews')}
            </p>
          )}

          {!loading && reviews.map((r) => (
            <div className="ar-card" key={r.id}>
              <div className="ar-card-top">
                <div className="ar-stars-row">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span
                      key={s}
                      style={{
                        color: s <= r.rating ? '#F5A623' : '#ddd',
                        fontSize: '18px',
                      }}
                    >★</span>
                  ))}
                  <span className="ar-score">{Number(r.rating).toFixed(1)}</span>
                </div>
                <span className="ar-author">
                  {r.daycare_name}
                  {r.review_date && (
                    <span style={{ fontSize: '11px', color: '#aaa', marginLeft: '8px' }}>
                      {new Date(r.review_date).toLocaleDateString()}
                    </span>
                  )}
                </span>
              </div>
              <p className="ar-text">{r.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AllReviews;