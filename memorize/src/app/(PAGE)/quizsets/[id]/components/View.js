'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import QuizSetModal from '@/app/(PAGE)/myquiz/components/CreateQuiz'

// 모드 정의
const MODES = [
  { key: 'CHOICE', top: '4지선다', bottom: '뜻 맞추기', direction: 'word2mean', path: 'mcquiz', type: 'WORD' },
  { key: 'REVERSE_CHOICE', top: '4지선다', bottom: '단어 맞추기', direction: 'mean2word', path: 'mcquiz', type: 'WORD' },
  { key: 'SHORT', top: '단답형', bottom: '뜻 맞추기', direction: 'word2mean', path: 'short', type: 'WORD' },
  { key: 'REVERSE_SHORT', top: '단답형', bottom: '단어 맞추기', direction: 'mean2word', path: 'short', type: 'WORD' },
  { key: 'QA_CHOICE', top: '4지선다', bottom: '정답 맞추기', direction: 'qa', path: 'mcquiz', type: 'QA' },
  { key: 'QA_SHORT', top: '단답형', bottom: '정답 맞추기', direction: 'qa', path: 'short', type: 'QA' }
]

export default function QuizViewPage({ quizSet, progresses, currentUserId }) {
  const [showEditModal, setShowEditModal] = useState(false)
  const [isCopying, setIsCopying] = useState(false)
  const [progressMap, setProgressMap] = useState(progresses ?? {})
  const router = useRouter()
  const total = quizSet.questions.length
  const isOwner = currentUserId === quizSet.creatorId

  // 삭제
  const handleDelete = async () => {
    if (confirm('정말 삭제할까요?')) {
      await axios.delete(`/api/quizsets/${quizSet.id}`)
      router.push('/myquiz')
    }
  }

  // 내 퀴즈로 복사
  const handleCopy = async () => {
    if (isCopying) return
    setIsCopying(true)
    const res = await axios.post(`/api/quizsets/${quizSet.id}/share`)
    if (res.status === 201) {
      alert('내 퀴즈로 복사되었습니다! 내 퀴즈 목록으로 이동합니다.')
      router.push('/myquiz')
    } else {
      setIsCopying(false)
      alert('복사 실패')
    }
  }

  // 모드별 카드
  const renderModeCard = (mode) => {
    if (mode.type === 'WORD' && quizSet.type !== 'WORD') return null
    if (mode.type === 'QA' && quizSet.type !== 'QA') return null

    const prog = progressMap[mode.key] || null
    const current = prog?.currentIndex ?? 0
    const finished = current >= total

    let actionLabel = '시작'
    let action

    if (prog && current > 0 && !finished) {
      actionLabel = '이어하기'
      action = () => router.push(`/quizsets/${quizSet.id}/${mode.path}?direction=${mode.direction}`)
    } else if (prog && finished) {
      actionLabel = '새로 시작'
      action = async () => {
        const newOrder = [...Array(total).keys()].sort(() => Math.random() - 0.5)
        await axios.put(`/api/quizsets/${quizSet.id}/progress?type=${mode.key}`, {
          currentIndex: 0, shuffledOrder: newOrder, incorrects: [], order: newOrder
        })
        // 새로고침하지 말고 진행도만 갱신
        setProgressMap(prev => ({
          ...prev,
          [mode.key]: { currentIndex: 0, shuffledOrder: newOrder, incorrects: [], order: newOrder }
        }))
        router.push(`/quizsets/${quizSet.id}/${mode.path}?direction=${mode.direction}`)
      }
    } else if (!prog || current === 0) {
      actionLabel = '시작'
      action = async () => {
        const newOrder = [...Array(total).keys()].sort(() => Math.random() - 0.5)
        await axios.put(`/api/quizsets/${quizSet.id}/progress?type=${mode.key}`, {
          currentIndex: 0, shuffledOrder: newOrder, incorrects: [], order: newOrder
        })
        setProgressMap(prev => ({
          ...prev,
          [mode.key]: { currentIndex: 0, shuffledOrder: newOrder, incorrects: [], order: newOrder }
        }))
        router.push(`/quizsets/${quizSet.id}/${mode.path}?direction=${mode.direction}`)
      }
    }

    return (
      <div
        key={mode.key}
        className={`
          flex flex-col justify-between border border-[var(--border-color)]
          bg-[var(--input-bg)] rounded-2xl shadow min-h-[140px] p-6
          hover:shadow-lg transition-transform hover:scale-[1.018]
        `}
        style={{ minWidth: 0 }}
      >
        <div className="mb-1 font-bold text-base sm:text-lg text-[var(--text-color)]">{mode.top}</div>
        <div className="text-xs text-gray-500 mb-4">{mode.bottom}</div>
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-1 bg-gray-200 dark:bg-zinc-500 rounded-full h-2 overflow-hidden">
            <div
              className="h-2 rounded-full bg-[var(--button-bg)] transition-all"
              style={{ width: `${(current / total) * 100}%` }}
            />
          </div>
          <span className="text-xs font-semibold min-w-max ml-2">{current} / {total}</span>
        </div>
        <button
          className={`
            w-full mt-1 py-2 rounded-lg font-bold text-sm
            bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)] text-white
            transition
          `}
          onClick={action}
        >
          {actionLabel}
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto pt-20 sm:pt-8 px-2 sm:px-6">
      {showEditModal && (
        <QuizSetModal
          onClose={() => { setShowEditModal(false); location.reload() }}
          initialData={quizSet}
          editMode={true}
        />
      )}

      <div className="rounded-2xl shadow-lg bg-[var(--bg-color)] border border-[var(--border-color)] px-2 sm:px-8 py-7 mb-10">
        {/* 타이틀+공개여부 */}
        <div className="flex items-center gap-2 mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-color)] break-words flex-1">{quizSet.title}</h1>
          <span className={`
            inline-flex items-center justify-center min-w-[52px] px-3 py-1 text-xs font-semibold rounded-full
            ${quizSet.isPublic
              ? 'bg-[var(--badge-bg-public)] text-[var(--badge-text-public)]'
              : 'bg-[var(--badge-bg-private)] text-[var(--badge-text-private)]'
            } whitespace-nowrap
          `}>
            {quizSet.isPublic ? '공개' : '비공개'}
          </span>
        </div>
        {/* 타입/문제수 */}
        <div className="flex gap-3 text-sm mb-8">
          <span className="rounded bg-[var(--input-bg)] px-2 py-1 font-semibold">{quizSet.type === 'WORD' ? '단어장' : '일반문제'}</span>
          <span className="rounded bg-[var(--input-bg)] px-2 py-1 font-semibold">{total} 문제</span>
        </div>

        {!isOwner && (
          <div className="mb-8">
            <button
              onClick={handleCopy}
              className="w-full py-3 rounded-xl bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)] text-white text-lg font-bold shadow transition"
              disabled={isCopying}
            >
              {isCopying ? "복사 중..." : "내 퀴즈로 복사"}
            </button>
          </div>
        )}

        {/* 내 퀴즈일 때만 모드카드 */}
        {isOwner && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
            {MODES.filter(mode =>
              (quizSet.type === 'WORD' && mode.type === 'WORD') ||
              (quizSet.type === 'QA' && mode.type === 'QA')
            ).map(renderModeCard)}
          </div>
        )}

        {/* 문제 카드 목록 */}
        <div className="border-t border-[var(--border-color)] pt-7 mt-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {quizSet.questions.map((q, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg bg-[var(--input-bg)] border border-[var(--border-color)] shadow-sm hover:scale-[1.01] transition"
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

        {/* 하단 액션 (내 퀴즈일 때만) */}
        {isOwner && (
          <div className="flex flex-col sm:flex-row gap-2 justify-end mt-8">
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
