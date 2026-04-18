import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Landing from './pages/Landing'
import Signup from './pages/Signup'
import Login from './pages/Login'
import VerifyEmail from './pages/VerifyEmail'
import ProfileSetup from './pages/ProfileSetup'
import Home from './pages/Home'
import Explore from './pages/Explore'
import CreateProject from './pages/CreateProject'
import Notifications from './pages/Notifications'
import Requests from './pages/Requests'
import Profile from './pages/Profile'
import EditProfile from './pages/EditProfile'
import ProjectDetail from './pages/ProjectDetail'
import EditProject from './pages/EditProject'
import ProjectRoom from './pages/ProjectRoom'
import ProtectedRoute from './components/ProtectedRoute'
import BottomNav from './components/BottomNav'
import Messages from './pages/Messages'
import DirectChat from './pages/DirectChat'


function AppContent() {
  const location = useLocation()
  const protectedPaths = ["/home", "/explore", "/create-project", "/notifications", "/requests", "/profile", "/project"]
  const showNav = protectedPaths.some(p => location.pathname.startsWith(p))

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/profile-setup" element={<ProtectedRoute><ProfileSetup /></ProtectedRoute>} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
        <Route path="/create-project" element={<ProtectedRoute><CreateProject /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
        <Route path="/profile/:username" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
        <Route path="/project/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
        <Route path="/edit-project/:id" element={<ProtectedRoute><EditProject /></ProtectedRoute>} />
        <Route path="/project-room/:projectId" element={<ProtectedRoute><ProjectRoom /></ProtectedRoute>} />

        <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        <Route path="/dm/:receiverUid" element={<ProtectedRoute><DirectChat /></ProtectedRoute>} />
      </Routes>
      {showNav && <BottomNav />}
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}