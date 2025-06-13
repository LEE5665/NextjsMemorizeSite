'use client'
import { useSession, signIn } from 'next-auth/react'

export default function Home() {
  const { data: session, status } = useSession()
  if (status === 'loading') return <p className="p-6">로딩 중…</p>

  return session ? (
    <main className="p-6">
      <h1 className="text-2xl">환영합니다, {session.user.name}님!</h1>
      <a href="/quizsets" className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded">내 퀴즈 보러가기</a>
    </main>
  ) : (
    <main className="p-6">
      <h1 className="text-2xl">로그인 해주세요</h1>
      <button onClick={() => signIn()} className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded">로그인</button>
    </main>
  )
}
