// ✅ app/login/page.js
'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('📧 Email:', email)
    console.log('🔑 Password:', password)
    setMessage('로그인 시도 중...')
  }

  if (!mounted) return null

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--bg-color)] text-[var(--text-color)]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-[var(--bg-color)] text-[var(--text-color)] p-8 rounded-lg shadow-md border border-[var(--border-color)]"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <label className="block mb-2 font-semibold">Email</label>
        <input
          type="email"
          className="w-full px-4 py-2 mb-4 border border-[var(--border-color)] rounded bg-[var(--input-bg)] text-[var(--text-color)]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="block mb-2 font-semibold">Password</label>
        <input
          type="password"
          className="w-full px-4 py-2 mb-4 border border-[var(--border-color)] rounded bg-[var(--input-bg)] text-[var(--text-color)]"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full py-2 px-4 bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)] text-white font-semibold rounded transition-colors"
        >
          Login
        </button>

        <div className="text-center mt-4 text-sm">{message}</div>

        <button
          type="button"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="mt-6 w-full py-2 border rounded border-[var(--border-color)]"
        >
          {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </form>
    </div>
  )
}
