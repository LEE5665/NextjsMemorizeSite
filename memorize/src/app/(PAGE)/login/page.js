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

  return (
    <form onSubmit={handleLogin} className="max-w-md mx-auto mt-10 space-y-4 p-6 border rounded">
      <h2 className="text-2xl font-bold">로그인</h2>
      {error && <p className="text-red-500">{error}</p>}
      <input type="email" placeholder="이메일" className="w-full p-2 border rounded" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="비밀번호" className="w-full p-2 border rounded" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded">로그인</button>
    </form>
  )
}
