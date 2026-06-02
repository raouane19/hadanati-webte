import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MdOutlineAssignment } from 'react-icons/md';
import { FiUser, FiPhone, FiMap, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import './editparent.css';
import defaultAvatar from '/editparent.png';
import { getUser, updateProfile } from '../api/auth';
import API from '../api/auth'; // ✅ for change-password route

const BASE_URL = import.meta.env.VITE_API_URL;

const resolveProfileImage = (u) =>
  u?.profile_image || u?.Profile_image || u?.profileImage || u?.image || null;

const buildImagePath = (img) => {
  if (!img) return null;
  if (img.startsWith('blob:') || img.startsWith('http')) return img;
  if (img.startsWith('/uploads/')) return `${BASE_URL}${img}`;
  return `${BASE_URL}/uploads/${img}`;
};

const fetchImageAsBlob = async (url) => {
  if (!url) return null;
  if (url.startsWith('blob:')) return url;
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

const EditParent = ({ onClose, onSaved }) => {
  const { t } = useTranslation();
  const rawUser = getUser();

  const [form, setForm] = useState({
    first_name: rawUser?.first_name || rawUser?.name?.split(' ')[0] || '',
    last_name:  rawUser?.last_name  || rawUser?.name?.split(' ').slice(1).join(' ') || '',
    phone:      rawUser?.phone      || '',
    city:       rawUser?.city       || rawUser?.location || '',
  });

  const [photoUrl,  setPhotoUrl]  = useState(defaultAvatar);
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

  useEffect(() => {
    const imgPath = resolveProfileImage(rawUser);
    const url = buildImagePath(imgPath);
    if (!url) return;
    fetchImageAsBlob(url).then((blob) => {
      if (blob) setPhotoUrl(blob);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) => setPasswords({ ...passwords, [e.target.name]: e.target.value });

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
    const imgPath = resolveProfileImage(rawUser);
    const url = buildImagePath(imgPath);
    if (url) {
      fetchImageAsBlob(url).then((blob) => setPhotoUrl(blob || defaultAvatar));
    } else {
      setPhotoUrl(defaultAvatar);
    }
    setPhotoFile(null);
    setError('');
    setSuccess('');
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const payload = new FormData();
      if (form.first_name.trim()) payload.append('first_name', form.first_name.trim());
      if (form.last_name.trim())  payload.append('last_name',  form.last_name.trim());
      if (form.phone.trim())      payload.append('phone',      form.phone.trim());
      if (form.city.trim())       payload.append('city',       form.city.trim());
      if (photoFile)              payload.append('profileImage', photoFile);

      const res = await updateProfile(payload);

      const returnedImage =
        res?.data?.profile_image || res?.data?.Profile_image || res?.data?.profileImage;
      let savedImagePath = resolveProfileImage(rawUser);
      if (returnedImage) {
        savedImagePath = returnedImage.startsWith('/uploads/')
          ? returnedImage
          : `/uploads/${returnedImage}`;
      }

      const updatedUser = {
        ...rawUser,
        first_name:    form.first_name.trim(),
        last_name:     form.last_name.trim(),
        name:          `${form.first_name} ${form.last_name}`.trim(),
        phone:         form.phone.trim(),
        city:          form.city.trim(),
        location:      form.city.trim(),
        profile_image: savedImagePath,
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      let newAvatarUrl = photoUrl;
      if (!photoFile) {
        const fetched = await fetchImageAsBlob(buildImagePath(savedImagePath));
        newAvatarUrl = fetched || defaultAvatar;
      }

      setSuccess(t('editProfile.savedAlert'));
      if (onSaved) onSaved({ ...updatedUser, blobAvatar: newAvatarUrl });

    } catch (err) {
      setError(err?.response?.data?.message || t('editProfile.saveError') || 'Save failed. Try again.');
    } finally {
      setSaving(false);
    }
  };

  // ✅ FIXED: now calls the correct route with correct field names
  const handleUpdatePassword = async () => {
    setError('');
    setSuccess('');

    if (!passwords.currentPassword) {
      setError(t('editProfile.currentPasswordRequired') || 'Enter your current password.');
      return;
    }
    if (passwords.newPassword.length < 4) {
      setError(t('editProfile.passwordErrorAlert') || 'Password must be at least 4 characters.');
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError(t('editProfile.passwordMismatch') || 'Passwords do not match.');
      return;
    }

    setSaving(true);
    try {
      // ✅ Correct route: PUT /parents/change-password
      // ✅ Correct field names: oldPassword / newPassword
      await API.put('/parents/change-password', {
        oldPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });

      setSuccess(t('editProfile.passwordUpdatedAlert') || 'Password updated successfully!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err?.response?.data?.message || 'Password update failed. Check your current password.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pp-overlay">
      <div className="pp-box">

        <div className="pp-header">
          <div className="pp-header-left">
            <div className="pp-header-icon">
              <MdOutlineAssignment size={16} color="#4f6d8f" />
            </div>
            <span className="pp-header-label">{t('editProfile.title')}</span>
          </div>
          <button className="pp-close" onClick={onClose}>✕</button>
        </div>

        <div className="pp-title-row">
          <button className="pp-back" onClick={onClose}>‹</button>
          <h2 className="pp-title">{t('editProfile.backTitle')}</h2>
        </div>

        {error   && <p style={{ color: '#e53e3e', padding: '0 24px 8px', fontSize: 13 }}>{error}</p>}
        {success && <p style={{ color: '#38a169', padding: '0 24px 8px', fontSize: 13 }}>{success}</p>}

        <div className="pp-section">
          <div className="pp-photo-row">
            <img
              key={photoUrl}
              src={photoUrl}
              alt="Profile"
              className="pp-avatar"
              onError={(e) => { e.target.src = defaultAvatar; }}
            />
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
                <button className="pp-btn-dark"
                  onClick={() => document.getElementById('photo-upload').click()}>
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

        <div className="pp-section">
          <div className="pp-section-header">
            <div>
              <h3 className="pp-section-title">{t('editProfile.security')}</h3>
              <p className="pp-section-sub">{t('editProfile.securitySub')}</p>
            </div>
            <button className="pp-update-password" onClick={handleUpdatePassword} disabled={saving}>
              {saving ? '…' : t('editProfile.updatePassword')}
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