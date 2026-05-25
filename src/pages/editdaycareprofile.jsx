// import { useState, useRef } from "react";
// import { useTranslation } from "react-i18next";
// import "./editdaycareprofile.css";
// import { useNavigate, useLocation } from "react-router-dom";

// const Icon = ({ type }) => {
//   if (type === "location") return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>);
//   if (type === "user") return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg>);
//   if (type === "clock") return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9" /><polyline points="12 6 12 12 16 14" /></svg>);
//   if (type === "info") return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>);
//   if (type === "mail") return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="5" width="18" height="14" rx="2" /><polyline points="3 7 12 13 21 7" /></svg>);
//   if (type === "list") return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M7 9h10M7 13h6" /></svg>);
//   if (type === "grid") return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>);
//   if (type === "eye") return (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>);
//   if (type === "upload") return (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" /></svg>);
//   if (type === "signout") return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>);
//   if (type === "addphoto") return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>);
//   if (type === "camera") return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" /></svg>);
//   return null;
// };

// const Toggle = ({ value, onChange }) => (
//   <button className={`fpe-toggle ${value ? "fpe-toggle--on" : ""}`} onClick={() => onChange(!value)} type="button" aria-pressed={value} />
// );

// const Stars = ({ rating }) => (
//   <span className="fpe-stars">
//     {[1, 2, 3, 4, 5].map((s) => (
//       <span key={s} style={{ color: s <= rating ? "#f5a623" : "#e5e7eb" }}>★</span>
//     ))}
//   </span>
// );

// const ACTIVITIES = [
//   { key: "educationLevels", label: "Education per Levels" },
//   { key: "languageLearning", label: "Language Learning" },
//   { key: "events",           label: "Events" },
//   { key: "plays",            label: "Plays" },
// ];

// const FacilityProfileEditor = () => {
//   const { t, i18n } = useTranslation();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const incoming = location.state?.profileData || {};

//   const [activeNav, setActiveNav] = useState(null);
//   const [activeSection, setActiveSection] = useState("facility-identity");

//   const fileInputRef = useRef(null);
//   const profilePhotoInputRef = useRef(null);

//   const sectionRefs = {
//     "facility-identity": useRef(null),
//     "contact-location":  useRef(null),
//     "academy-details":   useRef(null),
//     "operating-hours":   useRef(null),
//     "services":          useRef(null),
//     "manage-requests":   useRef(null),
//     "reviews-to-post":   useRef(null),
//     "facility-gallery":  useRef(null),
//   };

//   const [profilePhoto, setProfilePhoto] = useState(incoming.profilePhotoURL || null);

//   const handleProfilePhoto = (e) => {
//     const file = e.target.files[0];
//     if (file) setProfilePhoto(URL.createObjectURL(file));
//     e.target.value = "";
//   };

//   const [facilityName, setFacilityName] = useState(incoming.daycareName   || "EliteCare Academy North");
//   const [tagline,      setTagline]      = useState(incoming.tagline        || "Nurturing Brilliance, One Step at a Time");
//   const [bio,          setBio]          = useState(incoming.description    || "A state-of-the-art facility focused on holistic development through play-based learning and nurturing care.");
//   const [address,      setAddress]      = useState(incoming.fullAddress    || "");
//   const [phoneNumber,  setPhoneNumber]  = useState(incoming.phoneNumber    || "");
//   const [email,        setEmail]        = useState(incoming.email          || "");
//   const [ageStart,     setAgeStart]     = useState(incoming.ageFrom        || "");
//   const [ageEnd,       setAgeEnd]       = useState(incoming.ageTo          || "");
//   const [capacity,     setCapacity]     = useState(incoming.totalCapacity  || "");
//   const [tuitionMin,   setTuitionMin]   = useState(incoming.monthlyFeeMin  || "");
//   const [tuitionMax,   setTuitionMax]   = useState(incoming.monthlyFeeMax  || "");
//   const [opensAt,      setOpensAt]      = useState(incoming.opensAt        || "");
//   const [closesAt,     setClosesAt]     = useState(incoming.closesAt       || "");
//   const [dayStart,     setDayStart]     = useState(incoming.dayStart       || "Mon");
//   const [dayEnd,       setDayEnd]       = useState(incoming.dayEnd         || "Fri");
//   const [healthcare,   setHealthcare]   = useState(incoming.healthcare     || false);
//   const [transport,    setTransport]    = useState(incoming.transport      || false);
//   const [lunch,        setLunch]        = useState(incoming.lunch          || false);
//   const [snacks,       setSnacks]       = useState(incoming.snacks         || false);
//   const [activities,   setActivities]   = useState(incoming.activities     || []);
//   const [showAllRequests, setShowAllRequests] = useState(false);
//   const [showAllReviews,  setShowAllReviews]  = useState(false);

//   const defaultGallery = [
//     "https://images.unsplash.com/photo-1566454419431-4af1d5e4ddc9?w=160&h=160&fit=crop",
//     "https://images.unsplash.com/photo-1551966775-a4ddc8df052b?w=160&h=160&fit=crop",
//     "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=160&h=160&fit=crop",
//     "https://images.unsplash.com/photo-1588072432836-e10032774350?w=160&h=160&fit=crop",
//     "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=160&h=160&fit=crop",
//   ];

//   const [galleryImages, setGalleryImages] = useState(
//     incoming.photoURLs?.length > 0 ? incoming.photoURLs : defaultGallery
//   );

//   const [requests, setRequests] = useState([
//     { id: 1, child: "Leo Sterling", parent: "Amanda S.",  status: "Pending"  },
//     { id: 2, child: "Maya Chen",    parent: "David C.",   status: "Approved" },
//     { id: 3, child: "Julian Ross",  parent: "Sarah R.",   status: "Pending"  },
//   ]);

//   const [reviews, setReviews] = useState([
//     { id: 1, parent: "Catherine Bell",   group: "Toddler",    rating: 5, quote: '"The teachers here go above and...' },
//     { id: 2, parent: "Robert Henderson", group: "Pre-K Class", rating: 4, quote: '"Outstanding facility and safety...' },
//     { id: 3, parent: "Michelle Wu",      group: "Infant Care", rating: 5, quote: '"The parent app is a game changer."' },
//   ]);

