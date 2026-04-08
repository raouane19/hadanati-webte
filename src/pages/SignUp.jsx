import { useNavigate, Link } from 'react-router-dom';
import React, { useState } from 'react';
import './SignUp.css';
import { useTranslation } from 'react-i18next';
import { FiPhone } from 'react-icons/fi';

const SignUp = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
const handleSubmit = (e) => {
  e.preventDefault();

  // Optional: check passwords match
  if (formData.password !== formData.confirmPassword) {
    alert("Passwords don't match!");
    return;
  }

  // Save user role as "parent" so ProtectedRoute allows access
  localStorage.setItem('userRole', 'parent');

  console.log(formData);
  navigate('/parent-dashboard');
};

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2 className="signup-title">{t('signup.title')}</h2>
        <p className="signup-subtitle">{t('signup.subtitle')}</p>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>{t('signup.firstName')}</label>
              <input type="text" name="firstName" placeholder={t('signup.firstNamePlaceholder')} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>{t('signup.lastName')}</label>
              <input type="text" name="lastName" placeholder={t('signup.lastNamePlaceholder')} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>{t('signup.email')}</label>
            <input type="email" name="email" placeholder={t('signup.emailPlaceholder')} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>{t('signup.phone')}</label>
            <div className="input-with-icon">
              <FiPhone className="input-icon-inside" />
              <input type="tel" name="phone" placeholder="+213" onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{t('signup.password')}</label>
              <input type="password" name="password" placeholder="••••••••" onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>{t('signup.confirmPassword')}</label>
              <input type="password" name="confirmPassword" placeholder="••••••••" onChange={handleChange} />
            </div>
          </div>

          <button type="submit" className="signup-btn">{t('signup.btn')}</button>
        </form>

        {/* Updated login link with react-router-dom Link */}
        <p className="login-link">
          {t('signup.loginLink')}{' '}
          <Link to="/parent-login">{t('signup.login')}</Link>
        </p>

        <p className="professional-link">{t('signup.professional')}</p>
      </div>
    </div>
  );
};
export default SignUp;