import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <BrowserRouter>
      <Loading />
      <div className="App">
        <Navbar />
        <Routes>

          {/* Home with WhyChoose */}
          <Route path="/" element={
            <>
              <Home />
              <WhyChoose />
            </>
          } />

          <Route path="/join" element={<JoinPage />} />
          <Route path="/register-parent" element={<SignUp />} />
          <Route path="/parent-login" element={<ParentLogin />} />
          <Route path="/register-nursery" element={<NurserySignUp />} />
          <Route path="/daycare-profile" element={<DaycareProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/daycare/:id" element={<SunshineAcademyPage />} />

          {/* Protected routes */}
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

        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;