import React, { useState } from 'react';
import { useTranslation } from 'react-i18next'; // ✅
import { FiX, FiEdit2, FiMapPin, FiHeart, FiStar } from 'react-icons/fi';
import { LuClipboardList } from 'react-icons/lu';
import './MyFavorites.css';

// ✅ t passed as prop so FavCard can translate too
const FavCard = ({ fav, onRemove, t }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="fav-card">
      <div className="fav-img-wrap">
        <img className="fav-img" src={fav.image} alt={fav.name}
          onError={e => e.target.src = 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=300'}
        />
        <button
          className="fav-heart"
          onClick={() => onRemove(fav.id)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {hovered
            ? <FiX size={13} color="#e24b4a" />
            : <FiHeart size={13} fill="#e24b4a" color="#e24b4a" />
          }
        </button>
      </div>
      <div className="fav-info">
        <div className="fav-top-row">
          <p className="fav-name">{fav.name}</p>
          <span className="fav-rating"><FiStar size={11} fill="#f4a523" color="#f4a523" /> {fav.rating}</span>
        </div>
        <p className="fav-loc"><FiMapPin size={10} /> {fav.location}</p>
        <button className="fav-details">{t('favorites.viewDetails')}</button> {/* ✅ */}
      </div>
    </div>
  );
};

const MyFavorites = ({ onClose, onBack, favorites, setFavorites }) => {
  const { t } = useTranslation(); // ✅
  const [localFavs, setLocalFavs] = useState(favorites);
  const [hasChanges, setHasChanges] = useState(false);

  const removeFavorite = (id) => {
    setLocalFavs(prev => prev.filter(f => f.id !== id));
    setHasChanges(true);
  };

  const handleDiscard = () => {
    setLocalFavs(favorites);
    setHasChanges(false);
  };

  const handleSaveAll = () => {
    setFavorites(localFavs);
    localStorage.setItem('profileFavorites', JSON.stringify(localFavs));
    setHasChanges(false);
  };

  return (
    <div className="fav-overlay" onClick={onClose}>
      <div className="fav-modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="fav-header">
          <div className="fav-header-left">
            <LuClipboardList size={14} />
            <span>{t('favorites.title')}</span> {/* ✅ */}
          </div>
          <button className="fav-close" onClick={onClose}><FiX /></button>
        </div>

        {/* Title row */}
        <div className="fav-title-row">
          <div className="fav-title-left">
            <button className="fav-back" onClick={onBack}>‹</button>
            <h2 className="fav-title">{t('favorites.pageTitle')}</h2> {/* ✅ */}
          </div>
          <div className="fav-title-actions">
            {hasChanges && (
              <button className="fav-discard-btn" onClick={handleDiscard}>
                {t('favorites.discardChanges')} {/* ✅ */}
              </button>
            )}
            <button
              className="fav-edit-btn"
              onClick={handleSaveAll}
              disabled={!hasChanges}
              style={{ opacity: hasChanges ? 1 : 0.5, cursor: hasChanges ? 'pointer' : 'default' }}
            >
              <FiEdit2 size={12} /> {t('favorites.saveAll')} {/* ✅ */}
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="fav-grid">
          {localFavs.map(fav => (
            <FavCard key={fav.id} fav={fav} onRemove={removeFavorite} t={t} /> // ✅ pass t
          ))}
        </div>

      </div>
    </div>
  );
};

export default MyFavorites;