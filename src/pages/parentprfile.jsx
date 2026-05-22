// // import React, { useState, useRef, useEffect } from 'react';
// // import './ParentProfile.css';
// // import { useTranslation } from 'react-i18next';
// // import {
// //   FiX, FiEdit2, FiUser, FiHeart,
// //   FiUsers, FiLogOut, FiMapPin, FiCalendar,
// //   FiChevronRight, FiStar
// // } from 'react-icons/fi';
// // import { RiParentLine } from 'react-icons/ri';
// // import { PiStudent } from 'react-icons/pi';
// // import { TbMoodKid } from 'react-icons/tb';
// // import { LuClipboardList } from 'react-icons/lu';
// // import MyChildren from './MyChildren';
// // import MyEnrollmentRequests from './Myenrollmentrequests';
// // import EditParent from './editparent';
// // import MyFavorites from './My Favorites';
// // import {
// //   getUser,
// //   getChildren,
// //   getRequests,
// //   getSavedDaycares,
// //   logout,
// // } from '../api/auth';

// // const BASE_URL = import.meta.env.VITE_API_URL;

// // const getImageUrl = (img) => {
// //   if (!img) return null;
// //   if (img.startsWith('http')) return img;
// //   return `${BASE_URL}/${img}`;
// // };

// // const ParentProfile = ({ onClose }) => {
// //   const { t } = useTranslation();
// //   const [activeTab, setActiveTab] = useState('profile');

// //   const profileRef   = useRef(null);
// //   const requestsRef  = useRef(null);
// //   const favoritesRef = useRef(null);
// //   const childrenRef  = useRef(null);
// //   const contentRef   = useRef(null);

// //   // ── Data from API ──────────────────────────────────────────────────────────
  
// //   const rawUser = getUser(); // { id, email, first_name, last_name, role, ... }

// //   const [user, setUser] = useState({
// //    fullName: rawUser?.name || 'Parent',
// //     email:    rawUser?.email    || '',
// //     phone:    rawUser?.phone    || '',
// //     location: rawUser?.city     || rawUser?.location || '',
// //     avatar:   getImageUrl(rawUser?.profile_image) || null,
// //   });

// //   const [enrollmentRequests, setEnrollmentRequests] = useState([]);
// //   const [children,           setChildren]           = useState([]);
// //   const [favorites,          setFavorites]          = useState([]);
// //   const [loadingRequests,    setLoadingRequests]    = useState(true);
// //   const [loadingChildren,    setLoadingChildren]    = useState(true);
// //   const [loadingFavorites,   setLoadingFavorites]   = useState(true);

// //   // ── Sub-panels ─────────────────────────────────────────────────────────────
// //   const [showChildren,   setShowChildren]   = useState(false);
// //   const [showRequests,   setShowRequests]   = useState(false);
// //   const [showEditParent, setShowEditParent] = useState(false);
// //   const [showFavorites,  setShowFavorites]  = useState(false);

// //   // ── Fetch data on mount ────────────────────────────────────────────────────
// //   useEffect(() => {
// //     if (!rawUser?.id) return;

// //     // Children  GET /parents/:parentId/children
// //     getChildren(rawUser.id)
// //       .then((res) => {
// //         // Response: [{ id, name, age, birth_date, gender, medical_issues }]
// //         setChildren(res.data || []);
// //       })
// //       .catch(() => setChildren([]))
// //       .finally(() => setLoadingChildren(false));

// //     // Enrollment requests  GET /parents/:parentId/requests
// //     getRequests(rawUser.id)
// //       .then((res) => {
// //         // Response: [{ request_id, status, request_date, child_name,
// //         //              daycare_name, daycare_address, daycare_phone }]
// //         setEnrollmentRequests(res.data || []);
// //       })
// //       .catch(() => setEnrollmentRequests([]))
// //       .finally(() => setLoadingRequests(false));

// //     // Saved daycares  GET /parents/:parentId/saved-daycares
// //     getSavedDaycares(rawUser.id)
// //       .then((res) => {
// //         // Response: [{ id, name, address, phone, price }]
// //         const mapped = (res.data || []).map((d) => ({
// //           id:       d.id,
// //           name:     d.name,
// //           location: d.City || d.city || d.address || '',
// //           rating:   parseFloat(d.avg_rating ?? d.rating ?? 0).toFixed(1),
// //           image:    getImageUrl(d.profile_image) || 'https://images.unsplash.com/photo-1576765607924-3f7b8410a787?w=200',
// //         }));
// //         setFavorites(mapped);
// //       })
// //       .catch(() => setFavorites([]))
// //       .finally(() => setLoadingFavorites(false));
// //   }, []); // eslint-disable-line react-hooks/exhaustive-deps

