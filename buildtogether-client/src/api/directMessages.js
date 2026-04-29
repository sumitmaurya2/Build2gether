import { BASE_URL } from "./config"
import { apiFetch, readResponse } from "./request"

export async function getConversations(firebaseUid) {
  const response = await apiFetch(`${BASE_URL}/api/dm/${firebaseUid}`)
  return readResponse(response)
}

export async function getConversation(uid1, uid2) {
  const response = await apiFetch(`${BASE_URL}/api/dm/conversation/${uid1}/${uid2}`)
  return readResponse(response)
}
