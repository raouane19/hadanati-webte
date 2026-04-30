import React, { useState } from 'react';
import './AccountRecovery.css';
import { LiaFileAlt } from 'react-icons/lia';
import { LiaTelegramPlane } from 'react-icons/lia';

const AccountRecovery = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSend = async () => {
    if (!email) {
      setError('Please enter your email.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      // ⚠️ Replace with your friend's actual forgot password route
      const res = await fetch('http://192.168.12.26:5000/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Something went wrong.');
        return;
      }

      setSuccess('Verification code sent! Check your email. ✅');
    } catch (err) {
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
              placeholder=".j@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            className="recovery-btn"
            onClick={handleSend}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'send  verification code'}
            {!loading && <LiaTelegramPlane className="send-icon" />}
          </button>

        </div>
      </div>
    </div>
  );
};

export default AccountRecovery;