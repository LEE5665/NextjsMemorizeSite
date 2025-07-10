'use client'

import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[--button-bg] hover:bg-[--button-hover-bg] text-[--button-text] font-medium transition"
    >
      <LogOut size={16} />
      로그아웃
    </button>
  )
}
