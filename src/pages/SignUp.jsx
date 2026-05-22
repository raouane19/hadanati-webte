

// /////////////////////////first code he work perfect
import { useNavigate, Link } from 'react-router-dom';
import React, { useState } from 'react';
import './SignUp.css';
import { useTranslation } from 'react-i18next';
import { FiPhone } from 'react-icons/fi';
import { registerParent } from '../api/auth'; // ✅ import the API call

const SignUp = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // ✅ loading state
  const [error, setError] = useState('');         // ✅ error state

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
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      };

      const response = await registerParent(payload); // ✅ call backend

      // Save token and role from backend response
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userRole', 'parent');
localStorage.setItem('userEmail', formData.email);
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

        {/* ✅ Show error message */}
        {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}

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

          {/* ✅ Show loading state on button */}
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
// //////////////////////////second code work with log in
// // import { useNavigate, Link } from 'react-router-dom';
// // import React, { useState } from 'react';
// // import './SignUp.css';
// // import { useTranslation } from 'react-i18next';
// // import { FiPhone } from 'react-icons/fi';
// // import { registerParent } from '../api/auth';

// // const SignUp = () => {
// //   const { t } = useTranslation();
// //   const navigate = useNavigate();
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState('');

// //   const [formData, setFormData] = useState({
// //     firstName: '',
// //     lastName: '',
// //     email: '',
// //     phone: '',
// //     password: '',
// //     confirmPassword: ''
// //   });

// //   const handleChange = (e) => {
// //     setFormData({ ...formData, [e.target.name]: e.target.value });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setError('');

// //     if (formData.password !== formData.confirmPassword) {
// //       setError("Passwords don't match!");
// //       return;
// //     }

// //     try {
// //       setLoading(true);

// //       const payload = {
// //         firstName: formData.firstName,
// //         lastName: formData.lastName,
// //         email: formData.email,
// //         phone: formData.phone,
// //         password: formData.password,
// //       };

// //       await registerParent(payload);

// //       localStorage.setItem('userRole', 'parent');
// //       localStorage.setItem('userEmail', formData.email);
// //       navigate('/parent-verification');
// //     } catch (err) {
// //       console.error(err);
// //       setError(err.response?.data?.message || 'Registration failed. Please try again.');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="signup-container">
// //       <div className="signup-box">
// //         <h2 className="signup-title">{t('signup.title')}</h2>
// //         <p className="signup-subtitle">{t('signup.subtitle')}</p>

// //         {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}

// //         <form onSubmit={handleSubmit}>
// //           <div className="form-row">
// //             <div className="form-group">
// //               <label>{t('signup.firstName')}</label>
// //               <input type="text" name="firstName" placeholder={t('signup.firstNamePlaceholder')} onChange={handleChange} />
// //             </div>
// //             <div className="form-group">
// //               <label>{t('signup.lastName')}</label>
// //               <input type="text" name="lastName" placeholder={t('signup.lastNamePlaceholder')} onChange={handleChange} />
// //             </div>
// //           </div>

// //           <div className="form-group">
// //             <label>{t('signup.email')}</label>
// //             <input type="email" name="email" placeholder={t('signup.emailPlaceholder')} onChange={handleChange} />
// //           </div>

// //           <div className="form-group">
// //             <label>{t('signup.phone')}</label>
// //             <div className="input-with-icon">
// //               <FiPhone className="input-icon-inside" />
// //               <input type="tel" name="phone" placeholder="+213" onChange={handleChange} />
// //             </div>
// //           </div>

// //           <div className="form-row">
// //             <div className="form-group">
// //               <label>{t('signup.password')}</label>
// //               <input type="password" name="password" placeholder="••••••••" onChange={handleChange} />
// //             </div>
// //             <div className="form-group">
// //               <label>{t('signup.confirmPassword')}</label>
// //               <input type="password" name="confirmPassword" placeholder="••••••••" onChange={handleChange} />
// //             </div>
// //           </div>

