'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const tabs = [
    { key: '/explore', label: '공개 퀴즈' },
    { key: '/myquiz', label: '내 퀴즈' },
    { key: '/myinfo', label: '내 정보' },
  ]

  return (
    <>
      {/* 모바일 토글 버튼 (PC에서는 감춤) */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-[80px] left-4 z-50 p-2 bg-zinc-800 text-white rounded"
        aria-label="메뉴 열기"
      >
        ≡
      </button>

      {/* 모바일 사이드바 & 오버레이 */}
      {open && (
        <>
          {/* 오버레이 */}
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/50 z-40"
          />
          {/* 모바일 사이드바 */}
          <aside
            className="
              fixed top-0 left-0 h-full w-56 bg-zinc-800 text-white z-50
              flex flex-col px-4 py-6 shadow-lg
              transition-transform duration-200 ease-in-out
            "
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">메뉴</h2>
              <button onClick={() => setOpen(false)} className="text-white text-2xl" aria-label="메뉴 닫기">×</button>
            </div>
            <div className="space-y-2">
              {tabs.map((tab) => (
                <Link
                  key={tab.key}
                  href={tab.key}
                  onClick={() => setOpen(false)}
                  className={`block px-4 py-3 rounded-lg transition-colors duration-200 ${
                    pathname === tab.key
                      ? 'bg-zinc-700 font-bold text-white'
                      : 'hover:bg-zinc-700 text-gray-300'
                  }`}
                >
                  {tab.label}
                </Link>
              ))}
            </div>
          </aside>
        </>
      )}

      {/* PC 사이드바 */}
      <aside
        className="
          hidden lg:flex lg:flex-col lg:w-56
          lg:min-h-[calc(100vh-80px)]
          bg-zinc-800 text-white shadow-lg z-40
          px-4 py-6
        "
      >
        <div className="mb-4">
          <h2 className="text-xl font-bold">메뉴</h2>
        </div>
        <div className="space-y-2">
          {tabs.map((tab) => (
            <Link
              key={tab.key}
              href={tab.key}
              className={`block px-4 py-3 rounded-lg transition-colors duration-200 ${
                pathname === tab.key
                  ? 'bg-zinc-700 font-bold text-white'
                  : 'hover:bg-zinc-700 text-gray-300'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </aside>
    </>
  )
}