// //   // Refresh user info if EditParent saves changes
// //   const handleProfileUpdated = (updatedFields) => {
// //     setUser((prev) => ({
// //       ...prev,
// //       fullName: updatedFields.first_name
// //         ? `${updatedFields.first_name} ${updatedFields.last_name || ''}`.trim()
// //         : prev.fullName,
// //       phone:    updatedFields.phone    || prev.phone,
// //       location: updatedFields.city     || prev.location,
// //     }));
// //     setShowEditParent(false);
// //   };

// //   // ── Sidebar navigation ─────────────────────────────────────────────────────
// //   const sectionRefs = {
// //     profile:   profileRef,
// //     requests:  requestsRef,
// //     favorites: favoritesRef,
// //     children:  childrenRef,
// //   };

// //   const handleMenuClick = (key) => {
// //     setActiveTab(key);
// //     const ref = sectionRefs[key];
// //     if (ref?.current && contentRef?.current) {
// //       contentRef.current.scrollTo({
// //         top: ref.current.offsetTop - 16,
// //         behavior: 'smooth',
// //       });
// //     }
// //   };

// //   const menuItems = [
// //     { key: 'profile',   label: t('profile.profileInfo'), icon: <FiUser /> },
// //     { key: 'requests',  label: t('profile.myRequests'),  icon: <LuClipboardList /> },
// //     { key: 'favorites', label: t('profile.favorites'),   icon: <FiHeart /> },
// //     { key: 'children',  label: t('profile.children'),    icon: <FiUsers /> },
// //   ];

// //   // ── Render ─────────────────────────────────────────────────────────────────
// //   return (
// //     <div className="profile-overlay" onClick={onClose}>
// //       <div className="profile-modal" onClick={(e) => e.stopPropagation()}>

// //         {/* Header */}
// //         <div className="profile-header">
// //           <div className="profile-header-title">
// //             <LuClipboardList className="profile-header-icon" />
// //             <span>{t('profile.title')}</span>
// //           </div>
// //           <button className="profile-close-btn" onClick={onClose}>
// //             <FiX />
// //           </button>
// //         </div>

// //         <div className="profile-body">

// //           {/* ── Left Sidebar ── */}
// //           <div className="profile-sidebar">
// //             <div className="profile-avatar-section">
// //               <div className="profile-avatar">
// //                 {user.avatar ? (
// //                   <img
// //                     src={user.avatar}
// //                     alt="avatar"
// //                     onError={(e) => {
// //                       e.target.style.display = 'none';
// //                       e.target.nextSibling.style.display = 'flex';
// //                     }}
// //                   />
// //                 ) : null}
// //                 <div
// //                   className="profile-avatar-fallback"
// //                   style={{ display: user.avatar ? 'none' : 'flex' }}
// //                 >
// //                   <RiParentLine />
// //                 </div>
// //                 <div className="profile-avatar-edit">
// //                   <FiEdit2 size={10} />
// //                 </div>
// //               </div>
// //               <p className="profile-name">{user.fullName}</p>
// //             </div>

// //             <div className="profile-menu">
// //               <p className="profile-menu-label">{t('profile.account')}</p>
// //               {menuItems.map((item) => (
// //                 <button
// //                   key={item.key}
// //                   className={`profile-menu-item ${activeTab === item.key ? 'active' : ''}`}
// //                   onClick={() => handleMenuClick(item.key)}
// //                 >
// //                   {item.icon}
// //                   <span>{item.label}</span>
// //                 </button>
// //               ))}
// //               <button
// //                 className="profile-menu-item signout"
// //                 onClick={() => { onClose(); logout(); }}
// //               >
// //                 <FiLogOut />
// //                 <span>{t('profile.signOut')}</span>
// //               </button>
// //             </div>
// //           </div>

// //           {/* ── Right Content ── */}
// //           <div className="profile-content" ref={contentRef}>

