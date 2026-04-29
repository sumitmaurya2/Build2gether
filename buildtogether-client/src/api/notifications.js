import { BASE_URL } from "./config"
import { apiFetch, readResponse } from "./request"

export async function getNotifications(firebaseUid) {
  const response = await apiFetch(`${BASE_URL}/api/notifications/${firebaseUid}`)
  return readResponse(response)
}

export async function markAsRead(notificationId) {
  const response = await apiFetch(`${BASE_URL}/api/notifications/${notificationId}/read`, {
    method: "PATCH",
  })
  return readResponse(response)
}

export async function markAllAsRead(firebaseUid) {
  const response = await apiFetch(`${BASE_URL}/api/notifications/read-all/${firebaseUid}`, {
    method: "PATCH",
  })
  return readResponse(response)
}
