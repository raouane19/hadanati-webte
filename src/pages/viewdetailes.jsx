import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaRegUser } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import './viewdetailes.css';
import ParentProfile from './parentprfile';
import Gallery from './Gallery';
import { LuImages } from 'react-icons/lu';
import { FiMapPin, FiClock, FiMail, FiUsers, FiSmile, FiPhone } from 'react-icons/fi';
import { BsCash } from 'react-icons/bs';
import { LuUtensils, LuVideo, LuBus, LuBriefcaseMedical } from 'react-icons/lu';
import { MdOutlineAssignment } from 'react-icons/md';
import { TbMoodSmile } from 'react-icons/tb';
import { MdOutlineCheckCircle } from 'react-icons/md';
import { FiHeart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { getUser, getChildren, requestEnrollment, submitReview, searchDaycares } from '../api/auth';
import { getSavedDaycares, saveDaycare, unsaveDaycare } from '../api/auth';

// ── ngrok-safe image hook ──────────────────────────────────────────────────
const useNgrokImage = (url) => {
  const [src, setSrc] = useState(null);
  useEffect(() => {
    if (!url) { setSrc(null); return; }
    let objectUrl = null;
    fetch(url, { headers: { 'ngrok-skip-browser-warning': 'true' } })
      .then(r => r.blob())
      .then(blob => { objectUrl = URL.createObjectURL(blob); setSrc(objectUrl); })
      .catch(() => setSrc(null));
    return () => { if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [url]);
  return src;
};

const FACILITIES = [
  { icon: <LuUtensils size={32} />,         name: 'Meals' },
  { icon: <LuVideo size={32} />,            name: '24/7 Security' },
  { icon: <LuBus size={32} />,              name: 'Transport' },
  { icon: <LuBriefcaseMedical size={32} />, name: 'Wellness Clinic' },
];

const OWNER = {
  initials: 'EJ',
  color: '#dbeafe',
  textColor: '#1d4ed8',
  nameKey: 'leaders.elena.name',
  roleKey: 'leaders.elena.role',
};

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=900&h=400&fit=crop';

const SunshineAcademyPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const currentUser = getUser();

  const [daycare,          setDaycare]          = useState(null);
  const [loadingDaycare,   setLoadingDaycare]   = useState(true);
  const [children,         setChildren]         = useState([]);
  const [reviews,          setReviews]          = useState([]);
  const [loadingReviews,   setLoadingReviews]   = useState(true);
  const [navAvatar,        setNavAvatar]        = useState(null);

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedChild,    setSelectedChild]    = useState(null);
  const [showProfile,      setShowProfile]      = useState(false);
  const [showGallery,      setShowGallery]      = useState(false);
  const [showReviewModal,  setShowReviewModal]  = useState(false);
  const [reviewRating,     setReviewRating]     = useState(0);
  const [reviewHovered,    setReviewHovered]    = useState(0);
  const [reviewComment,    setReviewComment]    = useState('');
  const [savedIds,         setSavedIds]         = useState(new Set());

  // ── Hero image via ngrok hook ──────────────────────────────────────────────
  const heroImgUrl = daycare?.profile_image
    ? `${import.meta.env.VITE_API_URL}${daycare.profile_image}`
    : null;
  const resolvedHero = useNgrokImage(heroImgUrl);

  // ── Fetch saved daycares ───────────────────────────────────────────────────
  useEffect(() => {
    if (!currentUser?.id) return;
    getSavedDaycares(currentUser.id)
      .then((res) => {
        if (Array.isArray(res.data))
          setSavedIds(new Set(res.data.map((d) => d.id)));
      })
      .catch(() => {});
  }, [currentUser?.id]);

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

  // ── Fetch daycare ──────────────────────────────────────────────────────────
  useEffect(() => {
  const fetchDaycare = async () => {
  try {
    const BASE_URL = import.meta.env.VITE_API_URL;
    const res = await fetch(`${BASE_URL}/daycares/${id}`, {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    });
    const json = await res.json();
    setDaycare(json.data || null);
      } catch (err) {
        console.error('Failed to fetch daycare:', err);
      } finally {
        setLoadingDaycare(false);
      }
    };
    fetchDaycare();
  }, [id]);

  // ── Fetch reviews ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!currentUser?.id) {
      setLoadingReviews(false);
      return;
    }
    const BASE_URL = import.meta.env.VITE_API_URL;
    fetch(`${BASE_URL}/parents/${currentUser.id}/reviews`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'ngrok-skip-browser-warning': 'true',
      },
    })
      .then(r => r.json())
      .then(data => {
        const all = Array.isArray(data) ? data : [];
        setReviews(all.filter(r => String(r.daycare_id) === String(id)));
      })
      .catch(() => setReviews([]))
      .finally(() => setLoadingReviews(false));
  }, [currentUser?.id, id]);

  // ── Fetch children ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!currentUser?.id) return;
    getChildren(currentUser.id)
      .then(res => setChildren(res.data || []))
      .catch(() => {});
  }, [currentUser?.id]);

  // ── Font ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Inter:wght@400;500;600&display=swap';
    document.head.appendChild(link);
  }, []);

  // ── Avatar ─────────────────────────────────────────────────────────────────
  const loadAvatar = () => {
    const u = getUser();
    const img = u?.profile_image || u?.Profile_image || u?.profileImage || null;
    if (!img) return;
    const BASE_URL = import.meta.env.VITE_API_URL;
    const url = img.startsWith('http') ? img
      : img.startsWith('/uploads/') ? `${BASE_URL}${img}`
      : `${BASE_URL}/uploads/${img}`;
    fetch(url, { headers: { 'ngrok-skip-browser-warning': 'true' } })
      .then(r => r.ok ? r.blob() : null)
      .then(blob => blob && setNavAvatar(URL.createObjectURL(blob)))
      .catch(() => {});
  };

  useEffect(() => { loadAvatar(); }, []);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en');
  };

  // ── Request modal ──────────────────────────────────────────────────────────
  const handleCloseModal = () => {
    setShowRequestModal(false);
    setSelectedChild(null);
  };

  const handleSubmit = async () => {
    if (!selectedChild) return;
    try {
      await requestEnrollment(currentUser.id, selectedChild, id);
      handleCloseModal();
      alert('Request submitted successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Request failed. Try again.');
    }
  };

  // ── Review modal ───────────────────────────────────────────────────────────
  const handleCloseReview = () => {
    setShowReviewModal(false);
    setReviewRating(0);
    setReviewHovered(0);
    setReviewComment('');
  };

  const handleSubmitReview = async () => {
    if (!reviewRating || !reviewComment.trim()) return;
    try {
      await submitReview(currentUser.id, id, reviewRating, reviewComment);
      handleCloseReview();
      alert('Review submitted!');
      const BASE_URL = import.meta.env.VITE_API_URL;
      fetch(`${BASE_URL}/parents/${currentUser.id}/reviews`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'ngrok-skip-browser-warning': 'true',
        },
      })
        .then(r => r.json())
        .then(data => {
          const all = Array.isArray(data) ? data : [];
          setReviews(all.filter(r => String(r.daycare_id) === String(id)));
        })
        .catch(() => {});
    } catch (err) {
      alert(err.response?.data?.message || 'Review failed. Try again.');
    }
  };

  // ── Dynamic info rows ──────────────────────────────────────────────────────
  const dynamicInfoRows = [
    { icon: <FiMapPin />, label: t('daycareInfo.campus'),     value: daycare?.address   || '—' },
    { icon: <FiClock />,  label: t('daycareInfo.hours'),      value: daycare?.hours     || '—' },
    { icon: <FiMail />,   label: t('daycareInfo.admissions'), value: daycare?.email     || '—' },
    { icon: <FiPhone />,  label: t('daycareInfo.phone'),      value: daycare?.phone     || '—' },
    { icon: <FiUsers />,  label: t('daycareInfo.capacity'),   value: daycare?.capacity  ? `${daycare.capacity} children` : '—' },
    { icon: <FiSmile />,  label: t('daycareInfo.age'),        value: daycare?.age_range || '—' },
    { icon: <BsCash />,   label: t('daycareInfo.tuition'),    value: daycare?.price     ? `${daycare.price} DZD/month` : '—' },
  ];

  const facilityStatus = {
    'Meals':           !!daycare?.has_lunch,
    '24/7 Security':   true,
    'Transport':       !!daycare?.has_transport,
    'Wellness Clinic': !!daycare?.healthcare_info,
  };

  if (loadingDaycare) return (
    <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>Loading...</div>
  );

  return (
    <>
      {/* ── NAVBAR ── */}
      <div className="search-navbar">
        <div className="search-logo">
          <img className="logo" src="/public/logo.png" alt="HADANATI" />
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
              {currentUser
                ? `${currentUser.first_name || ''} ${currentUser.last_name || ''}`.trim() || 'Parent'
                : 'Guest'}
              <br /><small>Parent Member</small>
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
                  loadAvatar();
                }} />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="sa-page">

        {/* ── Page header ── */}
        <div className="sa-page-header">
          <h1 className="sa-page-title">{daycare?.name || t('sa.title')}</h1>
          <p className="sa-page-sub">{daycare?.description || t('sa.subtitle')}</p>
        </div>

        {/* ── Hero + Info sidebar ── */}
        <div className="sa-two-col">
          <div className="sa-hero">
            {/* ✅ FIX: use resolvedHero (blob URL from ngrok hook) */}
            <img
              src={resolvedHero || FALLBACK_IMG}
              alt="Classroom"
              className="sa-hero-img"
            />
            <button
              className="sa-gallery-btn"
              onClick={() => setShowGallery(true)}
              title="View Gallery"
            >
              <LuImages size={20} />
              <span>+12</span>
            </button>
            <button
              className={`sa-fav-btn ${savedIds.has(daycare?.id) ? 'sa-fav-btn--active' : ''}`}
              onClick={() => toggleLike(daycare?.id)}
              title="Add to favorites"
            >
              {savedIds.has(daycare?.id)
                ? <FaHeart size={18} />
                : <FiHeart size={18} />
              }
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
            {dynamicInfoRows.map((row) => (
              <div className="sa-info-row" key={row.label}>
                <span className="sa-info-icon">{row.icon}</span>
                <div>
                  <div className="sa-info-label">{row.label}</div>
                  <div className="sa-info-value">{row.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Philosophy + Facilities ── */}
        <div className="sa-two-col sa-mid">
          <div className="sa-phil">
            <span className="sa-badge">
              <span className="sa-badge-icon">★</span>
              {t('sa.phil.badge')}
            </span>
            <h2 className="sa-phil-title">{t('sa.phil.title')}</h2>
            <p className="sa-phil-text">
              {daycare?.bio || daycare?.education_info || t('sa.phil.text')}
            </p>
          </div>

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
        </div>

        {/* ── Parent reviews ── */}
        <div className="sa-section">
          <div className="sa-section-row">
            <h2 className="sa-section-title">{t('sa.reviews.title')}</h2>
            <button
              className="sa-read-all"
              onClick={() => navigate('/reviews', { state: { reviews } })}
            >
              {t('sa.reviews.readAll')}
            </button>
          </div>

          {loadingReviews && (
            <p style={{ color: '#aaa', textAlign: 'center', padding: '20px' }}>
              Loading reviews...
            </p>
          )}

          {!loadingReviews && reviews.length === 0 && (
            <p style={{ color: '#aaa', textAlign: 'center', padding: '20px' }}>
              No reviews yet for this daycare.
            </p>
          )}

          {!loadingReviews && reviews.slice(0, 3).map((r) => (
            <div className="sa-review-card" key={r.id}>
              <div className="sa-stars-row">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span
                    key={s}
                    className="sa-star"
                    style={{ color: s <= r.rating ? '#F5A623' : '#ddd' }}
                  >★</span>
                ))}
                <span className="sa-score">{Number(r.rating).toFixed(1)}</span>
              </div>
              <p className="sa-review-text">{r.comment}</p>
              <div className="sa-reviewer">— {r.daycare_name}</div>
            </div>
          ))}
        </div>

        {/* ── Owner ── */}
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
                {daycare?.name?.[0]?.toUpperCase() || OWNER.initials}
              </div>
            </div>
            <div>
              <div className="sa-leader-name">{daycare?.owner_name || t(OWNER.nameKey)}</div>
              <div className="sa-leader-role">{t(OWNER.roleKey)}</div>
            </div>
          </div>
        </div>

      </div>

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
              {children.length === 0 ? (
                <p style={{ color: '#888', fontSize: '13px', textAlign: 'center', padding: '10px' }}>
                  No children added yet.
                </p>
              ) : (
                children.map(child => (
                  <div
                    key={child.id}
                    className={`modal-child-row ${selectedChild === child.id ? 'selected' : ''}`}
                    onClick={() => setSelectedChild(child.id)}
                  >
                    <div className="modal-child-left">
                      <div className="modal-child-avatar" style={{ background: '#dbeafe', color: '#1d4ed8' }}>
                        {child.name[0].toUpperCase()}
                      </div>
                      <span className="modal-child-name">{child.name}</span>
                    </div>
                    {selectedChild === child.id && (
                      <MdOutlineCheckCircle size={22} color="#4f6d8f" />
                    )}
                  </div>
                ))
              )}
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

      {/* ── Review Modal ── */}
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
                >★</span>
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
  <Gallery
    onClose={() => setShowGallery(false)}
    images={
      daycare?.images?.map((img) => ({
        id:   img.id,
        url:  img.image_url?.startsWith('http')
                ? img.image_url
                : `${import.meta.env.VITE_API_URL}${img.image_url || img.url || ''}`,
        file: null,
      })) ?? []
    }
  />
)}
    </>
  );
};

export default SunshineAcademyPage;