// //           <button type="submit" className="signup-btn" disabled={loading}>
// //             {loading ? 'Signing up...' : t('signup.btn')}
// //           </button>
// //         </form>

// //         <p className="login-link">
// //           {t('signup.loginLink')}{' '}
// //           <Link to="/parent-login">{t('signup.login')}</Link>
// //         </p>
// //         <p className="professional-link">{t('signup.professional')}</p>
// //       </div>
// //     </div>
// //   );
// // };

// // export default SignUp;
// ////////////////////////another code for testing 
// import { useNavigate, Link } from 'react-router-dom';
// import React, { useState } from 'react';
// import './SignUp.css';
// import { useTranslation } from 'react-i18next';
// import { FiPhone } from 'react-icons/fi';
// import { registerParent } from '../api/auth';

// const SignUp = () => {
//   const { t } = useTranslation();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [error,   setError]   = useState('');

//   const [formData, setFormData] = useState({
//     firstName:       '',
//     lastName:        '',
//     email:           '',
//     phone:           '',
//     password:        '',
//     confirmPassword: '',
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     if (formData.password !== formData.confirmPassword) {
//       setError("Passwords don't match!");
//       return;
//     }

//     try {
//       setLoading(true);

//       const payload = {
//         firstName: formData.firstName,
//         lastName:  formData.lastName,
//         email:     formData.email,
//         phone:     formData.phone,
//         password:  formData.password,
//       };

//       await registerParent(payload);

//       // ── Save everything we know about the user so OTP page can use it ──────
//       localStorage.setItem('userRole',       'parent');
//       localStorage.setItem('userEmail',      formData.email);
//       localStorage.setItem('pendingUser', JSON.stringify({
//         first_name: formData.firstName,
//         last_name:  formData.lastName,
//         name:       `${formData.firstName} ${formData.lastName}`.trim(),
//         email:      formData.email,
//         phone:      formData.phone,
//         role:       'parent',
//       }));

//       navigate('/parent-verification');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Registration failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="signup-container">
//       <div className="signup-box">
//         <h2 className="signup-title">{t('signup.title')}</h2>
//         <p className="signup-subtitle">{t('signup.subtitle')}</p>

//         {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}

//         <form onSubmit={handleSubmit}>
//           <div className="form-row">
//             <div className="form-group">
//               <label>{t('signup.firstName')}</label>
//               <input type="text" name="firstName" placeholder={t('signup.firstNamePlaceholder')} onChange={handleChange} required />
//             </div>
//             <div className="form-group">
//               <label>{t('signup.lastName')}</label>
//               <input type="text" name="lastName" placeholder={t('signup.lastNamePlaceholder')} onChange={handleChange} required />
//             </div>
//           </div>

//           <div className="form-group">
//             <label>{t('signup.email')}</label>
//             <input type="email" name="email" placeholder={t('signup.emailPlaceholder')} onChange={handleChange} required />
//           </div>

//           <div className="form-group">
//             <label>{t('signup.phone')}</label>
//             <div className="input-with-icon">
//               <FiPhone className="input-icon-inside" />
//               <input type="tel" name="phone" placeholder="+213" onChange={handleChange} />
//             </div>
//           </div>

//           <div className="form-row">
//             <div className="form-group">
//               <label>{t('signup.password')}</label>
//               <input type="password" name="password" placeholder="••••••••" onChange={handleChange} required />
//             </div>
//             <div className="form-group">
//               <label>{t('signup.confirmPassword')}</label>
//               <input type="password" name="confirmPassword" placeholder="••••••••" onChange={handleChange} required />
//             </div>
//           </div>

//           <button type="submit" className="signup-btn" disabled={loading}>
//             {loading ? 'Signing up...' : t('signup.btn')}
//           </button>
//         </form>

//         <p className="login-link">
//           {t('signup.loginLink')}{' '}
//           <Link to="/parent-login">{t('signup.login')}</Link>
//         </p>
//         <p className="professional-link">{t('signup.professional')}</p>
//       </div>
//     </div>
//   );
// };

// export default SignUp;