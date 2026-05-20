import React, { useState } from 'react';
import { useTranslation } from 'react-i18next'; // ✅
import { MdOutlineAssignment } from 'react-icons/md';
import { FiUser, FiMail, FiPhone, FiMap, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import './editparent.css';
import defaultAvatar from '/editparent.png';

const originalForm = {
  fullName: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+21376756468',
  location: 'San Francisco, CA',
  currentPassword: '........',
  newPassword: '',
  confirmPassword: '',
};

const EditParent = ({ onClose }) => {
  const { t } = useTranslation(); // ✅
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState(originalForm);
  const [photoUrl, setPhotoUrl] = useState(defaultAvatar);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDiscard = () => {
    setForm(originalForm);
  };

  const handleSave = () => {
    alert(t('editProfile.savedAlert'));
  };

  const handleUpdatePassword = () => {
    if (form.newPassword.length < 8) {
      alert(t('editProfile.passwordErrorAlert'));
      return;
    }
    alert(t('editProfile.passwordUpdatedAlert'));
  };

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

        {/* Profile Picture */}
        <div className="pp-section">
          <div className="pp-photo-row">
            <img src={photoUrl} alt="Profile" className="pp-avatar" />
            <div className="pp-photo-info">
              <h3 className="pp-photo-title">{t('editProfile.profilePicture')}</h3>
              <p className="pp-photo-desc">{t('editProfile.profilePictureDesc')}</p>
              <p className="pp-photo-hint">{t('editProfile.profilePictureHint')}</p>
              <div className="pp-photo-btns">
                <input
                  type="file"
                  id="photo-upload"
                  accept="image/jpg, image/png, image/gif"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) setPhotoUrl(URL.createObjectURL(file));
                  }}
                />
                <button className="pp-btn-dark" onClick={() => document.getElementById('photo-upload').click()}>
                  {t('editProfile.updatePhoto')}
                </button>
                <button className="pp-btn-ghost" onClick={() => setPhotoUrl(defaultAvatar)}>
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
              <button className="pp-discard" onClick={handleDiscard}>{t('editProfile.discardChanges')}</button>
              <button className="pp-save" onClick={handleSave}>{t('editProfile.saveProfile')}</button>
            </div>
          </div>

          <div className="pp-fields-grid">
            <div className="pp-field">
              <label className="pp-label">{t('editProfile.fullName')}</label>
              <div className="pp-input-row">
                <FiUser size={15} color="#9ca3af" />
                <input name="fullName" value={form.fullName} onChange={handleChange} className="pp-input" />
              </div>
            </div>

            <div className="pp-field">
              <label className="pp-label">{t('editProfile.emailAddress')}</label>
              <div className="pp-input-row">
                <FiMail size={15} color="#9ca3af" />
                <input name="email" value={form.email} onChange={handleChange} className="pp-input" />
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
                <input name="location" value={form.location} onChange={handleChange} className="pp-input" />
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
            <button className="pp-update-password" onClick={handleUpdatePassword}>
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
                  value={form.currentPassword}
                  onChange={handleChange}
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
                  value={form.newPassword}
                  onChange={handleChange}
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
                  value={form.confirmPassword}
                  onChange={handleChange}
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