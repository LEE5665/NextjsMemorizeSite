'use client'

import { useSession, signOut } from 'next-auth/react'
import QuizForm from '../app/components/QuizForm'
import QuizList from '../app/components/QuizList'

export default function HomePage() {
  const { data: session, status } = useSession()

  if (status === 'loading') return <p className="p-8">로딩 중...</p>
  if (!session) return <p className="p-8">로그인 후 이용 가능합니다.</p>

  return (
    <main className="max-w-xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">👋 안녕하세요, <span className="text-indigo-600">{session.user.name}</span>님!</h1>
        <button 
          onClick={() => signOut()} 
          className="py-1 px-3 bg-red-500 hover:bg-red-600 text-white rounded"
        >
          로그아웃
        </button>
      </div>

      <QuizForm />
      <QuizList />
    </main>
  )
}
