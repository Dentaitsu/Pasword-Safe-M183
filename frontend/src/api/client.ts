const API_BASE = '/api'

export const AUTH_EXPIRED_EVENT = 'auth-expired'

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  // backend should return 401 whenever the JWT cookie is missing/expired
  if (res.status === 401) {
    window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT))
    throw new ApiError(401, 'Session expired')
  }

  if (!res.ok) {
    throw new ApiError(res.status, await res.text())
  }

  if (res.status === 204) {
    return undefined as T
  }

  return res.json() as Promise<T>
}
