'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/register', { email, name, password })
      alert('회원가입 완료! 로그인 해주세요.')
      router.push('/login')
    } catch (err) {
      setError(err.response?.data?.error || '회원가입 중 오류 발생')
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--bg-color)] text-[var(--text-color)]">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md space-y-4 p-6 rounded border border-[var(--border-color)] bg-[var(--input-bg)]"
      >
        <h2 className="text-2xl font-bold text-center">회원가입</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="text"
          placeholder="이름"
          className="w-full p-2 rounded bg-white dark:bg-[#1e1e1e] border border-[var(--border-color)]"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="이메일"
          className="w-full p-2 rounded bg-white dark:bg-[#1e1e1e] border border-[var(--border-color)]"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          className="w-full p-2 rounded bg-white dark:bg-[#1e1e1e] border border-[var(--border-color)]"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full p-2 bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)] text-white rounded"
        >
          회원가입
        </button>
        <p className="text-sm text-center">
          이미 계정이 있으신가요?{' '}
          <a href="/login" className="text-blue-500 hover:underline">로그인</a>
        </p>
      </form>
    </main>
  )
}
