'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import axios from 'axios'

export default function MCQuizPage() {
  const { id } = useParams()
  const searchParams = useSearchParams()
  const direction = searchParams.get('direction') || 'word2mean'
  const router = useRouter()

  const [questions, setQuestions] = useState([])
  const [shuffledOrder, setShuffledOrder] = useState([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [finished, setFinished] = useState(false)
  const [incorrects, setIncorrects] = useState([])
  const [options, setOptions] = useState([])

  // type 결정 (방향에 따라)
  const progressType = direction === 'mean2word' ? 'REVERSE_CHOICE' : 'CHOICE'

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get(`/api/quizsets/${id}`)
      const quiz = res.data
      const qs = quiz.questions
      const progress = (quiz.progress && quiz.progress[progressType]) || {}

      setQuestions(qs)

      if (progress.shuffledOrder && progress.currentIndex != null) {
        setShuffledOrder(progress.shuffledOrder)
        setCurrent(progress.currentIndex)
        setIncorrects(progress.incorrects || [])
      } else {
        const order = [...Array(qs.length).keys()].sort(() => Math.random() - 0.5)
        setShuffledOrder(order)
        setCurrent(0)
        setIncorrects([])
        await axios.put(`/api/quizsets/${id}/progress?type=${progressType}`, {
          currentIndex: 0,
          shuffledOrder: order,
          incorrects: [],
        })
      }
    }
    fetch()
  }, [id, direction, progressType])

  const q = questions && shuffledOrder && typeof shuffledOrder[current] !== "undefined"
    ? questions[shuffledOrder[current]]
    : undefined

  useEffect(() => {
    if (!q) return
    // 옵션 랜덤 생성
    const allAnswers = [...new Set(questions.map(q => (
      direction === 'mean2word' ? q.content : q.answer
    )))]
    const answer = direction === 'mean2word' ? q.content : q.answer
    const filtered = allAnswers.filter(a => a !== answer).sort(() => Math.random() - 0.5).slice(0, 3)
    setOptions(shuffle([...filtered, answer]))
    setSelected(null)
    setShowResult(false)
  }, [current, questions, q, direction])

  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5)

  const handleSelect = (option) => {
    if (selected !== null) return
    setSelected(option)
    setShowResult(true)
  }

  const next = async () => {
    const answer = direction === 'mean2word' ? q.content : q.answer
    const isCorrect = selected === answer
    const newIncorrects = !isCorrect ? [...incorrects, shuffledOrder[current]] : incorrects
    setIncorrects(newIncorrects)

    const nextIndex = current + 1
    await axios.put(`/api/quizsets/${id}/progress?type=${progressType}`, {
      currentIndex: nextIndex,
      shuffledOrder,
      incorrects: newIncorrects,
      lastAnswer: selected,
    })

    if (nextIndex >= shuffledOrder.length) {
      setFinished(true)
    } else {
      setCurrent(nextIndex)
    }
  }

  const handleRestart = async () => {
    const newOrder = [...Array(questions.length).keys()].sort(() => Math.random() - 0.5)
    await axios.put(`/api/quizsets/${id}/progress?type=${progressType}`, {
      currentIndex: 0,
      shuffledOrder: newOrder,
      incorrects: [],
    })
    setShuffledOrder(newOrder)
    setCurrent(0)
    setIncorrects([])
    setSelected(null)
    setShowResult(false)
    setFinished(false)
  }

  const speak = (text) => {
    window.speechSynthesis.cancel()
    const utterance = new window.SpeechSynthesisUtterance(text)
    const isKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(text)
    utterance.lang = isKorean ? 'ko-KR' : 'en-US'
    window.speechSynthesis.speak(utterance)
  }

  // === 로딩 상태 ===
  if (!q && !finished) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-xl" style={{ color: 'var(--text-color)' }}>
        불러오는 중…
      </div>
    )
  }

  // === 퀴즈 완료 ===
  if (finished) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-color)] text-[var(--text-color)] px-4">
        <div className="max-w-xl w-full bg-[var(--input-bg)] p-8 rounded-2xl shadow-xl space-y-6 text-center border border-[var(--border-color)]">
          <h2 className="text-2xl font-bold mb-3">퀴즈 완료!</h2>
          <p className="text-lg mb-4">
            점수: <span className="font-bold text-blue-500">{questions.length - incorrects.length} / {questions.length}</span>
          </p>
          {incorrects.length > 0 && (
            <div className="mt-6 text-left">
              <h3 className="font-bold mb-2 text-red-500">틀린 문제</h3>
              <div className="space-y-2">
                {incorrects.map(i => (
                  <div key={i} className="p-3 rounded-xl bg-[var(--input-bg)] border border-[var(--border-color)] text-sm shadow-sm">
                    <div>
                      <span className="font-bold">문제:</span>
                      <span className="ml-2 font-semibold text-[var(--subtext-color)]">
                        {direction === 'mean2word' ? questions[i]?.answer : questions[i]?.content}
                      </span>
                    </div>
                    <div>
                      <span className="font-bold">정답:</span>
                      <span className="ml-2 font-bold" style={{ color: 'var(--danger-text)' }}>
                        {direction === 'mean2word' ? questions[i]?.content : questions[i]?.answer}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <button
            onClick={handleRestart}
            className="mt-8 px-6 py-2 rounded-xl font-semibold bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)] text-white transition"
          >
            다시 하기
          </button>
        </div>
      </div>
    )
  }

  // === 퀴즈 풀이 화면 ===
  const prompt = direction === 'mean2word' ? q.answer : q.content
  const total = questions.length

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-color)] text-[var(--text-color)] px-2">
      <div className="w-full max-w-xl bg-[var(--input-bg)] p-8 rounded-2xl shadow-xl border border-[var(--border-color)] space-y-7">
        {/* 진행도 바 */}
        <div className="flex items-center gap-4 mb-3">
          <div className="flex-1 h-3 rounded-full bg-gray-200 dark:bg-zinc-500 overflow-hidden">
            <div
              className="h-3 rounded-full bg-[var(--button-bg)] transition-all"
              style={{ width: `${((current + 1) / total) * 100}%` }}
            />
          </div>
          <span className="text-sm font-semibold min-w-max ml-2">{current + 1} / {total}</span>
        </div>

        {/* 문제 */}
        <div className="flex flex-row items-center gap-2 text-lg sm:text-2xl font-bold mb-4">
          <span>{prompt}</span>
          <button
            onClick={() => speak(prompt)}
            className="ml-2 text-blue-400 hover:text-blue-700"
            title="문제 읽기"
          >
            <span className="text-lg">🔊</span>
          </button>
        </div>

        {/* 선택지 */}
        <div className="grid gap-4">
          {options.map((option, idx) => {
            const isSelected = selected === option
            const answer = direction === 'mean2word' ? q.content : q.answer
            const isCorrect = option === answer
            // 선택 후: 정답(파랑), 오답(빨강), 나머지(흐림)
            // 선택 전: 호버시 약간 어두운 배경/글씨(부드럽게)
            return (
              <button
                key={idx}
                disabled={selected !== null}
                onClick={() => handleSelect(option)}
                className={`
                  w-full px-4 py-3 rounded-xl font-semibold border shadow transition
                  flex items-center gap-3
                  ${selected
                    ? isSelected
                      ? isCorrect
                        ? 'bg-[var(--selected-bg)] text-[var(--selected-text)] border-[var(--selected-bg)]'
                        : 'bg-[var(--danger-text)] text-white border-[var(--danger-hover)]'
                      : isCorrect
                        ? 'bg-[var(--selected-bg)] text-[var(--selected-text)] border-[var(--selected-bg)] opacity-80'
                        : 'bg-[var(--input-bg)] text-[var(--text-color)] border-[var(--border-color)] opacity-60'
                    : 'bg-[var(--input-bg)] text-[var(--text-color)] border-[var(--border-color)] hover:bg-[var(--button-hover-bg)] hover:text-white'}
                `}
                style={{ fontSize: '1.1rem' }}
              >
                <span className="flex-1 text-left">{option}</span>
                <span
                  onClick={e => { e.stopPropagation(); speak(option); }}
                  title="읽기"
                  className="ml-2 cursor-pointer text-blue-400 hover:text-blue-600 text-base"
                >🔊</span>
              </button>
            )
          })}
        </div>

        {/* 다음 문제 버튼 */}
        {selected !== null && (
          <div className="text-center mt-4">
            <button
              onClick={next}
              className="px-6 py-2 rounded-xl font-semibold bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)] text-white shadow transition"
            >
              다음 문제 →
            </button>
          </div>
        )}

        {/* 모르겠어요 */}
        {!selected && (
          <button
            onClick={() => handleSelect('')}
            className="block mx-auto mt-2 text-sm text-gray-400 underline"
          >
            잘 모르겠습니다
          </button>
        )}
      </div>
    </div>
  )
}
