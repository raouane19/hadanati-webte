import React, { useState } from 'react';
import './AccountRecovery.css';
import { LiaFileAlt } from 'react-icons/lia';
import { LiaTelegramPlane } from 'react-icons/lia';
import { useNavigate } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AccountRecovery = ({ onClose }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const role = localStorage.getItem('userRole') || 'parent';

  const handleSend = async () => {
    if (!email) {
      setError('Please enter your email.');
      return;
    }
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Something went wrong.');
        return;
      }

      localStorage.setItem('userEmail', email);
      setSuccess('Code sent! Redirecting...');

      setTimeout(() => {
        onClose();
        navigate('/reset-password');
      }, 1500);

    } catch {
      setError('Could not connect to server. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recovery-overlay" onClick={onClose}>
      <div className="recovery-modal" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="recovery-header">
          <div className="recovery-title">
            <LiaFileAlt className="recovery-title-icon" />
            <span>Account Recovery</span>
          </div>
          <button className="recovery-close" onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div className="recovery-body">

          {error && <p className="recovery-error">{error}</p>}
          {success && <p className="recovery-success">{success}</p>}

          <div className="recovery-form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            className="recovery-btn"
            onClick={handleSend}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send verification code'}
            {!loading && <LiaTelegramPlane className="send-icon" />}
          </button>

        </div>
      </div>
    </div>
  );
};

export default AccountRecovery;