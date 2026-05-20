import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchResults.css';
import { FiSearch, FiMapPin, FiHeart, FiStar } from 'react-icons/fi';
import { MdOutlineVerified } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import ParentProfile from './parentprfile';
 // ← add useEffect here

const SearchResults = () => {
  const { t, i18n } = useTranslation();
  const [showProfile, setShowProfile] = useState(false);

  // ← nurseries MUST be here, inside the component
  const nurseries = [
    { id: 1, name: t('nurseries.sunshine.name'), city: "Sidi Bel Abbas", rating: 4.9, reviews: 128, description: t('nurseries.sunshine.desc'), image: "/public/sun-day.jpg", distance: "0.4 MI", exactMatch: true },
    { id: 2, name: t('nurseries.littlesprouts.name'), city: "Sidi Bel Abbas", rating: 4.7, reviews: 85, description: t('nurseries.littlesprouts.desc'), image: "/public/little-day.jpg", distance: "0.4 MI", exactMatch: false },
    { id: 3, name: t('nurseries.brighthorizons.name'), city: "Sidi Bel Abbas", rating: 4.8, reviews: 102, description: t('nurseries.brighthorizons.desc'), image: "/public/bright-day.jpg", distance: "1.2 MI", exactMatch: false },
    { id: 4, name: t('nurseries.wonderland.name'), city: "Oran", rating: 4.5, reviews: 76, description: t('nurseries.wonderland.desc'), image: "/public/wonder-day.jpg", distance: "0.8 MI", exactMatch: false },
    { id: 5, name: t('nurseries.happykids.name'), city: "Oran", rating: 4.6, reviews: 90, description: t('nurseries.happykids.desc'), image: "https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=400", distance: "1.5 MI", exactMatch: false }
  ];

  const [searchName, setSearchName] = useState('');
  const [searchCity, setSearchCity] = useState('sidi bel abbas');
  const [results, setResults] = useState(nurseries);
  const [searched, setSearched] = useState(true);
const [liked, setLiked] = useState(() => {
  const saved = localStorage.getItem('likedNurseries');
  return saved ? JSON.parse(saved) : {};
});

  // ← this updates results when language changes
  useEffect(() => {
    setResults(nurseries);
  }, [i18n.language]);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

 const handleSearch = () => {
  // if no name entered → show all from city
  if (searchName.trim() === '') {
    const all = nurseries.filter(n =>
      n.city.toLowerCase().includes(searchCity.toLowerCase())
    );
    setResults(all);
    setSearched(true);
    return;
  }

  const filtered = nurseries.filter(n =>
    n.name.toLowerCase().includes(searchName.toLowerCase()) &&
    n.city.toLowerCase().includes(searchCity.toLowerCase())
  );

  // similar = same city but exclude ALL filtered results (not just first)
  const filteredIds = filtered.map(n => n.id);
  const similar = nurseries.filter(n =>
    n.city.toLowerCase().includes(searchCity.toLowerCase()) &&
    !filteredIds.includes(n.id)
  );

  setResults([...filtered, ...similar]);
  setSearched(true);
};

 const toggleLike = (id) => {
  const nursery = nurseries.find(n => n.id === id);
  const isLiked = liked[id];

  // ✅ Update liked state
  const newLiked = { ...liked, [id]: !isLiked };
  setLiked(newLiked);
  localStorage.setItem('likedNurseries', JSON.stringify(newLiked));

  // ✅ Update favorites in localStorage
  const savedFavs = localStorage.getItem('profileFavorites');
  let favs = savedFavs ? JSON.parse(savedFavs) : [];

  if (isLiked) {
    // remove from favorites
    favs = favs.filter(f => f.id !== id);
  } else {
    // add to favorites
    favs.push({
      id: nursery.id,
      name: nursery.name,
      location: nursery.city,
      rating: nursery.rating,
      image: nursery.image,
    });
  }
  localStorage.setItem('profileFavorites', JSON.stringify(favs));
};
const handleSelectNursery = (nursery) => {
  // ✅ Move clicked nursery to top, rest become similar
  const newResults = [nursery, ...results.filter(n => n.id !== nursery.id)];
  setResults(newResults);
  window.scrollTo({ top: 0, behavior: 'smooth' }); // ✅ scroll to top to see it
};

  const topResult = results[0];
  const similarResults = results.slice(1);
  const navigate = useNavigate();

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
          <button className="find-btn" onClick={handleSearch}>
            {t('search.find_btn')}
          </button>
        </div>
      </div>

      {/* Results */}
      {searched && results.length > 0 && (
        <div className="results-container">

          {/* Top Result */}
          {topResult && (
            <div className="top-result-section">
              <h1 className="section-title">
                <MdOutlineVerified className="title-icon"/> {t('search.top_result')}
              </h1>
              <div className="top-result-card">
                <div className="top-result-image">
                  <img src={topResult.image} alt={topResult.name} />
                  {topResult.exactMatch && (
                    <span className="exact-match">{t('search.exact_match')}</span>
                  )}
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
                      <span>{topResult.rating}</span>
                      <small>({topResult.reviews} {t('search.reviews')})</small>
                    </div>
                  </div>
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

          {/* Similar Centers */}
          {similarResults.length > 0 && (
            <div className="similar-section">
              <div className="similar-header">
                <h3 className="section-title">{t('search.similar')}</h3>
              
              </div>
              <div className="similar-grid">
                {similarResults.map(nursery => (
                  <div key={nursery.id} className="nursery-card">
                    <div className="nursery-card-image">
                      <img src={nursery.image} alt={nursery.name} />
                      <span className="nursery-rating">
                        <FiStar style={{color: '#f4a523', fill: '#f4a523'}}/> {nursery.rating}
                      </span>
                    </div>
                    <div className="nursery-card-info">
                      <div className="nursery-card-header">
                        <h4>{nursery.name}</h4>
                        <span className="nursery-distance">{nursery.distance}</span>
                      </div>
                      <p>{nursery.description}</p>
                     <button className="card-arrow-btn" onClick={() => handleSelectNursery(nursery)}>›</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* No Results */}
      {searched && results.length === 0 && (
        <div className="no-results">
          <p>{t('search.no_results')}</p>
        </div>
      )}

    </div>
  );
};

export default SearchResults;