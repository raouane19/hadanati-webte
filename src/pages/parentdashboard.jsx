import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaRegUser } from "react-icons/fa";
import { FiHeart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { LuUtensils } from "react-icons/lu";
import { MdOutlineHealthAndSafety } from "react-icons/md";
import { FaEquals } from "react-icons/fa";
import { MdOutlineLocationOn } from "react-icons/md";
import { MdOutlineAccessTime } from "react-icons/md";
import ParentProfile from './parentprfile';
import './ParentDashboard.css';

const dummyDaycares = [
  {
    id: 1,
    name: 'Sunshine Early Learning',
    distance: '0.4 miles away',
    hours: 'Open 7AM – 6PM',
    rating: 4.9,
    badge: 'TOP RATED',
    image: '../public/sun-day.jpg',
  },
  {
    id: 2,
    name: 'Little Explorers Academy',
    distance: '1.2 miles away',
    hours: 'Open 8AM – 5PM',
    rating: 4.7,
    badge: null,
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop',
  },
  {
    id: 3,
    name: 'Green Tree Daycare',
    distance: '2.5 miles away',
    hours: 'Open 7:30AM – 6:30PM',
    rating: 4.5,
    badge: 'BEST VALUE',
    image: '../public/wonder-day.jpg',
  },
  {
    id: 4,
    name: 'Rainbow Kids Center',
    distance: '3.1 miles away',
    hours: 'Open 7AM – 7PM',
    rating: 4.6,
    badge: null,
    image: 'https://images.unsplash.com/photo-1576495199011-eb94736d05d6?w=400&h=300&fit=crop',
  },
  {
    id: 5,
    name: 'Happy Steps Nursery',
    distance: '3.8 miles away',
    hours: 'Open 8AM – 6PM',
    rating: 4.3,
    badge: null,
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=300&fit=crop',
  },
  {
    id: 6,
    name: 'Little Stars Academy',
    distance: '4.2 miles away',
    hours: 'Open 7AM – 5:30PM',
    rating: 4.8,
    badge: 'TOP RATED',
    image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b40?w=400&h=300&fit=crop',
  },
];

const CARDS_PER_PAGE = 3;

const ParentDashboard = () => {
  const { t, i18n } = useTranslation();  // ← added i18n here
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [showProfile, setShowProfile] = useState(false);  // ← added
  const [filters, setFilters] = useState({
    lunch: false,
    snacks: false,
    transport: false,
    educational: false,
    maxPrice: 25000,
  });
  const [liked, setLiked] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  // ← added
  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  const toggleLike = (id) => {
    setLiked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleFilterChange = (name) => {
    setFilters((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const filteredDaycares = dummyDaycares.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDaycares.length / CARDS_PER_PAGE);
  const paginatedDaycares = filteredDaycares.slice(
    (currentPage - 1) * CARDS_PER_PAGE,
    currentPage * CARDS_PER_PAGE
  );

  return (
    <>
      {/* ── NAVBAR ── */}
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
              esi mate<br /><small>Parent Member</small>
            </span>
            <div className="search-avatar" onClick={() => setShowProfile(true)}>
              <FaRegUser />
              {showProfile && <ParentProfile onClose={() => setShowProfile(false)} />}
            </div>
          </div>
        </div>
      </div>

      <div className="parent-dashboard">

        {/* ── HERO ── */}
        <div className="pd-hero">
          <h1 className="pd-hero-title">
            {t('parentDashboard.heroTitle1')} <span className="pd-highlight">{t('parentDashboard.heroTitle2')}</span> <br />
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
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              />
            </div>
            <div className="pd-location-input">
              <img src="/location.png" alt="" className="pd-input-icon pd-pin" />
              <input
                type="text"
                placeholder={t('parentDashboard.locationPlaceholder')}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <button
              className="pd-find-btn"
              onClick={() => {
                if (search.trim() === '' && location.trim() === '') {
                  alert('Please enter a daycare name or city first!');
                  return;
                }
                navigate('/search', { state: { name: search, city: location } });
              }}
            >
              {t('parentDashboard.findBtn')}
            </button>
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div className="pd-content">

          {/* ── FILTERS SIDEBAR ── */}
          <aside className="pd-filters">
            <h3 className="pd-filters-title">{t('parentDashboard.filters')}</h3>

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

            <div className="pd-filter-section">
              <h4 className="pd-filter-heading">
                < FaEquals size={15} />
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
                  <div className="pd-toggle-row">
              </div>
            </div>

            <button className="pd-apply-btn">{t('parentDashboard.applyFilters')}</button>
          </aside>

          {/* ── LISTINGS ── */}
          <div className="pd-listings">
            <p className="pd-results-count">
              <strong>{filteredDaycares.length} {t('parentDashboard.centersFound')}</strong>{' '}
              {t('parentDashboard.found')}{location ? ` ${t('parentDashboard.near')} ${location}` : ''}
            </p>

            <div className="pd-cards">
              {paginatedDaycares.map((daycare) => (
                <div key={daycare.id} className="pd-card">
                  <div className="pd-card-image">
                    <img src={daycare.image} alt={daycare.name} />
                    {daycare.badge && (
                       <span className={`pd-badge ${daycare.badge === 'TOP RATED' ? 'pd-badge-top' : 'pd-badge-value'}`}>
                      {daycare.badge === 'TOP RATED'
                        ? t('parentDashboard.topRated')
                        : t('parentDashboard.bestValue')}
                    </span>
                    )}
                  <button
                    className={`pd-favorite ${liked[daycare.id] ? 'active' : ''}`}
                    onClick={() => toggleLike(daycare.id)}
                  >
                    {liked[daycare.id] ? <FaHeart /> : <FiHeart />}  {/* ✅ filled when liked */}
                  </button>
                  </div>

                  <div className="pd-card-info">
                    <div>
                      <div className="pd-card-top">
                        <h3 className="pd-card-name">{daycare.name}</h3>
                        <span className="pd-card-rating">⭐ {daycare.rating}</span>
                      </div>
                      <div className="pd-card-meta-row">
                        <span className="pd-card-meta"><MdOutlineLocationOn size={15}/> {daycare.distance}</span>
                        <span className="pd-card-meta"><MdOutlineAccessTime size={15}/> {daycare.hours}</span>
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
            </div>

            {/* ── PAGINATION ── */}
            <div className="pd-pagination">
              <button
                className="pd-page-btn"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                ‹
              </button>

              {[1, 2, 3].map((p) => (
                <button
                  key={p}
                  className={`pd-page-btn ${currentPage === p ? 'active' : ''}`}
                  onClick={() => setCurrentPage(p)}
                >
                  {p}
                </button>
              ))}

              <span className="pd-page-dots">...</span>
              <button className="pd-page-btn" onClick={() => setCurrentPage(12)}>12</button>

              <button
                className="pd-page-btn"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                ›
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default ParentDashboard;