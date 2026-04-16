export const PROFILE_STORAGE_KEY = "buildtogether.userProfile"
export const PENDING_EMAIL_KEY = "buildtogether.pendingEmail"

export function requiresEmailVerification(user) {
  if (!user) {
    return false
  }

  return user.providerData.some((provider) => provider?.providerId === "password") && !user.emailVerified
}

export function isProfileComplete(existingUser) {
  return Boolean(existingUser?.profileComplete)
}

export function getNextRoute(user, existingUser) {
  if (!user) {
    return "/login"
  }

  if (requiresEmailVerification(user)) {
    return "/verify-email"
  }

  return isProfileComplete(existingUser) ? "/home" : "/profile-setup"
}

export function getProtectedRedirect(user, existingUser, options = {}) {
  const {
    requireProfileComplete = false,
    requireIncompleteProfile = false,
  } = options

  if (!user) {
    return "/login"
  }

  if (requiresEmailVerification(user)) {
    return "/verify-email"
  }

  const profileComplete = isProfileComplete(existingUser)

  if (requireProfileComplete && !profileComplete) {
    return "/profile-setup"
  }

  if (requireIncompleteProfile && profileComplete) {
    return "/home"
  }

  return null
}

export function getDisplayName(user, fallbackName = "User") {
  return user?.displayName || user?.email?.split("@")[0] || fallbackName
}

export function readStoredProfile() {
  if (typeof window === "undefined") {
    return null
  }

  try {
    const value = window.localStorage.getItem(PROFILE_STORAGE_KEY)
    return value ? JSON.parse(value) : null
  } catch {
    return null
  }
}

export function writeStoredProfile(profile) {
  if (typeof window === "undefined") {
    return
  }

  try {
    if (!profile) {
      window.localStorage.removeItem(PROFILE_STORAGE_KEY)
      return
    }

    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile))
  } catch {
    // Ignore storage errors and keep app flow working.
  }
}

export function readPendingEmail() {
  if (typeof window === "undefined") {
    return ""
  }

  return window.localStorage.getItem(PENDING_EMAIL_KEY) || ""
}

export function writePendingEmail(email) {
  if (typeof window === "undefined") {
    return
  }

  if (!email) {
    window.localStorage.removeItem(PENDING_EMAIL_KEY)
    return
  }

  window.localStorage.setItem(PENDING_EMAIL_KEY, email)
}
