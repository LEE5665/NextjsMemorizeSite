'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import axios from 'axios'

export default function QuizViewPage() {
  const { id } = useParams()
  const [quizSet, setQuizSet] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const fetchQuiz = async () => {
      const res = await axios.get(`/api/quizsets/${id}`)
      setQuizSet(res.data)
    }
    fetchQuiz()
  }, [id])

  const handleDelete = async () => {
    if (confirm('정말 삭제할까요?')) {
      await axios.delete(`/api/quizsets/${id}`)
      router.push('/quizsets')
    }
  }

  const handleRestart = async () => {
    if (!quizSet?.questions?.length) return
    const newOrder = [...Array(quizSet.questions.length).keys()].sort(() => Math.random() - 0.5)

    await axios.put(`/api/quizsets/${id}/progress`, {
      currentIndex: 0,
      shuffledOrder: newOrder,
      incorrects: [],
    })

    alert('진행을 초기화했습니다.')
    location.reload()
  }

  const handleResume = () => {
    router.push(`/quizsets/mcquiz/${id}`)
  }

  const handleStart = async () => {
    if (!quizSet?.questions?.length) return
    const newOrder = [...Array(quizSet.questions.length).keys()].sort(() => Math.random() - 0.5)

    await axios.put(`/api/quizsets/${id}/progress`, {
      currentIndex: 0,
      shuffledOrder: newOrder,
      incorrects: [],
    })

    router.push(`/quizsets/mcquiz/${id}`)
  }

  if (!quizSet) return <p className="p-6">불러오는 중...</p>

  const current = quizSet.progress?.currentIndex ?? 0
  const total = quizSet.questions.length
  const hasStarted = current > 0 && current < total
  const isCompleted = current >= total

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{quizSet.title}</h1>

      {/* 진행률 및 이어하기/재시작 버튼 */}
      {(hasStarted || isCompleted) && (
        <>
          {!isCompleted && (
            <p className="mb-2 text-gray-500 text-sm">📊 진행: {current} / {total}</p>
          )}
          <div className="flex gap-4 mb-4 text-sm">
            {hasStarted && (
              <button onClick={handleResume} className="text-green-600 underline">
                ▶️ 이어서 하기
              </button>
            )}
            {current > 0 && (
              <button onClick={handleRestart} className="text-blue-500 underline">
                🔄 새로 시작하기
              </button>
            )}
          </div>
        </>
      )}

      {/* 퀴즈 시작 버튼 */}
      <button
        className="bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)] text-white px-4 py-2 rounded mb-6"
        onClick={handleStart}
      >
        🎯 4지선다 퀴즈 시작
      </button>

      {/* 문제 목록 */}
      {quizSet.questions.map((q, idx) => (
        <div key={idx} className="mb-4 p-4 bg-[var(--input-bg)] rounded shadow">
          <p className="font-semibold">문제 {idx + 1}:</p>
          <p>{q.content}</p>
          <p className="mt-2 text-sm text-gray-400">정답: {q.answer}</p>
        </div>
      ))}

      {/* 수정/삭제 버튼 */}
      <div className="flex gap-2 mt-6">
        <button
          onClick={() => router.push(`/quizsets/edit/${id}`)}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          수정
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          삭제
        </button>
      </div>
    </div>
  )
}
