import React, { useState } from 'react';
import { FaRegUser } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import './viewdetailes.css';
import ParentProfile from './parentprfile';
import Gallery from './Gallery';
import { LuImages } from 'react-icons/lu';
import { FiMapPin, FiClock, FiMail, FiUsers, FiSmile, FiPhone } from 'react-icons/fi';
import { BsCash } from 'react-icons/bs';
import { LuUtensils } from 'react-icons/lu';
import { LuVideo } from 'react-icons/lu';
import { LuBus } from 'react-icons/lu';
import { LuBriefcaseMedical } from 'react-icons/lu';
import { MdOutlineAssignment } from 'react-icons/md';
import { TbMoodSmile } from 'react-icons/tb';
import { MdOutlineCheckCircle } from 'react-icons/md';

import { AiOutlineStar } from 'react-icons/ai'; // or keep using existing icons

// ✅ These are fine outside — plain arrays, no hooks
const INFO_ROWS = [
  { icon: <FiMapPin />, labelKey: 'daycareInfo.campus',    valueKey: 'daycareInfo.campusVal' },
  { icon: <FiClock />,  labelKey: 'daycareInfo.hours',     valueKey: 'daycareInfo.hoursVal' },
  { icon: <FiMail />,   labelKey: 'daycareInfo.admissions',valueKey: 'daycareInfo.admissionsVal' },
  { icon: <FiPhone />,  labelKey: 'daycareInfo.phone',     valueKey: 'daycareInfo.phoneVal' },
  { icon: <FiUsers />,  labelKey: 'daycareInfo.capacity',  valueKey: 'daycareInfo.capacityVal' },
  { icon: <FiSmile />,  labelKey: 'daycareInfo.age',       valueKey: 'daycareInfo.ageVal' },
  { icon: <BsCash />,   labelKey: 'daycareInfo.tuition',   valueKey: 'daycareInfo.tuitionVal' },
];

const FACILITIES = [
  { icon: <LuUtensils size={32} />,      name: 'Meals' },
  { icon: <LuVideo size={32} />,         name: '24/7 Security' },
  { icon: <LuBus size={32} />,           name: 'Transport' },
  { icon: <LuBriefcaseMedical size={32} />, name: 'Wellness Clinic' },
];

const REVIEWS = [
  { id: 1, score: '5.0', textKey: 'reviews.r1.text', authorKey: 'reviews.r1.author' },
    { id: 2, score: '4.8', textKey: 'reviews.r2.text', authorKey: 'reviews.r2.author' },
  { id: 3, score: '4.7', textKey: 'reviews.r3.text', authorKey: 'reviews.r3.author' },
  { id: 4, score: '5.0', textKey: 'reviews.r4.text', authorKey: 'reviews.r4.author' },
  { id: 5, score: '4.5', textKey: 'reviews.r5.text', authorKey: 'reviews.r5.author' },
];

const OWNER = {
  initials: 'EJ',
  color: '#dbeafe',
  textColor: '#1d4ed8',
  nameKey: 'leaders.elena.name',
  roleKey: 'leaders.elena.role',
};
const MOCK_CHILDREN = [
  { id: 1, name: 'Leo',   initials: 'L', color: '#dbeafe', textColor: '#1d4ed8' },
  { id: 2, name: 'Sarah', initials: 'S', color: '#f3f4f6', textColor: '#374151' },
];

/* ─── Page ──────────────────────────────────────────────── */
const SunshineAcademyPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // ✅ All hooks inside the component
  const [heroImg] = useState('https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=900&h=400&fit=crop');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedChild, setSelectedChild]       = useState(null);
  const [showProfile, setShowProfile]           = useState(false);
  
  const facilityStatus   = {
    'Meals': true,
    '24/7 Security': true,
    'Transport': false,
    'Wellness Clinic': true,
  };
const [showReviewModal, setShowReviewModal] = useState(false);
const [reviewRating, setReviewRating]       = useState(0);
const [reviewHovered, setReviewHovered]     = useState(0);
const [reviewComment, setReviewComment]     = useState('');

const handleCloseReview = () => {
  setShowReviewModal(false);
  setReviewRating(0);
  setReviewHovered(0);
  setReviewComment('');
};

