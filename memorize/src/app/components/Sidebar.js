'use client'

export default function Sidebar({ active, setActive }) {
  const tabs = [
    { key: 'explore', label: '공개 퀴즈' },
    { key: 'quiz', label: '내 퀴즈' },
    { key: 'me', label: '내 정보' },
  ]

  return (
    <aside className="w-56 bg-zinc-800 text-white p-6 space-y-4 shadow-lg">
      <h2 className="text-xl font-bold mb-8">메뉴</h2>
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => setActive(tab.key)}
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
  )
}
