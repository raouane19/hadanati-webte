import React, { useState } from 'react';
import './MyEnrollmentRequests.css';
import { FiX, FiChevronLeft, FiEdit2 } from 'react-icons/fi';
import { LuClipboardList } from 'react-icons/lu';
import { FiUser, FiCalendar, FiArrowRight } from 'react-icons/fi';

const MyEnrollmentRequests = ({ onClose, onBack }) => {
  const [requests] = useState([
    {
      id: 1,
      nursery: "Sunshine Academy",
      child: "Leo",
      date: "Oct 12, 2026",
      status: "IN REVIEW",
      statusKey: "in-review",
      image: "/public/sunshine-academy.jpg"
    },
    {
      id: 2,
      nursery: "Little Steps Institute",
      child: "Sarah",
      date: "Sep 28, 2026",
      status: "WAITLISTED",
      statusKey: "waitlisted",
      image: "/public/little-steps.jpg"
    },
    {
      id: 3,
      nursery: "Evergreen Montessori",
      child: "Leo",
      date: "Aug 15, 2026",
      status: "CONFIRMED",
      statusKey: "confirmed",
      image: "/public/evergreen.jpg"
    }
  ]);

 return (
  <div className="enrollment-wrapper" onClick={onClose}>
    <div className="enrollment-modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="profile-header">
          <div className="profile-header-title">
            <LuClipboardList className="profile-header-icon" />
            <span>profile info</span>
          </div>
          <button className="enrollment-close-btn" onClick={onClose}>
            <FiX />
        </button>
        </div>

        {/* Content */}
        <div className="enrollment-content">

          {/* Title row */}
          <div className="enrollment-title-row">
            <div className="enrollment-title-left">
              <button className="back-btn" onClick={onBack}>
                <FiChevronLeft size={28} />
              </button>
              <div>
                <h2>My Enrollment Requests</h2>
                <p className="enrollment-subtitle">
                  Track and manage your daycare applications and enrollment status across our network.
                </p>
              </div>
            </div>
            <button className="edit-all-btn">
              <FiEdit2 size={13} /> Edit All
            </button>
          </div>

          {/* Requests list */}
          <div className="enrollment-list">
            {requests.map(req => (
              <div key={req.id} className="enrollment-card">
                <div className="enrollment-card-image">
                  <img
                    src={req.image}
                    alt={req.nursery}
                    onError={e => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="enrollment-card-image-fallback">
                    <LuClipboardList size={28} />
                  </div>
                </div>

                <div className="enrollment-card-info">
                  <span className={`enrollment-status-badge ${req.statusKey}`}>
                    {req.status}
                  </span>
                  <h3 className="enrollment-card-name">{req.nursery}</h3>
                  <div className="enrollment-card-meta">
                    <span><FiUser size={11} /> Child: <strong>{req.child}</strong></span>
                    <span><FiCalendar size={11} /> Applied: <strong>{req.date}</strong></span>
                  </div>
                </div>

                <button className="view-details-btn">
                  View Details <FiArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default MyEnrollmentRequests;