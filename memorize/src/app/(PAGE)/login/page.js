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
    <main className="min-h-[100dvh] flex items-center justify-center bg-[var(--bg-color)] text-[var(--text-color)] px-2">
      <form
        onSubmit={handleLogin}
        className="
          w-full max-w-xs sm:max-w-md
          flex flex-col gap-3 sm:gap-4
          p-3 sm:p-6
          rounded-2xl border border-[var(--border-color)] bg-[var(--input-bg)]
          shadow-md
        "
      >
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-1 sm:mb-2">로그인</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <input
          type="email"
          placeholder="이메일"
          className="
            w-full p-2 sm:p-3
            rounded-lg bg-white dark:bg-[#1e1e1e]
            border border-[var(--border-color)]
            text-sm sm:text-base
            "
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          className="
            w-full p-2 sm:p-3
            rounded-lg bg-white dark:bg-[#1e1e1e]
            border border-[var(--border-color)]
            text-sm sm:text-base
            "
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="
            w-full py-2 sm:py-3
            mt-1 sm:mt-2
            bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)]
            text-white font-semibold rounded-lg
            text-sm sm:text-base
            transition
          "
        >
          로그인
        </button>

        <hr className="border-gray-300 dark:border-gray-600 my-1 sm:my-2" />

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="
            w-full py-2 sm:py-3
            bg-red-500 hover:bg-red-600 text-white rounded-lg
            font-semibold text-sm sm:text-base
            transition
          "
        >
          Google로 로그인
        </button>

        <p className="text-xs sm:text-sm text-center mt-2 sm:mt-3">
          아직 계정이 없으신가요?{' '}
          <a href="/register" className="text-blue-500 hover:underline font-semibold">회원가입</a>
        </p>
      </form>
    </main>
  )
}
