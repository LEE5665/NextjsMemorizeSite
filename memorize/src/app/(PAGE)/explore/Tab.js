'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'

export default function ExploreTab({ initialQuizSets, initialPage, total }) {
  const [quizSets, setQuizSets] = useState(initialQuizSets)
  const [page, setPage] = useState(initialPage)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  // CSR에서 page가 바뀌면 fetch
  useEffect(() => {
    const currentPage = parseInt(searchParams.get('page') || '1')
    if (currentPage === initialPage) return // 처음 렌더된 페이지는 SSR 데이터 그대로 사용

    const fetchData = async () => {
      setLoading(true)
      const res = await axios.get(`/api/explore?page=${currentPage}`)
      setQuizSets(res.data.quizSets)
      setPage(currentPage)
      setLoading(false)
    }

    fetchData()
  }, [searchParams, initialPage])

  const totalPages = Math.ceil(total / 8)

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', newPage)
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">공개 퀴즈</h1>

      {loading ? (
        <p className="text-gray-500">로딩 중...</p>
      ) : quizSets.length === 0 ? (
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
