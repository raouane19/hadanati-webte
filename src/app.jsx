import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

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
function AppContent() {
  const location = useLocation();

  const hideNavbar =
    location.pathname.startsWith('/daycare/') ||
    location.pathname === '/search' ||
    location.pathname === '/search-results' || 
    location.pathname === '/parent-dashboard'||
 location.pathname === '/facility-profile' ||
  location.pathname.startsWith('/admin');
  return (
    <div className="App">
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={
          <>
            <Home />
            <WhyChoose />
          </>
        } />
        <Route path="/join" element={<JoinPage />} />
        <Route path="/register-parent" element={<SignUp />} />
        <Route path="/parent-verification" element={<AccountVerification />} />
        <Route path="/account-verification" element={<AccountVerification />} />
        <Route path="/parent-login" element={<ParentLogin />} />
       
        <Route path="/register-nursery" element={<NurserySignUp />} />
        
         <Route path="/daycare-profile" element={
          <ProtectedRoute allowedRoles={['daycare']}>
            <DaycareProfile />
          </ProtectedRoute>
        } />
        <Route path="/parent-dashboard" element={
          <ProtectedRoute allowedRoles={['parent']}>
            <ParentDashboard />
          </ProtectedRoute>
        } />
        <Route path="/hadanati-login" element={<HadanatiLogin />} />
        <Route path="/daycare-profile" element={<DaycareProfile />} />
        <Route path="/facility-profile" element={<FacilityProfileEditor />} />
        <Route path="/login" element={<Login />} />
        <Route path="/daycare/:id" element={<SunshineAcademyPage />} />
        <Route path="/reviews" element={<AllReviews />} />
        <Route path="/about" element={<About />}/>
        
        <Route path="/search-results" element={<SearchResults />} />
        <Route path="/reset-password" element={<ResetPassword />} />
         <Route path="AdminLogin" element={<AdminLogin />} />
         <Route path="/admin/login" element={<AdminLogin />} />
<Route path="/admin/daycares" element={<DaycaresPage />} />
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
// import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

// import Navbar from "./components/navbar";
// import Footer from "./components/Footer";
// import Home from "./components/home";
// import WhyChoose from "./components/WhyChoose";
// import JoinPage from "./pages/join-page";
// import SignUp from './pages/SignUp';
// import ParentLogin from './pages/parentlogin';
// import NurserySignUp from './pages/nurserySignUp';
// import Loading from "./components/Loading";
// import DaycareProfile from "./pages/daycareprofile";
// import Login from './pages/daycarelogin';
// import ParentDashboard from './pages/parentdashboard';
// import SunshineAcademyPage from './pages/viewdetailes';
// import ProtectedRoute from './components/ProtectedRoute';
// import SearchResults from './pages/SearchResults';
// import FacilityProfileEditor from './pages/editdaycareprofile';
// import HadanatiLogin from './pages/Login';
// import AccountVerification from './pages/accountverification';
// import AllReviews from './pages/AllReviews';
// import About from './pages/aboutus';
// import ResetPassword from './pages/ResetPassword';
// import AdminLogin from './pages/Admin/adminlogin';
// import DaycaresPage from './pages/Admin/Daycarespage';

// function AppContent() {
//   const location = useLocation();

//   const hideNavbar =
//     location.pathname.startsWith('/daycare/') ||
//     location.pathname === '/search' ||
//     location.pathname === '/search-results' || 
//     location.pathname === '/parent-dashboard' ||
//     location.pathname === '/facility-profile' ||
//     location.pathname.startsWith('/admin');

//   return (
//     <div className="App">
//       {!hideNavbar && <Navbar />}

//       {/* 👇 Only change: wrapped Routes in this div */}
//       <div key={location.pathname} className="page-transition">
//         <Routes>
//           <Route path="/" element={
//             <>
//               <Home />
//               <WhyChoose />
//             </>
//           } />
//           <Route path="/join" element={<JoinPage />} />
//           <Route path="/register-parent" element={<SignUp />} />
//           <Route path="/parent-verification" element={<AccountVerification />} />
//           <Route path="/account-verification" element={<AccountVerification />} />
//           <Route path="/parent-login" element={<ParentLogin />} />
//           <Route path="/register-nursery" element={<NurserySignUp />} />
//           <Route path="/daycare-profile" element={
//             <ProtectedRoute allowedRoles={['daycare']}>
//               <DaycareProfile />
//             </ProtectedRoute>
//           } />
//           <Route path="/parent-dashboard" element={
//             <ProtectedRoute allowedRoles={['parent']}>
//               <ParentDashboard />
//             </ProtectedRoute>
//           } />
//           <Route path="/hadanati-login" element={<HadanatiLogin />} />
//           <Route path="/facility-profile" element={<FacilityProfileEditor />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/daycare/:id" element={<SunshineAcademyPage />} />
//           <Route path="/reviews" element={<AllReviews />} />
//           <Route path="/about" element={<About />} />
//           <Route path="/search-results" element={<SearchResults />} />
//           <Route path="/reset-password" element={<ResetPassword />} />
//           <Route path="/admin/login" element={<AdminLogin />} />
//           <Route path="/admin/daycares" element={<DaycaresPage />} />
//         </Routes>
//       </div>

//       <Footer />
//     </div>
//   );
// }

// function App() {
//   return (
//     <BrowserRouter>
//       <Loading />
//       <AppContent />
//     </BrowserRouter>
//   );
// }

// export default App;