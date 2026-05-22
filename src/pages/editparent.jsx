// import React, { useState } from 'react';
// import { useTranslation } from 'react-i18next'; // ✅
// import { MdOutlineAssignment } from 'react-icons/md';
// import { FiUser, FiMail, FiPhone, FiMap, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
// import './editparent.css';
// import defaultAvatar from '/editparent.png';

// const originalForm = {
//   fullName: 'John Doe',
//   email: 'john.doe@example.com',
//   phone: '+21376756468',
//   location: 'San Francisco, CA',
//   currentPassword: '........',
//   newPassword: '',
//   confirmPassword: '',
// };

// const EditParent = ({ onClose }) => {
//   const { t } = useTranslation(); // ✅
//   const [showCurrent, setShowCurrent] = useState(false);
//   const [showNew, setShowNew] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [form, setForm] = useState(originalForm);
//   const [photoUrl, setPhotoUrl] = useState(defaultAvatar);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleDiscard = () => {
//     setForm(originalForm);
//   };

//   const handleSave = () => {
//     alert(t('editProfile.savedAlert'));
//   };

//   const handleUpdatePassword = () => {
//     if (form.newPassword.length < 8) {
//       alert(t('editProfile.passwordErrorAlert'));
//       return;
//     }
//     alert(t('editProfile.passwordUpdatedAlert'));
//   };

//   return (
//     <div className="pp-overlay">
//       <div className="pp-box">

//         {/* Header */}
//         <div className="pp-header">
//           <div className="pp-header-left">
//             <div className="pp-header-icon">
//               <MdOutlineAssignment size={16} color="#4f6d8f" />
//             </div>
//             <span className="pp-header-label">{t('editProfile.title')}</span>
//           </div>
//           <button className="pp-close" onClick={onClose}>✕</button>
//         </div>

//         {/* Title */}
//         <div className="pp-title-row">
//           <button className="pp-back" onClick={onClose}>‹</button>
//           <h2 className="pp-title">{t('editProfile.backTitle')}</h2>
//         </div>

//         {/* Profile Picture */}
//         <div className="pp-section">
//           <div className="pp-photo-row">
//             <img src={photoUrl} alt="Profile" className="pp-avatar" />
//             <div className="pp-photo-info">
//               <h3 className="pp-photo-title">{t('editProfile.profilePicture')}</h3>
//               <p className="pp-photo-desc">{t('editProfile.profilePictureDesc')}</p>
//               <p className="pp-photo-hint">{t('editProfile.profilePictureHint')}</p>
//               <div className="pp-photo-btns">
//                 <input
//                   type="file"
//                   id="photo-upload"
//                   accept="image/jpg, image/png, image/gif"
//                   style={{ display: 'none' }}
//                   onChange={(e) => {
//                     const file = e.target.files[0];
//                     if (file) setPhotoUrl(URL.createObjectURL(file));
//                   }}
//                 />
//                 <button className="pp-btn-dark" onClick={() => document.getElementById('photo-upload').click()}>
//                   {t('editProfile.updatePhoto')}
//                 </button>
//                 <button className="pp-btn-ghost" onClick={() => setPhotoUrl(defaultAvatar)}>
//                   {t('editProfile.remove')}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Personal Information */}
//         <div className="pp-section">
//           <div className="pp-section-header">
//             <div>
//               <h3 className="pp-section-title">{t('editProfile.personalInfo')}</h3>
//               <p className="pp-section-sub">{t('editProfile.personalInfoSub')}</p>
//             </div>
//             <div className="pp-section-actions">
//               <button className="pp-discard" onClick={handleDiscard}>{t('editProfile.discardChanges')}</button>
//               <button className="pp-save" onClick={handleSave}>{t('editProfile.saveProfile')}</button>
//             </div>
//           </div>

//           <div className="pp-fields-grid">
//             <div className="pp-field">
//               <label className="pp-label">{t('editProfile.fullName')}</label>
//               <div className="pp-input-row">
//                 <FiUser size={15} color="#9ca3af" />
//                 <input name="fullName" value={form.fullName} onChange={handleChange} className="pp-input" />
//               </div>
//             </div>

//             <div className="pp-field">
//               <label className="pp-label">{t('editProfile.emailAddress')}</label>
//               <div className="pp-input-row">
//                 <FiMail size={15} color="#9ca3af" />
//                 <input name="email" value={form.email} onChange={handleChange} className="pp-input" />
//               </div>
//             </div>

