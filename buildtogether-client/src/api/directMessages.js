import { BASE_URL } from "./config"

export async function getConversations(firebaseUid) {
  const response = await fetch(`${BASE_URL}/api/dm/${firebaseUid}`)
  const data = await response.json()
  return data
}

export async function getConversation(uid1, uid2) {
  const response = await fetch(`${BASE_URL}/api/dm/conversation/${uid1}/${uid2}`)
  const data = await response.json()
  return data
}