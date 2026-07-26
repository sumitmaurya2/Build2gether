import { BASE_URL } from "./config"
import { apiFetch, readResponse } from "./request"

export async function getConversations(firebaseUid) {
  const response = await apiFetch(`${BASE_URL}/api/dm/${firebaseUid}`)
  return readResponse(response)
}

export async function getConversation(uid1, uid2, page = 1, limit = 50) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  const response = await apiFetch(`${BASE_URL}/api/dm/conversation/${uid1}/${uid2}?${params}`)
  return readResponse(response)
}
