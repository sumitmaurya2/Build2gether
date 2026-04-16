import { createContext, useContext, useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { getUser } from "../api/users"
import { auth } from "../firebase"
import { readStoredProfile, writePendingEmail, writeStoredProfile } from "../utils/authFlow"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfileState] = useState(() => readStoredProfile())
  const [loading, setLoading] = useState(true)

  function setUserProfile(profile) {
    setUserProfileState(profile)
    writeStoredProfile(profile)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)

      if (!currentUser) {
        setUserProfile(null)
        writePendingEmail("")
        setLoading(false)
        return
      }

      writePendingEmail(currentUser.email || "")

      try {
        const profile = await getUser(currentUser.uid)
        setUserProfile(profile)
      } catch {
        const cachedProfile = readStoredProfile()
        if (!cachedProfile || cachedProfile.firebaseUid !== currentUser.uid) {
          setUserProfile(null)
        }
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, setUserProfile }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
