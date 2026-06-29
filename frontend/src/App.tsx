import { useEffect, useRef, useState } from 'react'
import { login as apiLogin, logout as apiLogout } from './api/auth'
import { AUTH_EXPIRED_EVENT, ApiError } from './api/client'
import {
  createPassword,
  deletePassword,
  getPasswords,
  updatePassword,
  type PasswordEntry,
  type PasswordInput,
} from './api/passwords'
import './App.css'

type Page = 'login' | 'home'

const emptyForm: PasswordInput = {
  website: '',
  name: '',
  email: '',
  username: '',
  password: '',
}

function App() {
  const [page, setPage] = useState<Page>('login')
  const [entries, setEntries] = useState<PasswordEntry[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)

  const [loginError, setLoginError] = useState<string | null>(null)
  const [loginPending, setLoginPending] = useState(false)

  const [form, setForm] = useState<PasswordInput>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set())
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const dialogRef = useRef<HTMLDialogElement>(null)
  const clipboardTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    function handleAuthExpired() {
      setPage('login')
      setEntries([])
      setLoginError('Your session expired, please log in again.')
    }
    window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired)
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired)
  }, [])

  useEffect(() => {
    if (page !== 'home') return
    getPasswords()
      .then((data) => {
        setEntries(data)
        setLoadError(null)
      })
      .catch((err: unknown) => {
        if (err instanceof ApiError && err.status === 401) return
        setLoadError('Could not load passwords.')
      })
  }, [page])

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const username = String(data.get('username') ?? '')
    const password = String(data.get('password') ?? '')

    setLoginPending(true)
    setLoginError(null)
    try {
      await apiLogin(username, password)
      setPage('home')
    } catch {
      setLoginError('Login failed, please check your credentials.')
    } finally {
      setLoginPending(false)
    }
  }

  async function handleLogout() {
    try {
      await apiLogout()
    } finally {
      setPage('login')
      setEntries([])
    }
  }

  const CLIPBOARD_CLEAR_MS = 10_000

  async function handleCopy(id: string, password: string) {
    await navigator.clipboard.writeText(password)
    setCopiedId(id)

    if (clipboardTimeoutRef.current) clearTimeout(clipboardTimeoutRef.current)
    clipboardTimeoutRef.current = setTimeout(() => {
      setCopiedId(null)
      navigator.clipboard.writeText('').catch(() => undefined)
    }, CLIPBOARD_CLEAR_MS)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function openDialog() {
    setFormError(null)
    dialogRef.current?.showModal()
  }

  function closeDialog() {
    dialogRef.current?.close()
    setEditingId(null)
    setForm(emptyForm)
    setFormError(null)
  }

  function handleAdd() {
    setEditingId(null)
    setForm(emptyForm)
    openDialog()
  }

  function handleEdit(entry: PasswordEntry) {
    setEditingId(entry.id)
    setForm({
      website: entry.website,
      name: entry.name,
      email: entry.email,
      username: entry.username,
      password: entry.password,
    })
    openDialog()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)
    try {
      if (editingId) {
        const updated = await updatePassword(editingId, form)
        setEntries(entries.map((entry) => (entry.id === editingId ? updated : entry)))
      } else {
        const created = await createPassword(form)
        setEntries([...entries, created])
      }
      closeDialog()
    } catch {
      setFormError('Could not save this entry.')
    }
  }

  async function handleDelete(id: string) {
    try {
      await deletePassword(id)
      setEntries(entries.filter((entry) => entry.id !== id))
    } catch {
      setLoadError('Could not delete this entry.')
    }
  }

  function handleShowPswrd(id: string) {
    setVisibleIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  if (page === 'login') {
    return (
      <div className="login-page">
        <form className="login-form" onSubmit={handleLogin}>
          <h1>Password Safe</h1>
          <label>
            Username
            <input name="username" autoComplete="username" required />
          </label>
          <label>
            Password
            <input name="password" type="password" autoComplete="current-password" required />
          </label>
          {loginError && <p className="error">{loginError}</p>}
          <button type="submit" disabled={loginPending}>
            {loginPending ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Password Safe</h1>
        <div>
          <button type="button" onClick={handleAdd}>
            Add
          </button>
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {loadError && <p className="error">{loadError}</p>}

      <table>
        <thead>
          <tr>
            <th>Website</th>
            <th>Name</th>
            <th>Email</th>
            <th>Username</th>
            <th>Password</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td>{entry.website}</td>
              <td>{entry.name}</td>
              <td>{entry.email}</td>
              <td>{entry.username}</td>
              <td className="password-cell">{visibleIds.has(entry.id) ? entry.password : '••••••••'}</td>
              <td className="actions">
                <button type="button" onClick={() => handleShowPswrd(entry.id)}>
                  {visibleIds.has(entry.id) ? 'Hide' : 'Show'}
                </button>
                <button type="button" onClick={() => handleCopy(entry.id, entry.password)}>
                  {copiedId === entry.id ? 'Copied!' : 'Copy'}
                </button>
                <button type="button" onClick={() => handleEdit(entry)}>
                  Edit
                </button>
                <button type="button" className="danger" onClick={() => handleDelete(entry.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {entries.length === 0 && (
            <tr>
              <td colSpan={6} className="empty">
                No passwords saved yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <dialog ref={dialogRef} onClose={closeDialog}>
        <form onSubmit={handleSubmit}>
          <h2>{editingId ? 'Edit Password' : 'Add Password'}</h2>
          <label>
            Website
            <input name="website" value={form.website} onChange={handleChange} required />
          </label>
          <label>
            Name
            <input name="name" value={form.name} onChange={handleChange} />
          </label>
          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={handleChange} />
          </label>
          <label>
            Username
            <input name="username" value={form.username} onChange={handleChange} />
          </label>
          <label>
            Password
            <input name="password" type="password" value={form.password} onChange={handleChange} required />
          </label>

          {formError && <p className="error">{formError}</p>}

          <div className="dialog-actions">
            <button type="submit">{editingId ? 'Save' : 'Add'}</button>
            <button type="button" onClick={closeDialog}>
              Cancel
            </button>
          </div>
        </form>
      </dialog>
    </div>
  )
}

export default App