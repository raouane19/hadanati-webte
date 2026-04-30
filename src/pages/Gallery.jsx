import React, { useState } from 'react';
import './Gallery.css';
import { IoArrowBack } from 'react-icons/io5';

// Placeholder images — replace with real backend images later
const placeholderImages = [
  'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800',
  'https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=800',
  'https://images.unsplash.com/photo-1567186937675-a5131c8a89ea?w=800',
  'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800',
  'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800',
  'https://images.unsplash.com/photo-1516627145497-ae6968895b40?w=800',
  'https://images.unsplash.com/photo-1541178735493-479c1a27ed24?w=800',
  'https://images.unsplash.com/photo-1576765607924-3f7b8410a787?w=800',
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800',
  'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800',
  'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=800',
];

const VISIBLE_COUNT = 5;

const Gallery = ({ onClose, images = placeholderImages }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);

  const visibleImages = showAll ? images : images.slice(0, VISIBLE_COUNT);
  const extraCount = images.length - VISIBLE_COUNT;

  return (
    <div className="gallery-overlay" onClick={onClose}>
      <div className="gallery-modal" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="gallery-header">
          <div className="gallery-header-left">
            <button className="gallery-back-btn" onClick={onClose}>
              <IoArrowBack />
            </button>
            <h2 className="gallery-title">Gallery</h2>
          </div>
          <button className="gallery-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Main Image */}
        <div className="gallery-main-image">
          <img
            src={images[currentIndex]}
            alt={`Gallery image ${currentIndex + 1}`}
          />
        </div>

        {/* Thumbnails */}
        <div className="gallery-thumbnails">
          {visibleImages.map((img, index) => (
            <button
              key={index}
              className={`gallery-thumb-btn ${currentIndex === index ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            >
              {index + 1}
            </button>
          ))}

          {!showAll && extraCount > 0 && (
            <button
              className="gallery-thumb-btn gallery-more-btn"
              onClick={() => setShowAll(true)}
            >
              +{extraCount} pictures
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default Gallery;