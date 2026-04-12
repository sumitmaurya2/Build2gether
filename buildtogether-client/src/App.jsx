import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Signup from './pages/Signup'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-cream flex items-center justify-center text-ink font-sans">
                Dashboard — coming soon
              </div>
            </ProtectedRoute>
          } 
        />
        
      </Routes>
    </BrowserRouter>
  )
}