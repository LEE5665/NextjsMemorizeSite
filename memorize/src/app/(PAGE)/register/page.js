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
    <form onSubmit={handleRegister} className="max-w-md mx-auto mt-10 space-y-4 p-6 border rounded">
      <h2 className="text-2xl font-bold">회원가입</h2>
      {error && <p className="text-red-500">{error}</p>}
      <input type="text" placeholder="이름" className="w-full p-2 border rounded" value={name} onChange={e => setName(e.target.value)} />
      <input type="email" placeholder="이메일" className="w-full p-2 border rounded" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="비밀번호" className="w-full p-2 border rounded" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded">회원가입</button>
    </form>
  )
}
