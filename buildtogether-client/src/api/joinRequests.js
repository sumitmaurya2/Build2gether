import { BASE_URL } from "./config"

async function readResponse(response) {
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong")
  }

  return data
}

export async function sendJoinRequest(firebaseUid, projectId, message) {
  const response = await fetch(`${BASE_URL}/api/join-requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ firebaseUid, projectId, message }),
  })

  return readResponse(response)
}


export async function getProjectRequests(projectId) {
  const response = await fetch(`${BASE_URL}/api/join-requests/project/${projectId}`)
  return readResponse(response)
}

export async function updateRequestStatus(requestId, status) {
  const response = await fetch(`${BASE_URL}/api/join-requests/${requestId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  })
  return readResponse(response)
}
