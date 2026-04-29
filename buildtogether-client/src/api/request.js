import { auth } from "../firebase"

async function authHeaders(headers = {}) {
  const token = await auth.currentUser?.getIdToken()
  return {
    ...headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export async function apiFetch(url, options = {}) {
  const headers = await authHeaders(options.headers)
  return fetch(url, {
    ...options,
    headers,
  })
}

export async function readResponse(response) {
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const error = new Error(data.message || "Something went wrong")
    error.status = response.status
    throw error
  }

  return data
}

export async function getAuthToken() {
  return auth.currentUser?.getIdToken()
}
