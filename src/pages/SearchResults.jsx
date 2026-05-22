import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './SearchResults.css';
import { FiSearch, FiMapPin, FiStar } from 'react-icons/fi';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { MdOutlineVerified } from 'react-icons/md';
import { FaRegUser } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import ParentProfile from './parentprfile';
import {
  searchDaycares,
  saveDaycare,
  unsaveDaycare,
  getSavedDaycares,
  getUser,
} from '../api/auth';

const BASE_URL = import.meta.env.VITE_API_URL;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getImageUrl = (profileImage) => {
  if (!profileImage) return '/sun-day.jpg';
  if (profileImage.startsWith('http')) return profileImage;
  return `${BASE_URL}/${profileImage}`;
};

const normalizeDaycare = (d) => ({
  id: d.id,
  name: d.name,
  city: d.City || d.city || '',
  rating: parseFloat(d.avg_rating ?? d.rating ?? 0).toFixed(1),
  reviews: d.review_count ?? d.reviews ?? 0,
  description: [
    d.education_info,
    d.healthcare_info,
    d.age_range ? `Ages ${d.age_range}` : null,
    d.price ? `${Number(d.price).toLocaleString()} DA/mo` : null,
    d.hours || null,
  ]
    .filter(Boolean)
    .join(' · ') || d.address || '',
  image: getImageUrl(d.profile_image),
  distance: d.distance_km != null ? `${Number(d.distance_km).toFixed(1)} KM` : '',
  exactMatch: (d.match_score ?? 0) >= 5,
  raw: d,
});

// ─── Component ────────────────────────────────────────────────────────────────

