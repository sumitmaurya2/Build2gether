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
import PublicOnlyRoute from './components/PublicOnlyRoute'
import BottomNav from './components/BottomNav'
import Messages from './pages/Messages'
import DirectChat from './pages/DirectChat'
import { useAuth } from './context/AuthContext'

function MyProfileRedirect() {
  const { userProfile } = useAuth()
  return <Navigate to={userProfile?.username ? `/profile/${userProfile.username}` : '/home'} replace />
}


function AppContent() {
  const location = useLocation()
  const mobileNavPaths = ["/home", "/explore", "/create-project", "/messages", "/notifications"]
  const showNav = mobileNavPaths.includes(location.pathname)

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<PublicOnlyRoute><Signup /></PublicOnlyRoute>} />
        <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route
          path="/profile-setup"
          element={<ProtectedRoute requireIncompleteProfile><ProfileSetup /></ProtectedRoute>}
        />
        <Route
          path="/home"
          element={<ProtectedRoute requireProfileComplete><Home /></ProtectedRoute>}
        />
        <Route
          path="/explore"
          element={<ProtectedRoute requireProfileComplete><Explore /></ProtectedRoute>}
        />
        <Route
          path="/create-project"
          element={<ProtectedRoute requireProfileComplete><CreateProject /></ProtectedRoute>}
        />
        <Route
          path="/notifications"
          element={<ProtectedRoute requireProfileComplete><Notifications /></ProtectedRoute>}
        />
        <Route
          path="/requests"
          element={<ProtectedRoute requireProfileComplete><Requests /></ProtectedRoute>}
        />
        <Route
          path="/profile/:username"
          element={<ProtectedRoute requireProfileComplete><Profile /></ProtectedRoute>}
        />
        <Route
          path="/profile"
          element={<ProtectedRoute requireProfileComplete><MyProfileRedirect /></ProtectedRoute>}
        />
        <Route
          path="/edit-profile"
          element={<ProtectedRoute requireProfileComplete><EditProfile /></ProtectedRoute>}
        />
        <Route
          path="/project/:id"
          element={<ProtectedRoute requireProfileComplete><ProjectDetail /></ProtectedRoute>}
        />
        <Route
          path="/edit-project/:id"
          element={<ProtectedRoute requireProfileComplete><EditProject /></ProtectedRoute>}
        />
        <Route
          path="/project-room/:projectId"
          element={<ProtectedRoute requireProfileComplete><ProjectRoom /></ProtectedRoute>}
        />

        <Route
          path="/messages"
          element={<ProtectedRoute requireProfileComplete><Messages /></ProtectedRoute>}
        />
        <Route
          path="/dm/:receiverUid"
          element={<ProtectedRoute requireProfileComplete><DirectChat /></ProtectedRoute>}
        />
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
