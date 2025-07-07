'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import axios from 'axios'
import CreateQuizSetModal from './components/CreateQuiz'
import UploadQuizModal from './components/UploadQuiz'

export default function MyQuizTab() {
  const searchParams = useSearchParams()
  const sort = searchParams.get('sort') ?? 'createdAt'
  const [quizSets, setQuizSets] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`/api/quizsets?sort=${sort}`)
      setQuizSets(res.data.quizSets)
    }
    fetchData()
  }, [sort, showCreateModal, showUploadModal])

  if (!quizSets) return <p className="p-6">불러오는 중...</p>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">내 모든 퀴즈</h1>

      {/* 정렬 + 버튼 그룹 */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        {/* 정렬 선택 */}
        <div>
          <select
            className="border border-gray-300 dark:border-zinc-700 px-3 py-2 rounded w-full sm:w-auto"
            value={sort}
            onChange={(e) => {
              const params = new URLSearchParams(searchParams.toString())
              params.set('sort', e.target.value)
              router.push(`?${params.toString()}`)
            }}
          >
            <option value="createdAt">최신순</option>
            <option value="updatedAt">수정순</option>
            <option value="title">제목순</option>
          </select>
        </div>

        {/* 버튼 그룹 */}
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full sm:w-auto bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)] text-white px-4 py-2 rounded"
          >
            퀴즈 추가
          </button>
          <button
            onClick={() => setShowUploadModal(true)}
            className="w-full sm:w-auto bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)] text-white px-4 py-2 rounded"
          >
            파일 업로드
          </button>
        </div>
      </div>

      {/* 퀴즈 목록 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {quizSets.map((quiz) => (
          <div
            key={quiz.id}
            className="bg-white dark:bg-zinc-800 p-4 rounded shadow cursor-pointer hover:shadow-lg"
            onClick={() => router.push(`/quizsets/${quiz.id}`)}
          >
            <h2 className="font-bold truncate">{quiz.title}</h2>
            <p className="text-sm text-gray-500">{quiz.questions.length} 문제</p>
            <p className="text-xs text-gray-400">제작자: {quiz.displayCreator}</p>
          </div>
        ))}
      </div>

      {/* 모달 */}
      {showCreateModal && <CreateQuizSetModal onClose={() => setShowCreateModal(false)} />}
      {showUploadModal && <UploadQuizModal onClose={() => setShowUploadModal(false)} />}
    </div>
  )
}