const DEFAULT_LOCAL_URL = "http://localhost:5000"

function normalizeBaseUrl(value) {
  if (!value) {
    return DEFAULT_LOCAL_URL
  }

  const trimmedValue = value.trim().replace(/\/+$/, "")
  if (!trimmedValue) {
    return DEFAULT_LOCAL_URL
  }

  // Railway/Vercel envs are sometimes saved without protocol; make them usable automatically.
  if (/^https?:\/\//i.test(trimmedValue)) {
    return trimmedValue
  }

  return `https://${trimmedValue}`
}

// Keep API and socket targets configurable for Railway while preserving local development defaults.
export const BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_URL)
export const SOCKET_URL = normalizeBaseUrl(import.meta.env.VITE_SOCKET_URL || BASE_URL)