//             <div className="pp-field">
//               <label className="pp-label">{t('editProfile.phoneNumber')}</label>
//               <div className="pp-input-row">
//                 <FiPhone size={15} color="#9ca3af" />
//                 <input name="phone" value={form.phone} onChange={handleChange} className="pp-input" />
//               </div>
//             </div>

//             <div className="pp-field">
//               <label className="pp-label">{t('editProfile.location')}</label>
//               <div className="pp-input-row">
//                 <FiMap size={15} color="#9ca3af" />
//                 <input name="location" value={form.location} onChange={handleChange} className="pp-input" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Security & Password */}
//         <div className="pp-section">
//           <div className="pp-section-header">
//             <div>
//               <h3 className="pp-section-title">{t('editProfile.security')}</h3>
//               <p className="pp-section-sub">{t('editProfile.securitySub')}</p>
//             </div>
//             <button className="pp-update-password" onClick={handleUpdatePassword}>
//               {t('editProfile.updatePassword')}
//             </button>
//           </div>

//           <div className="pp-password-grid">
//             <div className="pp-field">
//               <label className="pp-label">{t('editProfile.currentPassword')}</label>
//               <div className="pp-input-row">
//                 <FiLock size={15} color="#9ca3af" />
//                 <input
//                   type={showCurrent ? 'text' : 'password'}
//                   name="currentPassword"
//                   value={form.currentPassword}
//                   onChange={handleChange}
//                   className="pp-input"
//                 />
//                 <button className="pp-eye" onClick={() => setShowCurrent(!showCurrent)}>
//                   {showCurrent ? <FiEyeOff size={14} /> : <FiEye size={14} />}
//                 </button>
//               </div>
//             </div>

//             <div className="pp-field">
//               <label className="pp-label">{t('editProfile.newPassword')}</label>
//               <div className="pp-input-row">
//                 <FiLock size={15} color="#9ca3af" />
//                 <input
//                   type={showNew ? 'text' : 'password'}
//                   name="newPassword"
//                   placeholder={t('editProfile.newPasswordPlaceholder')}
//                   value={form.newPassword}
//                   onChange={handleChange}
//                   className="pp-input"
//                 />
//                 <button className="pp-eye" onClick={() => setShowNew(!showNew)}>
//                   {showNew ? <FiEyeOff size={14} /> : <FiEye size={14} />}
//                 </button>
//               </div>
//             </div>

//             <div className="pp-field">
//               <label className="pp-label">{t('editProfile.confirmPassword')}</label>
//               <div className="pp-input-row">
//                 <FiLock size={15} color="#9ca3af" />
//                 <input
//                   type={showConfirm ? 'text' : 'password'}
//                   name="confirmPassword"
//                   placeholder={t('editProfile.confirmPasswordPlaceholder')}
//                   value={form.confirmPassword}
//                   onChange={handleChange}
//                   className="pp-input"
//                 />
//                 <button className="pp-eye" onClick={() => setShowConfirm(!showConfirm)}>
//                   {showConfirm ? <FiEyeOff size={14} /> : <FiEye size={14} />}
//                 </button>
//               </div>
//             </div>
//           </div>

