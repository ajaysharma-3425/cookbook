import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AuthProvider from './context/AuthContext.jsx'
import "./api/axiosInterceptor.js"
import "./api/axiosResponseInterceptor.js"
import { Toaster } from 'react-hot-toast'

{/* <Toaster position='top-right'/> */}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <Toaster position='top-right'/>
      <App />
    </AuthProvider>,
  </StrictMode>
)
