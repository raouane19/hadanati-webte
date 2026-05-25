import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaRegUser } from 'react-icons/fa';
import { FiHeart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { LuUtensils } from 'react-icons/lu';
import { MdOutlineHealthAndSafety } from 'react-icons/md';
import { FaEquals } from 'react-icons/fa';
import { MdOutlineLocationOn } from 'react-icons/md';
import { MdOutlineAccessTime } from 'react-icons/md';
import ParentProfile from "./parentprfile";
import {
  searchDaycares,
  getSavedDaycares,
  saveDaycare,
  unsaveDaycare,
  getUser,
} from '../api/auth';
import './ParentDashboard.css';

const BASE_URL = import.meta.env.VITE_API_URL;
const CARDS_PER_PAGE = 3;

// Convert "HH:MM:SS" to total minutes
const timeStringToMinutes = (str) => {
  if (!str) return null;
  const parts = str.split(':');
  if (parts.length < 2) return null;
  return parseInt(parts[0]) * 60 + parseInt(parts[1]);
};

const ParentDashboard = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const currentUser = getUser();

  const [showProfile, setShowProfile] = useState(false);
  const [search,      setSearch]      = useState('');
  const [location,    setLocation]    = useState('');
  const [filters, setFilters] = useState({
    lunch:        false,
    snacks:       false,
    transport:    false,
    educational:  false,
    maxPrice:     25000,
    city:         '',
    openingTime:  '',
    closingTime:  '',
  });

  const [daycares,     setDaycares]     = useState([]);
  const [savedIds,     setSavedIds]     = useState(new Set());
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState('');
  const [currentPage,  setCurrentPage]  = useState(1);
  const [navAvatar,    setNavAvatar]    = useState(null);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  const fetchDaycares = useCallback(async (nameQuery = '', cityQuery = '') => {
    setLoading(true);
    setError('');
    try {
      const params = {
        ...(nameQuery ? { name: nameQuery } : {}),
        ...(cityQuery ? { city: cityQuery } : {}),
        ...(!nameQuery && {
          ...(filters.lunch       ? { has_lunch: 1 }      : {}),
          ...(filters.snacks      ? { has_snacks: 1 }     : {}),
          ...(filters.transport   ? { has_transport: 1 }  : {}),
          ...(filters.educational ? { has_activities: 1 } : {}),
          price_max: filters.maxPrice,
          ...(filters.openingTime ? { open_time:  filters.openingTime } : {}),
          ...(filters.closingTime ? { close_time: filters.closingTime } : {}),
        }),
      };

      const res = await searchDaycares(params);
      setDaycares(Array.isArray(res.data) ? res.data : []);
      setCurrentPage(1);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load daycares');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchDaycares(); }, []); // eslint-disable-line

  useEffect(() => {
    if (!currentUser?.id) return;
    getSavedDaycares(currentUser.id)
      .then((res) => {
        if (Array.isArray(res.data))
          setSavedIds(new Set(res.data.map((d) => d.id)));
      })
      .catch(() => {});
  }, [currentUser?.id]);

  // Avatar
  useEffect(() => {
    const u = getUser();
    const img = u?.profile_image || u?.Profile_image || u?.profileImage || null;
    if (!img) return;
    const url = img.startsWith('http') ? img
      : img.startsWith('/uploads/') ? `${BASE_URL}${img}`
      : `${BASE_URL}/uploads/${img}`;
    fetch(url, { headers: { 'ngrok-skip-browser-warning': 'true' } })
      .then(r => r.ok ? r.blob() : null)
      .then(blob => blob && setNavAvatar(URL.createObjectURL(blob)))
      .catch(() => {});
  }, []);

  const toggleLike = async (daycareId) => {
    if (!currentUser?.id) return;
    const alreadySaved = savedIds.has(daycareId);
    setSavedIds((prev) => {
      const next = new Set(prev);
      alreadySaved ? next.delete(daycareId) : next.add(daycareId);
      return next;
    });
    try {
      if (alreadySaved) await unsaveDaycare(currentUser.id, daycareId);
      else              await saveDaycare(currentUser.id, daycareId);
    } catch (err) {
      if (err.response?.status !== 409) {
        setSavedIds((prev) => {
          const next = new Set(prev);
          alreadySaved ? next.add(daycareId) : next.delete(daycareId);
          return next;
        });
      }
    }
  };

  const handleFilterChange = (name) =>
    setFilters((prev) => ({ ...prev, [name]: !prev[name] }));

  const handleApplyFilters = () => fetchDaycares(search, location);

  const handleFind = () => {
    if (search.trim() === '' && location.trim() === '') {
      alert('Please enter a daycare name or city first!');
      return;
    }
    navigate(`/search-results?name=${encodeURIComponent(search)}&city=${encodeURIComponent(location)}`);
  };

  // Client-side filtering using HH:MM:SS format from backend
  const clientFiltered = daycares.filter((d) => {
    if (filters.city) {
      const daycareCity = (d.City || d.address || '').toLowerCase();
      if (!daycareCity.includes(filters.city.toLowerCase())) return false;
    }
    if (filters.openingTime) {
      const chosen  = timeStringToMinutes(filters.openingTime);
      // d.open_time comes from backend as "HH:MM:SS"
      const opening = timeStringToMinutes(d.open_time);
      // daycare must open AT or BEFORE chosen time
      if (opening === null || opening > chosen) return false;
    }
    if (filters.closingTime) {
      const chosen  = timeStringToMinutes(filters.closingTime);
      // d.close_time comes from backend as "HH:MM:SS"
      const closing = timeStringToMinutes(d.close_time);
      // daycare must close AT or AFTER chosen time
      if (closing === null || closing < chosen) return false;
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(clientFiltered.length / CARDS_PER_PAGE));
  const paginatedDaycares = clientFiltered.slice(
    (currentPage - 1) * CARDS_PER_PAGE,
    currentPage * CARDS_PER_PAGE
  );

  const resolveImage = (path) => {
    if (!path) return 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop';
    if (path.startsWith('http')) return path;
    return `${BASE_URL}/${path}`;
  };

  return (
    <>
      {/* ── NAVBAR ── */}
      <div className="search-navbar">
        <div className="search-logo">
          <img className="logo" src="/logo.png" alt="HADANATI" />
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
              {currentUser?.name || 'User'}<br /><small>Parent Member</small>
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
                  const u = getUser();
                  const img = u?.profile_image || u?.Profile_image || u?.profileImage || null;
                  if (!img) return;
                  const url = img.startsWith('http') ? img
                    : img.startsWith('/uploads/') ? `${BASE_URL}${img}`
                    : `${BASE_URL}/uploads/${img}`;
                  fetch(url, { headers: { 'ngrok-skip-browser-warning': 'true' } })
                    .then(r => r.ok ? r.blob() : null)
                    .then(blob => blob && setNavAvatar(URL.createObjectURL(blob)))
                    .catch(() => {});
                }} />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="parent-dashboard">

        {/* ── HERO ── */}
        <div className="pd-hero">
          <h1 className="pd-hero-title">
            {t('parentDashboard.heroTitle1')}{' '}
            <span className="pd-highlight">{t('parentDashboard.heroTitle2')}</span>
            <br />
            {t('parentDashboard.heroTitle3')}
          </h1>
          <p className="pd-hero-sub">{t('parentDashboard.heroSub')}</p>

          <div className="pd-search-bar">
            <div className="pd-search-input">
              <img src="/search.png" alt="" className="pd-input-icon" />
              <input
                type="text"
                placeholder={t('parentDashboard.searchPlaceholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleFind()}
              />
            </div>
            <div className="pd-location-input">
              <img src="/location.png" alt="" className="pd-input-icon pd-pin" />
              <input
                type="text"
                placeholder={t('parentDashboard.locationPlaceholder')}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleFind()}
              />
            </div>
            <button className="pd-find-btn" onClick={handleFind}>
              {t('parentDashboard.findBtn')}
            </button>
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div className="pd-content">

          {/* ── FILTERS SIDEBAR ── */}
          <aside className="pd-filters">
            <h3 className="pd-filters-title">{t('parentDashboard.filters')}</h3>

            {/* ── CITY ── */}
            <div className="pd-filter-section">
              <h4 className="pd-filter-heading">
                <MdOutlineLocationOn size={14} />
                {t('parentDashboard.cityFilter', 'Location')}
              </h4>
              <select
                className="pd-filter-select"
                value={filters.city}
                onChange={(e) => setFilters((prev) => ({ ...prev, city: e.target.value }))}
              >
                <option value="">{t('parentDashboard.allCities', 'All cities')}</option>
                <option value="Oran">Oran</option>
                <option value="Alger">Alger</option>
                <option value="Constantine">Constantine</option>
                <option value="Annaba">Annaba</option>
                <option value="Blida">Blida</option>
                <option value="Tlemcen">Tlemcen</option>
                <option value="Sétif">Sétif</option>
                <option value="Batna">Batna</option>
              </select>
            </div>

            {/* ── OPENING TIME ── */}
            <div className="pd-filter-section">
              <h4 className="pd-filter-heading">
                <MdOutlineAccessTime size={14} />
                {t('parentDashboard.openingTime', 'Opens by')}
              </h4>
              <select
                className="pd-filter-select"
                value={filters.openingTime}
                onChange={(e) => setFilters((prev) => ({ ...prev, openingTime: e.target.value }))}
              >
                <option value="">{t('parentDashboard.anyTime', 'Any time')}</option>
                <option value="06:00:00">6:00 am</option>
                <option value="07:00:00">7:00 am</option>
                <option value="07:30:00">7:30 am</option>
                <option value="08:00:00">8:00 am</option>
                <option value="08:30:00">8:30 am</option>
                <option value="09:00:00">9:00 am</option>
              </select>
            </div>

            {/* ── CLOSING TIME ── */}
            <div className="pd-filter-section">
              <h4 className="pd-filter-heading">
                <MdOutlineAccessTime size={14} />
                {t('parentDashboard.closingTime', 'Closes after')}
              </h4>
              <select
                className="pd-filter-select"
                value={filters.closingTime}
                onChange={(e) => setFilters((prev) => ({ ...prev, closingTime: e.target.value }))}
              >
                <option value="">{t('parentDashboard.anyTime', 'Any time')}</option>
                <option value="16:00:00">4:00 pm</option>
                <option value="16:30:00">4:30 pm</option>
                <option value="17:00:00">5:00 pm</option>
                <option value="17:30:00">5:30 pm</option>
                <option value="18:00:00">6:00 pm</option>
                <option value="18:30:00">6:30 pm</option>
                <option value="19:00:00">7:00 pm</option>
              </select>
            </div>

            {/* ── FOOD ── */}
            <div className="pd-filter-section">
              <h4 className="pd-filter-heading">
                <LuUtensils size={14} />
                {t('parentDashboard.foodProvided')}
              </h4>
              <label className="pd-checkbox-row">
                <input type="checkbox" checked={filters.lunch} onChange={() => handleFilterChange('lunch')} />
                {t('parentDashboard.lunchIncluded')}
              </label>
              <label className="pd-checkbox-row">
                <input type="checkbox" checked={filters.snacks} onChange={() => handleFilterChange('snacks')} />
                {t('parentDashboard.healthySnacks')}
              </label>
            </div>

            {/* ── PRICE ── */}
            <div className="pd-filter-section">
              <h4 className="pd-filter-heading">
                <MdOutlineHealthAndSafety size={14} />
                {t('parentDashboard.healthcareCap')}
              </h4>
              <div className="pd-price-range">
                <input
                  type="range"
                  min="3000"
                  max="25000"
                  step="500"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, maxPrice: parseInt(e.target.value) }))
                  }
                />
                <div className="pd-price-labels">
                  <span>3,000 DZD/m</span>
                  <span>Max {filters.maxPrice.toLocaleString()} DZD/m</span>
                </div>
              </div>
            </div>

            {/* ── AMENITIES ── */}
            <div className="pd-filter-section">
              <h4 className="pd-filter-heading">
                <FaEquals size={15} />
                {t('parentDashboard.amenities')}
              </h4>
              <div className="pd-toggle-row">
                <span>{t('parentDashboard.transport')}</span>
                <input
                  className="switch"
                  type="checkbox"
                  checked={filters.transport}
                  onChange={() => handleFilterChange('transport')}
                />
              </div>
              <div className="pd-toggle-row">
                <span>{t('parentDashboard.educational')}</span>
                <input
                  className="switch"
                  type="checkbox"
                  checked={filters.educational}
                  onChange={() => handleFilterChange('educational')}
                />
              </div>
            </div>

            <button className="pd-apply-btn" onClick={handleApplyFilters}>
              {t('parentDashboard.applyFilters')}
            </button>
          </aside>

          {/* ── LISTINGS ── */}
          <div className="pd-listings">

            {error && <div className="pd-error-banner">⚠️ {error}</div>}

            <p className="pd-results-count">
              <strong>
                {loading ? '…' : clientFiltered.length} {t('parentDashboard.centersFound')}
              </strong>{' '}
              {t('parentDashboard.found')}
              {location ? ` ${t('parentDashboard.near')} ${location}` : ''}
            </p>

            {loading ? (
              <div className="pd-loading">Loading daycares…</div>
            ) : (
              <>
                <div className="pd-cards">
                  {paginatedDaycares.map((daycare) => (
                    <div key={daycare.id} className="pd-card">
                      <div className="pd-card-image">
                        <img
                          src={resolveImage(daycare.profile_image)}
                          alt={daycare.name}
                          onError={(e) => {
                            e.target.src =
                              'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop';
                          }}
                        />
                        {daycare.badge && (
                          <span className={`pd-badge ${daycare.badge === 'TOP RATED' ? 'pd-badge-top' : 'pd-badge-value'}`}>
                            {daycare.badge === 'TOP RATED'
                              ? t('parentDashboard.topRated')
                              : t('parentDashboard.bestValue')}
                          </span>
                        )}
                        <button
                          className={`pd-favorite ${savedIds.has(daycare.id) ? 'active' : ''}`}
                          onClick={() => toggleLike(daycare.id)}
                        >
                          {savedIds.has(daycare.id) ? <FaHeart /> : <FiHeart />}
                        </button>
                      </div>

                      <div className="pd-card-info">
                        <div>
                          <div className="pd-card-top">
                            <h3 className="pd-card-name">{daycare.name}</h3>
                            {daycare.rating != null && (
                              <span className="pd-card-rating">⭐ {daycare.rating}</span>
                            )}
                          </div>
                          <div className="pd-card-meta-row">
                            {(daycare.City || daycare.address) && (
                              <span className="pd-card-meta">
                                <MdOutlineLocationOn size={15} />
                                {daycare.City || daycare.address}
                              </span>
                            )}
                            {daycare.hours && (
                              <span className="pd-card-meta">
                                <MdOutlineAccessTime size={15} />
                                {daycare.hours}
                              </span>
                            )}
                            {daycare.price != null && (
                              <span className="pd-card-meta">
                                {daycare.price.toLocaleString()} DZD/m
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          className="pd-view-btn"
                          onClick={() => navigate(`/daycare/${daycare.id}`)}
                        >
                          {t('parentDashboard.viewDetails')}
                        </button>
                      </div>
                    </div>
                  ))}

                  {paginatedDaycares.length === 0 && (
                    <p className="pd-no-results">No daycares found. Try adjusting your search.</p>
                  )}
                </div>

                {totalPages > 1 && (
                  <div className="pd-pagination">
                    <button
                      className="pd-page-btn"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >‹</button>

                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        className={`pd-page-btn ${currentPage === p ? 'active' : ''}`}
                        onClick={() => setCurrentPage(p)}
                      >{p}</button>
                    ))}

                    {totalPages > 5 && <span className="pd-page-dots">…</span>}

                    <button
                      className="pd-page-btn"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >›</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ParentDashboard;