// //             {/* Personal Information */}
// //             <div className="profile-section" ref={profileRef}>
// //               <div className="profile-section-header">
// //                 <h3>{t('profile.personalInfo')}</h3>
// //                 <button className="edit-btn" onClick={() => setShowEditParent(true)}>
// //                   <FiEdit2 size={13} /> {t('profile.editAll')}
// //                 </button>
// //               </div>
// //               <div className="profile-info-grid">
// //                 <div className="profile-info-item">
// //                   <label>{t('profile.fullName')}</label>
// //                   <p>{user.fullName}</p>
// //                 </div>
// //                 <div className="profile-info-item">
// //                   <label>{t('profile.emailAddress')}</label>
// //                   <p>{user.email}</p>
// //                 </div>
// //                 <div className="profile-info-item">
// //                   <label>{t('profile.phoneNumber')}</label>
// //                   <p>{user.phone || '—'}</p>
// //                 </div>
// //                 <div className="profile-info-item">
// //                   <label>{t('profile.location')}</label>
// //                   <p>{user.location || '—'}</p>
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Enrollment Requests */}
// //             <div className="profile-section" ref={requestsRef}>
// //               <div className="profile-section-header">
// //                 <h3>{t('profile.enrollmentRequests')}</h3>
// //                 <button className="view-all-btn" onClick={() => setShowRequests(true)}>
// //                   {t('profile.viewAll')}
// //                 </button>
// //               </div>

// //               {loadingRequests ? (
// //                 <p className="profile-loading">Loading…</p>
// //               ) : enrollmentRequests.length === 0 ? (
// //                 <p className="profile-empty">{t('profile.noRequests') || 'No requests yet.'}</p>
// //               ) : (
// //                 <div className="enrollment-list">
// //                   {enrollmentRequests.slice(0, 3).map((req) => (
// //                     <div key={req.request_id} className="enrollment-item">
// //                       <div className="enrollment-icon">
// //                         <PiStudent size={18} />
// //                       </div>
// //                       <div className="enrollment-info">
// //                         <p className="enrollment-nursery">{req.daycare_name}</p>
// //                         <div className="enrollment-meta">
// //                           <span><FiUser size={11} /> {req.child_name}</span>
// //                           <span>
// //                             <FiCalendar size={11} />
// //                             {req.request_date
// //                               ? new Date(req.request_date).toLocaleDateString()
// //                               : ''}
// //                           </span>
// //                         </div>
// //                       </div>
// //                       <span className={`enrollment-status ${req.status}`}>
// //                         {t(`profile.${req.status}`) || req.status}
// //                       </span>
// //                       <FiChevronRight className="enrollment-arrow" />
// //                     </div>
// //                   ))}
// //                 </div>
// //               )}
// //             </div>

// //             {/* Favorites */}
// //             <div className="profile-section" ref={favoritesRef}>
// //               <div className="profile-section-header">
// //                 <h3>{t('profile.favorites')}</h3>
// //                 <button className="view-all-btn" onClick={() => setShowFavorites(true)}>
// //                   {t('profile.manage')}
// //                 </button>
// //               </div>

// //               {loadingFavorites ? (
// //                 <p className="profile-loading">Loading…</p>
// //               ) : favorites.length === 0 ? (
// //                 <p className="profile-empty">{t('profile.noFavorites') || 'No saved daycares yet.'}</p>
// //               ) : (
// //                 <div className="favorites-grid">
// //                   {favorites.slice(0, 4).map((fav) => (
// //                     <div key={fav.id} className="favorite-card">
// //                       <div className="favorite-image">
// //                         <img
// //                           src={fav.image}
// //                           alt={fav.name}
// //                           onError={(e) =>
// //                             (e.target.src =
// //                               'https://images.unsplash.com/photo-1576765607924-3f7b8410a787?w=200')
// //                           }
// //                         />
// //                       </div>
// //                       <div className="favorite-info">
// //                         <div className="favorite-top">
// //                           <p className="favorite-name">{fav.name}</p>
// //                           <FiHeart className="favorite-heart" />
// //                         </div>
// //                         <span className="favorite-location">
// //                           <FiMapPin size={11} /> {fav.location}
// //                         </span>
// //                         <div className="favorite-bottom">
// //                           <span className="favorite-rating">
// //                             <FiStar size={11} style={{ color: '#f4a523', fill: '#f4a523' }} />
// //                             {fav.rating > 0 ? fav.rating : '—'}
// //                           </span>
// //                           <button className="favorite-details-btn">
// //                             {t('profile.details')}
// //                           </button>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   ))}
// //                 </div>
// //               )}
// //             </div>

// //             {/* Children */}
// //             <div className="profile-section" ref={childrenRef}>
// //               <div className="profile-section-header">
// //                 <h3>{t('profile.children')}</h3>
// //                 <button className="view-all-btn" onClick={() => setShowChildren(true)}>
// //                   {t('profile.manage')}
// //                 </button>
// //               </div>