const handleSubmitReview = () => {
  if (!reviewRating || !reviewComment.trim()) return;
  console.log('Review submitted:', { rating: reviewRating, comment: reviewComment });
  // call your backend here
  handleCloseReview();
};
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Inter:wght@400;500;600&display=swap';
    document.head.appendChild(link);
  }, []);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en');
  };

  const handleCloseModal = () => {
    setShowRequestModal(false);
    setSelectedChild(null);
  };

  const handleSubmit = () => {
    console.log('Request submitted for child id:', selectedChild);
    handleCloseModal();
  };
  const [showGallery, setShowGallery] = useState(false);

  return (
    <>
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

      <div className="sa-page">

        {/* ── Page header ── */}
        <div className="sa-page-header">
          <h1 className="sa-page-title">{t('sa.title')}</h1>
          <p className="sa-page-sub">{t('sa.subtitle')}</p>
        </div>

        {/* ── Hero + Info sidebar ── */}
        <div className="sa-two-col">
          <div className="sa-hero">
            {heroImg ? (
              <img src={heroImg} alt="Classroom" className="sa-hero-img" />
            ) : (
              <div className="sa-hero-scene">
                <div className="sa-scene-wall" />
                <div className="sa-scene-window" />
                <div className="sa-scene-board" />
                <div className="sa-scene-desk" />
                <span className="sa-scene-teacher">👩‍🏫</span>
                <span className="sa-scene-student">🧒</span>
              </div>
            )}
              {/* ✅ Gallery icon button — top right of hero */}
              <button
                className="sa-gallery-btn"
                onClick={() => setShowGallery(true)}
                title="View Gallery"
              >
                <LuImages size={20} />
                <span>+12</span>
              </button>
            <div className="sa-hero-overlay" />
            <div className="sa-hero-content">
              <h2 className="sa-hero-title">
                {t('sa.hero.line1')}{' '}
                <span className="sa-hero-accent">{t('sa.hero.line2')}</span>
              </h2>
              <p className="sa-hero-desc">{t('sa.hero.desc')}</p>
              <div className="sa-hero-btns">
               <button className="sa-btn-white" onClick={() => setShowReviewModal(true)}>
  {t('sa.hero.btn1')}
</button>
                <button className="sa-btn-ghost" onClick={() => setShowRequestModal(true)}>
                  {t('sa.hero.btn2')}
                </button>
              </div>
            </div>
          </div>

          <div className="sa-info-card">
            <div className="sa-info-head">
              <span className="sa-info-dot" />
              <span className="sa-info-head-label">{t('sa.info.title')}</span>
            </div>
            {INFO_ROWS.map((row) => (
              <div className="sa-info-row" key={row.labelKey}>
                <span className="sa-info-icon">{row.icon}</span>
                <div>
                  <div className="sa-info-label">{t(row.labelKey)}</div>
                  <div className="sa-info-value">{t(row.valueKey)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Philosophy + Facilities ── */}
        <div className="sa-two-col sa-mid">

          {/* Philosophy */}
          <div className="sa-phil">
            <span className="sa-badge">
              <span className="sa-badge-icon">★</span>
              {t('sa.phil.badge')}
            </span>
            <h2 className="sa-phil-title">{t('sa.phil.title')}</h2>
            <p className="sa-phil-text">{t('sa.phil.text')}</p>
          </div>

          {/* Facilities */}
          <div className="sa-facilities">
            <h2 className="sa-section-title">Our Facilities</h2>
            <div className="sa-facilities-grid">
              {FACILITIES.map((f) => {
                const isAvailable = facilityStatus[f.name];
                return (
                  <div
                    key={f.name}
                    className={`sa-facility-card ${isAvailable ? 'facility-available' : 'facility-unavailable'}`}
                 
                  >
                    <span className="sa-facility-icon">{f.icon}</span>
                    <div className="sa-facility-name">{f.name}</div>
                    <div className={`sa-facility-sub ${isAvailable ? 'sub-available' : 'sub-unavailable'}`}>
                      {isAvailable ? '✓ Available' : '✕ Not Available'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div> {/* ✅ closes sa-two-col sa-mid */}

        {/* ── Parent reviews ── */}
        <div className="sa-section">
          <div className="sa-section-row">
            <h2 className="sa-section-title">{t('sa.reviews.title')}</h2>
          <button className="sa-read-all" onClick={() => navigate('/reviews', { state: { reviews: REVIEWS } })}>
  {t('sa.reviews.readAll')}
</button>
          </div>
          {REVIEWS.map((r) => (
            <div className="sa-review-card" key={r.id}>
              <div className="sa-stars-row">
                {'★★★★★'.split('').map((s, i) => (
                  <span className="sa-star" key={i}>{s}</span>
                ))}
                <span className="sa-score">{r.score}</span>
              </div>
              <p className="sa-review-text">{t(r.textKey)}</p>
              <div className="sa-reviewer">{t(r.authorKey)}</div>
            </div>
          ))}
        </div>

        {/* ── Leadership ── */}
        {/* ── Leadership → Owner only ── */}
<div className="sa-section">
  <h2 className="sa-section-title">{t('sa.leaders.title')}</h2>
  <div className="sa-owner-card">
    <div className="sa-leader-avatar">
      <div style={{
        width: '100%', height: '100%', borderRadius: '50%',
        background: OWNER.color, color: OWNER.textColor,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '24px', fontWeight: '500',
      }}>
        {OWNER.initials}
      </div>
    </div>
    <div>
      <div className="sa-leader-name">{t(OWNER.nameKey)}</div>
      <div className="sa-leader-role">{t(OWNER.roleKey)}</div>
    </div>
  </div>
</div>

      </div> {/* ✅ closes sa-page */}

      {/* ── Request Modal ── */}
      {showRequestModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <div className="modal-header-left">
                <div className="modal-header-icon">
                  <MdOutlineAssignment size={18} color="#4f6d8f" />
                </div>
                <span className="modal-header-label">Request Form</span>
              </div>
              <button className="modal-close" onClick={handleCloseModal}>✕</button>
            </div>

            <h3 className="modal-title">
              <TbMoodSmile size={28} color="#4f6d8f" /> Select Child
            </h3>

            <div className="modal-children">
              {MOCK_CHILDREN.map(child => (
                <div
                  key={child.id}
                  className={`modal-child-row ${selectedChild === child.id ? 'selected' : ''}`}
                  onClick={() => setSelectedChild(child.id)}
                >
                  <div className="modal-child-left">
                    <div className="modal-child-avatar" style={{ background: child.color, color: child.textColor }}>
                      {child.initials}
                    </div>
                    <span className="modal-child-name">{child.name}</span>
                  </div>
                  {selectedChild === child.id && (
                    <MdOutlineCheckCircle size={22} color="#4f6d8f" />
                  )}
                </div>
              ))}
              <button className="modal-add-child">
                <div className="modal-add-icon">+</div>
                Add New Child
              </button>
            </div>

            <button
              className={`modal-submit ${selectedChild ? 'active' : ''}`}
              disabled={!selectedChild}
              onClick={handleSubmit}
            >
              Submit Request <span>➤</span>
            </button>
          </div>
        </div>
      )}
      {showReviewModal && (
  <div className="modal-overlay">
    <div className="modal-box">

      <div className="modal-header">
        <div className="modal-header-left">
          <div className="modal-header-icon">
            <MdOutlineAssignment size={18} color="#4f6d8f" />
          </div>
          <span className="modal-header-label">Review Form</span>
        </div>
        <button className="modal-close" onClick={handleCloseReview}>✕</button>
      </div>

      <h3 className="modal-title">
        <TbMoodSmile size={28} color="#4f6d8f" /> Leave a review
      </h3>

      <div className="review-stars-row">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`review-star ${star <= (reviewHovered || reviewRating) ? 'lit' : ''}`}
            onClick={() => setReviewRating(star)}
            onMouseEnter={() => setReviewHovered(star)}
            onMouseLeave={() => setReviewHovered(0)}
          >
            ★
          </span>
        ))}
      </div>

      {reviewRating > 0 && (
        <p className="review-rating-label">
          {['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent'][reviewRating]}
        </p>
      )}

      <div className="review-comment-wrap">
        <label>Your review</label>
        <textarea
          rows={4}
          placeholder="Share your experience with this daycare..."
          value={reviewComment}
          onChange={(e) => setReviewComment(e.target.value)}
        />
      </div>

      <button
        className={`modal-submit ${reviewRating > 0 && reviewComment.trim() ? 'active' : ''}`}
        disabled={!reviewRating || !reviewComment.trim()}
        onClick={handleSubmitReview}
      >
        Submit review <span>➤</span>
      </button>

    </div>
  </div>
)}
{showGallery && (
  <Gallery onClose={() => setShowGallery(false)} />
)}
    </>
  );
};

export default SunshineAcademyPage;