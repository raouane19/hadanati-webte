import React, { useState, useRef, useEffect } from 'react';
import './ParentProfile.css';
import { useTranslation } from 'react-i18next';
import {
  FiX, FiEdit2, FiUser, FiHeart,
  FiUsers, FiLogOut, FiMapPin, FiCalendar,
  FiChevronRight, FiStar, FiTrash2
} from 'react-icons/fi';
import { RiParentLine } from 'react-icons/ri';
import { PiStudent } from 'react-icons/pi';
import { TbMoodKid } from 'react-icons/tb';
import { LuClipboardList } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import MyChildren from './MyChildren';
import MyEnrollmentRequests from './Myenrollmentrequests';
import EditParent from './editparent';
import MyFavorites from './MyFavorites';
import {
  getUser,
  getChildren,
  getRequests,
  getSavedDaycares,
  logout,
} from '../api/auth';

const BASE_URL = import.meta.env.VITE_API_URL;

// ── Image helpers ─────────────────────────────────────────────────────────────
const resolveProfileImage = (u) =>
  u?.profile_image || u?.Profile_image || u?.profileImage || u?.image || null;

const buildImagePath = (img) => {
  if (!img) return null;
  if (img.startsWith('blob:') || img.startsWith('http')) return img;
  if (img.startsWith('/uploads/')) return `${BASE_URL}${img}`;
  return `${BASE_URL}/uploads/${img}`;
};

const resolveChildPhoto = (profile_image) => {
  if (!profile_image) return null;
  if (profile_image.startsWith('blob:') || profile_image.startsWith('http')) return profile_image;
  if (profile_image.startsWith('/uploads/')) return `${BASE_URL}${profile_image}`;
  return `${BASE_URL}/uploads/children/${profile_image}`;
};

const fetchImageAsBlob = async (url) => {
  if (!url) return null;
  if (url.startsWith('blob:') || url.startsWith('data:')) return url;
  try {
    const res = await fetch(url, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
    });
    if (!res.ok) return null;
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  } catch {
    return null;
  }
};

