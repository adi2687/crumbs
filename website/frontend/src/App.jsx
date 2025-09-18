import Landing from './assets/components/landing'
import Calculator from './assets/components/calculator'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
const App = () => {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/calculator" element={<Calculator />} />
        </Routes>
    </Router>
  )
}

export default App