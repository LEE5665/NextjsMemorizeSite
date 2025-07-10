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
    <main className="min-h-[100dvh] flex items-center justify-center bg-[var(--bg-color)] text-[var(--text-color)] px-2">
      <form
        onSubmit={handleRegister}
        className="
          w-full max-w-xs sm:max-w-md
          flex flex-col gap-3 sm:gap-4
          p-3 sm:p-6
          rounded-2xl border border-[var(--border-color)] bg-[var(--input-bg)]
          shadow-md
        "
      >
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-1 sm:mb-2">회원가입</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <input
          type="text"
          placeholder="이름"
          className="
            w-full p-2 sm:p-3
            rounded-lg bg-white dark:bg-[#1e1e1e]
            border border-[var(--border-color)]
            text-sm sm:text-base
            "
          value={name}
          onChange={e => setName(e.target.value)}
        />
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
          회원가입
        </button>
        <p className="text-xs sm:text-sm text-center mt-2 sm:mt-3">
          이미 계정이 있으신가요?{' '}
          <a href="/login" className="text-blue-500 hover:underline font-semibold">로그인</a>
        </p>
      </form>
    </main>
  )
}
