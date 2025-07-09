'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import QuizSetModal from '@/app/(PAGE)/myquiz/components/CreateQuiz'

export default function QuizViewPage({ quizSet }) {
  const [showEditModal, setShowEditModal] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (confirm('정말 삭제할까요?')) {
      await axios.delete(`/api/quizsets/${quizSet.id}`)
      router.push('/')
    }
  }

  const handleRestart = async () => {
    const newOrder = [...Array(quizSet.questions.length).keys()].sort(() => Math.random() - 0.5)
    await axios.put(`/api/quizsets/${quizSet.id}/progress`, {
      currentIndex: 0,
      shuffledOrder: newOrder,
      incorrects: [],
    })
    alert('진행을 초기화했습니다.')
    location.reload()
  }

  const handleResume = () => {
    router.push(`/quizsets/mcquiz/${quizSet.id}`)
  }

  const handleStart = async () => {
    const newOrder = [...Array(quizSet.questions.length).keys()].sort(() => Math.random() - 0.5)
    await axios.put(`/api/quizsets/${quizSet.id}/progress`, {
      currentIndex: 0,
      shuffledOrder: newOrder,
      incorrects: [],
    })
    router.push(`/quizsets/mcquiz/${quizSet.id}`)
  }

  const handleShare = async () => {
    const res = await axios.post(`/api/quizsets/${quizSet.id}/share`)
    if (res.status === 201) {
      alert('공유 완료! 내 퀴즈 목록으로 이동합니다.')
      router.push('/?tab=quiz')
    } else {
      alert('공유 실패')
    }
  }

  const handleModalClose = () => {
    setShowEditModal(false)
    location.reload()
  }

  const current = quizSet.progress?.currentIndex ?? 0
  const total = quizSet.questions.length
  const hasStarted = current > 0 && current < total
  const isCompleted = current >= total
  const isOwner = quizSet.currentUserId === quizSet.creatorId

  return (
    <div className="max-w-2xl mx-auto p-6">
      {showEditModal && (
        <QuizSetModal
          onClose={handleModalClose}
          initialData={quizSet}
          editMode={true}
        />
      )}

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{quizSet.title}</h1>
        <span
          className={`text-sm px-2 py-1 rounded-full ${quizSet.isPublic
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-200 text-gray-600'
            }`}
        >
          {quizSet.isPublic ? '공개' : '비공개'}
        </span>
      </div>

      {(hasStarted || isCompleted) && isOwner && (
        <div className="mb-6 p-4 rounded-xl bg-[var(--input-bg)] shadow space-y-2">
          {!isCompleted && (
            <p className="text-gray-500 text-sm">진행: {current} / {total}</p>
          )}
          <div className="flex gap-4">
            {hasStarted && (
              <button onClick={handleResume} className="text-sm text-blue-600 hover:underline">
                이어서 하기
              </button>
            )}
            {current > 0 && (
              <button onClick={handleRestart} className="text-sm text-blue-600 hover:underline">
                새로 시작하기
              </button>
            )}
          </div>
        </div>
      )}

      {isOwner ? (
        <button
          className="w-full mb-8 px-4 py-3 rounded-xl font-medium bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)] text-white transition"
          onClick={handleStart}
        >
          4지선다 퀴즈 시작
        </button>
      ) : (
        <button
          className="w-full mb-8 px-4 py-3 rounded-xl font-medium bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)] text-white transition"
          onClick={handleShare}
        >
          공유받기
        </button>
      )}

      {quizSet.questions.map((q, idx) => (
        <div key={idx} className="mb-4 p-4 bg-[var(--input-bg)] rounded-xl shadow">
          {quizSet.type === 'WORD' ? (
            <>
              <p><span className="font-semibold">단어:</span> {q.content}</p>
              <p><span className="font-semibold">뜻:</span> {q.answer}</p>
            </>
          ) : (
            <>
              <p><span className="font-semibold">문제:</span> {q.content}</p>
              <p><span className="font-semibold">답:</span> {q.answer}</p>
            </>
          )}
        </div>
      ))}

      {isOwner && (
        <div className="flex justify-end gap-3 mt-10">
          <button
            onClick={() => setShowEditModal(true)}
            className="px-4 py-2 rounded bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)] text-sm font-medium"
          >
            수정
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)] text-sm font-medium"
          >
            삭제
          </button>
        </div>
      )}
    </div>
  )
}
