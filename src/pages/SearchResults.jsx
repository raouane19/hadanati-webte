import React, { useState, useEffect } from 'react';
import './SearchResults.css';
import { FiSearch, FiMapPin, FiHeart, FiStar } from 'react-icons/fi';
import { MdOutlineVerified } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import ParentProfile from './parentprfile';
import { useLocation } from 'react-router-dom';
import { searchDaycares } from '../api/auth'; // ✅ import API

const SearchResults = () => {
  const { t, i18n } = useTranslation();
  const [showProfile, setShowProfile] = useState(false);
  const { state } = useLocation();
  const [searchName, setSearchName] = useState(state?.name || '');
  const [searchCity, setSearchCity] = useState(state?.city || 'sidi bel abbas');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [liked, setLiked] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ✅ fetch from backend
  const fetchDaycares = async (name, city) => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (name.trim()) params.name = name.trim();
      if (city.trim()) params.city = city.trim();

      const response = await searchDaycares(params);
      setResults(response.data);
      setSearched(true);
    } catch (err) {
      console.error(err);
      setError('Failed to load results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ run search on page load
  useEffect(() => {
    fetchDaycares(searchName, searchCity);
  }, []);

  const handleSearch = () => {
    fetchDaycares(searchName, searchCity);
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  const toggleLike = (id) => {
    setLiked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const topResult = results[0];
  const similarResults = results.slice(1);

  return (
    <div className="search-page">

      {/* Navbar */}
      <div className="search-navbar">
        <div className="search-logo">
          <img className='logo' src="/public/logo.png" alt="HADANATI" />
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
              esi mate<br/><small>Parent Member</small>
            </span>
            <div className="search-avatar" onClick={() => setShowProfile(true)}>
              <FaRegUser />
              {showProfile && <ParentProfile onClose={() => setShowProfile(false)} />}
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-bar-container">
        <div className="search-bar">
          <div className="search-input-group">
            <FiSearch className="search-icon"/>
            <input
              type="text"
              placeholder={t('search.placeholder_name')}
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </div>
          <div className="search-divider"/>
          <div className="search-input-group">
            <FiMapPin className="search-icon"/>
            <input
              type="text"
              placeholder={t('search.placeholder_city')}
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
            />
          </div>
          <button className="find-btn" onClick={handleSearch} disabled={loading}>
            {loading ? '...' : t('search.find_btn')}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>{error}</p>}

      {/* Loading */}
      {loading && <p style={{ textAlign: 'center', marginTop: '20px' }}>Loading...</p>}

      {/* Results */}
      {searched && !loading && results.length > 0 && (
        <div className="results-container">

          {/* Top Result */}
          {topResult && (
            <div className="top-result-section">
              <h1 className="section-title">
                <MdOutlineVerified className="title-icon"/> {t('search.top_result')}
              </h1>
              <div className="top-result-card">
                <div className="top-result-image">
                  <img src={topResult.profile_image || '/public/sun-day.jpg'} alt={topResult.name} />
                  <span className="exact-match">{t('search.exact_match')}</span>
                  <button
                    className={`like-btn ${liked[topResult.id] ? 'liked' : ''}`}
                    onClick={() => toggleLike(topResult.id)}
                  >
                    <FiHeart/>
                  </button>
                </div>
                <div className="top-result-info">
                  <div className="top-result-header">
                    <h2>{topResult.name}</h2>
                    <div className="rating">
                      <FiStar className="star-icon"/>
                      <span>{topResult.rating || '—'}</span>
                      <small>({topResult.reviews || 0} {t('search.reviews')})</small>
                    </div>
                  </div>
                  <p>{topResult.education_info || topResult.address}</p>
                  <button className="view-details-btn">{t('search.view_details')}</button>
                </div>
              </div>
            </div>
          )}

          {/* Similar Centers */}
          {similarResults.length > 0 && (
            <div className="similar-section">
              <div className="similar-header">
                <h3 className="section-title">{t('search.similar')}</h3>
                <span className="view-map">{t('search.view_map')}</span>
              </div>
              <div className="similar-grid">
                {similarResults.map(nursery => (
                  <div key={nursery.id} className="nursery-card">
                    <div className="nursery-card-image">
                      <img src={nursery.profile_image || '/public/little-day.jpg'} alt={nursery.name} />
                      <span className="nursery-rating">
                        <FiStar style={{color: '#f4a523', fill: '#f4a523'}}/> {nursery.rating || '—'}
                      </span>
                    </div>
                    <div className="nursery-card-info">
                      <div className="nursery-card-header">
                        <h4>{nursery.name}</h4>
                        <span className="nursery-distance">{nursery.City}</span>
                      </div>
                      <p>{nursery.education_info || nursery.address}</p>
                      <button className="card-arrow-btn">›</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* No Results */}
      {searched && !loading && results.length === 0 && (
        <div className="no-results">
          <p>{t('search.no_results')}</p>
        </div>
      )}

    </div>
  );
};

export default SearchResults;