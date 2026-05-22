// // //////////////////////////////first code works fine 
// import { useNavigate } from 'react-router-dom';
// import React, { useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import './accountverification.css';
// import axios from 'axios';

// const API = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
// });

// const AccountVerification = () => {
//   const { t } = useTranslation();
//   const navigate = useNavigate();

//   const [code, setCode] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [resendMsg, setResendMsg] = useState('');

//   const role  = localStorage.getItem('userRole');
//   const email = localStorage.getItem('userEmail');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setResendMsg('');

//     if (code.length !== 6) {
//       setError('Please enter the 6-digit code.');
//       return;
//     }

//     try {
//       setLoading(true);

//       await API.post('/auth/verify-otp', { email, code, role });

//       if (role === 'daycare') {
//         navigate('/daycare-profile');
//       } else {
//         navigate('/parent-dashboard');
//       }

//     } catch (err) {
//       setError(err.response?.data?.message || 'Invalid code. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleResend = async () => {
//     setError('');
//     setResendMsg('');
//     try {
//       await API.post('/auth/forgot-password', { email, role });
//       setResendMsg('A new code has been sent to your email.');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to resend. Try again.');
//     }
//   };

//   return (
//     <div className="login-container">
//       <div className="login-box">

//         <div className="verify-icon">
//           <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6B8E9E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//             <rect x="2" y="4" width="20" height="16" rx="2"/>
//             <path d="M2 7l10 7 10-7"/>
//           </svg>
//         </div>

//         <h2 className="login-title">Verify your account</h2>
//         <p className="login-subtitle">
//           We sent a verification code to your email.<br />
//           Please enter it below to continue.
//         </p>

//         {error && (
//           <p style={{ color: '#f87171', fontSize: '13px', marginBottom: '10px' }}>{error}</p>
//         )}
//         {resendMsg && (
//           <p style={{ color: '#34d399', fontSize: '13px', marginBottom: '10px' }}>{resendMsg}</p>
//         )}

//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label>Verification code</label>
//             <input
//               type="text"
//               name="code"
//               placeholder="Enter 6-digit code"
//               maxLength={6}
//               value={code}
//               onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
//               className="code-input"
//             />
//           </div>

//           <button type="submit" className="login-btn" disabled={loading}>
//             {loading ? 'Verifying...' : 'Verify account'}
//           </button>
//         </form>

//         <p className="forgot-link">
//           Didn't receive a code?{' '}
//           <a href="#!" onClick={(e) => { e.preventDefault(); handleResend(); }}>
//             Resend verification code
//           </a>
//         </p>

//       </div>
//     </div>
//   );
// };

// export default AccountVerification;
// // ////////////////////////////////second code tested and it work 
// // // import { useNavigate } from 'react-router-dom';
// // // import React, { useState } from 'react';
// // // import { useTranslation } from 'react-i18next';
// // // import './accountverification.css';
// // // import { verifyOtp } from '../api/auth';

// // // const AccountVerification = () => {
// // //   const { t } = useTranslation();
// // //   const navigate = useNavigate();

// // //   const [code,      setCode]      = useState('');
// // //   const [loading,   setLoading]   = useState(false);
// // //   const [error,     setError]     = useState('');
// // //   const [resendMsg, setResendMsg] = useState('');

// // //   const role  = localStorage.getItem('userRole');
// // //   const email = localStorage.getItem('userEmail');

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();
// // //     setError('');
// // //     setResendMsg('');

// // //     if (code.length !== 6) {
// // //       setError('Please enter the 6-digit code.');
// // //       return;
// // //     }

// // //     try {
// // //       setLoading(true);

// // //       await verifyOtp(email, code, role);

// // //       // ── Verification succeeded — clean up temp storage ─────────────────────
// // //       // Do NOT navigate to the dashboard — the user has no token/session yet.
// // //       // Send them to login so loginParent() runs and saves token + full user.
// // //       localStorage.removeItem('userRole');
// // //       localStorage.removeItem('userEmail');

// // //       // Pass a flag so the login page can show a "verified!" success message
// // //       navigate(
// // //         role === 'daycare' ? '/daycare-login' : '/parent-login',
// // //         { state: { verified: true, email } }
// // //       );

