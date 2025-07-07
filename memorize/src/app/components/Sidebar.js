'use client'

import { useState } from 'react'

export default function Sidebar({ active, setActive }) {
  const [open, setOpen] = useState(false)

  const tabs = [
    { key: 'explore', label: '공개 퀴즈' },
    { key: 'quiz', label: '내 퀴즈' },
    { key: 'me', label: '내 정보' },
  ]

  return (
    <>
      {/* 모바일 메뉴 토글 버튼 (열려 있을 때는 숨김) */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="lg:hidden fixed top-[80px] left-4 z-50 p-2 bg-zinc-800 text-white rounded"
        >
          ≡
        </button>
      )}

      {/* 오버레이 (모바일일 때만 보임) */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}

      {/* 사이드바 */}
      <aside
        className={`fixed top-0 left-0 h-full w-56 bg-zinc-800 text-white p-6 pt-4 space-y-4 shadow-lg z-40
          transform transition-transform duration-200 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:block`}
      >
        {/* 닫기 버튼 (모바일에서만 보임) */}
        <div className="flex justify-between items-center lg:hidden mb-4">
          <h2 className="text-xl font-bold">메뉴</h2>
          <button onClick={() => setOpen(false)} className="text-white text-2xl">
            ×
          </button>
        </div>

        {/* PC용 제목 */}
        <h2 className="text-xl font-bold mb-8 hidden lg:block">메뉴</h2>

        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActive(tab.key)
              setOpen(false)
            }}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${
              active === tab.key
                ? 'bg-zinc-700 font-bold text-white'
                : 'hover:bg-zinc-700 text-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </aside>
    </>
  )
}
