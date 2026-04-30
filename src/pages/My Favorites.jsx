import React, { useState } from 'react';
import { FiX, FiEdit2, FiMapPin, FiHeart, FiStar } from 'react-icons/fi';
import { LuClipboardList } from 'react-icons/lu';
import './MyFavorites.css';

const MyFavorites = ({ onClose, onBack }) => {
   const originalFavorites = [
    { id: 1, name: "Sunshine Academy", location: "oran", rating: 4.9, image: "/bright-day.jpg" },
    { id: 2, name: "Little Steps Institute", location: "sba", rating: 4.8, image: "/little-day.jpg" },
    { id: 3, name: "Elite Montessori", location: "oran", rating: 5.0, image: "/wonder-day.jpg" },
    { id: 4, name: "Platinum Tots", location: "sba", rating: 4.9, image: "/sun-day.jpg" },
    { id: 5, name: "Global Scholars", location: "oran", rating: 4.7, image: "/background color.jpg" },
  ];

 const [favorites, setFavorites] = useState(originalFavorites);
  const [hasChanges, setHasChanges] = useState(false);

  const removeFavorite = (id) => {
    setFavorites(favorites.filter(f => f.id !== id));
    setHasChanges(true);
  };

  const handleDiscard = () => {
    setFavorites(originalFavorites);
    setHasChanges(false);
  };

  return (
    <div className="fav-overlay" onClick={onClose}>
      <div className="fav-modal" onClick={e => e.stopPropagation()}>

        <div className="fav-header">
          <div className="fav-header-left">
            <LuClipboardList size={14} />
            <span>profile info</span>
          </div>
          <button className="fav-close" onClick={onClose}><FiX /></button>
        </div>

        <div className="fav-title-row">
  <div className="fav-title-left">
    <button className="fav-back" onClick={onBack}>‹</button>
    <h2 className="fav-title">My Favorites</h2>
  </div>
  <div className="fav-title-actions">
    {hasChanges && (
      <button className="fav-discard-btn" onClick={handleDiscard}>
        Discard Changes
      </button>
    )}
    <button className="fav-edit-btn"><FiEdit2 size={12} /> Edit All</button>
  </div>
</div>

        <div className="fav-grid">
          {favorites.map(fav => (
            <div key={fav.id} className="fav-card">
              <div className="fav-img-wrap">
                <img className="fav-img" src={fav.image} alt={fav.name}
                  onError={e => e.target.src = 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=300'}
                />
                <button className="fav-heart" onClick={() => removeFavorite(fav.id)}>
                  <FiHeart size={13} fill="#e24b4a" color="#e24b4a" />
                </button>
              </div>
              <div className="fav-info">
                <div className="fav-top-row">
                  <p className="fav-name">{fav.name}</p>
                  <span className="fav-rating"><FiStar size={11} fill="#f4a523" color="#f4a523" /> {fav.rating}</span>
                </div>
                <p className="fav-loc"><FiMapPin size={10} /> {fav.location}</p>
                <button className="fav-details">View Details →</button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default MyFavorites;