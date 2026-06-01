import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';

import Navbar from "./components/navbar";
import Footer from "./components/Footer";
import Home from "./components/home";
import WhyChoose from "./components/WhyChoose";
import JoinPage from "./pages/join-page";
import SignUp from './pages/SignUp';
import ParentLogin from './pages/parentlogin';
import NurserySignUp from './pages/nurserySignUp';
import Loading from "./components/Loading";
import DaycareProfile from "./pages/daycareprofile";
import Login from './pages/daycarelogin';
import ParentDashboard from './pages/parentdashboard';
import SunshineAcademyPage from './pages/viewdetailes';
import ProtectedRoute from './components/ProtectedRoute';
import SearchResults from './pages/SearchResults';
import FacilityProfileEditor from './pages/editdaycareprofile';
import HadanatiLogin from './pages/Login';
import AccountVerification from './pages/accountverification';
import AllReviews from './pages/AllReviews';
import About from './pages/aboutus';
import ResetPassword from './pages/ResetPassword';
import AdminLogin from './pages/Admin/adminlogin';
import DaycaresPage from './pages/Admin/Daycarespage';
import AdminProtectedRoute from './pages/Admin/ProtectedRoute';
import HelpCenter from './pages/Helpcenter';
import PendingApproval from './pages/PendingApproval';
import AccountRecovery from './pages/Accountrecovery';
import MyChildren from './pages/Mychildren';   
import MyFavorites from './pages/MyFavorites'; 
import { getUser } from './api/auth';

// ── Guard for approved daycares only ──────────────────────────────────────
// If daycare is not yet approved (is_active=0), send them to pending-approval
const ApprovedDaycareRoute = ({ children }) => {
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'daycare') return <Navigate to="/" replace />;
  if (!user.is_active) return <Navigate to="/pending-approval" replace />;
  return children;
};

function AppContent() {
  const location = useLocation();

  const hideNavbar =
    location.pathname.startsWith('/daycare/') ||
    location.pathname === '/search' ||
    location.pathname === '/search-results' ||
    location.pathname === '/parent-dashboard' ||
    location.pathname === '/facility-profile' ||
    location.pathname === '/daycare-profile' ||
    location.pathname === '/pending-approval' ||
    location.pathname === '/reviews' ||
    location.pathname.startsWith('/admin');

  return (
    <div className="App">
      {!hideNavbar && <Navbar />}
      <Routes>
        {/* ── Public ── */}
        <Route path="/" element={<><Home /><WhyChoose /></>} />
        <Route path="/join" element={<JoinPage />} />
        <Route path="/register-parent" element={<SignUp />} />
        <Route path="/parent-verification" element={<AccountVerification />} />
        <Route path="/account-verification" element={<AccountVerification />} />
        <Route path="/parent-login" element={<ParentLogin />} />
        <Route path="/register-nursery" element={<NurserySignUp />} />
        <Route path="/hadanati-login" element={<HadanatiLogin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/daycare/:id" element={<SunshineAcademyPage />} />
        <Route path="/reviews" element={<AllReviews />} />
        <Route path="/about" element={<About />} />
        <Route path="/search-results" element={<SearchResults />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/pending-approval" element={<PendingApproval />} />

        {/* ── Protected (parent) ── */}
        <Route path="/parent-dashboard" element={
          <ProtectedRoute allowedRoles={['parent']}>
            <ParentDashboard />
          </ProtectedRoute>
        } />

        {/* ── Protected (daycare — must be logged in) ── */}
        <Route path="/daycare-profile" element={
          <ProtectedRoute allowedRoles={['daycare']}>
            <DaycareProfile />
          </ProtectedRoute>
        } />

        {/* ── Protected (daycare — must be APPROVED by admin) ── */}
        <Route path="/facility-profile" element={
          <ApprovedDaycareRoute>
            <FacilityProfileEditor />
          </ApprovedDaycareRoute>
        } />

        {/* ── Admin ── */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/daycares" element={
          <AdminProtectedRoute>
            <DaycaresPage />
          </AdminProtectedRoute>
        } />
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />

      </Routes>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Loading />
      <AppContent />
    </BrowserRouter>
  );
}

export default App;