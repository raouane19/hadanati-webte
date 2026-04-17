import React, { useState } from 'react';
import { FaRegUser } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import './viewdetailes.css';
import { FiMapPin, FiClock, FiMail, FiUsers, FiSmile } from 'react-icons/fi';
import { BsCash } from 'react-icons/bs';
import { LuUtensils  } from 'react-icons/lu';
import { LuVideo } from 'react-icons/lu';
import { LuBus } from 'react-icons/lu';
import { LuBriefcaseMedical } from 'react-icons/lu';


const INFO_ROWS = [
  { icon: <FiMapPin />, labelKey: 'daycareInfo.campus', valueKey: 'daycareInfo.campusVal' },
  { icon: <FiClock />, labelKey: 'daycareInfo.hours', valueKey: 'daycareInfo.hoursVal' },
  { icon: <FiMail />, labelKey: 'daycareInfo.admissions', valueKey: 'daycareInfo.admissionsVal' },
  { icon: <FiUsers />, labelKey: 'daycareInfo.capacity', valueKey: 'daycareInfo.capacityVal' },
  { icon: <FiSmile />, labelKey: 'daycareInfo.age', valueKey: 'daycareInfo.ageVal' },
  { icon: <BsCash />, labelKey: 'daycareInfo.tuition', valueKey: 'daycareInfo.tuitionVal' },
];
 
const FACILITIES = [
  { icon: <LuUtensils size={32} />, name: 'Meals', sub: 'lunch, snack' },
  { icon: <LuVideo size={32} />, name: '24/7 Security', sub: 'safety first' },
  { icon: <LuBus size={32} />, name: 'Transport', sub: 'available or not' },
   { icon: <LuBriefcaseMedical size={32} />, name: 'Health', sub: 'on-site nurse' },
];
 
const REVIEWS = [
  {
    id: 1,
    score: '5.0',
    textKey: 'reviews.r1.text',
    authorKey: 'reviews.r1.author',
  },
];
 
const LEADERS = [
  { id: 1, avatar: null, initials: 'EJ', color: '#dbeafe', textColor: '#1d4ed8', nameKey: 'leaders.elena.name',   roleKey: 'leaders.elena.role' },
  { id: 2, avatar: null, initials: 'JL', color: '#fce7f3', textColor: '#be185d', nameKey: 'leaders.jessica.name', roleKey: 'leaders.jessica.role' },
  { id: 3, avatar: null, initials: 'MT', color: '#dcfce7', textColor: '#15803d', nameKey: 'leaders.mark.name',    roleKey: 'leaders.mark.role' },
  { id: 4, avatar: null, initials: 'AC', color: '#fef3c7', textColor: '#b45309', nameKey: 'leaders.amanda.name',  roleKey: 'leaders.amanda.role' },
];
 
// ── Mock children — replace with real parent profile data later ──
const MOCK_CHILDREN = [
  { id: 1, name: 'Leo',   initials: 'L', color: '#dbeafe', textColor: '#1d4ed8' },
  { id: 2, name: 'Sarah', initials: 'S', color: '#f3f4f6', textColor: '#374151' },
];
 
