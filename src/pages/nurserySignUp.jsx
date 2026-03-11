import React, { useState } from 'react';
import './NurserySignUp.css';
import { useTranslation } from 'react-i18next';
import { MdOutlineBusinessCenter, MdOutlineEmail } from 'react-icons/md';
import { FaRegUser } from 'react-icons/fa';
import { FiPhone } from 'react-icons/fi';
import { LiaLockSolid } from 'react-icons/lia';
import { GoShieldCheck } from 'react-icons/go';

const NurserySignUp = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    daycareName: '',
    ownerName: '',
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
    console.log(formData);
  };

  return (
    <div className="nursery-container">
      <div className="nursery-box">
        <h2 className="nursery-title">{t('nursery.title')}</h2>
        <p className="nursery-subtitle">{t('nursery.subtitle')}</p>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label><MdOutlineBusinessCenter className="input-icon"/> {t('nursery.daycareName')}</label>
            <input type="text" name="daycareName" placeholder={t('nursery.daycarePlaceholder')} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label><FaRegUser className="input-icon"/> {t('nursery.ownerName')}</label>
            <input type="text" name="ownerName" placeholder={t('nursery.ownerPlaceholder')} onChange={handleChange} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label><MdOutlineEmail className="input-icon"/> {t('nursery.email')}</label>
              <input type="email" name="email" placeholder={t('nursery.emailPlaceholder')} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label><FiPhone className="input-icon"/> {t('nursery.phone')}</label>
              <input type="tel" name="phone" placeholder="+213" onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label><LiaLockSolid className="input-icon"/> {t('nursery.password')}</label>
              <input type="password" name="password" placeholder="••••••••" onChange={handleChange} />
            </div>
            <div className="form-group">
              <label><GoShieldCheck className="input-icon"/> {t('nursery.confirmPassword')}</label>
              <input type="password" name="confirmPassword" placeholder="••••••••" onChange={handleChange} />
            </div>
          </div>

          <button type="submit" className="nursery-btn">
            {t('nursery.btn')} →
          </button>
        </form>

        <p className="login-link">{t('nursery.loginLink')} <a href="#">{t('nursery.login')}</a></p>
      </div>
    </div>
  );
};

export default NurserySignUp;