const BASE_URL = "http://localhost:5000"

async function readResponse(response) {
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong")
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
