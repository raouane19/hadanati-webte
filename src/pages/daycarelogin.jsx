import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import './daycarelogin.css';
import { useTranslation } from 'react-i18next';

 
const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
 
  
 
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    });

    const result = await res.json();

    if (result.success) {
      // Save token so other pages can use it
      localStorage.setItem('token', result.token);
      localStorage.setItem('userRole', result.user.role);

      // Go straight to the facility profile editor
      navigate('/facility-profile');
    } else {
      alert(result.message || 'Login failed. Check your email and password.');
    }
  } catch (err) {
    console.error('Login error:', err);
    alert('Could not connect to server.');
  }
};

  return (
    <div className="login-container">
 

 
      <div className="login-box">
        <h2 className="login-title">{t('login.title')}</h2>
        <p className="login-subtitle">{t('login.subtitle')}</p>
 
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('login.email')}</label>
            <input
              type="email"
              name="email"
              placeholder={t('login.emailPlaceholder')}
              onChange={handleChange}
            />
          </div>
 
          <div className="form-group">
            <label>{t('login.password')}</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              onChange={handleChange}
            />
          </div>
 
        <button type="submit" className="login-btn">
  {t('login.btn')}
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
 
export default Login;