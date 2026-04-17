import { BrowserRouter, Route, Routes } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute"
import PublicOnlyRoute from "./components/PublicOnlyRoute"
import Home from "./pages/Home"
import Landing from "./pages/Landing"
import Login from "./pages/Login"
import ProfileSetup from "./pages/ProfileSetup"
import Signup from "./pages/Signup"
import VerifyEmail from "./pages/VerifyEmail"
import CreateProject from './pages/CreateProject'
import Profile from './pages/Profile'
import EditProfile from './pages/EditProfile'


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/signup" element={<PublicOnlyRoute><Signup />
        
        </PublicOnlyRoute>} />
        <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute requireProfileComplete>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/create-project" element={
  <ProtectedRoute>
    <CreateProject />
  </ProtectedRoute>
    } />
        <Route
          path="/profile-setup"
          element={
            <ProtectedRoute>
              <ProfileSetup />
            </ProtectedRoute>
          }
          
        />
        <Route path="/edit-profile" element={
     <ProtectedRoute>
      <EditProfile />
      </ProtectedRoute>
     } />
      </Routes>
      
      
    </BrowserRouter>
  )
}
