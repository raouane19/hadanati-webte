import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './MyEnrollmentRequests.css';
import { FiX, FiChevronLeft, FiUser, FiCalendar, FiTrash2 } from 'react-icons/fi';
import { LuClipboardList } from 'react-icons/lu';
import { getUser, getRequests, cancelRequest } from '../api/auth';

const MyEnrollmentRequests = ({ onClose, onBack }) => {
  const { t } = useTranslation();
  const currentUser = getUser();

  const [requests,       setRequests]       = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState('');
  const [cancellingId,   setCancellingId]   = useState(null); // confirm cancel

  // ✅ Fetch real requests from backend
  useEffect(() => {
    if (!currentUser?.id) return;
    setLoading(true);
    getRequests(currentUser.id)
      .then((res) => setRequests(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError('Failed to load requests.'))
      .finally(() => setLoading(false));
  }, [currentUser?.id]);

  // ✅ Cancel request
  const handleCancel = async (requestId) => {
    try {
      await cancelRequest(currentUser.id, requestId);
      setRequests((prev) => prev.filter((r) => r.request_id !== requestId));
      setCancellingId(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel request.');
      setCancellingId(null);
    }
  };

  const getStatusClass = (status) => {
    if (!status) return '';
    const s = status.toLowerCase();
    if (s === 'pending')   return 'in-review';
    if (s === 'accepted')  return 'confirmed';
    if (s === 'rejected')  return 'rejected';
    return s;
  };

  return (
    <div className="enrollment-wrapper" onClick={onClose}>
      <div className="enrollment-modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="profile-header">
          <div className="profile-header-title">
            <LuClipboardList className="profile-header-icon" />
            <span>{t('enrollmentRequests.title')}</span>
          </div>
          <button className="enrollment-close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        {/* Content */}
        <div className="enrollment-content">

          <div className="enrollment-title-row">
            <div className="enrollment-title-left">
              <button className="back-btn" onClick={onBack}>
                <FiChevronLeft size={28} />
              </button>
              <div>
                <h2>{t('enrollmentRequests.pageTitle')}</h2>
                <p className="enrollment-subtitle">{t('enrollmentRequests.subtitle')}</p>
              </div>
            </div>
          </div>

          {/* List */}
          <div className="enrollment-list">
            {loading ? (
              <p style={{ color: '#888', textAlign: 'center', padding: '20px' }}>Loading...</p>
            ) : error ? (
              <p style={{ color: 'red', textAlign: 'center', padding: '20px' }}>{error}</p>
            ) : requests.length === 0 ? (
              <p style={{ color: '#aaa', textAlign: 'center', padding: '40px' }}>
                No enrollment requests yet.
              </p>
            ) : (
              requests.map(req => (
                <div key={req.request_id} className="enrollment-card">

                  <div className="enrollment-card-image">
                    <div className="enrollment-card-image-fallback" style={{ display: 'flex' }}>
                      <LuClipboardList size={28} />
                    </div>
                  </div>

                  <div className="enrollment-card-info">
                    <span className={`enrollment-status-badge ${getStatusClass(req.status)}`}>
                      {req.status || 'pending'}
                    </span>
                    <h3 className="enrollment-card-name">{req.daycare_name || '—'}</h3>
                    <div className="enrollment-card-meta">
                      <span>
                        <FiUser size={11} /> {t('enrollmentRequests.child')}: <strong>{req.child_name || '—'}</strong>
                      </span>
                      <span>
                        <FiCalendar size={11} /> {t('enrollmentRequests.applied')}:{' '}
                        <strong>
                          {req.request_date ? new Date(req.request_date).toLocaleDateString() : '—'}
                        </strong>
                      </span>
                    </div>
                  </div>

                  {/* ✅ Cancel button — only for pending requests */}
                  {req.status?.toLowerCase() === 'pending' && (
                    <div>
                      {cancellingId === req.request_id ? (
                        <div className="delete-confirm">
                          <span>Cancel?</span>
                          <button
                            className="delete-confirm-yes"
                            onClick={() => handleCancel(req.request_id)}
                          >
                            Yes
                          </button>
                          <button
                            className="delete-confirm-no"
                            onClick={() => setCancellingId(null)}
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          className="delete-child-btn"
                          onClick={() => setCancellingId(req.request_id)}
                        >
                          <FiTrash2 size={12} /> Cancel
                        </button>
                      )}
                    </div>
                  )}

                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default MyEnrollmentRequests;