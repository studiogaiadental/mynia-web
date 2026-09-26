import { useState, type FormEvent } from 'react'
import { ApiError, login } from './api'
import type { AdminSession } from './session'

const logo = '/assets/logo.png'

type LoginFormProps = {
  notice: string | null
  onLogin: (session: AdminSession) => void
}

function errorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.status === 401) return 'Wrong username or password.'
    if (err.status === 429) return 'Too many attempts. Wait a minute, then try again.'
    if (err.status === 503) return "Admin login isn't set up on the server yet."
    return err.message
  }
  return 'Something went wrong. Please try again.'
}

export default function LoginForm({ notice, onLogin }: LoginFormProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      onLogin(await login(username.trim(), password))
    } catch (err) {
      setError(errorMessage(err))
      setSubmitting(false)
    }
  }

  return (
    <main className="admin-login">
      <form className="admin-card admin-login__card" onSubmit={handleSubmit}>
        <img className="admin-login__logo" src={logo} alt="GMedCC" />
        <div className="admin-login__heading">
          <h1 className="admin-login__title">MyNia Admin</h1>
          <p className="admin-login__subtitle">Log in to manage the Android app downloads.</p>
        </div>

        {notice && !error && (
          <p className="admin-alert admin-alert--info" role="status">
            {notice}
          </p>
        )}
        {error && (
          <p className="admin-alert admin-alert--error" role="alert">
            {error}
          </p>
        )}

        <label className="admin-field">
          <span className="admin-field__label">Username</span>
          <input
            className="admin-input"
            name="username"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label className="admin-field">
          <span className="admin-field__label">Password</span>
          <input
            className="admin-input"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button className="admin-button admin-button--primary admin-login__submit" disabled={submitting}>
          {submitting ? 'Logging in…' : 'Log in'}
        </button>
      </form>
    </main>
  )
}
