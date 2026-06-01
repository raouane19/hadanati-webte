import React, { useState } from 'react';
import './HowItWorks.css';
import { MdFamilyRestroom } from 'react-icons/md';
import { FaSchool } from 'react-icons/fa6';

const HowItWorks = ({ onClose }) => {
  const [selected, setSelected] = useState(null); // 'parent' | 'daycare'

  return (
    <div className="hiw-overlay" onClick={onClose}>
      <div className="hiw-modal" onClick={(e) => e.stopPropagation()}>

        <button className="hiw-close" onClick={onClose}>✕</button>

        <h2 className="hiw-title">How It Works</h2>
        <p className="hiw-sub">Choose your role to see how HADANATI works for you</p>

        {/* ── ROLE SELECTOR ── */}
        {!selected && (
          <div className="hiw-roles">
            <button
              className="hiw-role-btn"
              onClick={() => setSelected('parent')}
            >
              <span className="hiw-role-icon">
                <MdFamilyRestroom size={40} color="#5b8fa8" />
                </span>
              <span className="hiw-role-label">For Parents</span>
              <span className="hiw-role-desc">Find & enroll in the best daycare</span>
            </button>
            <button
              className="hiw-role-btn"
              onClick={() => setSelected('daycare')}
            >
              <span className="hiw-role-icon">
            <FaSchool size={40} color="#5b8fa8" />
            </span>
              <span className="hiw-role-label">For Daycares</span>
              <span className="hiw-role-desc">Manage enrollments & grow your center</span>
            </button>
          </div>
        )}

        {/* ── VIDEO PLAYER ── */}
        {selected && (
          <div className="hiw-video-section">
            <div className="hiw-tabs">
               <button
                    className={`hiw-tab ${selected === 'parent' ? 'active' : ''}`}
                    onClick={() => setSelected('parent')}
                >
                    <MdFamilyRestroom size={18} /> For Parents
                </button>
            <button
                className={`hiw-tab ${selected === 'daycare' ? 'active' : ''}`}
                onClick={() => setSelected('daycare')}
            >
                <FaSchool size={18} /> For Daycares
            </button>
            </div>

            <div className="hiw-video-wrapper">
              {selected === 'parent' ? (
                // ── Replace src with your parent video URL ──
                <video
                  className="hiw-video"
                  controls
                  autoPlay
                  key="parent-video"
                >
                  <source src="/videos/parent-demo.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                // ── Replace src with your daycare video URL ──
                <video
                  className="hiw-video"
                  controls
                  autoPlay
                  key="daycare-video"
                >
                  <source src="/videos/daycare-demo.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default HowItWorks;