import Landing from './assets/components/landing'
import Calculator from './assets/components/calculator'
import Contact from './assets/components/contact'
import Navbar from './assets/components/Navbar'
import NotFound from './assets/components/NotFound'
import Uploadbtn from './assets/components/uploadbtn'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
const App = () => {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/navbar" element={<Navbar />} />
          <Route path="/uploadbtn" element={<Uploadbtn />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
    </Router>
  )
}

export default App