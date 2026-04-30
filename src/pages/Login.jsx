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
      const url =
        role === 'parent'
          ? 'http://192.168.12.26:5000/auth/login/parent'
          : 'http://192.168.12.26:5000/auth/login/daycare';

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login failed. Try again.');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('role', role);

      if (role === 'parent') {
        navigate('/search');
      } else {
        navigate('/nursery-dashboard');
      }
    } catch (err) {
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
            {loading ? 'Logging in...' : 'log in'}
          </button>

        </form>

        <div className="had-login-footer-links">
          <span className="had-forgot-link" onClick={() => setShowRecovery(true)}>
            forgot password?
          </span>
          <span className="had-send-code-link">send code</span>
        </div>

        <p className="had-login-secure">SECURE & CONFIDENTIAL PROFESSIONAL SERVICES</p>
      </div>

      {showRecovery && <AccountRecovery onClose={() => setShowRecovery(false)} />}
    </div>
  );
};

export default Login;