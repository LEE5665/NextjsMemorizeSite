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
    return <p className="text-gray-500">로딩 중...</p>
  }

  const { quizSets, total } = data
  const totalPages = Math.ceil(total / 8)

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">공개 퀴즈</h1>

      {quizSets.length === 0 ? (
        <p className="text-gray-500">공개된 퀴즈가 없습니다.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {quizSets.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-white dark:bg-zinc-800 p-4 rounded shadow hover:shadow-lg cursor-pointer"
                onClick={() => router.push(`/quizsets/${quiz.id}`)}
              >
                <h2 className="font-bold truncate">{quiz.title}</h2>
                <p className="text-sm text-gray-500">{quiz.questionCount} 문제</p>
                <p className="text-xs text-gray-400">제작자: {quiz.creatorName}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`px-3 py-1 rounded border ${
                  page === p
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-zinc-700 text-gray-800 dark:text-white'
                }`}
                onClick={() => handlePageChange(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
