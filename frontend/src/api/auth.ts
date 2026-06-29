import { apiFetch } from './client'

// POST /api/auth/login { username, password } -> 200 + sets httpOnly JWT cookie, 401 on bad credentials
export function login(username: string, password: string) {
  return apiFetch<void>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
}

// POST /api/auth/logout -> 200 + clears the auth cookie
export function logout() {
  return apiFetch<void>('/auth/logout', { method: 'POST' })
}