//   const [savedState, setSavedState] = useState({
//     facilityName: incoming.daycareName   || "EliteCare Academy North",
//     tagline:      incoming.tagline       || "Nurturing Brilliance, One Step at a Time",
//     bio:          incoming.description   || "A state-of-the-art facility focused on holistic development through play-based learning and nurturing care.",
//     address:      incoming.fullAddress   || "",
//     phoneNumber:  incoming.phoneNumber   || "",
//     email:        incoming.email         || "",
//     ageStart:     incoming.ageFrom       || "",
//     ageEnd:       incoming.ageTo         || "",
//     capacity:     incoming.totalCapacity || "",
//     tuitionMin:   incoming.monthlyFeeMin || "",
//     tuitionMax:   incoming.monthlyFeeMax || "",
//     opensAt:      incoming.opensAt       || "",
//     closesAt:     incoming.closesAt      || "",
//     transport:    incoming.transport     || false,
//     healthcare:   incoming.healthcare    || false,
//     lunch:        incoming.lunch         || false,
//     snacks:       incoming.snacks        || false,
//     dayStart:     incoming.dayStart      || "Mon",
//     dayEnd:       incoming.dayEnd        || "Fri",
//     activities:   incoming.activities    || [],
//     profilePhoto: incoming.profilePhotoURL || null,
//     galleryImages: incoming.photoURLs?.length > 0 ? incoming.photoURLs : defaultGallery,
//     requests: [
//       { id: 1, child: "Leo Sterling", parent: "Amanda S.",  status: "Pending"  },
//       { id: 2, child: "Maya Chen",    parent: "David C.",   status: "Approved" },
//       { id: 3, child: "Julian Ross",  parent: "Sarah R.",   status: "Pending"  },
//     ],
//     reviews: [
//       { id: 1, parent: "Catherine Bell",   group: "Toddler",    rating: 5, quote: '"The teachers here go above and...' },
//       { id: 2, parent: "Robert Henderson", group: "Pre-K Class", rating: 4, quote: '"Outstanding facility and safety...' },
//       { id: 3, parent: "Michelle Wu",      group: "Infant Care", rating: 5, quote: '"The parent app is a game changer."' },
//     ],
//   });

//   const handleSave = () => {
//     setSavedState({
//       facilityName, tagline, bio, address, phoneNumber,
//       email, ageStart, ageEnd, capacity, tuitionMin, tuitionMax,
//       opensAt, closesAt, transport, healthcare, lunch, snacks,
//       dayStart, dayEnd, activities, profilePhoto, galleryImages,
//       requests, reviews,
//     });
//     alert('Profile saved!');
//   };

//   const handleDiscard = () => {
//     if (!savedState) return;
//     setFacilityName(savedState.facilityName);
//     setTagline(savedState.tagline);
//     setBio(savedState.bio);
//     setAddress(savedState.address);
//     setPhoneNumber(savedState.phoneNumber);
//     setEmail(savedState.email);
//     setAgeStart(savedState.ageStart);
//     setAgeEnd(savedState.ageEnd);
//     setCapacity(savedState.capacity);
//     setTuitionMin(savedState.tuitionMin);
//     setTuitionMax(savedState.tuitionMax);
//     setOpensAt(savedState.opensAt);
//     setClosesAt(savedState.closesAt);
//     setTransport(savedState.transport);
//     setHealthcare(savedState.healthcare);
//     setLunch(savedState.lunch);
//     setSnacks(savedState.snacks);
//     setDayStart(savedState.dayStart);
//     setDayEnd(savedState.dayEnd);
//     setActivities(savedState.activities);
//     setProfilePhoto(savedState.profilePhoto);
//     setGalleryImages(savedState.galleryImages);
//     setRequests(savedState.requests);
//     setReviews(savedState.reviews);
//   };

//   const handleFileUpload = (e) => {
//     const files = Array.from(e.target.files);
//     const urls  = files.map((file) => URL.createObjectURL(file));
//     setGalleryImages((prev) => [...prev, ...urls]);
//     e.target.value = "";
//   };

//   const toggleActivity = (key) => {
//     setActivities((prev) =>
//       prev.includes(key) ? prev.filter((a) => a !== key) : [...prev, key]
//     );
//   };

//   const toggleLanguage = () => {
//     const newLang = i18n.language === "en" ? "ar" : "en";
//     i18n.changeLanguage(newLang);
//     document.body.dir = newLang === "ar" ? "rtl" : "ltr";
//   };

//   const handleSidebarClick = (key) => {
//     setActiveSection(key);
//     sectionRefs[key]?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
//   };

//   const sidebarItems = [
//     { key: "facility-identity", label: t("facilityProfile.sidebar.facilityIdentity"), icon: "user"     },
//     { key: "contact-location",  label: t("facilityProfile.sidebar.contactLocation"),  icon: "location" },
//     { key: "academy-details",   label: t("facilityProfile.sidebar.academyDetails"),   icon: "info"     },
//     { key: "operating-hours",   label: t("facilityProfile.sidebar.operatingHours"),   icon: "clock"    },
//     { key: "services",          label: t("facilityProfile.sidebar.services"),         icon: "list"     },
//     { key: "manage-requests",   label: t("facilityProfile.sidebar.manageRequests"),   icon: "mail"     },
//     { key: "reviews-to-post",   label: t("facilityProfile.sidebar.reviewsToPost"),    icon: "list"     },
//     { key: "facility-gallery",  label: t("facilityProfile.sidebar.facilityGallery"),  icon: "grid"     },
//   ];

//   return (
//     <div className="fpe-page">

//       {/* Navbar */}
//       <nav className="fpe-topbar">
//         <img src="/logo.png" alt="Hadanati" className="fpe-logo-img" />
//         <div className="fpe-nav-links">
//           {["home", "about", "help"].map((key) => (
//             <button
//               key={key}
//               className={`fpe-nav-btn ${activeNav === key ? "fpe-nav-btn--active" : ""}`}
//               onClick={() => setActiveNav(key)}
//             >
//               {t(`navbar.${key}`)}
//             </button>
//           ))}
//         </div>
//         <div className="fpe-nav-right">
//           <button className="fpe-lang-btn" onClick={toggleLanguage}>
//             {i18n.language === "en" ? "العربية" : "English"}
//           </button>
//           <div className="fpe-user-info">
//             <div>
//               <div className="fpe-user-name">esi mate</div>
//               <div className="fpe-user-role">Daycare Member</div>
//             </div>
//             <div className="fpe-avatar"><Icon type="user" /></div>
//           </div>
//         </div>
//       </nav>

//       {/* Page Header */}
//       <div className="fpe-page-header">
//         <div>
//           <h1 className="fpe-page-title">{t("facilityProfile.pageTitle")}</h1>
//           <p className="fpe-page-sub">{t("facilityProfile.pageSubtitle")}</p>
//         </div>
//         <div className="fpe-header-btns">
//           <button className="fpe-btn-discard" onClick={handleDiscard}>{t("facilityProfile.discard")}</button>
//           <button className="fpe-btn-save"    onClick={handleSave}>{t("facilityProfile.saveChanges")}</button>
//         </div>
//       </div>

//       {/* Main Layout */}
//       <div className="fpe-main">