// // //     } catch (err) {
// // //       setError(err.response?.data?.message || 'Invalid code. Please try again.');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const handleResend = async () => {
// // //     setError('');
// // //     setResendMsg('');
// // //     try {
// // //       // Use the correct resend endpoint — forgot-password sends a reset code,
// // //       // not a verification code. Use verify-otp resend if your API has one,
// // //       // otherwise this is the closest available endpoint.
// // //       await verifyOtp(email, '', role).catch(() => {}); // trigger resend if supported
// // //       setResendMsg('A new code has been sent to your email.');
// // //     } catch {
// // //       setResendMsg('A new code has been sent to your email.');
// // //     }
// // //   };

// // //   return (
// // //     <div className="login-container">
// // //       <div className="login-box">

// // //         <div className="verify-icon">
// // //           <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6B8E9E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
// // //             <rect x="2" y="4" width="20" height="16" rx="2"/>
// // //             <path d="M2 7l10 7 10-7"/>
// // //           </svg>
// // //         </div>

// // //         <h2 className="login-title">Verify your account</h2>
// // //         <p className="login-subtitle">
// // //           We sent a verification code to your email.<br />
// // //           Please enter it below to continue.
// // //         </p>

// // //         {error     && <p style={{ color: '#f87171', fontSize: '13px', marginBottom: '10px' }}>{error}</p>}
// // //         {resendMsg && <p style={{ color: '#34d399', fontSize: '13px', marginBottom: '10px' }}>{resendMsg}</p>}

// // //         <form onSubmit={handleSubmit}>
// // //           <div className="form-group">
// // //             <label>Verification code</label>
// // //             <input
// // //               type="text"
// // //               name="code"
// // //               placeholder="Enter 6-digit code"
// // //               maxLength={6}
// // //               value={code}
// // //               onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
// // //               className="code-input"
// // //             />
// // //           </div>

// // //           <button type="submit" className="login-btn" disabled={loading}>
// // //             {loading ? 'Verifying...' : 'Verify account'}
// // //           </button>
// // //         </form>

// // //         <p className="forgot-link">
// // //           Didn't receive a code?{' '}
// // //           <a href="#!" onClick={(e) => { e.preventDefault(); handleResend(); }}>
// // //             Resend verification code
// // //           </a>
// // //         </p>

// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default AccountVerification;
// // /////////////another code to test
// // import { useNavigate } from 'react-router-dom';
// // import React, { useState } from 'react';
// // import { useTranslation } from 'react-i18next';
// // import './accountverification.css';
// // import { verifyOtp } from '../api/auth';

// // const AccountVerification = () => {
// //   const { t } = useTranslation();
// //   const navigate = useNavigate();

// //   const [code,      setCode]      = useState('');
// //   const [loading,   setLoading]   = useState(false);
// //   const [error,     setError]     = useState('');
// //   const [resendMsg, setResendMsg] = useState('');

// //   const role  = localStorage.getItem('userRole');
// //   const email = localStorage.getItem('userEmail');

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setError('');
// //     setResendMsg('');

// //     if (code.length !== 6) {
// //       setError('Please enter the 6-digit code.');
// //       return;
// //     }

// //     try {
// //       setLoading(true);

// //       const res = await verifyOtp(email, code, role);

// //       // ── Read the signup data we saved in SignUp.jsx ────────────────────────
// //       const pendingUser = JSON.parse(localStorage.getItem('pendingUser') || '{}');

// //       if (res.data?.token) {
// //         // Backend returns a token on verify — use it directly, go to dashboard
// //         const user = {
// //           ...pendingUser,
// //           id:   res.data.user?.id   || null,
// //           role: res.data.user?.role || role,
// //         };
// //         localStorage.setItem('token',    res.data.token);
// //         localStorage.setItem('userRole', user.role);
// //         localStorage.setItem('user',     JSON.stringify(user));

// //         localStorage.removeItem('pendingUser');
// //         localStorage.removeItem('userEmail');
// //         localStorage.removeItem('userRole');

// //         navigate(role === 'daycare' ? '/daycare-profile' : '/parent-dashboard');

// //       } else {
// //         // No token — user needs to log in, but we pre-fill email and show
// //         // a success message so it feels seamless
// //         localStorage.removeItem('pendingUser');
// //         localStorage.removeItem('userEmail');
// //         localStorage.removeItem('userRole');

