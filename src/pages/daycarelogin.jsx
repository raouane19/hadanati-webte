// import { useNavigate } from 'react-router-dom';
// import React, { useState } from 'react';
// import './daycarelogin.css';
// import { useTranslation } from 'react-i18next';

// const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// const Login = () => {
//   const { t } = useTranslation();
//   const navigate = useNavigate();
// const isLoggedIn = localStorage.getItem('token') && localStorage.getItem('userRole') === 'daycare';
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       const res = await fetch(`${BASE_URL}/auth/login`, { // 
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           email: formData.email,
//           password: formData.password,
//           role: 'daycare', 
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         if (res.status === 401 && data.message?.includes('not verified')) {
//           setError('Your account is not verified yet. Please check your email for the OTP.');
//         } else if (res.status === 401) {
//           setError('Wrong password. Please try again.');
//         } else if (res.status === 404) {
//           setError('No account found with this email.');
//         } else {
//           setError(data.message || 'Login failed. Please try again.');
//         }
//         return;
//       }


//       localStorage.setItem('token', data.token);
//       localStorage.setItem('userRole', data.user.role);
//       localStorage.setItem('userId', String(data.user.id));
//       localStorage.setItem('userName', data.user.name);
// localStorage.setItem('user', JSON.stringify(data.user));
//       navigate('/facility-profile'); 

//     } catch {
//       setError('Cannot reach the server. Please try again later.');
//     } finally {
//       setLoading(false);
//     }
//   };
// if (isLoggedIn) {
//   return (
//     <div className="login-container">
//       <div className="login-box">
//         <h2 className="login-title">Welcome Back! 👋</h2>
//         <p className="login-subtitle">You're already logged in.</p>
//         <button
//           className="login-btn"
//           onClick={() => navigate('/facility-profile')}
//         >
//           Go to Dashboard
//         </button>
//       </div>
//     </div>
//   );
// }
//   return (
//     <div className="login-container">
//       <div className="login-box">
//         <h2 className="login-title">{t('login.title')}</h2>
//         <p className="login-subtitle">{t('login.subtitle')}</p>

//         {error && (
//           <p style={{ color: '#f87171', marginBottom: '12px', fontSize: '13px' }}>
//             {error}
//           </p>
//         )}

//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label>{t('login.email')}</label>
//             <input
//               type="email"
//               name="email"
//               placeholder={t('login.emailPlaceholder')}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label>{t('login.password')}</label>
//             <input
//               type="password"
//               name="password"
//               placeholder="••••••••"
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <button type="submit" className="login-btn" disabled={loading}>
//             {loading ? 'Logging in...' : t('login.btn')}
//           </button>
//         </form>

//         <p className="forgot-link">
//           <a href="#">{t('login.forgotPassword')}</a>
//         </p>
//         <p className="professional-link">{t('login.professional')}</p>
//       </div>
//     </div>
//   );
// };

// export default Login;
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import './daycarelogin.css';
import { useTranslation } from 'react-i18next';
import { loginDaycare } from '../api/auth.js'; // adjust path as needed

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const isLoggedIn =
    localStorage.getItem('token') && localStorage.getItem('userRole') === 'daycare';

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginDaycare(formData.email, formData.password);
      navigate('/daycare-profile');
    } catch (err) {
      const status = err?.response?.status;
      const message = err?.response?.data?.message || '';

      if (status === 401 && message.includes('not verified')) {
        setError('Your account is not verified yet. Please check your email for the OTP.');
      } else if (status === 401) {
        setError('Wrong password. Please try again.');
      } else if (status === 404) {
        setError('No account found with this email.');
      } else {
        setError(message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (isLoggedIn) {
    return (
      <div className="login-container">
        <div className="login-box">
          <h2 className="login-title">Welcome Back! 👋</h2>
          <p className="login-subtitle">You're already logged in.</p>
          <button className="login-btn" onClick={() => navigate('/facility-profile')}>
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">{t('login.title')}</h2>
        <p className="login-subtitle">{t('login.subtitle')}</p>

        {error && (
          <p style={{ color: '#f87171', marginBottom: '12px', fontSize: '13px' }}>{error}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('login.email')}</label>
            <input
              type="email"
              name="email"
              placeholder={t('login.emailPlaceholder')}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>{t('login.password')}</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Logging in...' : t('login.btn')}
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
