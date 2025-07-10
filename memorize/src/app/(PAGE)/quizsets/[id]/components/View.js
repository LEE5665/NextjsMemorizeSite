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
    <div className="max-w-2xl mx-auto p-0 sm:p-6">
      {showEditModal && (
        <QuizSetModal
          onClose={handleModalClose}
          initialData={quizSet}
          editMode={true}
        />
      )}

      {/* 퀴즈 메인 카드 */}
      <div className="rounded-2xl shadow-lg bg-[var(--bg-color)] border border-[var(--border-color)] px-8 py-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--text-color)]">{quizSet.title}</h1>
          <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full
            ${quizSet.isPublic
              ? 'bg-[var(--badge-bg-public)] text-[var(--badge-text-public)]'
              : 'bg-[var(--badge-bg-private)] text-[var(--badge-text-private)]'}
          `}>
            {quizSet.isPublic ? '공개' : '비공개'}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 text-sm mb-6">
          <span className="rounded-lg bg-[var(--input-bg)] px-3 py-1 text-[var(--text-color)] font-semibold">{quizSet.type === 'WORD' ? '단어장' : '일반문제'}</span>
          <span className="rounded-lg bg-[var(--input-bg)] px-3 py-1 text-[var(--text-color)] font-semibold">{total}문제</span>
        </div>

        {/* 진행/버튼 */}
        {(hasStarted || isCompleted) && isOwner && (
          <div className="mb-6 p-4 rounded-xl bg-[var(--input-bg)] shadow-inner space-y-2">
            {!isCompleted && (
              <div className="flex items-center gap-3">
                <span className="text-xs text-[var(--subtext-color)]">진행</span>
                <div className="flex-1 h-2 bg-gray-200 dark:bg-zinc-700 rounded">
                  <div
                    className="h-2 rounded bg-blue-400 dark:bg-blue-600 transition-all"
                    style={{ width: `${(current / total) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-[var(--subtext-color)]">{current}/{total}</span>
              </div>
            )}
            <div className="flex gap-3 mt-2">
              {hasStarted && (
                <button onClick={handleResume} className="rounded-lg px-3 py-1 text-blue-600 dark:text-blue-400 hover:underline transition text-sm">
                  이어서 하기
                </button>
              )}
              {current > 0 && (
                <button onClick={handleRestart} className="rounded-lg px-3 py-1 text-[var(--subtext-color)] hover:underline transition text-sm">
                  새로 시작
                </button>
              )}
            </div>
          </div>
        )}

        {/* 주요 액션 */}
        <div className="flex gap-2 mt-2 mb-8">
          {isOwner ? (
            <button
              className="flex-1 px-4 py-3 rounded-xl font-medium bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)] text-[var(--button-text)] shadow transition"
              onClick={handleStart}
            >
              4지선다 퀴즈 시작
            </button>
          ) : (
            <button
              className="flex-1 px-4 py-3 rounded-xl font-medium bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)] text-[var(--button-text)] shadow transition"
              onClick={handleShare}
            >
              공유받기
            </button>
          )}
        </div>

        {/* 문제 카드 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          {quizSet.questions.map((q, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[var(--input-bg)] border border-[var(--border-color)] shadow hover:scale-[1.02] transition"
            >
              {quizSet.type === 'WORD' ? (
                <>
                  <div className="font-bold text-base mb-2 text-blue-600 dark:text-blue-300">단어</div>
                  <div className="text-xl font-extrabold mb-3 text-[var(--text-color)]">{q.content}</div>
                  <div className="text-[var(--subtext-color)]">뜻: <span className="font-semibold">{q.answer}</span></div>
                </>
              ) : (
                <>
                  <div className="font-bold text-base mb-2 text-indigo-600 dark:text-indigo-300">문제</div>
                  <div className="text-lg font-extrabold mb-3 text-[var(--text-color)]">{q.content}</div>
                  <div className="text-[var(--subtext-color)]">정답: <span className="font-semibold">{q.answer}</span></div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* 하단 액션 */}
        {isOwner && (
          <div className="flex gap-3 justify-end mt-10">
            <button
              onClick={() => setShowEditModal(true)}
              className="px-5 py-2 rounded-xl bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)] text-sm font-semibold text-[var(--button-text)] shadow transition"
            >
              수정
            </button>
            <button
              onClick={handleDelete}
              className="px-5 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-sm font-semibold text-white shadow transition"
            >
              삭제
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
