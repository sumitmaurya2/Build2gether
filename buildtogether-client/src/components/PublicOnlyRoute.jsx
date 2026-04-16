import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { getNextRoute } from "../utils/authFlow"

export default function PublicOnlyRoute({ children }) {
  const { user, userProfile } = useAuth()

  if (!user) {
    return children
  }

  return <Navigate to={getNextRoute(user, userProfile)} replace />
}
