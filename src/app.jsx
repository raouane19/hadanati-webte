import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from "./components/navbar";
import Footer from "./components/Footer";
import Home from "./components/home";
import JoinPage from "./pages/join-page";
import SignUp from './pages/SignUp';
import NurserySignUp from './pages/nurserySignUp';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/join" element={<JoinPage />} />
          <Route path="/register-parent" element={<SignUp />} />
          <Route path="/register-nursery" element={<NurserySignUp />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;