//         {/* Sidebar */}
//         <aside className="fpe-sidebar">
//           <div className="fpe-sidebar-label">{t("facilityProfile.sidebar.account")}</div>
//           {sidebarItems.map((item) => (
//             <div
//               key={item.key}
//               className={`fpe-sidebar-item ${activeSection === item.key ? "fpe-sidebar-item--active" : ""}`}
//               onClick={() => handleSidebarClick(item.key)}
//             >
//               <Icon type={item.icon} />
//               {item.label}
//             </div>
//           ))}
//           <div className="fpe-sidebar-signout" onClick={() => navigate("/hadanati-login")}>
//             <Icon type="signout" />
//             {t("facilityProfile.sidebar.signOut")}
//           </div>
//         </aside>

//         {/* Content */}
//         <div className="fpe-content">

//           <div className="fpe-row-top">

//             {/* Facility Identity */}
//             <div ref={sectionRefs["facility-identity"]} className="fpe-card fpe-card--identity">
//               <div className="fpe-card-title">
//                 <Icon type="user" />{t("facilityProfile.identity.title")}
//               </div>
//               <div className="fpe-identity-grid">
//                 <div
//                   className="fpe-photo-box"
//                   onClick={() => profilePhotoInputRef.current.click()}
//                   style={{ cursor: "pointer" }}
//                 >
//                   {profilePhoto ? (
//                     <img
//                       className="fpe-photo-preview"
//                       src={profilePhoto}
//                       alt="Facility profile"
//                       onError={(e) => { e.target.style.background = "#f3f4f6"; e.target.removeAttribute("src"); }}
//                     />
//                   ) : (
//                     <div className="fpe-photo-preview" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f3f4f6", gap: "8px", color: "#bbb", fontSize: "12px", textAlign: "center" }}>
//                       <Icon type="camera" />
//                       <span>Click to upload</span>
//                     </div>
//                   )}
//                   <p className="fpe-photo-hint">{t("facilityProfile.identity.photoHint")}</p>
//                   <input ref={profilePhotoInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleProfilePhoto} />
//                 </div>

//                 <div className="fpe-form-col">
//                   <div>
//                     <label className="fpe-label">{t("facilityProfile.identity.daycareName")}</label>
//                     <input className="fpe-input" value={facilityName} onChange={(e) => setFacilityName(e.target.value)} />
//                   </div>
//                   <div>
//                     <label className="fpe-label">{t("facilityProfile.identity.tagline")}</label>
//                     <input className="fpe-input" value={tagline} onChange={(e) => setTagline(e.target.value)} />
//                   </div>
//                   <div>
//                     <label className="fpe-label">{t("facilityProfile.identity.shortBio")}</label>
//                     <textarea className="fpe-input fpe-textarea" value={bio} onChange={(e) => setBio(e.target.value)} />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Contact & Location */}
//             <div ref={sectionRefs["contact-location"]} className="fpe-card fpe-card--contact">
//               <div className="fpe-card-title">
//                 <Icon type="location" />{t("facilityProfile.contact.title")}
//               </div>
//               <div className="fpe-contact-field">
//                 <label className="fpe-label">{t("facilityProfile.contact.physicalAddress")}</label>
//                 <input className="fpe-input" value={address} onChange={(e) => setAddress(e.target.value)} />
//               </div>
//               <div className="fpe-contact-row-2">
//                 <div>
//                   <label className="fpe-label">{t("facilityProfile.contact.phone")}</label>
//                   <div className="fpe-phone-box">
//                     <span className="fpe-phone-prefix">+213</span>
//                     <input className="fpe-phone-inner" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="000 000 000" />
//                   </div>
//                 </div>
//                 <div>
//                   <label className="fpe-label">{t("facilityProfile.contact.email")}</label>
//                   <input className="fpe-input" value={email} onChange={(e) => setEmail(e.target.value)} />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Academy Details */}
//           <div ref={sectionRefs["academy-details"]} className="fpe-card">
//             <div className="fpe-card-title">
//               <Icon type="info" />{t("facilityProfile.academy.title")}
//             </div>
//             <div className="fpe-details-grid">
//               <div>
//                 <label className="fpe-label">{t("facilityProfile.academy.ageRange")}</label>
//                 <div className="fpe-hours-times">
//                   <input className="fpe-time-pill fpe-time-pill--input fpe-time-pill--wide" value={ageStart} onChange={(e) => setAgeStart(e.target.value)} placeholder="6 weeks" />
//                   <span className="fpe-time-sep">—</span>
//                   <input className="fpe-time-pill fpe-time-pill--input fpe-time-pill--wide" value={ageEnd} onChange={(e) => setAgeEnd(e.target.value)} placeholder="6 years" />
//                 </div>
//               </div>
//               <div>
//                 <label className="fpe-label">{t("facilityProfile.academy.capacity")}</label>
//                 <input className="fpe-input" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
//               </div>
//               <div className="fpe-col-span-2">
//                 <label className="fpe-label">{t("facilityProfile.academy.tuitionStructure")}</label>
//                 <div style={{ display: "flex", gap: "8px" }}>
//                   <input className="fpe-input" placeholder="e.g. 3000" value={tuitionMin} onChange={(e) => setTuitionMin(e.target.value)} />
//                   <input className="fpe-input" placeholder="e.g. 5000" value={tuitionMax} onChange={(e) => setTuitionMax(e.target.value)} />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Operating Hours + Services */}
//           <div ref={sectionRefs["operating-hours"]} className="fpe-card">
//             <div className="fpe-card-title">
//               <Icon type="clock" />{t("facilityProfile.hours.title")}
//             </div>
//             <div className="fpe-hours-row">
//               <div className="fpe-hours-times">
//                 <input className="fpe-time-pill fpe-time-pill--input" value={dayStart} onChange={(e) => setDayStart(e.target.value)} placeholder="Mon" />
//                 <span className="fpe-time-sep">—</span>
//                 <input className="fpe-time-pill fpe-time-pill--input" value={dayEnd} onChange={(e) => setDayEnd(e.target.value)} placeholder="Fri" />
//               </div>
//               <div className="fpe-hours-times">
//                 <input className="fpe-time-pill fpe-time-pill--input" type="time" value={opensAt} onChange={(e) => setOpensAt(e.target.value)} />
//                 <span className="fpe-time-sep">—</span>
//                 <input className="fpe-time-pill fpe-time-pill--input" type="time" value={closesAt} onChange={(e) => setClosesAt(e.target.value)} />
//               </div>
//             </div>

//             <div className="fpe-card-divider" />