// //               {loadingChildren ? (
// //                 <p className="profile-loading">Loading…</p>
// //               ) : children.length === 0 ? (
// //                 <p className="profile-empty">{t('profile.noChildren') || 'No children added yet.'}</p>
// //               ) : (
// //                 <div className="children-grid">
// //                   {children.map((child) => (
// //                     <div key={child.id} className="child-item">
// //                       <div className="child-avatar">
// //                         <TbMoodKid size={20} />
// //                       </div>
// //                       <div>
// //                         <p className="child-name">{child.name}</p>
// //                         <span className="child-age">
// //                           {child.age
// //                             ? `${child.age} ${t('profile.yearsOld') || 'yrs'}`
// //                             : child.birth_date
// //                             ? new Date(child.birth_date).toLocaleDateString()
// //                             : ''}
// //                         </span>
// //                       </div>
// //                     </div>
// //                   ))}
// //                 </div>
// //               )}
// //             </div>

// //           </div>
// //         </div>
// //       </div>

// //       {/* ── Sub-panels ── */}
// //       {showChildren && (
// //         <MyChildren onClose={onClose} onBack={() => setShowChildren(false)} />
// //       )}
// //       {showRequests && (
// //         <MyEnrollmentRequests onClose={onClose} onBack={() => setShowRequests(false)} />
// //       )}
// //       {showEditParent && (
// //         <EditParent
// //           onClose={() => setShowEditParent(false)}
// //           onSaved={handleProfileUpdated}
// //         />
// //       )}
// //       {showFavorites && (
// //         <MyFavorites
// //           onClose={onClose}
// //           onBack={() => setShowFavorites(false)}
// //           favorites={favorites}
// //           setFavorites={setFavorites}
// //         />
// //       )}
// //     </div>
// //   );
// // };

// // export default ParentProfile;

// import React, { useState, useRef, useEffect } from 'react';
// import './ParentProfile.css';
// import { useTranslation } from 'react-i18next';
// import {
//   FiX, FiEdit2, FiUser, FiHeart,
//   FiUsers, FiLogOut, FiMapPin, FiCalendar,
//   FiChevronRight, FiStar
// } from 'react-icons/fi';
// import { RiParentLine } from 'react-icons/ri';
// import { PiStudent } from 'react-icons/pi';
// import { TbMoodKid } from 'react-icons/tb';
// import { LuClipboardList } from 'react-icons/lu';
// import MyChildren from './MyChildren';
// import MyEnrollmentRequests from './Myenrollmentrequests';
// import EditParent from './editparent';
// import MyFavorites from './My Favorites';
// import {
//   getUser,
//   getChildren,
//   getRequests,
//   getSavedDaycares,
//   logout,
// } from '../api/auth';

// const BASE_URL = import.meta.env.VITE_API_URL;

// const getImageUrl = (img) => {
//   if (!img) return null;
//   if (img.startsWith('http')) return img;
//   return `${BASE_URL}/${img}`;
// };

// const ParentProfile = ({ onClose }) => {
//   const { t } = useTranslation();
//   const [activeTab, setActiveTab] = useState('profile');

//   const profileRef   = useRef(null);
//   const requestsRef  = useRef(null);
//   const favoritesRef = useRef(null);
//   const childrenRef  = useRef(null);
//   const contentRef   = useRef(null);

//   // ── Read fresh user from localStorage on every mount ──────────────────────
//   // rawUser is declared here so useEffect can access it too
//   const rawUser = getUser();

//   const [user, setUser] = useState(() => {
//     const u = getUser(); // lazy init reads fresh on mount
//     const fullName = u?.first_name
//       ? `${u.first_name} ${u.last_name || ''}`.trim()
//       : u?.name || 'Parent';
//     return {
//       fullName,
//       email:    u?.email    || '',
//       phone:    u?.phone    || '',
//       location: u?.city     || u?.location || '',
//       avatar:   getImageUrl(u?.profile_image) || null,
//     };
//   });

//   const [enrollmentRequests, setEnrollmentRequests] = useState([]);
//   const [children,           setChildren]           = useState([]);
//   const [favorites,          setFavorites]          = useState([]);
//   const [loadingRequests,    setLoadingRequests]    = useState(true);
//   const [loadingChildren,    setLoadingChildren]    = useState(true);
//   const [loadingFavorites,   setLoadingFavorites]   = useState(true);

