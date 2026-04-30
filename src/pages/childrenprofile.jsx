import React, { useState } from 'react';
import { IoCloudUploadOutline } from "react-icons/io5";
import { FiX, FiUser, FiCalendar, FiEdit2 } from 'react-icons/fi';
import { LuClipboardList } from 'react-icons/lu';
import { PiGenderIntersex } from 'react-icons/pi';
import './childrenprofile.css';

const ChildrenProfile = ({ onClose, onBack }) => {
  const [portrait, setPortrait] = useState(null);
  const [form, setForm] = useState({
    fullName: '',
    dob: '',
    gender: '',
    medicalNotes: '',
  });

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) setPortrait(URL.createObjectURL(file));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.fullName || !form.dob || !form.gender) {
      alert('Please fill in all required fields.');
      return;
    }
    alert(`Child "${form.fullName}" added successfully!`);
    onBack();
  };

  return (
    <div className="mc-overlay" onClick={onClose}>
      <div className="mc-modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="mc-header">
          <div className="mc-header-left">
            <LuClipboardList size={14} color="#2d4a6e" />
            <span>profile info</span>
          </div>
          <button className="mc-close" onClick={onClose}><FiX /></button>
        </div>

        {/* Title */}
        <div className="mc-title-row">
          <button className="mc-back" onClick={onBack}>‹</button>
          <h2 className="mc-title">My Children</h2>
        </div>

        <div className="mc-body">

          {/* Portrait */}
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
                accept="image/jpg, image/png, image/gif"
                style={{ display: 'none' }}
                onChange={handlePhotoChange}
              />
            </div>
            <div className="mc-portrait-info">
              <p className="mc-portrait-title">Child's Portrait</p>
              <p className="mc-portrait-desc">High-resolution headshot recommended.</p>
              <p className="mc-portrait-desc">Accepted formats: JPG, PNG (Max 5MB)</p>
              <label htmlFor="child-photo" className="mc-upload-btn">
                <IoCloudUploadOutline size={14} /> Upload New Photo
              </label>
            </div>
          </div>

          {/* Full Name */}
          <div className="mc-field">
            <label className="mc-label">CHILD'S FULL LEGAL NAME</label>
            <div className="mc-input-row">
              <FiUser size={14} color="#2d4a6e" />
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Enter full name as per identity documents"
                className="mc-input"
              />
            </div>
          </div>

          {/* DOB + Gender */}
          <div className="mc-row-two">
            <div className="mc-field">
              <label className="mc-label">DATE OF BIRTH</label>
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
              <label className="mc-label">GENDER</label>
              <div className="mc-input-row">
                <PiGenderIntersex size={14} color="#2d4a6e" />
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="mc-input mc-select"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>
          </div>

          {/* Medical Notes */}
          <div className="mc-field">
            <label className="mc-label">MEDICAL NOTES / ALLERGIES</label>
            <textarea
              name="medicalNotes"
              value={form.medicalNotes}
              onChange={handleChange}
              placeholder="Enter any critical health information, dietary restrictions, or known allergies..."
              className="mc-textarea"
              rows={4}
            />
          </div>

          {/* Actions */}
          <div className="mc-actions">
            <button className="mc-cancel" onClick={onBack}>Cancel</button>
            <button className="mc-submit" onClick={handleSubmit}>
              <FiUser size={13} /> Add Child to Program
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ChildrenProfile;