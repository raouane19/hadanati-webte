import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoCloudUploadOutline } from "react-icons/io5";
import { FiX, FiUser, FiCalendar, FiEdit2 } from 'react-icons/fi';
import { LuClipboardList } from 'react-icons/lu';
import { PiGenderIntersex } from 'react-icons/pi';
import './childrenprofile.css';

const ChildrenProfile = ({ onClose, onBack, onSave, initialData }) => {
  const { t } = useTranslation();
  const isEditing = !!initialData;

  // portrait is only for local preview — the actual File object is sent to backend
  const [portrait, setPortrait]   = useState(initialData?.profile_image_url || null);
  const [photoFile, setPhotoFile] = useState(null); // the actual File to upload

  const [form, setForm] = useState({
    fullName:     initialData?.name  || '',
    dob:          initialData?.birth_date?.slice(0, 10) || '',
    gender:       initialData?.gender?.toLowerCase() || '',
    medicalNotes: initialData?.medical_issues || '',
  });

  // Show preview immediately, keep File object for FormData upload
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPortrait(reader.result); // base64 just for preview
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (!form.fullName || !form.dob || !form.gender) {
      alert(t('childrenProfile.requiredAlert'));
      return;
    }

    // Build FormData — required because backend uses multer (req.file)
    const formData = new FormData();
    formData.append('name',           form.fullName);
    formData.append('birth_date',     form.dob);
    formData.append('gender',         form.gender.charAt(0).toUpperCase() + form.gender.slice(1));
    formData.append('medical_issues', form.medicalNotes || '');
    if (photoFile) {
      formData.append('childImage', photoFile); // matches upload.single("childImage") in upload.js
    }

    // Also pass meta needed by MyChildren for optimistic UI update
    const meta = {
      id:            initialData?.id || null,
      previewUrl:    portrait,        // base64 preview to show immediately
      birth_date:    form.dob,
    };

    if (onSave) onSave(formData, meta);
    else onBack();
  };

  return (
    <div className="mc-overlay" onClick={onClose}>
      <div className="mc-modal" onClick={e => e.stopPropagation()}>

        <div className="mc-header">
          <div className="mc-header-left">
            <LuClipboardList size={14} color="#2d4a6e" />
            <span>{t('childrenProfile.title')}</span>
          </div>
          <button className="mc-close" onClick={onClose}><FiX /></button>
        </div>

        <div className="mc-title-row">
          <button className="mc-back" onClick={onBack}>‹</button>
          <h2 className="mc-title">
            {isEditing
              ? t('childrenProfile.editTitle', { name: initialData.name })
              : t('childrenProfile.addTitle')
            }
          </h2>
        </div>

        <div className="mc-body">

          <div className="mc-portrait-row">
            <div className="mc-portrait-wrap">
              {portrait ? (
                <img src={portrait} alt="Child" className="mc-portrait-img" />
              ) : (
                <div className="mc-portrait-placeholder">
                  <IoCloudUploadOutline size={38} color="#ffffff" />
                </div>
              )}
              <label className="mc-portrait-edit" htmlFor="child-photo">
                <FiEdit2 size={10} />
              </label>
              <input
                type="file"
                id="child-photo"
                accept="image/jpg,image/jpeg,image/png,image/gif"
                style={{ display: 'none' }}
                onChange={handlePhotoChange}
              />
            </div>
            <div className="mc-portrait-info">
              <p className="mc-portrait-title">{t('childrenProfile.portrait')}</p>
              <p className="mc-portrait-desc">{t('childrenProfile.portraitDesc')}</p>
              <p className="mc-portrait-desc">{t('childrenProfile.portraitFormats')}</p>
              <label htmlFor="child-photo" className="mc-upload-btn">
                <IoCloudUploadOutline size={14} /> {t('childrenProfile.uploadPhoto')}
              </label>
            </div>
          </div>

          <div className="mc-field">
            <label className="mc-label">{t('childrenProfile.fullName')}</label>
            <div className="mc-input-row">
              <FiUser size={14} color="#2d4a6e" />
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder={t('childrenProfile.fullNamePlaceholder')}
                className="mc-input"
              />
            </div>
          </div>

          <div className="mc-row-two">
            <div className="mc-field">
              <label className="mc-label">{t('childrenProfile.dob')}</label>
              <div className="mc-input-row">
                <FiCalendar size={14} color="#2d4a6e" />
                <input
                  type="date"
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                  className="mc-input"
                />
              </div>
            </div>

            <div className="mc-field">
              <label className="mc-label">{t('childrenProfile.gender')}</label>
              <div className="mc-input-row">
                <PiGenderIntersex size={14} color="#2d4a6e" />
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="mc-input mc-select"
                >
                  <option value="">{t('childrenProfile.selectGender')}</option>
                  <option value="male">{t('childrenProfile.male')}</option>
                  <option value="female">{t('childrenProfile.female')}</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mc-field">
            <label className="mc-label">{t('childrenProfile.medicalNotes')}</label>
            <textarea
              name="medicalNotes"
              value={form.medicalNotes}
              onChange={handleChange}
              placeholder={t('childrenProfile.medicalPlaceholder')}
              className="mc-textarea"
              rows={4}
            />
          </div>

          <div className="mc-actions">
            <button className="mc-cancel" onClick={onBack}>
              {t('childrenProfile.cancel')}
            </button>
            <button className="mc-submit" onClick={handleSubmit}>
              <FiUser size={13} />
              {isEditing
                ? t('childrenProfile.saveChanges')
                : t('childrenProfile.addChild')
              }
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ChildrenProfile;