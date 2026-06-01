import { useNavigate, Link } from 'react-router-dom';
import React, { useState } from 'react';
import './SignUp.css';
import { useTranslation } from 'react-i18next';
import { FiPhone } from 'react-icons/fi';
import { registerParent } from '../api/auth';

const SignUp = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // ✅ Clear any old session before registering
    localStorage.clear();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      };

      await registerParent(payload); // ✅ no token in register response

      // ✅ Save only what's needed for OTP + auto-login after verification
      localStorage.setItem('userRole', 'parent');
      localStorage.setItem('userEmail', formData.email);
      localStorage.setItem('pendingPassword', formData.password); // ✅ for auto-login after OTP
      localStorage.setItem('pendingUser', JSON.stringify({
        first_name: formData.firstName,
        last_name: formData.lastName,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        role: 'parent',
      }));

      navigate('/parent-verification');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2 className="signup-title">{t('signup.title')}</h2>
        <p className="signup-subtitle">{t('signup.subtitle')}</p>

        {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>{t('signup.firstName')}</label>
              <input type="text" name="firstName" placeholder={t('signup.firstNamePlaceholder')} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>{t('signup.lastName')}</label>
              <input type="text" name="lastName" placeholder={t('signup.lastNamePlaceholder')} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>{t('signup.email')}</label>
            <input type="email" name="email" placeholder={t('signup.emailPlaceholder')} onChange={handleChange} required />
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
              <input type="password" name="password" placeholder="••••••••" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>{t('signup.confirmPassword')}</label>
              <input type="password" name="confirmPassword" placeholder="••••••••" onChange={handleChange} required />
            </div>
          </div>

          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? 'Signing up...' : t('signup.btn')}
          </button>
        </form>

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