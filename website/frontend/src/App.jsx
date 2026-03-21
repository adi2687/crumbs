import Landing from './assets/components/landing'
import Calculator from './assets/components/calculator'
import Contact from './assets/components/contact'
import NotFound from './assets/components/NotFound'
import Uploadbtn from './assets/components/uploadbtn'
import Joinnet from './assets/components/Join'
import Auth from './assets/components/auth'
import Demo from './assets/components/animations'
import Profile from './assets/components/profile'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
const App = () => {
  return (
    <Router>
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
        </Routes>
    </Router>
  )
}

export default App