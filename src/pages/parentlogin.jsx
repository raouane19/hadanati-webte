import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import './daycarelogin.css';
import { useTranslation } from 'react-i18next';

const BASE_URL = 'http://192.168.0.151:5000';

const ParentLogin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: 'parent',  // ✅ hardcoded since role was chosen on previous page
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401 && data.message?.includes('not verified')) {
          setError('Your account is not verified yet. Please check your email for the OTP.');
        } else if (res.status === 401) {
          setError('Wrong password. Please try again.');
        } else if (res.status === 404) {
          setError('No account found with this email.');
        } else {
          setError(data.message || 'Login failed. Please try again.');
        }
        return;
      }

      // ✅ Save token + user info
      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', data.user.role);
      localStorage.setItem('userId', String(data.user.id));
      localStorage.setItem('userName', data.user.name);

      navigate('/parent-dashboard');

    } catch (err) {
      setError('Cannot reach the server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">

        <h2 className="login-title">Parent Login</h2>
        <p className="login-subtitle">
          Welcome back! Let's continue your parenting journey.
        </p>

        {error && (
          <p style={{ color: '#f87171', marginBottom: '12px', fontSize: '13px' }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('login.email')}</label>
            <input
              type="email"
              name="email"
              placeholder={t('login.emailPlaceholder')}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>{t('login.password')}</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Logging in...' : t('login.btn')}
          </button>
        </form>

        <p className="forgot-link">
          <a href="#">{t('login.forgotPassword')}</a>
        </p>
        <p className="professional-link">{t('login.professional')}</p>

      </div>
    </div>
  );
};

export default ParentLogin;