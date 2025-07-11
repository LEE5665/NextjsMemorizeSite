import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/(API)/api/auth/[...nextauth]/route'
import LogoutButton from './LogoutButton'
import Link from 'next/link'

export default async function Header() {
  const session = await getServerSession(authOptions)

  return (
    <header className="w-full flex justify-between items-center px-6 py-4 shadow-sm border-b bg-[--header-bg] border-[--header-border] text-[--header-text]">
      {/* 왼쪽: 로고 */}
      <Link
        href="/explore"
        className="text-xl font-bold hover:opacity-80 text-[--header-link] hover:text-[--header-link-hover] transition"
      >
        QuizSite
      </Link>

      {/* 오른쪽: 로그인 상태 */}
      {session ? (
        <div className="flex gap-4 items-center text-sm">
          <span className="font-medium">{session.user.name}님</span>
          <LogoutButton />
        </div>
      ) : (
        <Link
          href="/login"
          className="text-sm text-[--header-link] hover:text-[--header-link-hover] transition"
        >
          로그인
        </Link>
      )}
    </header>
  )
}
