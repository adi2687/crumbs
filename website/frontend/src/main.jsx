import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'  

const token = localStorage.getItem("crumbs_token")
const currentPath=window.location.pathname 

const protectedRoutes= ['/profile','/analytics','/upload'] 
if (token && !protectedRoutes.includes(currentPath)){ 
  if (currentPath==="/"){
    window.location.href="/profile"
  }else{ 

  window.location.href="/profile"
  }
} 
if (protectedRoutes.includes(currentPath) && !token){
  window.location.href='/auth'
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