//           <div className="pp-warning">
//             <span>⚠️</span>
//             <span>{t('editProfile.warning')}</span>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default EditParent;
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdOutlineAssignment } from 'react-icons/md';
import { FiUser, FiPhone, FiMap, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import './editparent.css';
import defaultAvatar from '/editparent.png';
import { getUser, updateProfile } from '../api/auth';

const BASE_URL = import.meta.env.VITE_API_URL;

const getImageUrl = (img) => {
  if (!img) return null;
  if (img.startsWith('http')) return img;
  return `${BASE_URL}/${img}`;
};

const EditParent = ({ onClose, onSaved }) => {
  const { t } = useTranslation();

  // ── Read real user from localStorage on mount ──────────────────────────────
  const rawUser = getUser();

  const [form, setForm] = useState({
    first_name: rawUser?.first_name || rawUser?.name?.split(' ')[0] || '',
    last_name:  rawUser?.last_name  || rawUser?.name?.split(' ').slice(1).join(' ') || '',
    phone:      rawUser?.phone      || '',
    city:       rawUser?.city       || rawUser?.location || '',
  });

  const [photoUrl, setPhotoUrl] = useState(
    getImageUrl(rawUser?.profile_image) || defaultAvatar
  );
  const [photoFile, setPhotoFile] = useState(null);

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew,     setShowNew]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoUrl(URL.createObjectURL(file));
    }
  };

  const handleDiscard = () => {
    setForm({
      first_name: rawUser?.first_name || rawUser?.name?.split(' ')[0] || '',
      last_name:  rawUser?.last_name  || rawUser?.name?.split(' ').slice(1).join(' ') || '',
      phone:      rawUser?.phone      || '',
      city:       rawUser?.city       || rawUser?.location || '',
    });
    setPhotoUrl(getImageUrl(rawUser?.profile_image) || defaultAvatar);
    setPhotoFile(null);
    setError('');
    setSuccess('');
  };

  // ── Save profile ────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      // Build FormData so we can send a photo file if selected
      const payload = new FormData();
      payload.append('first_name', form.first_name);
      payload.append('last_name',  form.last_name);
      payload.append('phone',      form.phone);
      payload.append('city',       form.city);
      if (photoFile) payload.append('profile_image', photoFile);

      await updateProfile(payload);

      // ── Update localStorage with the new values so profile reads them fresh ──
      const updatedUser = {
        ...rawUser,
        first_name:    form.first_name,
        last_name:     form.last_name,
        name:          `${form.first_name} ${form.last_name}`.trim(),
        phone:         form.phone,
        city:          form.city,
        profile_image: photoFile ? photoUrl : rawUser?.profile_image,
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setSuccess(t('editProfile.savedAlert'));

      // ── Tell ParentProfile to re-read updated user ──────────────────────────
      if (onSaved) onSaved(updatedUser);

    } catch (err) {
      setError(err?.response?.data?.message || t('editProfile.saveError') || 'Save failed. Try again.');
    } finally {
      setSaving(false);
    }
  };

  // ── Update password ────────────────────────────────────────────────────────
  const handleUpdatePassword = async () => {
    setError('');
    setSuccess('');

    if (!passwords.currentPassword) {
      setError(t('editProfile.currentPasswordRequired') || 'Enter your current password.');
      return;
    }
    if (passwords.newPassword.length < 8) {
      setError(t('editProfile.passwordErrorAlert'));
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError(t('editProfile.passwordMismatch') || 'Passwords do not match.');
      return;
    }

    setSaving(true);
    try {
      await updateProfile({
        current_password: passwords.currentPassword,
        new_password:     passwords.newPassword,
      });
      setSuccess(t('editProfile.passwordUpdatedAlert'));
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err?.response?.data?.message || 'Password update failed.');
    } finally {
      setSaving(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="pp-overlay">
      <div className="pp-box">

        {/* Header */}
        <div className="pp-header">
          <div className="pp-header-left">
            <div className="pp-header-icon">
              <MdOutlineAssignment size={16} color="#4f6d8f" />
            </div>
            <span className="pp-header-label">{t('editProfile.title')}</span>
          </div>
          <button className="pp-close" onClick={onClose}>✕</button>
        </div>

        {/* Title */}
        <div className="pp-title-row">
          <button className="pp-back" onClick={onClose}>‹</button>
          <h2 className="pp-title">{t('editProfile.backTitle')}</h2>
        </div>

        {/* Feedback messages */}
        {error   && <p style={{ color: '#e53e3e', padding: '0 24px 8px', fontSize: 13 }}>{error}</p>}
        {success && <p style={{ color: '#38a169', padding: '0 24px 8px', fontSize: 13 }}>{success}</p>}

        {/* Profile Picture */}
        <div className="pp-section">
          <div className="pp-photo-row">
            <img src={photoUrl} alt="Profile" className="pp-avatar"
              onError={(e) => { e.target.src = defaultAvatar; }} />
            <div className="pp-photo-info">
              <h3 className="pp-photo-title">{t('editProfile.profilePicture')}</h3>
              <p className="pp-photo-desc">{t('editProfile.profilePictureDesc')}</p>
              <p className="pp-photo-hint">{t('editProfile.profilePictureHint')}</p>
              <div className="pp-photo-btns">
                <input
                  type="file"
                  id="photo-upload"
                  accept="image/jpg,image/png,image/gif"
                  style={{ display: 'none' }}
                  onChange={handlePhotoChange}
                />
                <button className="pp-btn-dark" onClick={() => document.getElementById('photo-upload').click()}>
                  {t('editProfile.updatePhoto')}
                </button>
                <button className="pp-btn-ghost" onClick={() => {
                  setPhotoUrl(defaultAvatar);
                  setPhotoFile(null);
                }}>
                  {t('editProfile.remove')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="pp-section">
          <div className="pp-section-header">
            <div>
              <h3 className="pp-section-title">{t('editProfile.personalInfo')}</h3>
              <p className="pp-section-sub">{t('editProfile.personalInfoSub')}</p>
            </div>
            <div className="pp-section-actions">
              <button className="pp-discard" onClick={handleDiscard} disabled={saving}>
                {t('editProfile.discardChanges')}
              </button>
              <button className="pp-save" onClick={handleSave} disabled={saving}>
                {saving ? '…' : t('editProfile.saveProfile')}
              </button>
            </div>
          </div>

          <div className="pp-fields-grid">
            <div className="pp-field">
              <label className="pp-label">{t('editProfile.firstName') || 'First Name'}</label>
              <div className="pp-input-row">
                <FiUser size={15} color="#9ca3af" />
                <input name="first_name" value={form.first_name} onChange={handleChange} className="pp-input" />
              </div>
            </div>

            <div className="pp-field">
              <label className="pp-label">{t('editProfile.lastName') || 'Last Name'}</label>
              <div className="pp-input-row">
                <FiUser size={15} color="#9ca3af" />
                <input name="last_name" value={form.last_name} onChange={handleChange} className="pp-input" />
              </div>
            </div>

            <div className="pp-field">
              <label className="pp-label">{t('editProfile.phoneNumber')}</label>
              <div className="pp-input-row">
                <FiPhone size={15} color="#9ca3af" />
                <input name="phone" value={form.phone} onChange={handleChange} className="pp-input" />
              </div>
            </div>

            <div className="pp-field">
              <label className="pp-label">{t('editProfile.location')}</label>
              <div className="pp-input-row">
                <FiMap size={15} color="#9ca3af" />
                <input name="city" value={form.city} onChange={handleChange} className="pp-input" />
              </div>
            </div>
          </div>
        </div>

        {/* Security & Password */}
        <div className="pp-section">
          <div className="pp-section-header">
            <div>
              <h3 className="pp-section-title">{t('editProfile.security')}</h3>
              <p className="pp-section-sub">{t('editProfile.securitySub')}</p>
            </div>
            <button className="pp-update-password" onClick={handleUpdatePassword} disabled={saving}>
              {t('editProfile.updatePassword')}
            </button>
          </div>

          <div className="pp-password-grid">
            <div className="pp-field">
              <label className="pp-label">{t('editProfile.currentPassword')}</label>
              <div className="pp-input-row">
                <FiLock size={15} color="#9ca3af" />
                <input
                  type={showCurrent ? 'text' : 'password'}
                  name="currentPassword"
                  value={passwords.currentPassword}
                  onChange={handlePasswordChange}
                  className="pp-input"
                />
                <button className="pp-eye" onClick={() => setShowCurrent(!showCurrent)}>
                  {showCurrent ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
              </div>
            </div>

            <div className="pp-field">
              <label className="pp-label">{t('editProfile.newPassword')}</label>
              <div className="pp-input-row">
                <FiLock size={15} color="#9ca3af" />
                <input
                  type={showNew ? 'text' : 'password'}
                  name="newPassword"
                  placeholder={t('editProfile.newPasswordPlaceholder')}
                  value={passwords.newPassword}
                  onChange={handlePasswordChange}
                  className="pp-input"
                />
                <button className="pp-eye" onClick={() => setShowNew(!showNew)}>
                  {showNew ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
              </div>
            </div>

            <div className="pp-field">
              <label className="pp-label">{t('editProfile.confirmPassword')}</label>
              <div className="pp-input-row">
                <FiLock size={15} color="#9ca3af" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder={t('editProfile.confirmPasswordPlaceholder')}
                  value={passwords.confirmPassword}
                  onChange={handlePasswordChange}
                  className="pp-input"
                />
                <button className="pp-eye" onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
              </div>
            </div>
          </div>

          <div className="pp-warning">
            <span>⚠️</span>
            <span>{t('editProfile.warning')}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EditParent;