//   // ── Sub-panels ─────────────────────────────────────────────────────────────
//   const [showChildren,   setShowChildren]   = useState(false);
//   const [showRequests,   setShowRequests]   = useState(false);
//   const [showEditParent, setShowEditParent] = useState(false);
//   const [showFavorites,  setShowFavorites]  = useState(false);

//   // ── Fetch data on mount ────────────────────────────────────────────────────
//   useEffect(() => {
//     if (!rawUser?.id) return;

//     // Children  GET /parents/:parentId/children
//     getChildren(rawUser.id)
//       .then((res) => setChildren(res.data || []))
//       .catch(() => setChildren([]))
//       .finally(() => setLoadingChildren(false));

//     // Enrollment requests  GET /parents/:parentId/requests
//     getRequests(rawUser.id)
//       .then((res) => setEnrollmentRequests(res.data || []))
//       .catch(() => setEnrollmentRequests([]))
//       .finally(() => setLoadingRequests(false));

//     // Saved daycares  GET /parents/:parentId/saved-daycares
//     getSavedDaycares(rawUser.id)
//       .then((res) => {
//         const mapped = (res.data || []).map((d) => ({
//           id:       d.id,
//           name:     d.name,
//           location: d.City || d.city || d.address || '',
//           rating:   parseFloat(d.avg_rating ?? d.rating ?? 0).toFixed(1),
//           image:    getImageUrl(d.profile_image) ||
//                     'https://images.unsplash.com/photo-1576765607924-3f7b8410a787?w=200',
//         }));
//         setFavorites(mapped);
//       })
//       .catch(() => setFavorites([]))
//       .finally(() => setLoadingFavorites(false));

//   }, []); // eslint-disable-line react-hooks/exhaustive-deps

//   // Refresh user info after EditParent saves
//   const handleProfileUpdated = (updatedFields) => {
//     setUser((prev) => ({
//       ...prev,
//       fullName: updatedFields.first_name
//         ? `${updatedFields.first_name} ${updatedFields.last_name || ''}`.trim()
//         : prev.fullName,
//       phone:    updatedFields.phone || prev.phone,
//       location: updatedFields.city  || prev.location,
//     }));
//     setShowEditParent(false);
//   };

//   // ── Sidebar navigation ─────────────────────────────────────────────────────
//   const sectionRefs = {
//     profile:   profileRef,
//     requests:  requestsRef,
//     favorites: favoritesRef,
//     children:  childrenRef,
//   };

//   const handleMenuClick = (key) => {
//     setActiveTab(key);
//     const ref = sectionRefs[key];
//     if (ref?.current && contentRef?.current) {
//       contentRef.current.scrollTo({
//         top: ref.current.offsetTop - 16,
//         behavior: 'smooth',
//       });
//     }
//   };

//   const menuItems = [
//     { key: 'profile',   label: t('profile.profileInfo'), icon: <FiUser /> },
//     { key: 'requests',  label: t('profile.myRequests'),  icon: <LuClipboardList /> },
//     { key: 'favorites', label: t('profile.favorites'),   icon: <FiHeart /> },
//     { key: 'children',  label: t('profile.children'),    icon: <FiUsers /> },
//   ];

//   // ── Render ─────────────────────────────────────────────────────────────────
//   return (
//     <div className="profile-overlay" onClick={onClose}>
//       <div className="profile-modal" onClick={(e) => e.stopPropagation()}>

//         {/* Header */}
//         <div className="profile-header">
//           <div className="profile-header-title">
//             <LuClipboardList className="profile-header-icon" />
//             <span>{t('profile.title')}</span>
//           </div>
//           <button className="profile-close-btn" onClick={onClose}>
//             <FiX />
//           </button>
//         </div>

//         <div className="profile-body">

//           {/* ── Left Sidebar ── */}
//           <div className="profile-sidebar">
//             <div className="profile-avatar-section">
//               <div className="profile-avatar">
//                 {user.avatar ? (
//                   <img
//                     src={user.avatar}
//                     alt="avatar"
//                     onError={(e) => {
//                       e.target.style.display = 'none';
//                       e.target.nextSibling.style.display = 'flex';
//                     }}
//                   />
//                 ) : null}
//                 <div
//                   className="profile-avatar-fallback"
//                   style={{ display: user.avatar ? 'none' : 'flex' }}
//                 >
//                   <RiParentLine />
//                 </div>
//                 <div className="profile-avatar-edit">
//                   <FiEdit2 size={10} />
//                 </div>
//               </div>
//               <p className="profile-name">{user.fullName}</p>
//             </div>

