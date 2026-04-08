import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import './daycarelogin.css'; // reuse SAME CSS
import { useTranslation } from 'react-i18next';

const ParentLogin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  localStorage.setItem('userRole', 'parent');
   
    navigate('/parent-dashboard');
  };

  return (
    <div className="login-container">
      <div className="login-box">

        {/* ✅ ONLY CHANGE HERE */}
        <h2 className="login-title">Parent login</h2>
        <p className="login-subtitle">
          Welcome back! Let’s continue your parenting journey.
        </p>

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

        <p className="professional-link">
          {t('login.professional')}
        </p>

      </div>
    </div>
  );
};

export default ParentLogin;