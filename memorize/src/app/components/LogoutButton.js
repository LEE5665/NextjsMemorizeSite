'use client'

import { signOut } from 'next-auth/react'

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="px-3 py-1.5 text-white rounded bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)] transition text-sm"
    >
      로그아웃
    </button>
  )
}
