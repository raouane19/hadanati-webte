import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './accountverification.css';
import axios from 'axios';
import { loginParent } from '../api/auth'; // ✅ for auto-login after OTP

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

const AccountVerification = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendMsg, setResendMsg] = useState('');

  // Read from pendingUser set during registration
  const pendingUser = JSON.parse(localStorage.getItem('pendingUser') || '{}');
  const role     = pendingUser.role  || localStorage.getItem('userRole');
  const email    = pendingUser.email || localStorage.getItem('userEmail');
  const password = localStorage.getItem('pendingPassword'); // ✅ for auto-login

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResendMsg('');

    if (code.length !== 6) {
      setError('Please enter the 6-digit code.');
      return;
    }

    try {
      setLoading(true);

      // 1. Verify OTP
      await API.post('/auth/verify-otp', { email, code, role });

      // 2. Auto-login so user goes straight to dashboard
      if (role === 'daycare') {
        // Clean up and send daycare to their login
        localStorage.removeItem('pendingUser');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('pendingPassword');
        navigate('/login'); // daycare login page
      } else {
        // Parent: auto-login then go to dashboard
        await loginParent({ email, password });

        // Clean up pending state
        localStorage.removeItem('pendingUser');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('pendingPassword');

        navigate('/parent-dashboard'); // ✅ straight to dashboard
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setResendMsg('');
    try {
      await API.post('/auth/resend-otp', { email, role });
      setResendMsg('A new code has been sent to your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend. Try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">

        <div className="verify-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6B8E9E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2"/>
            <path d="M2 7l10 7 10-7"/>
          </svg>
        </div>

        <h2 className="login-title">Verify your account</h2>
        <p className="login-subtitle">
          We sent a verification code to your email.<br />
          Please enter it below to continue.
        </p>

        {error && (
          <p style={{ color: '#f87171', fontSize: '13px', marginBottom: '10px' }}>{error}</p>
        )}
        {resendMsg && (
          <p style={{ color: '#34d399', fontSize: '13px', marginBottom: '10px' }}>{resendMsg}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Verification code</label>
            <input
              type="text"
              name="code"
              placeholder="Enter 6-digit code"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              className="code-input"
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify account'}
          </button>
        </form>

        <p className="forgot-link">
          Didn't receive a code?{' '}
          <a href="#!" onClick={(e) => { e.preventDefault(); handleResend(); }}>
            Resend verification code
          </a>
        </p>

      </div>
    </div>
  );
};

export default AccountVerification;