import { BASE_URL } from "./config"

export async function getNotifications(firebaseUid) {
  const response = await fetch(`${BASE_URL}/api/notifications/${firebaseUid}`)
  const data = await response.json()
  return data
}

export async function markAsRead(notificationId) {
  const response = await fetch(`${BASE_URL}/api/notifications/${notificationId}/read`, {
    method: "PATCH",
  })
  const data = await response.json()
  return data
}

export async function markAllAsRead(firebaseUid) {
  const response = await fetch(`${BASE_URL}/api/notifications/read-all/${firebaseUid}`, {
    method: "PATCH",
  })
  const data = await response.json()
  return data
}