// ── ChildPhoto component ──────────────────────────────────────────────────────
const ChildPhoto = ({ src, name }) => {
  const [blobUrl, setBlobUrl] = useState(null);

  useEffect(() => {
    if (!src) return;
    fetchImageAsBlob(src).then((blob) => {
      if (blob) setBlobUrl(blob);
    });
  }, [src]);

  if (!blobUrl) return <TbMoodKid size={20} />;
  return (
    <img
      src={blobUrl}
      alt={name}
      style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
    />
  );
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const buildUserDisplay = (u) => ({
  fullName: u?.first_name
    ? `${u.first_name} ${u.last_name || ''}`.trim()
    : u?.name || 'Parent',
  email:    u?.email    || '',
  phone:    u?.phone    || '',
  location: u?.city     || u?.location || '',
});

// ── Component ─────────────────────────────────────────────────────────────────
const ParentProfile = ({ onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading,     setDeleteLoading]     = useState(false);

  const profileRef   = useRef(null);
  const requestsRef  = useRef(null);
  const favoritesRef = useRef(null);
  const childrenRef  = useRef(null);
  const contentRef   = useRef(null);

  const [user,   setUser]   = useState(() => buildUserDisplay(getUser()));
  const [avatar, setAvatar] = useState(null);

  const [enrollmentRequests, setEnrollmentRequests] = useState([]);
  const [children,           setChildren]           = useState([]);
  const [favorites,          setFavorites]          = useState([]);
  const [loadingRequests,    setLoadingRequests]    = useState(true);
  const [loadingChildren,    setLoadingChildren]    = useState(true);
  const [loadingFavorites,   setLoadingFavorites]   = useState(true);

  const [showChildren,   setShowChildren]   = useState(false);
  const [showRequests,   setShowRequests]   = useState(false);
  const [showEditParent, setShowEditParent] = useState(false);
  const [showFavorites,  setShowFavorites]  = useState(false);

  // Load parent avatar
  useEffect(() => {
    const u = getUser();
    const imgPath = resolveProfileImage(u);
    const url = buildImagePath(imgPath);
    if (url) {
      fetchImageAsBlob(url).then((blob) => {
        if (blob) setAvatar(blob);
      });
    }
  }, []);

  // Load children, requests, favorites
  useEffect(() => {
    const u = getUser();
    if (!u?.id) return;

    getChildren(u.id)
      .then((res) => setChildren(res.data || []))
      .catch(() => setChildren([]))
      .finally(() => setLoadingChildren(false));

    getRequests(u.id)
      .then((res) => setEnrollmentRequests(res.data || []))
      .catch(() => setEnrollmentRequests([]))
      .finally(() => setLoadingRequests(false));

    getSavedDaycares(u.id)
      .then((res) => {
        const mapped = (res.data || []).map((d) => ({
          id:       d.id,
          name:     d.name,
          location: d.City || d.city || d.address || '',
          rating:   parseFloat(d.avg_rating ?? d.rating ?? 0).toFixed(1),
          image:    buildImagePath(resolveProfileImage(d)) ||
                    'https://images.unsplash.com/photo-1576765607924-3f7b8410a787?w=200',
        }));
        setFavorites(mapped);
      })
      .catch(() => setFavorites([]))
      .finally(() => setLoadingFavorites(false));
  }, []);

  // ── Delete account ─────────────────────────────────────────────────────────
  const handleDeleteAccount = async () => {
    const u = getUser();
    if (!u?.id) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/parents/${u.id}/delete`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'ngrok-skip-browser-warning': 'true',
        },
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.message || 'Failed to delete account.');
        setDeleteLoading(false);
        return;
      }
      // Clear everything and go to signup
      logout();
      navigate('/register-parent');
    } catch {
      alert('Something went wrong. Please try again.');
      setDeleteLoading(false);
    }
  };

  const handleProfileUpdated = (updatedUser) => {
    setUser(buildUserDisplay(updatedUser));
    if (updatedUser.blobAvatar) setAvatar(updatedUser.blobAvatar);
    setShowEditParent(false);
  };

  const handleChildrenChanged = () => {
    const u = getUser();
    if (!u?.id) return;
    getChildren(u.id)
      .then((res) => setChildren(res.data || []))
      .catch(() => {});
  };

  const sectionRefs = {
    profile:   profileRef,
    requests:  requestsRef,
    favorites: favoritesRef,
    children:  childrenRef,
  };

  const handleMenuClick = (key) => {
    setActiveTab(key);
    const ref = sectionRefs[key];
    if (ref?.current && contentRef?.current) {
      contentRef.current.scrollTo({
        top: ref.current.offsetTop - 16,
        behavior: 'smooth',
      });
    }
  };

  const menuItems = [
    { key: 'profile',   label: t('profile.profileInfo'), icon: <FiUser /> },
    { key: 'requests',  label: t('profile.myRequests'),  icon: <LuClipboardList /> },
    { key: 'favorites', label: t('profile.favorites'),   icon: <FiHeart /> },
    { key: 'children',  label: t('profile.children'),    icon: <FiUsers /> },
  ];

  return (
    <div className="profile-overlay" onClick={onClose}>
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>

        <div className="profile-header">
          <div className="profile-header-title">
            <LuClipboardList className="profile-header-icon" />
            <span>{t('profile.title')}</span>
          </div>
          <button className="profile-close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="profile-body">

          {/* ── Sidebar ── */}
          <div className="profile-sidebar">
            <div className="profile-avatar-section">
              <div className="profile-avatar">
                {avatar ? (
                  <img key={avatar} src={avatar} alt="avatar" />
                ) : null}
                <div
                  className="profile-avatar-fallback"
                  style={{ display: avatar ? 'none' : 'flex' }}
                >
                  <RiParentLine />
                </div>
                <div className="profile-avatar-edit" onClick={() => setShowEditParent(true)}>
                  <FiEdit2 size={10} />
                </div>
              </div>
              <p className="profile-name">{user.fullName}</p>
            </div>

            <div className="profile-menu">
              <p className="profile-menu-label">{t('profile.account')}</p>
              {menuItems.map((item) => (
                <button
                  key={item.key}
                  className={`profile-menu-item ${activeTab === item.key ? 'active' : ''}`}
                  onClick={() => handleMenuClick(item.key)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}

              {/* Sign Out → goes to /signup */}
              <button
                className="profile-menu-item signout"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <FiLogOut />
                <span>{t('profile.signOut')}</span>
              </button>


            </div>
          </div>

          {/* ── Content ── */}
          <div className="profile-content" ref={contentRef}>

            {/* Personal Info */}
            <div className="profile-section" ref={profileRef}>
              <div className="profile-section-header">
                <h3>{t('profile.personalInfo')}</h3>
                <button className="edit-btn" onClick={() => setShowEditParent(true)}>
                  <FiEdit2 size={13} /> {t('profile.editAll')}
                </button>
              </div>
              <div className="profile-info-grid">
                <div className="profile-info-item">
                  <label>{t('profile.fullName')}</label>
                  <p>{user.fullName}</p>
                </div>
                <div className="profile-info-item">
                  <label>{t('profile.emailAddress')}</label>
                  <p>{user.email}</p>
                </div>
                <div className="profile-info-item">
                  <label>{t('profile.phoneNumber')}</label>
                  <p>{user.phone || '—'}</p>
                </div>
                <div className="profile-info-item">
                  <label>{t('profile.location')}</label>
                  <p>{user.location || '—'}</p>
                </div>
              </div>
            </div>

            {/* Enrollment Requests */}
            <div className="profile-section" ref={requestsRef}>
              <div className="profile-section-header">
                <h3>{t('profile.enrollmentRequests')}</h3>
                <button className="view-all-btn" onClick={() => setShowRequests(true)}>
                  {t('profile.viewAll')}
                </button>
              </div>
              {loadingRequests ? (
                <p className="profile-loading">Loading…</p>
              ) : enrollmentRequests.length === 0 ? (
                <p className="profile-empty">{t('profile.noRequests')}</p>
              ) : (
                <div className="enrollment-list">
                  {enrollmentRequests.slice(0, 3).map((req) => (
                    <div key={req.request_id} className="enrollment-item">
                      <div className="enrollment-icon"><PiStudent size={18} /></div>
                      <div className="enrollment-info">
                        <p className="enrollment-nursery">{req.daycare_name}</p>
                        <div className="enrollment-meta">
                          <span><FiUser size={11} /> {req.child_name}</span>
                          <span>
                            <FiCalendar size={11} />
                            {req.request_date ? new Date(req.request_date).toLocaleDateString() : ''}
                          </span>
                        </div>
                      </div>
                      <span className={`enrollment-status ${req.status}`}>
                        {t(`profile.${req.status}`) || req.status}
                      </span>
                      <FiChevronRight className="enrollment-arrow" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Favorites */}
            <div className="profile-section" ref={favoritesRef}>
              <div className="profile-section-header">
                <h3>{t('profile.favorites')}</h3>
                <button className="view-all-btn" onClick={() => setShowFavorites(true)}>
                  {t('profile.manage')}
                </button>
              </div>
              {loadingFavorites ? (
                <p className="profile-loading">Loading…</p>
              ) : favorites.length === 0 ? (
                <p className="profile-empty">{t('profile.noFavorites')}</p>
              ) : (
                <div className="favorites-grid">
                  {favorites.slice(0, 4).map((fav) => (
                    <div key={fav.id} className="favorite-card">
                      <div className="favorite-image">
                        <img src={fav.image} alt={fav.name}
                          onError={(e) => (e.target.src = 'https://images.unsplash.com/photo-1576765607924-3f7b8410a787?w=200')} />
                      </div>
                      <div className="favorite-info">
                        <div className="favorite-top">
                          <p className="favorite-name">{fav.name}</p>
                          <FiHeart className="favorite-heart" />
                        </div>
                        <span className="favorite-location">
                          <FiMapPin size={11} /> {fav.location}
                        </span>
                        <div className="favorite-bottom">
                          <span className="favorite-rating">
                            <FiStar size={11} style={{ color: '#f4a523', fill: '#f4a523' }} />
                            {fav.rating > 0 ? fav.rating : '—'}
                          </span>
                          <button className="favorite-details-btn">{t('profile.details')}</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Children */}
            <div className="profile-section" ref={childrenRef}>
              <div className="profile-section-header">
                <h3>{t('profile.children')}</h3>
                <button className="view-all-btn" onClick={() => setShowChildren(true)}>
                  {t('profile.manage')}
                </button>
              </div>
              {loadingChildren ? (
                <p className="profile-loading">Loading…</p>
              ) : children.length === 0 ? (
                <p className="profile-empty">{t('profile.noChildren')}</p>
              ) : (
                <div className="children-grid">
                  {children.map((child) => (
                    <div key={child.id} className="child-item">
                      <div className="child-avatar">
                        <ChildPhoto
                          src={resolveChildPhoto(child.profile_image)}
                          name={child.name}
                        />
                      </div>
                      <div>
                        <p className="child-name">{child.name}</p>
                        <span className="child-age">
                          {child.age
                            ? `${child.age} ${t('profile.yearsOld')}`
                            : child.birth_date
                            ? new Date(child.birth_date).toLocaleDateString()
                            : ''}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* ── Delete Confirmation Modal ── */}
      {showDeleteConfirm && (
        <div
          className="profile-overlay"
          style={{ zIndex: 9999 }}
          onClick={() => !deleteLoading && setShowDeleteConfirm(false)}
        >
          <div
            className="profile-modal"
            style={{ maxWidth: '380px', padding: '32px', textAlign: 'center' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>⚠️</div>
            <h3 style={{ margin: '0 0 8px', color: '#1a202c' }}>Delete Account</h3>
            <p style={{ color: '#718096', fontSize: '14px', margin: '0 0 24px' }}>
              This will permanently delete your account and all your data. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteLoading}
                style={{
                  padding: '10px 24px', borderRadius: '8px', border: '1px solid #e2e8f0',
                  background: '#fff', color: '#4a5568', cursor: 'pointer', fontSize: '14px',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
                style={{
                  padding: '10px 24px', borderRadius: '8px', border: 'none',
                  background: '#e53e3e', color: '#fff', cursor: deleteLoading ? 'not-allowed' : 'pointer',
                  fontSize: '14px', opacity: deleteLoading ? 0.7 : 1,
                }}
              >
                {deleteLoading ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showChildren && (
        <MyChildren
          onClose={onClose}
          onBack={() => setShowChildren(false)}
          onChildrenChanged={handleChildrenChanged}
        />
      )}
      {showRequests && (
        <MyEnrollmentRequests onClose={onClose} onBack={() => setShowRequests(false)} />
      )}
      {showEditParent && (
        <EditParent
          onClose={() => setShowEditParent(false)}
          onSaved={handleProfileUpdated}
        />
      )}
      {showFavorites && (
        <MyFavorites
          onClose={onClose}
          onBack={() => setShowFavorites(false)}
          favorites={favorites}
          setFavorites={setFavorites}
        />
      )}
    </div>
  );
};

export default ParentProfile;