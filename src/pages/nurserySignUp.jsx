
import React, { useState } from 'react';
import './NurserySignUp.css';
import { useTranslation } from 'react-i18next';
import { MdOutlineBusinessCenter, MdOutlineEmail } from 'react-icons/md';
import { FaRegUser } from 'react-icons/fa';
import { FiPhone } from 'react-icons/fi';
import { LiaLockSolid } from 'react-icons/lia';
import { GoShieldCheck } from 'react-icons/go';
import { useNavigate, Link } from 'react-router-dom';
import { registerNursery } from '../api/auth'; // ✅ import API call


const NurserySignUp = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    daycareName: "",
    ownerName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {  // ✅ async
    e.preventDefault();

    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: formData.daycareName,       // ✅ backend expects "name"
        ownerName: formData.ownerName,    // ✅ backend expects "ownerName"
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      };

    await registerNursery(payload); // ✅ call backend

      // localStorage.setItem('token', response.data.token);
      // localStorage.setItem('userRole', 'daycare');
      // localStorage.setItem('userEmail', formData.email);
      localStorage.setItem('pendingUser', JSON.stringify({ email: formData.email, role: 'daycare' }));

      navigate('/account-verification');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="nursery-container">
      <div className="nursery-box">
        <h2 className="nursery-title">
          {t("nursery.title")}
        </h2>

        <p className="nursery-subtitle">
          {t("nursery.subtitle")}
        </p>

        {/* ✅ Show error message */}
        {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label>
              <MdOutlineBusinessCenter className="input-icon" />
              {" "}
              {t("nursery.daycareName")}
            </label>

            <input
              type="text"
              name="daycareName"
              value={formData.daycareName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>
              <FaRegUser className="input-icon" />
              {" "}
              {t("nursery.ownerName")}
            </label>

            <input
              type="text"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                <MdOutlineEmail className="input-icon" />
                {" "}
                {t("nursery.email")}
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>
                <FiPhone className="input-icon" />
                {" "}
                {t("nursery.phone")}
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                <LiaLockSolid className="input-icon" />
                {" "}
                {t("nursery.password")}
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>
                <GoShieldCheck className="input-icon" />
                {" "}
                {t("nursery.confirmPassword")}
              </label>

              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>


          {/* ✅ loading state on button */}
          <button type="submit" className="nursery-btn" disabled={loading}>
            {loading ? 'Registering...' : `${t('nursery.btn')} →`}


          </button>

        </form>

        <p className="login-link">
          {t("nursery.loginLink")}{" "}
          <Link to="/login">
            {t("nursery.login")}
          </Link>
        </p>

      </div>
    </div>
  );
};
export default NurserySignUp;