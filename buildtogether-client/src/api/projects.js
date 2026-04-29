import { BASE_URL } from "./config"
import { apiFetch, readResponse } from "./request"

export async function createProject(projectData) {
  const response = await apiFetch(`${BASE_URL}/api/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(projectData),
  })

  return readResponse(response)
}

export async function getProjects(page = 1) {
  const response = await fetch(`${BASE_URL}/api/projects?page=${page}`)
  const data = await response.json()
  return data
}

export async function getUserProjects(firebaseUid) {
  const response = await apiFetch(`${BASE_URL}/api/projects/user/${firebaseUid}`)
  return readResponse(response)
}

export async function deleteProject(projectId) {
  const response = await apiFetch(`${BASE_URL}/api/projects/${projectId}`, {
    method: "DELETE",
  })
  return readResponse(response)
}

export async function updateProject(projectId, projectData) {
  const response = await apiFetch(`${BASE_URL}/api/projects/${projectId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(projectData),
  })
  return readResponse(response)
}
export async function searchProjects(query = "", stage = "", budget = "") {
  const params = new URLSearchParams()
  if (query) params.append("q", query)
  if (stage) params.append("stage", stage)
  if (budget) params.append("budget", budget)

  const response = await fetch(`${BASE_URL}/api/projects/search?${params}`)
  const data = await response.json()
  return data
}


export async function getProjectById(projectId) {
  const response = await fetch(`${BASE_URL}/api/projects/${projectId}`)
  return readResponse(response)
}
