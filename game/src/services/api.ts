import axios from "axios"

export const API_URL = "http://localhost:3000"

const http = axios.create({
  baseURL: API_URL,
})

export async function getAnimals () {
  const { data, status } = await http.get("/api/animals")
  if(status != 200) return []
  return data.data
}

export async function getTopUsers () {
  const { data, status } = await http.get("/api/topUsers")
  if(status != 200) return []
  return data.data
}

export async function findOrCreateUser (username = "") {
  if(!username) return null
  const { data, status } = await http.get(`/api/users/${username}`)
  if(status != 200) return null
  return data.data
}

export async function updateUserPoints (username : string | undefined, points = 0) {
  console.log({username, points});
  if(!username) return null
  const { data, status } = await http.put(`/api/users`, {
    username,
    points
  })
  if(status != 200) return null
  return data.data
}