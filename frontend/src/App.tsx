import { useEffect, useState } from 'react'

interface PasswordEntry {
  id: string
  website: string
  name: string
  email: string
  username: string
  password: string
}

type Page = 'login' | 'home' | 'form'

const STORAGE_KEY = 'password-safe-entries'

const emptyForm = {
  website: '',
  name: '',
  email: '',
  username: '',
  password: '',
}

function App() {
  const [page, setPage] = useState<Page>('login')
  const [entries, setEntries] = useState<PasswordEntry[]>([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      setEntries(JSON.parse(stored))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  }, [entries])

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setPage('home')
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (editingId) {
      setEntries(entries.map((entry) =>
        entry.id === editingId ? { ...entry, ...form } : entry
      ))
      setEditingId(null)
    } else {
      setEntries([...entries, { id: crypto.randomUUID(), ...form }])
    }

    setForm(emptyForm)
    setPage('home')
  }

  function handleAdd() {
    setEditingId(null)
    setForm(emptyForm)
    setPage('form')
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
    setPage('form')
  }

  function handleDelete(id: string) {
    setEntries(entries.filter((entry) => entry.id !== id))
  }

  function handleCancel() {
    setEditingId(null)
    setForm(emptyForm)
    setPage('home')
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
      <div>
        <h1>Password Safe</h1>
        <form onSubmit={handleLogin}>
          <div>
            <label>
              Username
              <input name="login-username" />
            </label>
          </div>
          <div>
            <label>
              Password
              <input name="login-password" type="password" />
            </label>
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    )
  }

  if (page === 'form') {
    return (
      <div>
        <h1>{editingId ? 'Edit Password' : 'Add Password'}</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Website
              <input name="website" value={form.website} onChange={handleChange} required />
            </label>
          </div>
          <div>
            <label>
              Name
              <input name="name" value={form.name} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              Email
              <input name="email" type="email" value={form.email} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              Username
              <input name="username" value={form.username} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              Password
              <input name="password" type="password" value={form.password} onChange={handleChange} required />
            </label>
          </div>

          <button type="submit">{editingId ? 'Save' : 'Add'}</button>
          <button type="button" onClick={handleCancel}>Cancel</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h1>Password Safe</h1>

      <button type="button" onClick={handleAdd}>Add</button>

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
              <td>{visibleIds.has(entry.id) ? entry.password : '••••••••'}</td>
              <td>
                <button type="button" onClick={() => handleShowPswrd(entry.id)}>
                  {visibleIds.has(entry.id) ? 'Hide' : 'Show'}
                </button>
                <button type="button" onClick={() => handleEdit(entry)}>Edit</button>
                <button type="button" onClick={() => handleDelete(entry.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App
