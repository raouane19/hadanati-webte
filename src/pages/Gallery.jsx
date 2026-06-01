import React, { useState } from 'react';
import './Gallery.css';
import { IoArrowBack } from 'react-icons/io5';

const BASE_URL = import.meta.env.VITE_API_URL;

// Same helpers as FacilityProfileEditor
const resolveImage = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_URL}${cleanPath}`;
};

const useNgrokImage = (url) => {
  const [src, setSrc] = React.useState(null);
  React.useEffect(() => {
    if (!url) { setSrc(null); return; }
    let objectUrl = null;
    fetch(url, { headers: { 'ngrok-skip-browser-warning': 'true' } })
      .then((r) => r.blob())
      .then((blob) => {
        objectUrl = URL.createObjectURL(blob);
        setSrc(objectUrl);
      })
      .catch(() => setSrc(null));
    return () => { if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [url]);
  return src;
};

const NgrokImg = ({ url, alt, className, style }) => {
  const src = useNgrokImage(url);
  if (!src) return <div style={{ background: '#f3f4f6', width: '100%', height: '100%' }} />;
  return <img src={src} alt={alt} className={className} style={style} />;
};

const VISIBLE_COUNT = 5;

// images prop = same galleryImages array from FacilityProfileEditor
// each item: { id, url, file } — url is already resolved
const Gallery = ({ onClose, images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);

  const visibleImages = showAll ? images : images.slice(0, VISIBLE_COUNT);
  const extraCount = images.length - VISIBLE_COUNT;

  if (images.length === 0) {
    return (
      <div className="gallery-overlay" onClick={onClose}>
        <div className="gallery-modal" onClick={(e) => e.stopPropagation()}>
          <div className="gallery-header">
            <div className="gallery-header-left">
              <button className="gallery-back-btn" onClick={onClose}><IoArrowBack /></button>
              <h2 className="gallery-title">Gallery</h2>
            </div>
            <button className="gallery-close-btn" onClick={onClose}>✕</button>
          </div>
          <div style={{ textAlign: 'center', padding: '40px', color: '#aaa' }}>
            No photos uploaded yet.
          </div>
        </div>
      </div>
    );
  }

  const current = images[currentIndex];

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
          {current.file ? (
            // Local file (not yet saved) — use object URL directly
            <img src={current.url} alt={`Gallery image ${currentIndex + 1}`} />
          ) : (
            // Saved backend image — use NgrokImg
           <NgrokImg
          url={current.url}
          alt={`Gallery image ${currentIndex + 1}`}
          style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '8px' }}
        />
          )}
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