// //         navigate('/parent-login', { state: { verified: true, email } });
// //       }

// //     } catch (err) {
// //       setError(err.response?.data?.message || 'Invalid code. Please try again.');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleResend = async () => {
// //     setError('');
// //     setResendMsg('');
// //     try {
// //       await verifyOtp(email, '', role);
// //     } catch {
// //       // expected to fail with empty code — just show message
// //     }
// //     setResendMsg('A new code has been sent to your email.');
// //   };

// //   return (
// //     <div className="login-container">
// //       <div className="login-box">

// //         <div className="verify-icon">
// //           <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6B8E9E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
// //             <rect x="2" y="4" width="20" height="16" rx="2"/>
// //             <path d="M2 7l10 7 10-7"/>
// //           </svg>
// //         </div>

// //         <h2 className="login-title">Verify your account</h2>
// //         <p className="login-subtitle">
// //           We sent a verification code to your email.<br />
// //           Please enter it below to continue.
// //         </p>

// //         {error     && <p style={{ color: '#f87171', fontSize: '13px', marginBottom: '10px' }}>{error}</p>}
// //         {resendMsg && <p style={{ color: '#34d399', fontSize: '13px', marginBottom: '10px' }}>{resendMsg}</p>}

// //         <form onSubmit={handleSubmit}>
// //           <div className="form-group">
// //             <label>Verification code</label>
// //             <input
// //               type="text"
// //               name="code"
// //               placeholder="Enter 6-digit code"
// //               maxLength={6}
// //               value={code}
// //               onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
// //               className="code-input"
// //             />
// //           </div>

// //           <button type="submit" className="login-btn" disabled={loading}>
// //             {loading ? 'Verifying...' : 'Verify account'}
// //           </button>
// //         </form>

// //         <p className="forgot-link">
// //           Didn't receive a code?{' '}
// //           <a href="#!" onClick={(e) => { e.preventDefault(); handleResend(); }}>
// //             Resend verification code
// //           </a>
// //         </p>

// //       </div>
// //     </div>
// //   );
// // };

// // export default AccountVerification;
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './accountverification.css';
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

const AccountVerification = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendMsg, setResendMsg] = useState('');

  // Read from pendingUser set during registration, not from active session
  const pendingUser = JSON.parse(localStorage.getItem('pendingUser') || '{}');
  const role  = pendingUser.role  || localStorage.getItem('userRole');
  const email = pendingUser.email || localStorage.getItem('userEmail');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResendMsg('');

    if (code.length !== 6) {
      setError('Please enter the 6-digit code.');
      return;
    }

    try {
      setLoading(true);

      await API.post('/auth/verify-otp', { email, code, role });

      // Clean up pending state
      localStorage.removeItem('pendingUser');
      localStorage.removeItem('userEmail');

      // Redirect to the correct login page so they start a clean session
      if (role === 'daycare') {
        navigate('/daycare-login');
      } else {
        navigate('/parent-login');
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setResendMsg('');
    try {
      await API.post('/auth/resend-otp', { email, role });
      setResendMsg('A new code has been sent to your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend. Try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">

        <div className="verify-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6B8E9E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2"/>
            <path d="M2 7l10 7 10-7"/>
          </svg>
        </div>

        <h2 className="login-title">Verify your account</h2>
        <p className="login-subtitle">
          We sent a verification code to your email.<br />
          Please enter it below to continue.
        </p>

        {error && (
          <p style={{ color: '#f87171', fontSize: '13px', marginBottom: '10px' }}>{error}</p>
        )}
        {resendMsg && (
          <p style={{ color: '#34d399', fontSize: '13px', marginBottom: '10px' }}>{resendMsg}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Verification code</label>
            <input
              type="text"
              name="code"
              placeholder="Enter 6-digit code"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              className="code-input"
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify account'}
          </button>
        </form>

        <p className="forgot-link">
          Didn't receive a code?{' '}
          <a href="#!" onClick={(e) => { e.preventDefault(); handleResend(); }}>
            Resend verification code
          </a>
        </p>

      </div>
    </div>
  );
};

export default AccountVerification;