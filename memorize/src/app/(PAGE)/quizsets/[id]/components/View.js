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
      router.push('/myquiz')
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
    <div className="max-w-2xl mx-auto pt-20 sm:pt-6 p-0 sm:p-4"> {/* 상단 여백 pt-20 추가 */}
      {showEditModal && (
        <QuizSetModal
          onClose={handleModalClose}
          initialData={quizSet}
          editMode={true}
        />
      )}

      {/* 퀴즈 메인 카드 */}
      <div className="rounded-lg shadow bg-[var(--bg-color)] border border-[var(--border-color)] px-3 sm:px-6 py-5 sm:py-8 mb-6">
        {/* 타이틀 + 뱃지 한 줄 */}
        <div className="flex items-center gap-2 mb-3">
          <h1 className="text-lg sm:text-2xl font-bold text-[var(--text-color)] break-words flex-1">{quizSet.title}</h1>
          <span className={`
            inline-flex items-center justify-center min-w-[48px] px-2 py-1 text-sm font-semibold rounded-full
            ${quizSet.isPublic
              ? 'bg-[var(--badge-bg-public)] text-[var(--badge-text-public)]'
              : 'bg-[var(--badge-bg-private)] text-[var(--badge-text-private)]'
            }
            whitespace-nowrap
          `}>
            {quizSet.isPublic ? '공개' : '비공개'}
          </span>
        </div>

        {/* 퀴즈 타입/개수 */}
        <div className="flex flex-wrap gap-2 text-sm mb-4">
          <span className="rounded-md bg-[var(--input-bg)] px-2 py-1 text-[var(--text-color)] font-semibold">{quizSet.type === 'WORD' ? '단어장' : '일반문제'}</span>
          <span className="rounded-md bg-[var(--input-bg)] px-2 py-1 text-[var(--text-color)] font-semibold">{total}문제</span>
        </div>

        {/* 진행/버튼 */}
        {(hasStarted || isCompleted) && isOwner && (
          <div className="mb-4 p-2 rounded-lg bg-[var(--input-bg)] shadow-inner space-y-1">
            {!isCompleted && (
              <div className="flex items-center gap-2">
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
            <div className="flex gap-2 mt-1 flex-col sm:flex-row">
              {hasStarted && (
                <button
                  onClick={handleResume}
                  className="rounded-md px-3 py-1 text-blue-600 dark:text-blue-400 hover:underline transition text-sm w-full sm:w-auto"
                >
                  이어서 하기
                </button>
              )}
              {current > 1 && (
                <button
                  onClick={handleRestart}
                  className="rounded-md px-3 py-1 text-[var(--subtext-color)] hover:underline transition text-sm w-full sm:w-auto"
                >
                  새로 시작
                </button>
              )}
            </div>
          </div>
        )}

        {/* 주요 액션 */}
        <div className="flex flex-col sm:flex-row gap-2 mt-2 mb-5">
          {isOwner ? (
            <button
              className="flex-1 px-3 py-2 rounded-md font-medium bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)] text-[var(--button-text)] shadow transition text-sm w-full sm:w-auto"
              onClick={handleStart}
            >
              4지선다 퀴즈 시작
            </button>
          ) : (
            <button
              className="flex-1 px-3 py-2 rounded-md font-medium bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)] text-[var(--button-text)] shadow transition text-sm w-full sm:w-auto"
              onClick={handleShare}
            >
              공유받기
            </button>
          )}
        </div>

        {/* 문제 카드 목록 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
          {quizSet.questions.map((q, idx) => (
            <div
              key={idx}
              className="p-3 rounded-md bg-[var(--input-bg)] border border-[var(--border-color)] shadow-sm hover:scale-[1.01] transition"
            >
              {quizSet.type === 'WORD' ? (
                <>
                  <div className="font-bold text-sm mb-1 text-blue-600 dark:text-blue-300">단어</div>
                  <div className="text-base font-extrabold mb-2 text-[var(--text-color)] break-all">{q.content}</div>
                  <div className="text-[var(--subtext-color)] text-sm">뜻: <span className="font-semibold">{q.answer}</span></div>
                </>
              ) : (
                <>
                  <div className="font-bold text-sm mb-1 text-indigo-700 dark:text-indigo-300">문제</div>
                  <div className="text-base font-extrabold mb-2 text-[var(--text-color)] break-all">{q.content}</div>
                  <div className="text-[var(--subtext-color)] text-sm">정답: <span className="font-semibold">{q.answer}</span></div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* 하단 액션 */}
        {isOwner && (
          <div className="flex flex-col sm:flex-row gap-2 justify-end mt-7">
            <button
              onClick={() => setShowEditModal(true)}
              className="px-4 py-2 rounded-md bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)] text-sm font-semibold text-[var(--button-text)] shadow transition w-full sm:w-auto"
            >
              수정
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-sm font-semibold text-white shadow transition w-full sm:w-auto"
            >
              삭제
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
