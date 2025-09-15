import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <h1>Project Crumbs</h1>
        <p>Peer-to-peer file sharing</p>
      </div>
      <footer>
        made by aditya kurani
      </footer>
    </>
  )
}

export default App
