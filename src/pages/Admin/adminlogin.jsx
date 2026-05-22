import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AccountRecovery from '../AccountRecovery';
import './adminlogin.css';

const AdminLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
const [showRecovery, setShowRecovery] = useState(false);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || 'Login failed');
      return;
    }

    localStorage.setItem('adminToken', data.token);
    navigate('/admin/daycares');
  } catch  {
    setError('Network error. Try again.');
  }
};

  return (
    <div className="admin-login-container">

      <div className="admin-login-box">

        <h2 className="admin-login-title">
          Admin Login
        </h2>

        <p className="admin-login-subtitle">
          Manage Hadanti platform securely
        </p>

        {error && (
          <p className="admin-error">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>

          <div className="admin-form-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="admin@gmail.com"
              onChange={handleChange}
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="••••••••"
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="admin-login-btn"
          >
            Login
          </button>
<p
  className="admin-forgot-password"
  onClick={() => setShowRecovery(true)}
>
  Forgot password?
</p>
        </form>

      </div>
   {
      showRecovery && (
        <AccountRecovery
          onClose={() => setShowRecovery(false)}
        />
      )
    }
    </div>

  );
};

export default AdminLogin;