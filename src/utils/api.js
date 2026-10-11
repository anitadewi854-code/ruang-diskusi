const BASE = 'https://forum-api.dicoding.dev/v1'
const TOKEN_KEY = 'ruang_diskusi_token'

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (token) => (
  token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY)
)

async function request (path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth) headers.Authorization = `Bearer ${getToken()}`
  const res = await fetch(`${BASE}${path}`, { method, headers, body: body && JSON.stringify(body) })
  const json = await res.json()
  if (json.status !== 'success') throw new Error(json.message)
  return json.data
}

const post = (path, body, auth = true) => request(path, { method: 'POST', body, auth })

const api = {
  register: (body) => post('/register', body, false),
  login: async (body) => (await post('/login', body, false)).token,
  me: async () => (await request('/users/me', { auth: true })).user,
  users: async () => (await request('/users')).users,
  threads: async () => (await request('/threads')).threads,
  thread: async (id) => (await request(`/threads/${id}`)).detailThread,
  addThread: async (body) => (await post('/threads', body)).thread,
  addComment: async (id, content) => (await post(`/threads/${id}/comments`, { content })).comment,
  vote: (path, type) => post(`${path}/${type}`),
  leaderboards: async () => (await request('/leaderboards')).leaderboards
}

export default api
