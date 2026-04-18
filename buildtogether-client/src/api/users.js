import { BASE_URL } from "./config"

async function readResponse(response) {
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const error = new Error(data.message || "Something went wrong")
    error.status = response.status
    throw error
  }

  return data
}

export async function createUser(firebaseUid, name, email) {
  const response = await fetch(`${BASE_URL}/api/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ firebaseUid, name, email }),
  })

  return readResponse(response)
}

export async function updateUserProfile(firebaseUid, profileData) {
  const response = await fetch(`${BASE_URL}/api/users/${firebaseUid}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profileData),
  })

  return readResponse(response)
}

export async function getUser(firebaseUid) {
  const response = await fetch(`${BASE_URL}/api/users/${firebaseUid}`)
  return readResponse(response)
}

export async function findOrCreateUser(firebaseUser, fallbackName) {
  try {
    return await getUser(firebaseUser.uid)
  } catch (error) {
    // Recover the app flow when Firebase auth exists but the API profile was never created.
    if (error.status !== 404) {
      throw error
    }

    const email = firebaseUser.email?.trim().toLowerCase()
    if (!email) {
      throw new Error("Account email missing hai, profile sync nahi ho payi.")
    }

    return createUser(firebaseUser.uid, fallbackName, email)
  }
}

export async function getUserByUsername(username) {
  const response = await fetch(`${BASE_URL}/api/users/username/${username}`)
  const data = await response.json()
  return data
}