/* ─── Page ──────────────────────────────────────────────── */
const SunshineAcademyPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
 
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Inter:wght@400;500;600&display=swap';
    document.head.appendChild(link);
  }, []);
 
  const [heroImg] = useState('https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=900&h=400&fit=crop');
 
  // ── Modal state ──
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedChild, setSelectedChild]       = useState(null);
 
  const handleCloseModal = () => {
    setShowRequestModal(false);
    setSelectedChild(null);
  };
 
  const handleSubmit = () => {
    // TODO: wire to real API when backend + parent profile ready
    console.log('Request submitted for child id:', selectedChild);
    handleCloseModal();
  };
  const [showProfile, setShowProfile] = useState(false);
  const { i18n } = useTranslation(); // update your existing const { t } to this
  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en');
  };
 
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
            esi mate<br/><small>Parent Member</small>
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
 
        {/* Hero */}
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
          <div className="sa-hero-overlay" />
          <div className="sa-hero-content">
            <h2 className="sa-hero-title">
              {t('sa.hero.line1')}{' '}
              <span className="sa-hero-accent">{t('sa.hero.line2')}</span>
            </h2>
            <p className="sa-hero-desc">{t('sa.hero.desc')}</p>
            <div className="sa-hero-btns">
               <button className="sa-btn-white" onClick={() => navigate('/reviews')}>
    {t('sa.hero.btn1')}
  </button>
  <button className="sa-btn-ghost" onClick={() => setShowRequestModal(true)}>
    {t('sa.hero.btn2')}
  </button>
            </div>
          </div>
        </div>
 
        {/* Daycare info sidebar */}
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
            {FACILITIES.map((f) => (
              <div className="sa-facility-card" key={f.name}>
                <span className="sa-facility-icon">{f.icon}</span>
                <div className="sa-facility-name">{f.name}</div>
                <div className="sa-facility-sub">{f.sub}</div>
              </div>
            ))}
          </div>
        </div>
 
      </div>
 
      {/* ── Parent reviews ── */}
      <div className="sa-section">
        <div className="sa-section-row">
          <h2 className="sa-section-title">{t('sa.reviews.title')}</h2>
          <button className="sa-read-all" onClick={() => navigate('/reviews')}>
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
      <div className="sa-section">
        <h2 className="sa-section-title">{t('sa.leaders.title')}</h2>
        <div className="sa-leaders-grid">
          {LEADERS.map((l) => (
            <div className="sa-leader-card" key={l.id}>
              <div className="sa-leader-avatar">
                {l.avatar
                  ? <img src={l.avatar} alt={t(l.nameKey)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      background: l.color,
                      color: l.textColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      fontWeight: '500',
                    }}>
                      {l.initials}
                    </div>
                }
              </div>
              <div className="sa-leader-name">{t(l.nameKey)}</div>
              <div className="sa-leader-role">{t(l.roleKey)}</div>
            </div>
          ))}
        </div>
      </div>
 
      {/* ── Request Modal ── */}
      {showRequestModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            width: '360px',
            padding: '24px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          }}>
 
            {/* Modal header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>📋</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Request Form</span>
              </div>
              <button
                onClick={handleCloseModal}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#9ca3af', lineHeight: 1 }}>
                ✕
              </button>
            </div>
 
            {/* Modal title */}
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 16px' }}>
              <span>😊</span> Select Child
            </h3>
 
            {/* Children list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {MOCK_CHILDREN.map(child => (
                <div
                  key={child.id}
                  onClick={() => setSelectedChild(child.id)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 16px', borderRadius: '12px', cursor: 'pointer',
                    border: selectedChild === child.id ? '1.5px solid #4f6d8f' : '1px solid #e5e7eb',
                    background: selectedChild === child.id ? '#f8fafc' : '#fff',
                    transition: 'all 0.15s',
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '50%',
                      background: child.color, color: child.textColor,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '16px', fontWeight: '600',
                    }}>
                      {child.initials}
                    </div>
                    <span style={{ fontSize: '15px', fontWeight: '500', color: '#111827' }}>{child.name}</span>
                  </div>
                  {selectedChild === child.id && (
                    <span style={{ color: '#4f6d8f', fontSize: '18px' }}>✓</span>
                  )}
                </div>
              ))}
 
              {/* Add new child — wire up later */}
              <button style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#9ca3af', fontSize: '14px', padding: '8px 4px',
              }}>
                <span style={{ fontSize: '18px' }}>+</span> Add New Child
              </button>
            </div>
 
            {/* Submit button */}
            <button
              disabled={!selectedChild}
              onClick={handleSubmit}
              style={{
                width: '100%', padding: '14px',
                background: selectedChild ? '#4f6d8f' : '#d1d5db',
                color: '#fff', border: 'none', borderRadius: '12px',
                fontSize: '15px', fontWeight: '600',
                cursor: selectedChild ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                transition: 'background 0.2s',
              }}>
              Submit Request ➤
            </button>
 
          </div>
        </div>
      )}
 
    </div>
      </>
  );
};
 
export default SunshineAcademyPage;