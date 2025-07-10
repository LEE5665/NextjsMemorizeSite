'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()

  const currentTheme = resolvedTheme || theme

  const toggleTheme = () => {
    const next = currentTheme === 'dark' ? 'light' : 'dark'
    setTheme(next)
  }

  return (
    <button
      onClick={toggleTheme}
      className="mt-6 px-4 py-2 w-full rounded-lg bg-[--button-bg] hover:bg-[--button-hover-bg] text-[--button-text] font-semibold transition"
    >
      {currentTheme === 'dark' ? (
        <span className="flex items-center justify-center">
          <Sun className="mr-2" size={18} /> 라이트 모드
        </span>
      ) : (
        <span className="flex items-center justify-center">
          <Moon className="mr-2" size={18} /> 다크 모드
        </span>
      )}
    </button>
  )
}
