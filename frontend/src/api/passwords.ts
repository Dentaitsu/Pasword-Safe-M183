import { apiFetch } from './client'

export interface PasswordEntry {
  id: string
  website: string
  name: string
  email: string
  username: string
  password: string
}

export type PasswordInput = Omit<PasswordEntry, 'id'>

// GET /api/passwords -> PasswordEntry[] for the logged-in user
export function getPasswords() {
  return apiFetch<PasswordEntry[]>('/passwords')
}

// POST /api/passwords { website, name, email, username, password } -> created PasswordEntry (with id)
export function createPassword(data: PasswordInput) {
  return apiFetch<PasswordEntry>('/passwords', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// PUT /api/passwords/:id { website, name, email, username, password } -> updated PasswordEntry
export function updatePassword(id: string, data: PasswordInput) {
  return apiFetch<PasswordEntry>(`/passwords/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

// DELETE /api/passwords/:id -> 204
export function deletePassword(id: string) {
  return apiFetch<void>(`/passwords/${id}`, { method: 'DELETE' })
}