//             <div className="profile-menu">
//               <p className="profile-menu-label">{t('profile.account')}</p>
//               {menuItems.map((item) => (
//                 <button
//                   key={item.key}
//                   className={`profile-menu-item ${activeTab === item.key ? 'active' : ''}`}
//                   onClick={() => handleMenuClick(item.key)}
//                 >
//                   {item.icon}
//                   <span>{item.label}</span>
//                 </button>
//               ))}
//               <button
//                 className="profile-menu-item signout"
//                 onClick={() => { onClose(); logout(); }}
//               >
//                 <FiLogOut />
//                 <span>{t('profile.signOut')}</span>
//               </button>
//             </div>
//           </div>

//           {/* ── Right Content ── */}
//           <div className="profile-content" ref={contentRef}>

//             {/* Personal Information */}
//             <div className="profile-section" ref={profileRef}>
//               <div className="profile-section-header">
//                 <h3>{t('profile.personalInfo')}</h3>
//                 <button className="edit-btn" onClick={() => setShowEditParent(true)}>
//                   <FiEdit2 size={13} /> {t('profile.editAll')}
//                 </button>
//               </div>
//               <div className="profile-info-grid">
//                 <div className="profile-info-item">
//                   <label>{t('profile.fullName')}</label>
//                   <p>{user.fullName}</p>
//                 </div>
//                 <div className="profile-info-item">
//                   <label>{t('profile.emailAddress')}</label>
//                   <p>{user.email}</p>
//                 </div>
//                 <div className="profile-info-item">
//                   <label>{t('profile.phoneNumber')}</label>
//                   <p>{user.phone || '—'}</p>
//                 </div>
//                 <div className="profile-info-item">
//                   <label>{t('profile.location')}</label>
//                   <p>{user.location || '—'}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Enrollment Requests */}
//             <div className="profile-section" ref={requestsRef}>
//               <div className="profile-section-header">
//                 <h3>{t('profile.enrollmentRequests')}</h3>
//                 <button className="view-all-btn" onClick={() => setShowRequests(true)}>
//                   {t('profile.viewAll')}
//                 </button>
//               </div>

//               {loadingRequests ? (
//                 <p className="profile-loading">Loading…</p>
//               ) : enrollmentRequests.length === 0 ? (
//                 <p className="profile-empty">{t('profile.noRequests')}</p>
//               ) : (
//                 <div className="enrollment-list">
//                   {enrollmentRequests.slice(0, 3).map((req) => (
//                     <div key={req.request_id} className="enrollment-item">
//                       <div className="enrollment-icon">
//                         <PiStudent size={18} />
//                       </div>
//                       <div className="enrollment-info">
//                         <p className="enrollment-nursery">{req.daycare_name}</p>
//                         <div className="enrollment-meta">
//                           <span><FiUser size={11} /> {req.child_name}</span>
//                           <span>
//                             <FiCalendar size={11} />
//                             {req.request_date
//                               ? new Date(req.request_date).toLocaleDateString()
//                               : ''}
//                           </span>
//                         </div>
//                       </div>
//                       <span className={`enrollment-status ${req.status}`}>
//                         {t(`profile.${req.status}`) || req.status}
//                       </span>
//                       <FiChevronRight className="enrollment-arrow" />
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Favorites */}
//             <div className="profile-section" ref={favoritesRef}>
//               <div className="profile-section-header">
//                 <h3>{t('profile.favorites')}</h3>
//                 <button className="view-all-btn" onClick={() => setShowFavorites(true)}>
//                   {t('profile.manage')}
//                 </button>
//               </div>

