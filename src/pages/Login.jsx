import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { MdFamilyRestroom } from 'react-icons/md';
import { RiFirstAidKitLine } from 'react-icons/ri';
import AccountRecovery from './AccountRecovery';

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('parent');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL ;

      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login failed. Try again.');
        return;
      }

      // Store token, role, and user info
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.role);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Navigate based on role
      if (role === 'parent') {
         localStorage.setItem('userRole', 'parent');
         localStorage.setItem('userEmail', email);
         navigate('/parent-dashboard');
      } else if (role === 'daycare') {
          localStorage.setItem('userRole', 'daycare');
  navigate('/facility-profile');
      }

    } catch  {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="had-login-container">
      <div className="had-login-box">
        <h2 className="had-login-title">Login page</h2>
        <p className="had-login-subtitle">
          Welcome back to Hadanti<br />
          Let's continue this journey together.
        </p>

        <form onSubmit={handleSubmit}>

          <p className="had-role-label">Select your role</p>
          <div className="had-role-selector">
            <button
              type="button"
              className={`had-role-btn ${role === 'parent' ? 'had-role-active' : ''}`}
              onClick={() => setRole('parent')}
            >
              <MdFamilyRestroom className="had-role-icon" /> Parent
            </button>
            <button
              type="button"
              className={`had-role-btn ${role === 'daycare' ? 'had-role-active' : ''}`}
              onClick={() => setRole('daycare')}
            >
              <RiFirstAidKitLine className="had-role-icon" /> Daycare
            </button>
          </div>

          {error && <p className="had-login-error">{error}</p>}

          <div className="had-login-form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="sarah.j@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="had-login-form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="had-login-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Log in'}
          </button>

        </form>

        <div className="had-login-footer-links">
          <span className="had-forgot-link" onClick={() => setShowRecovery(true)}>
            Forgot password?
          </span>
        </div>

        <p className="had-login-secure">SECURE & CONFIDENTIAL PROFESSIONAL SERVICES</p>
      </div>

      {showRecovery && <AccountRecovery onClose={() => setShowRecovery(false)} />}
    </div>
  );
};

export default Login;