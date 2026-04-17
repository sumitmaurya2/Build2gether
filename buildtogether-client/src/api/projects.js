const BASE_URL = "http://localhost:5000"

export async function createProject(projectData) {
  const response = await fetch(`${BASE_URL}/api/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(projectData),
  })

  const data = await response.json()
  return data
}

export async function getProjects() {
  const response = await fetch(`${BASE_URL}/api/projects`)
  const data = await response.json()
  return data
}

export async function getUserProjects(firebaseUid) {
  const response = await fetch(`${BASE_URL}/api/projects/user/${firebaseUid}`)
  const data = await response.json()
  return data
}