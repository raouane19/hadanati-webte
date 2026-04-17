import React, { useState } from 'react';
import './ParentProfile.css';
import {
  FiX, FiEdit2, FiUser, FiList, FiHeart,
  FiUsers, FiLogOut, FiMapPin, FiCalendar,
  FiChevronRight, FiStar
} from 'react-icons/fi';
import { RiParentLine } from 'react-icons/ri';
import { PiStudent } from 'react-icons/pi';
import { TbMoodKid } from 'react-icons/tb';
import { LuClipboardList } from 'react-icons/lu';
import MyChildren from './MyChildren';
import MyEnrollmentRequests from './Myenrollmentrequests';

const ParentProfile = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('profile');

  const [user] = useState({
    fullName: "Parent Full Name",
    email: "@example.com",
    phone: "+21376756468",
    location: "Algeria, sba"
  });

  const [enrollmentRequests] = useState([
    { id: 1, nursery: "Bright Horizons Center", child: "Liam D.", date: "Oct 12, 2023", status: "PENDING" },
    { id: 2, nursery: "Kindercare Academy", child: "Liam D.", date: "Sep 28, 2023", status: "APPROVED" }
  ]);

  const [favorites] = useState([
    { id: 1, name: "The Goddard School", location: "oran", rating: 4.9, image: "/public/little-day.jpg" },
    { id: 2, name: "Stepping Stones", location: "sba", rating: 4.7, image: "/public/bright-day.jpg" }
  ]);

  const [children] = useState([
    { id: 1, name: "Leo Wright", age: "AGE: 4 YEARS" },
    { id: 2, name: "Sarah Wright", age: "AGE: 2 YEARS" }
  ]);
  const [showChildren, setShowChildren] = useState(false);
  const [showRequests, setShowRequests] = useState(false);

  const menuItems = [
    { key: 'profile', label: 'Profile Info', icon: <FiUser /> },
    { key: 'requests', label: 'My Requests', icon: <LuClipboardList /> },
    { key: 'favorites', label: 'Favorites', icon: <FiHeart /> },
    { key: 'children', label: 'Children', icon: <FiUsers /> },
  ];

  return (
    <div className="profile-overlay" onClick={onClose}>
      <div className="profile-modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="profile-header">
          <div className="profile-header-title">
            <LuClipboardList className="profile-header-icon" />
            <span>profile info</span>
          </div>
          <button className="profile-close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="profile-body">

          {/* Left Sidebar */}
          <div className="profile-sidebar">
            <div className="profile-avatar-section">
              <div className="profile-avatar">
                <img src="/public/php 1.jpg" alt="avatar"
                  onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
                />
                <div className="profile-avatar-fallback">
                  <RiParentLine />
                </div>
                <div className="profile-avatar-edit">
                  <FiEdit2 size={10} />
                </div>
              </div>
              <p className="profile-name">{user.fullName}</p>
            </div>

            <div className="profile-menu">
              <p className="profile-menu-label">ACCOUNT</p>
              {menuItems.map(item => (
                <button
                  key={item.key}
                  className={`profile-menu-item ${activeTab === item.key ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.key)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
              <button className="profile-menu-item signout">
                <FiLogOut />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Right Content */}
          <div className="profile-content">

            {/* Personal Information */}
            <div className="profile-section">
              <div className="profile-section-header">
                <h3>Personal Information</h3>
                <button className="edit-btn"><FiEdit2 size={13}/> Edit All</button>
              </div>
              <div className="profile-info-grid">
                <div className="profile-info-item">
                  <label>FULL NAME</label>
                  <p>{user.fullName}</p>
                </div>
                <div className="profile-info-item">
                  <label>EMAIL ADDRESS</label>
                  <p>{user.email}</p>
                </div>
                <div className="profile-info-item">
                  <label>PHONE NUMBER</label>
                  <p>{user.phone}</p>
                </div>
                <div className="profile-info-item">
                  <label>LOCATION</label>
                  <p>{user.location}</p>
                </div>
              </div>
            </div>

            {/* Enrollment Requests */}
            <div className="profile-section">
              <div className="profile-section-header">
                <h3>Enrollment Requests</h3>
               <button className="view-all-btn" onClick={() => setShowRequests(true)}>VIEW ALL</button>
              </div>
              <div className="enrollment-list">
                {enrollmentRequests.map(req => (
                  <div key={req.id} className="enrollment-item">
                    <div className="enrollment-icon">
                      <PiStudent size={18} />
                    </div>
                    <div className="enrollment-info">
                      <p className="enrollment-nursery">{req.nursery}</p>
                      <div className="enrollment-meta">
                        <span><FiUser size={11}/> {req.child}</span>
                        <span><FiCalendar size={11}/> {req.date}</span>
                      </div>
                    </div>
                    <span className={`enrollment-status ${req.status.toLowerCase()}`}>
                      {req.status}
                    </span>
                    <FiChevronRight className="enrollment-arrow" />
                  </div>
                ))}
              </div>
            </div>

            {/* Favorites */}
            <div className="profile-section">
              <div className="profile-section-header">
                <h3>Favorites</h3>
                <button className="view-all-btn">MANAGE</button>
              </div>
              <div className="favorites-grid">
                {favorites.map(fav => (
                  <div key={fav.id} className="favorite-card">
                    <div className="favorite-image">
                      <img src={fav.image} alt={fav.name}
                        onError={e => e.target.src = 'https://images.unsplash.com/photo-1576765607924-3f7b8410a787?w=200'}
                      />
                    </div>
                    <div className="favorite-info">
                      <div className="favorite-top">
                        <p className="favorite-name">{fav.name}</p>
                        <FiHeart className="favorite-heart" />
                      </div>
                      <span className="favorite-location"><FiMapPin size={11}/> {fav.location}</span>
                      <div className="favorite-bottom">
                        <span className="favorite-rating"><FiStar size={11} style={{color:'#f4a523', fill:'#f4a523'}}/> {fav.rating}</span>
                        <button className="favorite-details-btn">Details</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Children */}
            <div className="profile-section">
              <div className="profile-section-header">
                <h3>Children</h3>
                 <button className="view-all-btn" onClick={() => setShowChildren(true)}>MANAGE</button>
              </div>
              <div className="children-grid">
                {children.map(child => (
                  <div key={child.id} className="child-item">
                    <div className="child-avatar">
                     <TbMoodKid size={20} />
                    </div>
                    <div>
                      <p className="child-name">{child.name}</p>
                      <span className="child-age">{child.age}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
        {showChildren && (
        <MyChildren
          onClose={onClose}
          onBack={() => setShowChildren(false)}
        />
      )}
      {showRequests && (
        <MyEnrollmentRequests
          onClose={onClose}
          onBack={() => setShowRequests(false)}
        />
      )}
    </div>
  );
};

export default ParentProfile;