//               {loadingFavorites ? (
//                 <p className="profile-loading">Loading…</p>
//               ) : favorites.length === 0 ? (
//                 <p className="profile-empty">{t('profile.noFavorites')}</p>
//               ) : (
//                 <div className="favorites-grid">
//                   {favorites.slice(0, 4).map((fav) => (
//                     <div key={fav.id} className="favorite-card">
//                       <div className="favorite-image">
//                         <img
//                           src={fav.image}
//                           alt={fav.name}
//                           onError={(e) =>
//                             (e.target.src =
//                               'https://images.unsplash.com/photo-1576765607924-3f7b8410a787?w=200')
//                           }
//                         />
//                       </div>
//                       <div className="favorite-info">
//                         <div className="favorite-top">
//                           <p className="favorite-name">{fav.name}</p>
//                           <FiHeart className="favorite-heart" />
//                         </div>
//                         <span className="favorite-location">
//                           <FiMapPin size={11} /> {fav.location}
//                         </span>
//                         <div className="favorite-bottom">
//                           <span className="favorite-rating">
//                             <FiStar size={11} style={{ color: '#f4a523', fill: '#f4a523' }} />
//                             {fav.rating > 0 ? fav.rating : '—'}
//                           </span>
//                           <button className="favorite-details-btn">
//                             {t('profile.details')}
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Children */}
//             <div className="profile-section" ref={childrenRef}>
//               <div className="profile-section-header">
//                 <h3>{t('profile.children')}</h3>
//                 <button className="view-all-btn" onClick={() => setShowChildren(true)}>
//                   {t('profile.manage')}
//                 </button>
//               </div>

//               {loadingChildren ? (
//                 <p className="profile-loading">Loading…</p>
//               ) : children.length === 0 ? (
//                 <p className="profile-empty">{t('profile.noChildren')}</p>
//               ) : (
//                 <div className="children-grid">
//                   {children.map((child) => (
//                     <div key={child.id} className="child-item">
//                       <div className="child-avatar">
//                         <TbMoodKid size={20} />
//                       </div>
//                       <div>
//                         <p className="child-name">{child.name}</p>
//                         <span className="child-age">
//                           {child.age
//                             ? `${child.age} ${t('profile.yearsOld')}`
//                             : child.birth_date
//                             ? new Date(child.birth_date).toLocaleDateString()
//                             : ''}
//                         </span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//           </div>
//         </div>
//       </div>

//       {/* ── Sub-panels ── */}
//       {showChildren && (
//         <MyChildren onClose={onClose} onBack={() => setShowChildren(false)} />
//       )}
//       {showRequests && (
//         <MyEnrollmentRequests onClose={onClose} onBack={() => setShowRequests(false)} />
//       )}
//       {showEditParent && (
//         <EditParent
//           onClose={() => setShowEditParent(false)}
//           onSaved={handleProfileUpdated}
//         />
//       )}
//       {showFavorites && (
//         <MyFavorites
//           onClose={onClose}
//           onBack={() => setShowFavorites(false)}
//           favorites={favorites}
//           setFavorites={setFavorites}
//         />
//       )}
//     </div>
//   );
// };

// export default ParentProfile;
import React, { useState, useRef, useEffect } from 'react';
import './ParentProfile.css';
import { useTranslation } from 'react-i18next';
import {
  FiX, FiEdit2, FiUser, FiHeart,
  FiUsers, FiLogOut, FiMapPin, FiCalendar,
  FiChevronRight, FiStar
} from 'react-icons/fi';
import { RiParentLine } from 'react-icons/ri';
import { PiStudent } from 'react-icons/pi';
import { TbMoodKid } from 'react-icons/tb';
import { LuClipboardList } from 'react-icons/lu';
import MyChildren from './MyChildren';
import MyEnrollmentRequests from './Myenrollmentrequests';
import EditParent from './editparent';
import MyFavorites from './My Favorites';
import {
  getUser,
  getChildren,
  getRequests,
  getSavedDaycares,
  getProfile,
  logout,
} from '../api/auth';

const BASE_URL = import.meta.env.VITE_API_URL;

const getImageUrl = (img) => {
  if (!img) return null;
  if (img.startsWith('http')) return img;
  return `${BASE_URL}/${img}`;
};

// Build a user display object from any user-shaped data
const buildUserDisplay = (u) => ({
  fullName: u?.first_name
    ? `${u.first_name} ${u.last_name || ''}`.trim()
    : u?.name || 'Parent',
  email:    u?.email    || '',
  phone:    u?.phone    || '',
  location: u?.city     || u?.location || '',
  avatar:   getImageUrl(u?.profile_image) || null,
});

