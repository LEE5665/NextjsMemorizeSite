'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (res?.error) {
      setError('이메일 또는 비밀번호가 틀렸습니다.')
    } else {
      router.push('/')
    }
  }

  const handleGoogleLogin = async () => {
    await signIn('google', { callbackUrl: '/' })
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--bg-color)] text-[var(--text-color)]">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md space-y-4 p-6 rounded border border-[var(--border-color)] bg-[var(--input-bg)]"
      >
        <h2 className="text-2xl font-bold text-center">로그인</h2>
        {error && <p className="text-red-500">{error}</p>}

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
          로그인
        </button>

        <hr className="border-gray-300 dark:border-gray-600" />

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full p-2 bg-red-500 hover:bg-red-600 text-white rounded"
        >
          Google로 로그인
        </button>

        <p className="text-sm text-center">
          아직 계정이 없으신가요?{' '}
          <a href="/register" className="text-blue-500 hover:underline">회원가입</a>
        </p>
      </form>
    </main>
  )
}
