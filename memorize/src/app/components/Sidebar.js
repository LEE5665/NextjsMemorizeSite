'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { Menu, X, User, FolderOpen, BookOpen } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

export default function Sidebar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  const tabs = [
    { key: '/explore', label: '공개 퀴즈', icon: <BookOpen className="mr-2" size={18} /> },
    { key: '/myquiz', label: '내 퀴즈', icon: <FolderOpen className="mr-2" size={18} /> },
    { key: '/myinfo', label: '내 정보', icon: <User className="mr-2" size={18} /> },
  ]

  const renderTabs = () => (
    <div className="space-y-3">
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          href={tab.key}
          onClick={() => setOpen(false)}
          className={`flex items-center px-4 py-3 rounded-lg font-semibold transition-all ${pathname === tab.key
              ? 'bg-[--selected-bg] text-[--selected-text] shadow'
              : 'hover:bg-[--input-bg] text-[--text-color]'
            }`}
        >
          {tab.icon}
          {tab.label}
        </Link>
      ))}
    </div>
  )

  return (
    <>
      {/* 모바일 메뉴 버튼 */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="lg:hidden fixed top-[80px] left-4 z-50 p-2 bg-zinc-800 text-white rounded-full shadow-lg border border-white/20"
          aria-label="메뉴 열기"
        >
          <Menu size={26} />
        </button>
      )}

      {/* 모바일 사이드바 */}
      {open && (
        <>
          <div onClick={() => setOpen(false)} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-all" />
          <aside className="fixed top-0 left-0 h-full w-64 bg-[--bg-color] text-[--text-color] z-50 flex flex-col px-6 py-8 shadow-2xl border-r border-[--border-color] animate-slide-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">퀴즈 메뉴</h2>
              <button onClick={() => setOpen(false)} aria-label="메뉴 닫기">
                <X size={26} />
              </button>
            </div>
            {renderTabs()}
            <ThemeToggle />
          </aside>
        </>
      )}

      {/* PC 사이드바 */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 min-h-screen bg-[--bg-color] text-[--text-color] px-6 py-8 shadow-2xl border-r border-[--border-color] z-40">
        <h2 className="text-2xl font-bold mb-6">퀴즈 메뉴</h2>
        {renderTabs()}
        <ThemeToggle />
      </aside>

      {/* 애니메이션 */}
      <style jsx global>{`
        @keyframes slide-in {
          from {
            transform: translateX(-60px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.2s ease-out;
        }
      `}</style>
    </>
  )
}
