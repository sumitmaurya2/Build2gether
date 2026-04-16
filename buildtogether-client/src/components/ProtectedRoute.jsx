import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { getProtectedRedirect } from "../utils/authFlow"

export default function ProtectedRoute({
  children,
  requireProfileComplete = false,
  requireIncompleteProfile = false,
}) {
  const { user, userProfile } = useAuth()

  const redirectTo = getProtectedRedirect(user, userProfile, {
    requireProfileComplete,
    requireIncompleteProfile,
  })

  if (redirectTo) {
    return <Navigate to={redirectTo} replace />
  }

  return children
}
