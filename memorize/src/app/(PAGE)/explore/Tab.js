'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export default function ExploreTab() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const page = parseInt(searchParams.get('page') || '1')

  const { data, isLoading } = useQuery({
    queryKey: ['explore', page],
    queryFn: async () => {
      const res = await axios.get(`/api/explore?page=${page}`)
      return res.data
    },
    keepPreviousData: true,
  })

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', newPage)
    router.push(`?${params.toString()}`)
  }

  if (isLoading || !data) {
    return <p style={{ color: 'var(--text-color)' }}>로딩 중...</p>
  }

  const { quizSets, total } = data
  const totalPages = Math.ceil(total / 8)

  // 퀴즈 타입 한글 변환
  const typeText = (type) => (type === 'WORD' ? '단어장' : '일반문제')

  return (
    <div className="max-w-6xl mx-auto py-6 space-y-8">
      <h1 className="text-2xl font-extrabold tracking-tight text-[var(--text-color)]">
        공개 퀴즈
      </h1>

      {quizSets.length === 0 ? (
        <p className="text-[var(--text-color)]">공개된 퀴즈가 없습니다.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {quizSets.map((quiz) => (
              <div
                key={quiz.id}
                className="p-5 rounded-2xl bg-[var(--input-bg)] border border-[var(--border-color)] shadow-md hover:shadow-xl cursor-pointer transition relative"
                onClick={() => router.push(`/quizsets/${quiz.id}`)}
              >
                <div className="absolute top-1 right-2 flex gap-1">
                  <span className="px-1.5 py-0.5 rounded-full text-[0.6rem] font-bold bg-[var(--badge-bg)] text-[var(--badge-text)]">
                    {quiz.questionCount}문제
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full text-[0.6rem] font-bold bg-[var(--badge-bg)] text-[var(--badge-text)]">
                    {typeText(quiz.type)}
                  </span>
                </div>
                <h2 className="font-bold text-lg truncate">{quiz.title}</h2>
                <p className="text-xs mt-1 text-[var(--subtext-color)]">제작자: {quiz.creatorName}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
              const isActive = page === p
              return (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`px-3 py-1 rounded border text-sm font-semibold transition ${
                    isActive
                      ? 'bg-[var(--button-bg)] text-white'
                      : 'bg-[var(--input-bg)] text-[var(--text-color)] hover:bg-[var(--button-bg)] hover:text-white'
                  }`}
                  style={{ borderColor: 'var(--border-color)' }}
                >
                  {p}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
