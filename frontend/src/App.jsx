import React from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPass from './pages/ForgotPass'
import ResetPass from './pages/ResetPass'
import ProtectedRoute from './components/ProtectedRoute'
import Chats from './pages/Chats'
import { Toaster } from 'react-hot-toast'
const App = () => {
  return (
    <>
     <Toaster position="top-center" reverseOrder={false} />
    
      <Routes>
        <Route path="/" element ={<Login/>}/>
        <Route path="/signup" element={<Signup />} />

      <Route path="/forgot-password" element={<ForgotPass />} />
      <Route path="/reset-password" element={<ResetPass />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/chats" element={<Chats />} />
        {/* Add more protected pages here */}
      </Route>
      </Routes>
   
    </>
  )
}

export default App