const SearchResults = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [showProfile, setShowProfile] = useState(false);

  // ✅ Initialize as empty — useEffect will set from URL params
  const [searchName, setSearchName] = useState('');
  const [searchCity, setSearchCity] = useState('');

  const [results, setResults]   = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [liked, setLiked]       = useState(new Set());
  const [ setSavedMap] = useState({});

  const user = getUser();

  // ── Language toggle ────────────────────────────────────────────────────────
  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  // ── Load saved daycares on mount ───────────────────────────────────────────
  useEffect(() => {
    if (!user?.id) return;
    getSavedDaycares(user.id)
      .then((res) => {
        const ids = new Set((res.data || []).map((d) => d.id));
        setLiked(ids);
      })
      .catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Core search function ───────────────────────────────────────────────────
  const handleSearch = useCallback(
    async (nameOverride, cityOverride) => {
      const name = nameOverride !== undefined ? nameOverride : searchName;
      const city = cityOverride !== undefined ? cityOverride : searchCity;

      setLoading(true);
      setError('');
      try {
        const params = {};
        if (name.trim()) params.name = name.trim();
        if (city.trim()) params.city = city.trim();

        const res = await searchDaycares(params);
        const normalized = (res.data || []).map(normalizeDaycare);
        setResults(normalized);
        setSearched(true);
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          t('search.error') ||
          'Search failed. Please try again.';
        setError(msg);
        setResults([]);
        setSearched(true);
      } finally {
        setLoading(false);
      }
    },
    [searchName, searchCity, t]
  );

  // ✅ KEY FIX: re-runs whenever URL params change (e.g. new search from dashboard)
  useEffect(() => {
    const name = searchParams.get('name') || '';
    const city = searchParams.get('city') || '';
    setSearchName(name);
    setSearchCity(city);
    handleSearch(name, city);
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Save / unsave ──────────────────────────────────────────────────────────
  const toggleLike = async (id) => {
    if (!user?.id) {
      navigate('/login');
      return;
    }

    const isLiked = liked.has(id);

    // Optimistic UI update
    const newLiked = new Set(liked);
    if (isLiked) newLiked.delete(id);
    else newLiked.add(id);
    setLiked(newLiked);

    try {
      if (isLiked) {
        await unsaveDaycare(user.id, id);
        setSavedMap((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
      } else {
        const res = await saveDaycare(user.id, id);
        if (res.data?.savedId) {
          setSavedMap((prev) => ({ ...prev, [id]: res.data.savedId }));
        }
      }
    } catch {
      // Roll back on failure
      setLiked(new Set(liked));
    }
  };

  // ── Move card to top ───────────────────────────────────────────────────────
  const handleSelectNursery = (nursery) => {
    setResults([nursery, ...results.filter((n) => n.id !== nursery.id)]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const topResult      = results[0];
  const similarResults = results.slice(1);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="search-page">

      {/* Navbar */}
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
  {user?.name || 'Guest'}
  <br />
  <small>Parent Member</small>
</span>
            <div className="search-avatar" onClick={() => setShowProfile(true)}>
              <FaRegUser />
              {showProfile && (
                <ParentProfile onClose={() => setShowProfile(false)} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-bar-container">
        <div className="search-bar">
          <div className="search-input-group">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder={t('search.placeholder_name')}
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <div className="search-divider" />
          <div className="search-input-group">
            <FiMapPin className="search-icon" />
            <input
              type="text"
              placeholder={t('search.placeholder_city')}
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button
            className="find-btn"
            onClick={() => handleSearch()}
            disabled={loading}
          >
            {loading ? '…' : t('search.find_btn')}
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="no-results">
          <p>{t('search.loading') || 'Searching…'}</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="no-results">
          <p>{error}</p>
        </div>
      )}

      {/* Results */}
      {!loading && !error && searched && results.length > 0 && (
        <div className="results-container">

          {/* Top Result */}
          {topResult && (
            <div className="top-result-section">
              <h1 className="section-title">
                <MdOutlineVerified className="title-icon" />
                {t('search.top_result')}
              </h1>
              <div className="top-result-card">
                <div className="top-result-image">
                  <img src={topResult.image} alt={topResult.name} />
                  {topResult.exactMatch && (
                    <span className="exact-match">{t('search.exact_match')}</span>
                  )}
                  <button
                    className={`like-btn ${liked.has(topResult.id) ? 'liked' : ''}`}
                    onClick={() => toggleLike(topResult.id)}
                    title={liked.has(topResult.id) ? 'Remove from saved' : 'Save'}
                  >
                    {liked.has(topResult.id)
                      ? <FaHeart color="#e05c5c" />
                      : <FaRegHeart />
                    }
                  </button>
                </div>
                <div className="top-result-info">
                  <div className="top-result-header">
                    <h2>{topResult.name}</h2>
                    <div className="rating">
                      <FiStar className="star-icon" />
                      <span>{topResult.rating > 0 ? topResult.rating : '–'}</span>
                      <small>({topResult.reviews} {t('search.reviews')})</small>
                    </div>
                  </div>
                  {topResult.city && (
                    <p className="result-city">
                      <FiMapPin style={{ marginInlineEnd: 4 }} />
                      {topResult.city}
                    </p>
                  )}
                  <p>{topResult.description}</p>
                  <button
                    className="view-details-btn"
                    onClick={() => navigate(`/daycare/${topResult.id}`)}
                  >
                    {t('search.view_details')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Similar Results */}
          {similarResults.length > 0 && (
            <div className="similar-section">
              <div className="similar-header">
                <h3 className="section-title">{t('search.similar')}</h3>
              </div>
              <div className="similar-grid">
                {similarResults.map((nursery) => (
                  <div key={nursery.id} className="nursery-card">
                    <div className="nursery-card-image">
                      <img src={nursery.image} alt={nursery.name} />
                      <span className="nursery-rating">
                        <FiStar style={{ color: '#f4a523', fill: '#f4a523' }} />
                        {nursery.rating > 0 ? nursery.rating : '–'}
                      </span>
                      <button
                        className={`like-btn like-btn--card ${liked.has(nursery.id) ? 'liked' : ''}`}
                        onClick={(e) => { e.stopPropagation(); toggleLike(nursery.id); }}
                        title={liked.has(nursery.id) ? 'Remove from saved' : 'Save'}
                      >
                        {liked.has(nursery.id)
                          ? <FaHeart color="#e05c5c" />
                          : <FaRegHeart />
                        }
                      </button>
                    </div>
                    <div className="nursery-card-info">
                      <div className="nursery-card-header">
                        <h4>{nursery.name}</h4>
                        <span className="nursery-distance">{nursery.distance}</span>
                      </div>
                      {nursery.city && (
                        <p className="result-city" style={{ fontSize: 12 }}>
                          <FiMapPin style={{ marginInlineEnd: 4 }} />{nursery.city}
                        </p>
                      )}
                      <p>{nursery.description}</p>
                      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                        <button
                          className="view-details-btn"
                          style={{ flex: 1, fontSize: 12 }}
                          onClick={() => navigate(`/daycare/${nursery.id}`)}
                        >
                          {t('search.view_details')}
                        </button>
                        <button
                          className="card-arrow-btn"
                          onClick={() => handleSelectNursery(nursery)}
                          title="Set as top result"
                        >
                          ›
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* No Results */}
      {!loading && !error && searched && results.length === 0 && (
        <div className="no-results">
          <p>{t('search.no_results')}</p>
        </div>
      )}

    </div>
  );
};

export default SearchResults;