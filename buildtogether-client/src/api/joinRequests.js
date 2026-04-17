const BASE_URL = "http://localhost:5000"

export async function sendJoinRequest(firebaseUid, projectId, message) {
  const response = await fetch(`${BASE_URL}/api/join-requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ firebaseUid, projectId, message }),
  })

  const data = await response.json()
  return data
}