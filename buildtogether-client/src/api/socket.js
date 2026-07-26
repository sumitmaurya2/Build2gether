import { io } from "socket.io-client"
import { SOCKET_URL } from "./config"
import { getAuthToken } from "./request"

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnectionAttempts: 3,
  timeout: 10000,
  withCredentials: false,
})

export async function connectSocket() {
  const token = await getAuthToken()
  if (!token) {
    throw new Error("Authentication required for realtime connection")
  }

  socket.auth = { token }

  if (!socket.connected) {
    socket.connect()
  }

  return socket
}
