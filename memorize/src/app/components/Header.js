// components/Header.js (서버 컴포넌트)
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/(API)/api/auth/[...nextauth]/route'
import LogoutButton from './LogoutButton'
import Link from 'next/link'

export default async function Header() {
  const session = await getServerSession(authOptions)

  return (
    <header className="w-full flex justify-between items-center px-6 py-4 border-b border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm">
      {/* 왼쪽: 사이트 로고/이름 */}
      <Link href="/" className="text-xl font-bold text-blue-600 dark:text-blue-400 hover:opacity-80">
        QuizSite
      </Link>

      {/* 오른쪽: 사용자 정보 or 로그인 */}
      {session ? (
        <div className="flex gap-4 items-center text-sm text-zinc-700 dark:text-zinc-200">
          <span className="font-medium">{session.user.name}님</span>
          <LogoutButton />
        </div>
      ) : (
        <Link href="/login" className="text-sm text-blue-500 hover:underline">
          로그인
        </Link>
      )}
    </header>
  )
}
