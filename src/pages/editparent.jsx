import React, { useState } from 'react';

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
    alert('Profile saved successfully!');
  };

  const handleUpdatePassword = () => {
    if (form.newPassword.length < 8) {
      alert('Password must be at least 8 characters and include a symbol!');
      return;
    }
    alert('Password updated successfully!');
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
            <span className="pp-header-label">profile info</span>
          </div>
          <button className="pp-close" onClick={onClose}>✕</button>
        </div>

        {/* Title */}
        <div className="pp-title-row">
          <button className="pp-back" onClick={onClose}>‹</button>
          <h2 className="pp-title">My Enrollment Requests</h2>
        </div>

        {/* Profile Picture */}
        <div className="pp-section">
          <div className="pp-photo-row">
            <img src={photoUrl} alt="Profile" className="pp-avatar" />
            <div className="pp-photo-info">
              <h3 className="pp-photo-title">Profile Picture</h3>
              <p className="pp-photo-desc">Personalize your profile with a professional portrait.</p>
              <p className="pp-photo-hint">SUPPORTS JPG, PNG OR GIF • MAX 5MB</p>
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
                  Update Photo
                </button>
               <button className="pp-btn-ghost" onClick={() => setPhotoUrl('defaultAvatar')}>
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="pp-section">
          <div className="pp-section-header">
            <div>
              <h3 className="pp-section-title">Personal Information</h3>
              <p className="pp-section-sub">Manage your public profile information</p>
            </div>
            <div className="pp-section-actions">
              <button className="pp-discard" onClick={handleDiscard}>Discard Changes</button>
              <button className="pp-save" onClick={handleSave}>SAVE PROFILE</button>
            </div>
          </div>

          <div className="pp-fields-grid">
            <div className="pp-field">
              <label className="pp-label">FULL NAME</label>
              <div className="pp-input-row">
                <FiUser size={15} color="#9ca3af" />
                <input name="fullName" value={form.fullName} onChange={handleChange} className="pp-input" />
              </div>
            </div>

            <div className="pp-field">
              <label className="pp-label">EMAIL ADDRESS</label>
              <div className="pp-input-row">
                <FiMail size={15} color="#9ca3af" />
                <input name="email" value={form.email} onChange={handleChange} className="pp-input" />
              </div>
            </div>

            <div className="pp-field">
              <label className="pp-label">PHONE NUMBER</label>
              <div className="pp-input-row">
                <FiPhone size={15} color="#9ca3af" />
                <input name="phone" value={form.phone} onChange={handleChange} className="pp-input" />
              </div>
            </div>

            <div className="pp-field">
              <label className="pp-label">LOCATION</label>
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
              <h3 className="pp-section-title">Security & Password</h3>
              <p className="pp-section-sub">Update your password to keep your account secure</p>
            </div>
            <button className="pp-update-password" onClick={handleUpdatePassword}>UPDATE PASSWORD</button>
          </div>

          <div className="pp-password-grid">
            <div className="pp-field">
              <label className="pp-label">CURRENT PASSWORD</label>
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
              <label className="pp-label">NEW PASSWORD</label>
              <div className="pp-input-row">
                <FiLock size={15} color="#9ca3af" />
                <input
                  type={showNew ? 'text' : 'password'}
                  name="newPassword"
                  placeholder="New Password"
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
              <label className="pp-label">CONFIRM NEW PASSWORD</label>
              <div className="pp-input-row">
                <FiLock size={15} color="#9ca3af" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm Password"
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
            <span>PASSWORD MUST BE AT LEAST 8 CHARACTERS AND INCLUDE A SYMBOL.</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EditParent;