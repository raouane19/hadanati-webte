import React, { useState } from 'react';
import { useTranslation } from 'react-i18next'; // ✅
import './MyChildren.css';
import { FiEdit2, FiAlertTriangle, FiX } from 'react-icons/fi';
import { LuClipboardList } from 'react-icons/lu';
import { MdOutlineLocalHospital } from 'react-icons/md';
import { HiOutlineUserAdd } from 'react-icons/hi';
import { FiChevronLeft } from "react-icons/fi";
import ChildrenProfile from './childrenprofile';

const MyChildren = ({ onClose, onBack }) => {
  const { t } = useTranslation(); // ✅

  const [children, setChildren] = useState([
    { id: 1, name: "Leo", age: 8, gender: "Male", medical: "None Disclosed", hasAlert: false },
    { id: 2, name: "Sarah", age: 5, gender: "Female", medical: "Peanut Allergy", hasAlert: true }
  ]);
  const [showAddChild, setShowAddChild] = useState(false);
  const [editingChild, setEditingChild] = useState(null);

  const handleSaveChild = (updatedChild) => {
    if (updatedChild.id) {
      setChildren(prev => prev.map(c => c.id === updatedChild.id ? updatedChild : c));
    } else {
      setChildren(prev => [...prev, { ...updatedChild, id: Date.now() }]);
    }
    setEditingChild(null);
    setShowAddChild(false);
  };

  return (
    <div className="profile-overlay" onClick={onClose}>
      <div className="children-modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="profile-header">
          <div className="profile-header-title">
            <LuClipboardList className="profile-header-icon" />
            <span>{t('children.title')}</span> {/* ✅ */}
          </div>
          <button className="profile-close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        {/* Content */}
        <div className="children-content">

          {/* Back + Title */}
          <div className="children-title">
            <button className="back-btn" onClick={onBack}>
              <FiChevronLeft size={28} />
            </button>
            <h2>{t('children.pageTitle')}</h2> {/* ✅ */}
          </div>

          {/* Children list */}
          <div className="children-list">
            {children.map(child => (
              <div key={child.id} className="child-card">
                <div className="child-avatar">
                  <img src={child.photo || null} alt={child.name} />
                </div>
                <div className="child-card-info">
                  <h3 className="child-card-name">{child.name}</h3>
                  <p className="child-card-details">
                    {t('children.age')}: {child.age} · {child.gender} {/* ✅ */}
                  </p>
                  <div className={`child-medical ${child.hasAlert ? 'alert' : 'none'}`}>
                    {child.hasAlert
                      ? <FiAlertTriangle size={13} />
                      : <MdOutlineLocalHospital size={13} />
                    }
                    <span>
                      {t('children.medical')}: <span className="medical-value">{child.medical}</span> {/* ✅ */}
                    </span>
                  </div>
                  <button className="edit-profile-btn" onClick={() => setEditingChild(child)}>
                    <FiEdit2 size={12} /> {t('children.editProfile')} {/* ✅ */}
                  </button>
                </div>
              </div>
            ))}

            {/* Add child card */}
            <div className="add-child-card" onClick={() => setShowAddChild(true)}>
              <HiOutlineUserAdd size={28} className="add-child-icon" />
              <p>{t('children.addChild')}</p> {/* ✅ */}
            </div>
          </div>

        </div>
      </div>

      {editingChild && (
        <ChildrenProfile
          onClose={() => setEditingChild(null)}
          onBack={() => setEditingChild(null)}
          onSave={handleSaveChild}
          initialData={editingChild}
        />
      )}

      {showAddChild && (
        <ChildrenProfile
          onClose={() => setShowAddChild(false)}
          onBack={() => setShowAddChild(false)}
          onSave={handleSaveChild}
        />
      )}
    </div>
  );
};

export default MyChildren;