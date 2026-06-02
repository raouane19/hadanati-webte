import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './accountverification.css';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ResetPassword = () => {
  const navigate = useNavigate();

  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const email = localStorage.getItem('userEmail');
  const role  = localStorage.getItem('userRole') || 'parent';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (code.length !== 6) {
      setError('Please enter the 6-digit code.');
      return;
    }

    if (newPassword !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role, code, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Reset failed. Try again.');
        return;
      }

      navigate('/hadanati-login');

    } catch {
      setError('Could not connect to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">

        <div className="verify-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6B8E9E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
        </div>

        <h2 className="login-title">Reset your password</h2>
        <p className="login-subtitle">
          Enter the code sent to your email<br />and choose a new password.
        </p>

        {error && (
          <p style={{ color: '#f87171', fontSize: '13px', marginBottom: '10px' }}>{error}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Reset code</label>
            <input
              type="text"
              placeholder="Enter 6-digit code"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              className="code-input"
            />
          </div>

          <div className="form-group">
            <label>New password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Confirm password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset password'}
          </button>
        </form>

        <p className="forgot-link">
          Remembered it? <a href="/hadanati-login">Back to login</a>
        </p>

      </div>
    </div>
  );
};

export default ResetPassword;