import Landing from './assets/components/landing'
import Calculator from './assets/components/calculator'
import Contact from './assets/components/contact'
import NotFound from './assets/components/NotFound'
import Uploadbtn from './assets/components/uploadbtn'
import Joinnet from './assets/components/Join'
import Auth from './assets/components/auth'
import Demo from './assets/components/animations'
import Profile from './assets/components/profile' 
import { Analytics } from "@vercel/analytics/react"
import UsersPage from './assets/components/users'
import UploadPage from './assets/components/upload'
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

// Navigation wrapper component
const AppWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("crumbs_token");
    const currentPath = location.pathname;
    const protectedRoutes = ['/profile', '/analytics', '/upload', '/admin'];
    
    if (token && !protectedRoutes.includes(currentPath)) {
      if (currentPath === "/") {
        navigate("/profile");
      } else {
        navigate("/profile");
      }
    }
    
    if (protectedRoutes.includes(currentPath) && !token) {
      navigate('/auth');
    }
  }, [navigate, location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/calculator" element={<Calculator />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/uploadbtn" element={<Uploadbtn />} />
      <Route path="/join" element={<Joinnet />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/demo" element={<Demo />} /> 
      <Route path="*" element={<NotFound />} />
      <Route path='/profile' element={<Profile/>} /> 
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/admin" element={<UsersPage />} />
      <Route path="/upload" element={<UploadPage />} />
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <AppWrapper />
    </Router>
  )
}

export default App