//             <div ref={sectionRefs["services"]} className="fpe-services-grid fpe-services-grid--3col">
//               <div>
//                 <div className="fpe-section-label">{t("facilityProfile.services.servicesTitle")}</div>
//                 <div className="fpe-toggle-row">
//                   <span className="fpe-toggle-label">{t("facilityProfile.services.transport")}</span>
//                   <Toggle value={transport} onChange={setTransport} />
//                 </div>
//                 <div className="fpe-toggle-row">
//                   <span className="fpe-toggle-label">{t("facilityProfile.services.healthcare")}</span>
//                   <Toggle value={healthcare} onChange={setHealthcare} />
//                 </div>
//               </div>
//               <div>
//                 <div className="fpe-section-label">{t("facilityProfile.services.foodTitle")}</div>
//                 <label className="fpe-checkbox-row">
//                   <input type="checkbox" checked={lunch} onChange={(e) => setLunch(e.target.checked)} className="fpe-cb" />
//                   {t("facilityProfile.services.lunch")}
//                 </label>
//                 <label className="fpe-checkbox-row">
//                   <input type="checkbox" checked={snacks} onChange={(e) => setSnacks(e.target.checked)} className="fpe-cb" />
//                   {t("facilityProfile.services.snacks")}
//                 </label>
//               </div>
//               <div>
//                 <div className="fpe-section-label">{t("daycare.activitiesOffered")}</div>
//                 <div className="fpe-activities-box">
//                   {ACTIVITIES.map(({ key, label }) => (
//                     <label key={key} className="fpe-checkbox-row">
//                       <input type="checkbox" checked={activities.includes(key)} onChange={() => toggleActivity(key)} className="fpe-cb" />
//                       {t(`daycare.${key}`) || label}
//                     </label>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Requests + Reviews */}
//           <div className="fpe-row-bottom">
//             <div ref={sectionRefs["manage-requests"]} className="fpe-card">
//               <div className="fpe-card-header-row">
//                 <div className="fpe-card-title" style={{ marginBottom: 0 }}>
//                   <Icon type="mail" />{t("facilityProfile.requests.title")}
//                 </div>
//                 <button className="fpe-view-all" onClick={() => setShowAllRequests(true)}>
//                   <Icon type="eye" /> {t("facilityProfile.requests.viewAll")}
//                 </button>
//               </div>
//               <table className="fpe-table">
//                 <thead>
//                   <tr>
//                     <th>{t("facilityProfile.requests.childParent")}</th>
//                     <th>{t("facilityProfile.requests.status")}</th>
//                     <th>{t("facilityProfile.requests.action")}</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {requests.map((r) => (
//                     <tr key={r.id}>
//                       <td>
//                         <div className="fpe-child-name">{r.child}</div>
//                         <div className="fpe-parent-sub">{r.parent}</div>
//                       </td>
//                       <td>
//                         <span className={`fpe-status fpe-status--${r.status.toLowerCase()}`}>
//                           ● {r.status === "Pending" ? t("facilityProfile.requests.pending") : t("facilityProfile.requests.approved")}
//                         </span>
//                       </td>
//                       <td className="fpe-actions-cell">
//                         {r.status === "Pending" ? (
//                           <button className="fpe-btn-approve" onClick={() => setRequests(prev => prev.map(req => req.id === r.id ? { ...req, status: "Approved" } : req))}>
//                             {t("facilityProfile.reviews.approve")}
//                           </button>
//                         ) : (
//                           <span className="fpe-status fpe-status--approved">✓ {t("facilityProfile.requests.approved")}</span>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             <div ref={sectionRefs["reviews-to-post"]} className="fpe-card">
//               <div className="fpe-card-header-row">
//                 <div className="fpe-card-title" style={{ marginBottom: 0 }}>
//                   <Icon type="list" />{t("facilityProfile.reviews.title")}
//                 </div>
//                 <button className="fpe-view-all" onClick={() => setShowAllReviews(true)}>
//                   <Icon type="eye" /> {t("facilityProfile.requests.viewAll")}
//                 </button>
//               </div>
//               <table className="fpe-table fpe-table--reviews">
//                 <thead>
//                   <tr>
//                     <th>{t("facilityProfile.reviews.parent")}</th>
//                     <th>{t("facilityProfile.reviews.rating")}</th>
//                     <th>{t("facilityProfile.reviews.quote")}</th>
//                     <th>{t("facilityProfile.reviews.actions")}</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {reviews.map((rv) => (
//                     <tr key={rv.id}>
//                       <td>
//                         <div className="fpe-child-name">{rv.parent}</div>
//                         <div className="fpe-parent-sub">{rv.group}</div>
//                       </td>
//                       <td><Stars rating={rv.rating} /></td>
//                       <td><span className="fpe-quote">{rv.quote}</span></td>
//                       <td className="fpe-actions-cell">
//                         <button className="fpe-btn-approve" onClick={() => setReviews(prev => prev.filter(r => r.id !== rv.id))}>
//                           {t("facilityProfile.reviews.approve")}
//                         </button>
//                         <button className="fpe-btn-delete" onClick={() => setReviews(prev => prev.filter(r => r.id !== rv.id))}>🗑</button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Gallery */}
//           <div ref={sectionRefs["facility-gallery"]} className="fpe-card">
//             <div className="fpe-card-header-row">
//               <div className="fpe-card-title" style={{ marginBottom: 0 }}>
//                 <Icon type="grid" />{t("facilityProfile.gallery.title")}
//               </div>
//               <div className="fpe-gallery-header-right">
//                 <span className="fpe-gallery-count">
//                   {galleryImages.length} / 20 {t("facilityProfile.gallery.photosUploaded")}
//                 </span>
//                 <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={handleFileUpload} />
//                 <button className="fpe-upload-btn" onClick={() => fileInputRef.current.click()}>
//                   <Icon type="upload" /> {t("facilityProfile.gallery.uploadPhotos")}
//                 </button>
//               </div>
//             </div>
//             <div className="fpe-gallery-grid">
//               {galleryImages.map((src, i) => (
//                 <img key={i} src={src} alt={`Gallery ${i + 1}`} className="fpe-gallery-img"
//                   onError={(e) => { e.target.style.background = "#f3f4f6"; e.target.removeAttribute("src"); }} />
//               ))}
//               <div className="fpe-gallery-add" onClick={() => fileInputRef.current.click()}>
//                 <Icon type="addphoto" />
//                 <span>{t("facilityProfile.gallery.addNew")}</span>
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>

