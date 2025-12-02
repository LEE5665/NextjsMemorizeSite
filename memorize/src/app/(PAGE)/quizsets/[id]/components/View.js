'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import QuizSetModal from '@/app/(PAGE)/myquiz/components/CreateQuiz'
import { Volume2 } from 'lucide-react'

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
  const [isSimpleMode, setIsSimpleMode] = useState(false)
  const router = useRouter()

  const total = quizSet.questions.length
  const isOwner = currentUserId === quizSet.creatorId

  const speak = (text) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new window.SpeechSynthesisUtterance(text);
    const isKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(text);
    utter.lang = isKorean ? 'ko-KR' : 'en-US';
    window.speechSynthesis.speak(utter);
  };

  const handleDelete = async () => {
    if (confirm('정말 삭제할까요?')) {
      await axios.delete(`/api/quizsets/${quizSet.id}`)
      router.push('/myquiz')
    }
  }

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

  const renderModeCard = (mode) => {
    if (mode.type === 'WORD' && quizSet.type !== 'WORD') return null
    if (mode.type === 'QA' && quizSet.type !== 'QA') return null

    const prog = progressMap[mode.key] || null
    const current = prog?.currentIndex ?? 0
    const finished = current >= total

    const goQuiz = () =>
      router.push(`/quizsets/${quizSet.id}/${mode.path}?direction=${mode.direction}`)

    const restartQuiz = async () => {
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

    let actionButtons = null
    if (prog && current > 0 && !finished) {
      actionButtons = (
        <div className="flex gap-2">
          <button
            className="flex-1 py-2 rounded-lg font-bold text-sm bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)] text-white transition"
            onClick={goQuiz}
          >
            이어하기
          </button>
          <button
            className="flex-1 py-2 rounded-lg font-bold text-sm bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)] text-white transition"
            onClick={restartQuiz}
          >
            새로 시작
          </button>
        </div>
      )
    } else if (prog && finished) {
      actionButtons = (
        <button
          className="w-full mt-1 py-2 rounded-lg font-bold text-sm bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)] text-white transition"
          onClick={restartQuiz}
        >
          새로 시작
        </button>
      )
    } else {
      actionButtons = (
        <button
          className="w-full mt-1 py-2 rounded-lg font-bold text-sm bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)] text-white transition"
        >
          시작
        </button>
      )
    }

    return (
      <div
        key={mode.key}
        className="flex flex-col justify-between border border-[var(--border-color)]
        bg-[var(--input-bg)] rounded-2xl shadow min-h-[140px] p-6
        hover:shadow-lg transition-transform hover:scale-[1.018]"
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
        {actionButtons}
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto pt-16 sm:pt-8 px-2 sm:px-6">
      {showEditModal && (
        <QuizSetModal
          onClose={() => { setShowEditModal(false); location.reload() }}
          initialData={quizSet}
          editMode={true}
        />
      )}

      <div className="rounded-2xl shadow-lg bg-[var(--bg-color)] border border-[var(--border-color)] px-2 sm:px-8 py-7 mb-10">

        {/* 타이틀 */}
        <div className="flex items-center gap-2 mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-color)] break-words flex-1">
            {quizSet.title}
          </h1>
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

        <div className="flex gap-3 text-sm mb-8">
          <span className="rounded bg-[var(--input-bg)] px-2 py-1 font-semibold">
            {quizSet.type === 'WORD' ? '단어장' : '일반문제'}
          </span>
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

        {/* ✨ 모드 카드 */}
        {isOwner && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
            {MODES.filter(mode =>
              (quizSet.type === 'WORD' && mode.type === 'WORD') ||
              (quizSet.type === 'QA' && mode.type === 'QA')
            ).map(mode => renderModeCard(mode))} {/* key 정상 */}
          </div>
        )}

        {/* 보기 모드 토글 */}
        <div className="flex items-center gap-3 mb-5">
          <span className="font-semibold text-sm text-[var(--text-color)]">보기 모드:</span>

          {/* 기본 모드 버튼 */}
          <button
            onClick={() => setIsSimpleMode(false)}
            className={`px-3 py-1 rounded-lg text-sm font-bold transition-all duration-150
              ${!isSimpleMode
                ? 'bg-[var(--button-bg)] text-white shadow-md scale-[1.05]'
                : 'bg-[var(--input-bg)] text-[var(--text-color)] hover:bg-[var(--button-bg)] hover:text-white hover:scale-[1.03]'
              }`}
          >
            기본
          </button>

          {/* 단어만 모드 버튼 */}
          <button
            onClick={() => setIsSimpleMode(true)}
            className={`px-3 py-1 rounded-lg text-sm font-bold transition-all duration-150
              ${isSimpleMode
                ? 'bg-[var(--button-bg)] text-white shadow-md scale-[1.05]'
                : 'bg-[var(--input-bg)] text-[var(--text-color)] hover:bg-[var(--button-bg)] hover:text-white hover:scale-[1.03]'
              }`}
          >
            단어만
          </button>
        </div>

        {/* 문제 카드 */}
        <div className="border-t border-[var(--border-color)] pt-7 mt-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {quizSet.questions.map((q, idx) => {
            const isShown = progressMap[`show_${idx}`] ?? false

            // 단어만 모드
            if (isSimpleMode) {
              return (
                <div
                  key={idx}
                  className="p-4 rounded-lg bg-[var(--input-bg)] border border-[var(--border-color)]
                  shadow-sm hover:scale-[1.01] cursor-pointer transition"
                  onClick={() =>
                    setProgressMap(prev => ({
                      ...prev,
                      [`show_${idx}`]: !isShown
                    }))
                  }
                >
                  <div className="flex flex-wrap items-baseline w-full gap-2">

                    {/* 단어 */}
                    <span className="font-bold text-base text-[var(--text-color)] shrink-0">
                      {q.content}
                    </span>

                    {/* 뜻 */}
                    {isShown && (
                      <span className="text-sm text-[var(--subtext-color)] break-words flex-1 min-w-[40%]">
                        {q.answer}
                      </span>
                    )}

                    {/* 스피커 */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        speak(q.content)
                      }}
                      className="text-indigo-400 hover:text-indigo-700 ml-auto shrink-0 self-start"
                    >
                      <Volume2 size={22} />
                    </button>

                  </div>
                </div>
              )
            }

            // 기본 모드
            return (
              <div
                key={idx}
                className="p-4 rounded-lg bg-[var(--input-bg)] border border-[var(--border-color)] shadow-sm hover:scale-[1.01] transition"
              >
                {quizSet.type === 'WORD' ? (
                  <>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-indigo-700 dark:text-indigo-300">단어</span>
                      <button
                        onClick={() => speak(q.content)}
                        className="ml-1 text-indigo-400 hover:text-indigo-700"
                      >
                        <Volume2 size={18} />
                      </button>
                    </div>

                    <div className="text-base mb-2 text-[var(--text-color)] break-all flex items-center gap-2">
                      <span>{q.content}</span>
                    </div>

                    <div className="text-[var(--subtext-color)] text-sm flex items-center gap-1">
                      뜻:
                      <span>{q.answer}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-indigo-700 dark:text-indigo-300">문제</span>
                      <button
                        onClick={() => speak(q.content)}
                        className="ml-1 text-indigo-400 hover:text-indigo-700"
                      >
                        <Volume2 size={18} />
                      </button>
                    </div>

                    <div className="text-base mb-2 text-[var(--text-color)] break-all flex items-center gap-2">
                      <span>{q.content}</span>
                    </div>

                    <div className="text-[var(--subtext-color)] text-sm flex items-center gap-1">
                      정답:
                      <span>{q.answer}</span>
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>

        {/* 하단 액션 */}
        {isOwner && (
          <div className="flex flex-col sm:flex-row gap-2 justify-end mt-8">
            <button
              onClick={() => setShowEditModal(true)}
              className="px-4 py-2 rounded-md bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)]
              text-sm font-semibold text-[var(--button-text)] shadow transition w-full sm:w-auto"
            >
              수정
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600
              text-sm font-semibold text-white shadow transition w-full sm:w-auto"
            >
              삭제
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
