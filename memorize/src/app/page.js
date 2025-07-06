// app/page.js (Server Component)
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/(API)/api/auth/[...nextauth]/route'
import Link from 'next/link'
import LogoutButton from '../app/LogoutButton'

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-color)] text-[var(--text-color)]">
      {/* 헤더 */}
      <header className="w-full flex justify-end p-4">
        {/* <ThemeToggle /> */}
      </header>

      <main className="flex flex-col items-center justify-center flex-1 space-y-6">
        {session ? (
          <>
            <h1 className="text-3xl font-bold">환영합니다, {session.user.name}님!</h1>
            <div className="flex gap-4">
              <Link href="/quizsets" className="px-4 py-2 rounded bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)] text-white">내 퀴즈 보러가기</Link>
              <Link href="/quiz/create" className="px-4 py-2 rounded bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)] text-white">퀴즈 만들기</Link>
            </div>
            <LogoutButton />
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold">Quizlet 같은 사이트에 오신 걸 환영합니다!</h1>
            <p className="text-lg">퀴즈를 즐기기 위해 로그인 해주세요.</p>
            <div className="flex gap-4">
              <Link href="/login" className="px-4 py-2 rounded bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)] text-white">로그인</Link>
              <Link href="/register" className="px-4 py-2 rounded bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)] text-white">회원가입</Link>
            </div>
          </>
        )}
      </main>

      <footer className="w-full text-center p-4">
        <p className="text-sm text-[var(--text-color)]">© 2025 Quizlet Clone. All rights reserved.</p>
      </footer>
    </div>
  )
}