//       {/* Requests Modal */}
//       {showAllRequests && (
//         <div className="fpe-modal-backdrop" onClick={() => setShowAllRequests(false)}>
//           <div className="fpe-modal" onClick={(e) => e.stopPropagation()}>
//             <div className="fpe-modal-header">
//               <span className="fpe-card-title"><Icon type="mail" /> All Requests</span>
//               <button className="fpe-btn-discard" onClick={() => setShowAllRequests(false)}>✕ Close</button>
//             </div>
//             <table className="fpe-table">
//               <thead><tr><th>Child &amp; Parent</th><th>Status</th><th>Action</th></tr></thead>
//               <tbody>
//                 {requests.map((r) => (
//                   <tr key={r.id}>
//                     <td><div className="fpe-child-name">{r.child}</div><div className="fpe-parent-sub">{r.parent}</div></td>
//                     <td><span className={`fpe-status fpe-status--${r.status.toLowerCase()}`}>● {r.status}</span></td>
//                     <td>{r.status === "Pending"
//                       ? <button className="fpe-btn-approve" onClick={() => setRequests(prev => prev.map(req => req.id === r.id ? { ...req, status: "Approved" } : req))}>Approve</button>
//                       : <span className="fpe-status fpe-status--approved">✓ Approved</span>}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* Reviews Modal */}
//       {showAllReviews && (
//         <div className="fpe-modal-backdrop" onClick={() => setShowAllReviews(false)}>
//           <div className="fpe-modal" onClick={(e) => e.stopPropagation()}>
//             <div className="fpe-modal-header">
//               <span className="fpe-card-title"><Icon type="list" /> All Reviews</span>
//               <button className="fpe-btn-discard" onClick={() => setShowAllReviews(false)}>✕ Close</button>
//             </div>
//             <table className="fpe-table fpe-table--reviews">
//               <thead><tr><th>Parent</th><th>Rating</th><th>Quote</th><th>Actions</th></tr></thead>
//               <tbody>
//                 {reviews.map((rv) => (
//                   <tr key={rv.id}>
//                     <td><div className="fpe-child-name">{rv.parent}</div><div className="fpe-parent-sub">{rv.group}</div></td>
//                     <td><Stars rating={rv.rating} /></td>
//                     <td><span className="fpe-quote">{rv.quote}</span></td>
//                     <td className="fpe-actions-cell">
//                       <button className="fpe-btn-approve" onClick={() => setReviews(prev => prev.filter(r => r.id !== rv.id))}>Approve</button>
//                       <button className="fpe-btn-delete"  onClick={() => setReviews(prev => prev.filter(r => r.id !== rv.id))}>🗑</button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// };

// export default FacilityProfileEditor;
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./editdaycareprofile.css";
import { useNavigate } from "react-router-dom";
import { getUser, logout, getDaycareProfile, DAYCARE_API } from "../api/auth";

const BASE_URL = import.meta.env.VITE_DAYCARE_API_URL;

