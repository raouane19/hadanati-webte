import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './MyChildren.css';
import { FiEdit2, FiAlertTriangle, FiX, FiTrash2 } from 'react-icons/fi';
import { LuClipboardList } from 'react-icons/lu';
import { MdOutlineLocalHospital } from 'react-icons/md';
import { HiOutlineUserAdd } from 'react-icons/hi';
import { FiChevronLeft } from 'react-icons/fi';
import ChildrenProfile from './childrenprofile';
import { getChildren, addChild, updateChild, getUser } from '../api/auth';
import API from '../api/auth';

const BASE_URL = import.meta.env.VITE_API_URL;

// ✅ Build correct child photo URL with children/ subfolder
const resolveChildPhoto = (profile_image) => {
  if (!profile_image) return null;
  if (profile_image.startsWith('data:')) return profile_image;
  if (profile_image.startsWith('blob:')) return profile_image;
  if (profile_image.startsWith('http')) return profile_image;
  if (profile_image.startsWith('/uploads/')) return `${BASE_URL}${profile_image}`;
  if (profile_image.startsWith('uploads/children/')) return `${BASE_URL}/${profile_image}`;
  return `${BASE_URL}/uploads/children/${profile_image}`;
};

// ✅ Fetch image with ngrok header and return blob URL
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

// ✅ Child photo component — loads via blob to bypass ngrok
const ChildPhoto = ({ src, name }) => {
  const [blobUrl, setBlobUrl] = useState(null);

  useEffect(() => {
    if (!src) return;
    fetchImageAsBlob(src).then((blob) => {
      if (blob) setBlobUrl(blob);
    });
  }, [src]);

  if (!blobUrl) {
    return (
      <div className="child-avatar-placeholder">
        {name?.[0]?.toUpperCase()}
      </div>
    );
  }
  return (
    <img
      src={blobUrl}
      alt={name}
      style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
    />
  );
};

const calcAge = (birthDateStr) => {
  if (!birthDateStr) return 0;
  const today = new Date();
  const birth = new Date(birthDateStr);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

const MyChildren = ({ onClose, onBack, onChildrenChanged }) => {
  const { t } = useTranslation();
  const currentUser = getUser();

  const [children,        setChildren]        = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState('');
  const [showAddChild,    setShowAddChild]    = useState(false);
  const [editingChild,    setEditingChild]    = useState(null);
  const [deletingChildId, setDeletingChildId] = useState(null);

  useEffect(() => {
    if (!currentUser?.id) return;
    setLoading(true);
    getChildren(currentUser.id)
      .then((res) => setChildren(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError('Failed to load children.'))
      .finally(() => setLoading(false));
  }, [currentUser?.id]);

  const handleSaveChild = async (formData, meta) => {
    try {
      if (meta.id) {
        const res = await updateChild(currentUser.id, meta.id, formData);
        const newFilename = res.data?.profile_image;
        setChildren((prev) =>
          prev.map((c) => {
            if (c.id !== meta.id) return c;
            return {
              ...c,
              name:           formData.get('name'),
              birth_date:     formData.get('birth_date'),
              gender:         formData.get('gender'),
              medical_issues: formData.get('medical_issues'),
              age:            calcAge(formData.get('birth_date')),
              profile_image:  newFilename || meta.previewUrl || c.profile_image,
            };
          })
        );
      } else {
        const res = await addChild(currentUser.id, formData);
        const newChild = res.data?.child;
        if (newChild) {
          setChildren((prev) => [...prev, newChild]);
        } else {
          const fresh = await getChildren(currentUser.id);
          setChildren(Array.isArray(fresh.data) ? fresh.data : []);
        }
      }
      if (onChildrenChanged) onChildrenChanged();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save child.');
    } finally {
      setEditingChild(null);
      setShowAddChild(false);
    }
  };

  // ✅ Calls backend DELETE route
  const handleDeleteChild = async (childId) => {
    try {
      await API.delete(`/parents/${currentUser.id}/children/${childId}`);
      setChildren((prev) => prev.filter((c) => c.id !== childId));
      setDeletingChildId(null);
      if (onChildrenChanged) onChildrenChanged();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete child.');
      setDeletingChildId(null);
    }
  };

  return (
    <div className="profile-overlay" onClick={onClose}>
      <div className="children-modal" onClick={(e) => e.stopPropagation()}>

        <div className="profile-header">
          <div className="profile-header-title">
            <LuClipboardList className="profile-header-icon" />
            <span>{t('children.title')}</span>
          </div>
          <button className="profile-close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="children-content">
          <div className="children-title">
            <button className="back-btn" onClick={onBack}>
              <FiChevronLeft size={28} />
            </button>
            <h2>{t('children.pageTitle')}</h2>
          </div>

          {loading ? (
            <p style={{ color: '#888', textAlign: 'center', padding: '20px' }}>Loading...</p>
          ) : error ? (
            <p style={{ color: 'red', textAlign: 'center', padding: '20px' }}>{error}</p>
          ) : (
            <div className="children-list">
              {children.map((child) => {
                const photoUrl = resolveChildPhoto(child.profile_image);
                const isConfirmingDelete = deletingChildId === child.id;

                return (
                  <div key={child.id} className="child-card">
                    <div className="child-avatar">
                      {/* ✅ Uses ChildPhoto blob component — bypasses ngrok */}
                      <ChildPhoto src={photoUrl} name={child.name} />
                    </div>

                    <div className="child-card-info">
                      <h3 className="child-card-name">{child.name}</h3>
                      <p className="child-card-details">
                        {t('children.age')}: {child.age} · {child.gender}
                      </p>
                      <div className={`child-medical ${child.medical_issues ? 'alert' : 'none'}`}>
                        {child.medical_issues
                          ? <FiAlertTriangle size={13} />
                          : <MdOutlineLocalHospital size={13} />
                        }
                        <span>
                          {t('children.medical')}:{' '}
                          <span className="medical-value">
                            {child.medical_issues || 'None Disclosed'}
                          </span>
                        </span>
                      </div>

                      <div className="child-card-actions">
                        <button
                          className="edit-profile-btn"
                          onClick={() => setEditingChild({
                            ...child,
                            profile_image_url: photoUrl,
                          })}
                        >
                          <FiEdit2 size={12} /> {t('children.editProfile')}
                        </button>

                        {!isConfirmingDelete ? (
                          <button
                            className="delete-child-btn"
                            onClick={() => setDeletingChildId(child.id)}
                          >
                            <FiTrash2 size={12} /> Delete
                          </button>
                        ) : (
                          <div className="delete-confirm">
                            <span>Are you sure?</span>
                            <button
                              className="delete-confirm-yes"
                              onClick={() => handleDeleteChild(child.id)}
                            >
                              Yes
                            </button>
                            <button
                              className="delete-confirm-no"
                              onClick={() => setDeletingChildId(null)}
                            >
                              No
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="add-child-card" onClick={() => setShowAddChild(true)}>
                <HiOutlineUserAdd size={28} className="add-child-icon" />
                <p>{t('children.addChild')}</p>
              </div>
            </div>
          )}
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