const ParentProfile = ({ onClose }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('profile');

  const profileRef   = useRef(null);
  const requestsRef  = useRef(null);
  const favoritesRef = useRef(null);
  const childrenRef  = useRef(null);
  const contentRef   = useRef(null);

  // ── User display state — initialised from localStorage ────────────────────
  const [user, setUser] = useState(() => buildUserDisplay(getUser()));

  const [enrollmentRequests, setEnrollmentRequests] = useState([]);
  const [children,           setChildren]           = useState([]);
  const [favorites,          setFavorites]          = useState([]);
  const [loadingRequests,    setLoadingRequests]    = useState(true);
  const [loadingChildren,    setLoadingChildren]    = useState(true);
  const [loadingFavorites,   setLoadingFavorites]   = useState(true);

  // ── Sub-panels ─────────────────────────────────────────────────────────────
  const [showChildren,   setShowChildren]   = useState(false);
  const [showRequests,   setShowRequests]   = useState(false);
  const [showEditParent, setShowEditParent] = useState(false);
  const [showFavorites,  setShowFavorites]  = useState(false);

  // ── Fetch all data on mount ────────────────────────────────────────────────
  useEffect(() => {
    // Always re-read from localStorage inside the effect (avoid stale closure)
    const u = getUser();
    if (!u?.id) return;

    // ── 1. Fetch full profile to get phone / city / profile_image ────────────
    //    GET /parents/:id/profile
    getProfile(u.id)
      .then((res) => {
        const fullProfile = res.data;
        // Merge full profile into localStorage so future mounts are correct
        const merged = { ...u, ...fullProfile };
        localStorage.setItem('user', JSON.stringify(merged));
        setUser(buildUserDisplay(merged));
      })
      .catch(() => {
        // If endpoint doesn't exist yet, just keep what we have from localStorage
      });

    // ── 2. Children ───────────────────────────────────────────────────────────
    getChildren(u.id)
      .then((res) => setChildren(res.data || []))
      .catch(() => setChildren([]))
      .finally(() => setLoadingChildren(false));

    // ── 3. Enrollment requests ────────────────────────────────────────────────
    getRequests(u.id)
      .then((res) => setEnrollmentRequests(res.data || []))
      .catch(() => setEnrollmentRequests([]))
      .finally(() => setLoadingRequests(false));

    // ── 4. Saved daycares ─────────────────────────────────────────────────────
    getSavedDaycares(u.id)
      .then((res) => {
        const mapped = (res.data || []).map((d) => ({
          id:       d.id,
          name:     d.name,
          location: d.City || d.city || d.address || '',
          rating:   parseFloat(d.avg_rating ?? d.rating ?? 0).toFixed(1),
          image:    getImageUrl(d.profile_image) ||
                    'https://images.unsplash.com/photo-1576765607924-3f7b8410a787?w=200',
        }));
        setFavorites(mapped);
      })
      .catch(() => setFavorites([]))
      .finally(() => setLoadingFavorites(false));

  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── After EditParent saves — it already updated localStorage ──────────────
  // Just re-read from localStorage to refresh everything at once
  const handleProfileUpdated = (updatedUser) => {
    setUser(buildUserDisplay(updatedUser));
    setShowEditParent(false);
  };

  // ── Sidebar navigation ─────────────────────────────────────────────────────
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

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="profile-overlay" onClick={onClose}>
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
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

          {/* ── Left Sidebar ── */}
          <div className="profile-sidebar">
            <div className="profile-avatar-section">
              <div className="profile-avatar">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="avatar"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  className="profile-avatar-fallback"
                  style={{ display: user.avatar ? 'none' : 'flex' }}
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
              <button
                className="profile-menu-item signout"
                onClick={() => { onClose(); logout(); }}
              >
                <FiLogOut />
                <span>{t('profile.signOut')}</span>
              </button>
            </div>
          </div>

          {/* ── Right Content ── */}
          <div className="profile-content" ref={contentRef}>

            {/* Personal Information */}
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
                      <div className="enrollment-icon">
                        <PiStudent size={18} />
                      </div>
                      <div className="enrollment-info">
                        <p className="enrollment-nursery">{req.daycare_name}</p>
                        <div className="enrollment-meta">
                          <span><FiUser size={11} /> {req.child_name}</span>
                          <span>
                            <FiCalendar size={11} />
                            {req.request_date
                              ? new Date(req.request_date).toLocaleDateString()
                              : ''}
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
                        <img
                          src={fav.image}
                          alt={fav.name}
                          onError={(e) =>
                            (e.target.src =
                              'https://images.unsplash.com/photo-1576765607924-3f7b8410a787?w=200')
                          }
                        />
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
                          <button className="favorite-details-btn">
                            {t('profile.details')}
                          </button>
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
                        <TbMoodKid size={20} />
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

      {/* ── Sub-panels ── */}
      {showChildren && (
        <MyChildren onClose={onClose} onBack={() => setShowChildren(false)} />
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