const resolveImage = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${BASE_URL}/${path}`;
};

const Icon = ({ type }) => {
  if (type === "location") return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>);
  if (type === "user") return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg>);
  if (type === "clock") return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9" /><polyline points="12 6 12 12 16 14" /></svg>);
  if (type === "info") return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>);
  if (type === "mail") return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="5" width="18" height="14" rx="2" /><polyline points="3 7 12 13 21 7" /></svg>);
  if (type === "list") return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M7 9h10M7 13h6" /></svg>);
  if (type === "grid") return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>);
  if (type === "eye") return (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>);
  if (type === "upload") return (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" /></svg>);
  if (type === "signout") return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>);
  if (type === "addphoto") return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>);
  if (type === "camera") return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" /></svg>);
  if (type === "trash") return (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" /></svg>);
  return null;
};

const Toggle = ({ value, onChange }) => (
  <button className={`fpe-toggle ${value ? "fpe-toggle--on" : ""}`} onClick={() => onChange(!value)} type="button" aria-pressed={value} />
);

const Stars = ({ rating }) => (
  <span className="fpe-stars">
    {[1, 2, 3, 4, 5].map((s) => (
      <span key={s} style={{ color: s <= rating ? "#f5a623" : "#e5e7eb" }}>★</span>
    ))}
  </span>
);

const ACTIVITIES = [
  { key: "educationLevels", label: "Education per Levels" },
  { key: "languageLearning", label: "Language Learning" },
  { key: "events",           label: "Events" },
  { key: "plays",            label: "Plays" },
];

const FacilityProfileEditor = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const currentUser = getUser();

  const fileInputRef = useRef(null);
  const profilePhotoInputRef = useRef(null);

  const [activeNav,     setActiveNav]     = useState(null);
  const [activeSection, setActiveSection] = useState("facility-identity");
  const [loading,       setLoading]       = useState(true);
  const [saving,        setSaving]        = useState(false);
  const [error,         setError]         = useState('');
  const [success,       setSuccess]       = useState('');

  const sectionRefs = {
    "facility-identity": useRef(null),
    "contact-location":  useRef(null),
    "academy-details":   useRef(null),
    "operating-hours":   useRef(null),
    "services":          useRef(null),
    "manage-requests":   useRef(null),
    "reviews-to-post":   useRef(null),
    "facility-gallery":  useRef(null),
  };

  const [profilePhoto,     setProfilePhoto]     = useState(null);
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [facilityName,     setFacilityName]     = useState('');
  const [tagline,          setTagline]          = useState('');
  const [bio,              setBio]              = useState('');
  const [address,          setAddress]          = useState('');
  const [phoneNumber,      setPhoneNumber]      = useState('');
  const [email,            setEmail]            = useState('');
  const [ageStart,         setAgeStart]         = useState('');
  const [ageEnd,           setAgeEnd]           = useState('');
  const [capacity,         setCapacity]         = useState('');
  const [tuitionMin,       setTuitionMin]       = useState('');
  const [tuitionMax,       setTuitionMax]       = useState('');
  const [opensAt,          setOpensAt]          = useState('');
  const [closesAt,         setClosesAt]         = useState('');
  const [dayStart,         setDayStart]         = useState('Mon');
  const [dayEnd,           setDayEnd]           = useState('Fri');
  const [healthcare,       setHealthcare]       = useState(false);
  const [transport,        setTransport]        = useState(false);
  const [lunch,            setLunch]            = useState(false);
  const [snacks,           setSnacks]           = useState(false);
  const [activities,       setActivities]       = useState([]);
  const [galleryImages,    setGalleryImages]    = useState([]);
  const [deletedImages,    setDeletedImages]    = useState([]);
  const [showAllRequests,  setShowAllRequests]  = useState(false);
  const [showAllReviews,   setShowAllReviews]   = useState(false);
  const [requests,         setRequests]         = useState([]);
  const [reviews,          setReviews]          = useState([]);

  // ── Populate state from API response ──────────────────────────────────────
  const populateFromData = (d) => {
    setFacilityName(d.name               || '');
    setTagline(d.tagline                 || '');
    setBio(d.description                 || '');
    setAddress(d.full_address            || d.address || '');
    setPhoneNumber(d.phone               || '');
    setEmail(d.email                     || '');
    setAgeStart(d.age_from               || '');
    setAgeEnd(d.age_to                   || '');
    setCapacity(d.total_capacity         || '');
    setTuitionMin(d.monthly_fee_min      || '');
    setTuitionMax(d.monthly_fee_max      || '');
    setOpensAt(d.opens_at                || '');
    setClosesAt(d.closes_at              || '');
    setDayStart(d.day_from               || 'Mon');
    setDayEnd(d.day_to                   || 'Fri');
    setHealthcare(!!d.healthcare_availability);
    setTransport(!!d.transport_availability);
    setLunch(!!d.lunch_included);
    setSnacks(!!d.snacks_included);
    setProfilePhoto(resolveImage(d.profile_image) || null);
    setProfilePhotoFile(null);
    setDeletedImages([]);
    const acts = [];
    if (d.education_per_levels) acts.push('educationLevels');
    if (d.language_learning)    acts.push('languageLearning');
    if (d.events)               acts.push('events');
    if (d.plays)                acts.push('plays');
    setActivities(acts);
    if (d.gallery) {
      const parsed = typeof d.gallery === 'string' ? JSON.parse(d.gallery) : d.gallery;
      setGalleryImages(parsed.map((url) => ({ url: resolveImage(url), file: null })));
    } else {
      setGalleryImages([]);
    }
  };

  // ── Fetch on mount ─────────────────────────────────────────────────────────
  useEffect(() => {
    getDaycareProfile()
      .then((res) => populateFromData(res.data?.data || res.data || {}))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // ── Discard — re-fetch from API ────────────────────────────────────────────
  const handleDiscard = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await getDaycareProfile();
      populateFromData(res.data?.data || res.data || {});
    } catch {
      // keep current state
    } finally {
      setLoading(false);
    }
  };

  // ── Save to backend ────────────────────────────────────────────────────────
  const handleSave = async () => {
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      const data = new FormData();
      data.append('name',              facilityName);
      data.append('tagline',           tagline);
      data.append('description',       bio);
      data.append('fullAddress',       address);
      data.append('phone',             phoneNumber);
      data.append('email',             email);
      data.append('ageFrom',           ageStart);
      data.append('ageTo',             ageEnd);
      data.append('totalCapacity',     capacity);
      data.append('monthlyFeeMin',     tuitionMin);
      data.append('monthlyFeeMax',     tuitionMax);
      data.append('opensAt',           opensAt);
      data.append('closesAt',          closesAt);
      data.append('dayStart',          dayStart);
      data.append('dayEnd',            dayEnd);
      data.append('healthcare',        healthcare);
      data.append('transport',         transport);
      data.append('lunch',             lunch);
      data.append('snacks',            snacks);
      data.append('educationLevels',   activities.includes('educationLevels'));
      data.append('languageLearning',  activities.includes('languageLearning'));
      data.append('events',            activities.includes('events'));
      data.append('plays',             activities.includes('plays'));
      if (profilePhotoFile) data.append('profile_image', profilePhotoFile);
      galleryImages.forEach(({ file }) => { if (file) data.append('photos', file); });
      if (deletedImages.length > 0) data.append('deletedPhotos', JSON.stringify(deletedImages));

      await DAYCARE_API.put('/api/daycares/profile/me', data);
      setSuccess('Profile saved successfully!');
      setDeletedImages([]);
      setProfilePhotoFile(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleProfilePhoto = (e) => {
    const file = e.target.files[0];
    if (file) { setProfilePhotoFile(file); setProfilePhoto(URL.createObjectURL(file)); }
    e.target.value = '';
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setGalleryImages((prev) => [...prev, ...files.map((file) => ({ url: URL.createObjectURL(file), file }))]);
    e.target.value = '';
  };

  const handleDeleteGalleryImage = (index) => {
    const img = galleryImages[index];
    if (!img.file) setDeletedImages((prev) => [...prev, img.url]);
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleActivity = (key) => {
    setActivities((prev) => prev.includes(key) ? prev.filter((a) => a !== key) : [...prev, key]);
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    document.body.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  const handleSidebarClick = (key) => {
    setActiveSection(key);
    sectionRefs[key]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const sidebarItems = [
    { key: 'facility-identity', label: t('facilityProfile.sidebar.facilityIdentity'), icon: 'user'     },
    { key: 'contact-location',  label: t('facilityProfile.sidebar.contactLocation'),  icon: 'location' },
    { key: 'academy-details',   label: t('facilityProfile.sidebar.academyDetails'),   icon: 'info'     },
    { key: 'operating-hours',   label: t('facilityProfile.sidebar.operatingHours'),   icon: 'clock'    },
    { key: 'services',          label: t('facilityProfile.sidebar.services'),         icon: 'list'     },
    { key: 'manage-requests',   label: t('facilityProfile.sidebar.manageRequests'),   icon: 'mail'     },
    { key: 'reviews-to-post',   label: t('facilityProfile.sidebar.reviewsToPost'),    icon: 'list'     },
    { key: 'facility-gallery',  label: t('facilityProfile.sidebar.facilityGallery'),  icon: 'grid'     },
  ];

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading profile…</div>;

  return (
    <div className="fpe-page">

      {/* Navbar */}
      <nav className="fpe-topbar">
        <img src="/logo.png" alt="Hadanati" className="fpe-logo-img" />
        <div className="fpe-nav-links">
          {['home', 'about', 'help'].map((key) => (
            <button key={key} className={`fpe-nav-btn ${activeNav === key ? 'fpe-nav-btn--active' : ''}`} onClick={() => setActiveNav(key)}>
              {t(`navbar.${key}`)}
            </button>
          ))}
        </div>
        <div className="fpe-nav-right">
          <button className="fpe-lang-btn" onClick={toggleLanguage}>
            {i18n.language === 'en' ? 'العربية' : 'English'}
          </button>
          <div className="fpe-user-info">
            <div>
              <div className="fpe-user-name">{facilityName || currentUser?.name || 'Daycare'}</div>
              <div className="fpe-user-role">Daycare Member</div>
            </div>
            <div className="fpe-avatar"><Icon type="user" /></div>
          </div>
        </div>
      </nav>

      {/* Page Header */}
      <div className="fpe-page-header">
        <div>
          <h1 className="fpe-page-title">{t('facilityProfile.pageTitle')}</h1>
          <p className="fpe-page-sub">{t('facilityProfile.pageSubtitle')}</p>
        </div>
        <div className="fpe-header-btns">
          {error   && <p style={{ color: '#e53e3e', fontSize: 13, marginRight: 12 }}>{error}</p>}
          {success && <p style={{ color: '#38a169', fontSize: 13, marginRight: 12 }}>{success}</p>}
          <button className="fpe-btn-discard" onClick={handleDiscard} disabled={saving || loading}>
            {t('facilityProfile.discard')}
          </button>
          <button className="fpe-btn-save" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : t('facilityProfile.saveChanges')}
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="fpe-main">

        {/* Sidebar */}
        <aside className="fpe-sidebar">
          <div className="fpe-sidebar-label">{t('facilityProfile.sidebar.account')}</div>
          {sidebarItems.map((item) => (
            <div key={item.key} className={`fpe-sidebar-item ${activeSection === item.key ? 'fpe-sidebar-item--active' : ''}`} onClick={() => handleSidebarClick(item.key)}>
              <Icon type={item.icon} />{item.label}
            </div>
          ))}
          <div className="fpe-sidebar-signout" onClick={() => logout()}>
            <Icon type="signout" />{t('facilityProfile.sidebar.signOut')}
          </div>
        </aside>

        {/* Content */}
        <div className="fpe-content">

          <div className="fpe-row-top">

            {/* Facility Identity */}
            <div ref={sectionRefs['facility-identity']} className="fpe-card fpe-card--identity">
              <div className="fpe-card-title"><Icon type="user" />{t('facilityProfile.identity.title')}</div>
              <div className="fpe-identity-grid">
                <div className="fpe-photo-box" onClick={() => profilePhotoInputRef.current.click()} style={{ cursor: 'pointer' }}>
                  {profilePhoto ? (
                    <img className="fpe-photo-preview" src={profilePhoto} alt="Facility profile" onError={(e) => { e.target.style.background = '#f3f4f6'; e.target.removeAttribute('src'); }} />
                  ) : (
                    <div className="fpe-photo-preview" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6', gap: '8px', color: '#bbb', fontSize: '12px', textAlign: 'center' }}>
                      <Icon type="camera" /><span>Click to upload</span>
                    </div>
                  )}
                  <p className="fpe-photo-hint">{t('facilityProfile.identity.photoHint')}</p>
                  <input ref={profilePhotoInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleProfilePhoto} />
                </div>
                <div className="fpe-form-col">
                  <div>
                    <label className="fpe-label">{t('facilityProfile.identity.daycareName')}</label>
                    <input className="fpe-input" value={facilityName} onChange={(e) => setFacilityName(e.target.value)} />
                  </div>
                  <div>
                    <label className="fpe-label">{t('facilityProfile.identity.tagline')}</label>
                    <input className="fpe-input" value={tagline} onChange={(e) => setTagline(e.target.value)} />
                  </div>
                  <div>
                    <label className="fpe-label">{t('facilityProfile.identity.shortBio')}</label>
                    <textarea className="fpe-input fpe-textarea" value={bio} onChange={(e) => setBio(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact & Location */}
            <div ref={sectionRefs['contact-location']} className="fpe-card fpe-card--contact">
              <div className="fpe-card-title"><Icon type="location" />{t('facilityProfile.contact.title')}</div>
              <div className="fpe-contact-field">
                <label className="fpe-label">{t('facilityProfile.contact.physicalAddress')}</label>
                <input className="fpe-input" value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <div className="fpe-contact-row-2">
                <div>
                  <label className="fpe-label">{t('facilityProfile.contact.phone')}</label>
                  <div className="fpe-phone-box">
                    <span className="fpe-phone-prefix">+213</span>
                    <input className="fpe-phone-inner" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="000 000 000" />
                  </div>
                </div>
                <div>
                  <label className="fpe-label">{t('facilityProfile.contact.email')}</label>
                  <input className="fpe-input" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          {/* Academy Details */}
          <div ref={sectionRefs['academy-details']} className="fpe-card">
            <div className="fpe-card-title"><Icon type="info" />{t('facilityProfile.academy.title')}</div>
            <div className="fpe-details-grid">
              <div>
                <label className="fpe-label">{t('facilityProfile.academy.ageRange')}</label>
                <div className="fpe-hours-times">
                  <input className="fpe-time-pill fpe-time-pill--input fpe-time-pill--wide" value={ageStart} onChange={(e) => setAgeStart(e.target.value)} placeholder="6 weeks" />
                  <span className="fpe-time-sep">—</span>
                  <input className="fpe-time-pill fpe-time-pill--input fpe-time-pill--wide" value={ageEnd} onChange={(e) => setAgeEnd(e.target.value)} placeholder="6 years" />
                </div>
              </div>
              <div>
                <label className="fpe-label">{t('facilityProfile.academy.capacity')}</label>
                <input className="fpe-input" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
              </div>
              <div className="fpe-col-span-2">
                <label className="fpe-label">{t('facilityProfile.academy.tuitionStructure')}</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input className="fpe-input" placeholder="e.g. 3000" value={tuitionMin} onChange={(e) => setTuitionMin(e.target.value)} />
                  <input className="fpe-input" placeholder="e.g. 5000" value={tuitionMax} onChange={(e) => setTuitionMax(e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          {/* Operating Hours + Services */}
          <div ref={sectionRefs['operating-hours']} className="fpe-card">
            <div className="fpe-card-title"><Icon type="clock" />{t('facilityProfile.hours.title')}</div>
            <div className="fpe-hours-row">
              <div className="fpe-hours-times">
                <input className="fpe-time-pill fpe-time-pill--input" value={dayStart} onChange={(e) => setDayStart(e.target.value)} placeholder="Mon" />
                <span className="fpe-time-sep">—</span>
                <input className="fpe-time-pill fpe-time-pill--input" value={dayEnd} onChange={(e) => setDayEnd(e.target.value)} placeholder="Fri" />
              </div>
              <div className="fpe-hours-times">
                <input className="fpe-time-pill fpe-time-pill--input" type="time" value={opensAt} onChange={(e) => setOpensAt(e.target.value)} />
                <span className="fpe-time-sep">—</span>
                <input className="fpe-time-pill fpe-time-pill--input" type="time" value={closesAt} onChange={(e) => setClosesAt(e.target.value)} />
              </div>
            </div>
            <div className="fpe-card-divider" />
            <div ref={sectionRefs['services']} className="fpe-services-grid fpe-services-grid--3col">
              <div>
                <div className="fpe-section-label">{t('facilityProfile.services.servicesTitle')}</div>
                <div className="fpe-toggle-row"><span className="fpe-toggle-label">{t('facilityProfile.services.transport')}</span><Toggle value={transport} onChange={setTransport} /></div>
                <div className="fpe-toggle-row"><span className="fpe-toggle-label">{t('facilityProfile.services.healthcare')}</span><Toggle value={healthcare} onChange={setHealthcare} /></div>
              </div>
              <div>
                <div className="fpe-section-label">{t('facilityProfile.services.foodTitle')}</div>
                <label className="fpe-checkbox-row"><input type="checkbox" checked={lunch} onChange={(e) => setLunch(e.target.checked)} className="fpe-cb" />{t('facilityProfile.services.lunch')}</label>
                <label className="fpe-checkbox-row"><input type="checkbox" checked={snacks} onChange={(e) => setSnacks(e.target.checked)} className="fpe-cb" />{t('facilityProfile.services.snacks')}</label>
              </div>
              <div>
                <div className="fpe-section-label">{t('daycare.activitiesOffered')}</div>
                <div className="fpe-activities-box">
                  {ACTIVITIES.map(({ key, label }) => (
                    <label key={key} className="fpe-checkbox-row">
                      <input type="checkbox" checked={activities.includes(key)} onChange={() => toggleActivity(key)} className="fpe-cb" />
                      {t(`daycare.${key}`) || label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Requests + Reviews */}
          <div className="fpe-row-bottom">
            <div ref={sectionRefs['manage-requests']} className="fpe-card">
              <div className="fpe-card-header-row">
                <div className="fpe-card-title" style={{ marginBottom: 0 }}><Icon type="mail" />{t('facilityProfile.requests.title')}</div>
                <button className="fpe-view-all" onClick={() => setShowAllRequests(true)}><Icon type="eye" /> {t('facilityProfile.requests.viewAll')}</button>
              </div>
              <table className="fpe-table">
                <thead><tr><th>{t('facilityProfile.requests.childParent')}</th><th>{t('facilityProfile.requests.status')}</th><th>{t('facilityProfile.requests.action')}</th></tr></thead>
                <tbody>
                  {requests.length === 0 ? (
                    <tr><td colSpan={3} style={{ textAlign: 'center', color: '#aaa', padding: '20px' }}>No requests yet.</td></tr>
                  ) : requests.slice(0, 3).map((r) => (
                    <tr key={r.id}>
                      <td><div className="fpe-child-name">{r.child}</div><div className="fpe-parent-sub">{r.parent}</div></td>
                      <td><span className={`fpe-status fpe-status--${r.status?.toLowerCase()}`}>● {r.status}</span></td>
                      <td className="fpe-actions-cell">
                        {r.status === 'Pending'
                          ? <button className="fpe-btn-approve" onClick={() => setRequests(prev => prev.map(req => req.id === r.id ? { ...req, status: 'Approved' } : req))}>{t('facilityProfile.reviews.approve')}</button>
                          : <span className="fpe-status fpe-status--approved">✓ {t('facilityProfile.requests.approved')}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div ref={sectionRefs['reviews-to-post']} className="fpe-card">
              <div className="fpe-card-header-row">
                <div className="fpe-card-title" style={{ marginBottom: 0 }}><Icon type="list" />{t('facilityProfile.reviews.title')}</div>
                <button className="fpe-view-all" onClick={() => setShowAllReviews(true)}><Icon type="eye" /> {t('facilityProfile.requests.viewAll')}</button>
              </div>
              <table className="fpe-table fpe-table--reviews">
                <thead><tr><th>{t('facilityProfile.reviews.parent')}</th><th>{t('facilityProfile.reviews.rating')}</th><th>{t('facilityProfile.reviews.quote')}</th><th>{t('facilityProfile.reviews.actions')}</th></tr></thead>
                <tbody>
                  {reviews.length === 0 ? (
                    <tr><td colSpan={4} style={{ textAlign: 'center', color: '#aaa', padding: '20px' }}>No reviews yet.</td></tr>
                  ) : reviews.slice(0, 3).map((rv) => (
                    <tr key={rv.id}>
                      <td><div className="fpe-child-name">{rv.parent}</div><div className="fpe-parent-sub">{rv.group}</div></td>
                      <td><Stars rating={rv.rating} /></td>
                      <td><span className="fpe-quote">{rv.quote}</span></td>
                      <td className="fpe-actions-cell">
                        <button className="fpe-btn-delete" onClick={() => setReviews(prev => prev.filter(r => r.id !== rv.id))}>🗑</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Gallery */}
          <div ref={sectionRefs['facility-gallery']} className="fpe-card">
            <div className="fpe-card-header-row">
              <div className="fpe-card-title" style={{ marginBottom: 0 }}><Icon type="grid" />{t('facilityProfile.gallery.title')}</div>
              <div className="fpe-gallery-header-right">
                <span className="fpe-gallery-count">{galleryImages.length} / 20 {t('facilityProfile.gallery.photosUploaded')}</span>
                <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleFileUpload} />
                <button className="fpe-upload-btn" onClick={() => fileInputRef.current.click()}>
                  <Icon type="upload" /> {t('facilityProfile.gallery.uploadPhotos')}
                </button>
              </div>
            </div>
            <div className="fpe-gallery-grid">
              {galleryImages.map((img, i) => (
                <div key={i} className="fpe-gallery-thumb">
                  <img src={img.url} alt={`Gallery ${i + 1}`} className="fpe-gallery-img"
                    onError={(e) => { e.target.style.background = '#f3f4f6'; e.target.removeAttribute('src'); }} />
                  <button className="fpe-gallery-delete" onClick={() => handleDeleteGalleryImage(i)} title="Delete photo">
                    <Icon type="trash" />
                  </button>
                </div>
              ))}
              <div className="fpe-gallery-add" onClick={() => fileInputRef.current.click()}>
                <Icon type="addphoto" /><span>{t('facilityProfile.gallery.addNew')}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Requests Modal */}
      {showAllRequests && (
        <div className="fpe-modal-backdrop" onClick={() => setShowAllRequests(false)}>
          <div className="fpe-modal" onClick={(e) => e.stopPropagation()}>
            <div className="fpe-modal-header">
              <span className="fpe-card-title"><Icon type="mail" /> All Requests</span>
              <button className="fpe-btn-discard" onClick={() => setShowAllRequests(false)}>✕ Close</button>
            </div>
            <table className="fpe-table">
              <thead><tr><th>Child &amp; Parent</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.id}>
                    <td><div className="fpe-child-name">{r.child}</div><div className="fpe-parent-sub">{r.parent}</div></td>
                    <td><span className={`fpe-status fpe-status--${r.status?.toLowerCase()}`}>● {r.status}</span></td>
                    <td>{r.status === 'Pending'
                      ? <button className="fpe-btn-approve" onClick={() => setRequests(prev => prev.map(req => req.id === r.id ? { ...req, status: 'Approved' } : req))}>Approve</button>
                      : <span className="fpe-status fpe-status--approved">✓ Approved</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reviews Modal */}
      {showAllReviews && (
        <div className="fpe-modal-backdrop" onClick={() => setShowAllReviews(false)}>
          <div className="fpe-modal" onClick={(e) => e.stopPropagation()}>
            <div className="fpe-modal-header">
              <span className="fpe-card-title"><Icon type="list" /> All Reviews</span>
              <button className="fpe-btn-discard" onClick={() => setShowAllReviews(false)}>✕ Close</button>
            </div>
            <table className="fpe-table fpe-table--reviews">
              <thead><tr><th>Parent</th><th>Rating</th><th>Quote</th><th>Actions</th></tr></thead>
              <tbody>
                {reviews.map((rv) => (
                  <tr key={rv.id}>
                    <td><div className="fpe-child-name">{rv.parent}</div><div className="fpe-parent-sub">{rv.group}</div></td>
                    <td><Stars rating={rv.rating} /></td>
                    <td><span className="fpe-quote">{rv.quote}</span></td>
                    <td><button className="fpe-btn-delete" onClick={() => setReviews(prev => prev.filter(r => r.id !== rv.id))}>🗑</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default FacilityProfileEditor;