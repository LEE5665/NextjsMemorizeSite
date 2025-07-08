'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ExploreTab({ initialQuizSets }) {
  const [quizSets] = useState(initialQuizSets)
  const router = useRouter()

  if (!quizSets) return <p className="p-6">불러오는 중...</p>
  if (quizSets.length === 0) return <p className="p-6 text-gray-500">공개된 퀴즈가 없습니다.</p>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">공개 퀴즈</h1>

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
    </div>
  )
}
