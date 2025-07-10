'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import axios from 'axios'

export default function MCQuizPage() {
  const { id } = useParams()
  const router = useRouter()

  const [questions, setQuestions] = useState([])
  const [shuffledOrder, setShuffledOrder] = useState([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [finished, setFinished] = useState(false)
  const [incorrects, setIncorrects] = useState([])
  const [options, setOptions] = useState([])

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get(`/api/quizsets/${id}`)
      const quiz = res.data
      const qs = quiz.questions
      const progress = quiz.progress || {}

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
        await axios.put(`/api/quizsets/${id}/progress`, {
          currentIndex: 0,
          shuffledOrder: order,
          incorrects: [],
        })
      }
    }

    fetch()
  }, [id])

  const q = questions[shuffledOrder[current]]

  useEffect(() => {
    if (!q) return
    const all = [...new Set([q.answer, ...questions.map(q => q.answer)])]
    const filtered = all.filter(a => a !== q.answer).sort(() => Math.random() - 0.5).slice(0, 3)
    setOptions(shuffle([...filtered, q.answer]))
    setSelected(null)
    setShowResult(false)
  }, [current, questions, q])

  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5)

  const handleSelect = (option) => {
    if (selected !== null) return
    setSelected(option)
    setShowResult(true)
  }

  const next = async () => {
    const isCorrect = selected === q.answer
    const newIncorrects = !isCorrect ? [...incorrects, shuffledOrder[current]] : incorrects
    setIncorrects(newIncorrects)

    const nextIndex = current + 1
    await axios.put(`/api/quizsets/${id}/progress`, {
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
    await axios.put(`/api/quizsets/${id}/progress`, {
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

  if (questions.length === 0) return (
    <div className="flex items-center justify-center min-h-[50vh] text-xl" style={{ color: 'var(--text-color)' }}>
      불러오는 중…
    </div>
  )

  if (finished) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-color)] text-[var(--text-color)] px-4">
        <div className="max-w-xl w-full bg-[var(--input-bg)] p-8 rounded-2xl shadow-xl space-y-6 text-center border border-[var(--border-color)]">
          <h2 className="text-2xl font-bold mb-3">퀴즈 완료!</h2>
          <p className="text-lg">점수: <span className="font-bold text-blue-500">{questions.length - incorrects.length} / {questions.length}</span></p>
          {incorrects.length > 0 && (
            <div className="mt-6 text-left">
              <h3 className="font-bold mb-2 text-red-500">틀린 문제</h3>
              {incorrects.map(i => (
                <div key={i} className="mb-3 p-3 rounded-xl bg-red-50 dark:bg-red-900/50 border border-red-300 dark:border-red-700 text-sm">
                  ❌ <span className="font-semibold">{questions[i].content}</span><br />
                  <span className="text-red-400">정답: {questions[i].answer}</span>
                </div>
              ))}
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

  // 현재 문제 데이터
  const isWrong = showResult && selected !== null && selected !== q.answer

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-color)] text-[var(--text-color)] px-2">
      <div className="w-full max-w-xl bg-[var(--input-bg)] p-8 rounded-2xl shadow-xl border border-[var(--border-color)] space-y-7">
        {/* 진행도 바 */}
        <div className="flex items-center gap-4 mb-3">
          <div className="flex-1 bg-gray-200 dark:bg-zinc-400 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-[var(--button-bg)] transition-all"
              style={{ width: `${((current + 1) / questions.length) * 100}%` }}
            />
          </div>
          <span className="text-sm font-semibold min-w-max ml-2">{current + 1} / {questions.length}</span>
        </div>

        <div className="flex items-center gap-2 text-lg sm:text-xl font-semibold">
          <span>{q.content}</span>
          <button
            onClick={() => speak(q.content)}
            className="text-blue-500 hover:text-blue-700"
            title="문제 읽기"
          >
            🔊
          </button>
        </div>

        <div className="grid gap-4">
          {options.map((option, idx) => {
            const isSelected = selected === option
            const isCorrect = option === q.answer
            // 정답: 파란색, 오답: 빨간색, 선택X: input-bg
            return (
              <button
                key={idx}
                disabled={selected !== null}
                onClick={() => handleSelect(option)}
                className={`
                  w-full px-4 py-3 rounded-xl font-semibold border transition
                  flex items-center gap-3 shadow-sm
                  ${selected
                    ? isSelected
                      ? isCorrect
                        ? 'bg-[var(--button-bg)] text-white border-[var(--button-bg)]'
                        : 'bg-red-500 text-white border-red-600'
                      : isCorrect
                        ? 'bg-[var(--button-bg)] text-white border-[var(--button-bg)] opacity-80'
                        : 'bg-[var(--input-bg)] text-[var(--text-color)] border-[var(--border-color)] opacity-60'
                    : 'bg-[var(--input-bg)] text-[var(--text-color)] border-[var(--border-color)] hover:bg-[var(--button-bg)] hover:text-white'}
                `}
                style={{
                  fontSize: '1rem'
                }}
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

        {!selected && (
          <button
            onClick={() => handleSelect('')}
            className="block mx-auto mt-2 text-sm text-gray-400 underline"
          >
            잘 모르겠습니다
          </button>
        )}

        {selected !== null && (
          <div className="text-center mt-6">
            <button
              onClick={next}
              className="px-6 py-2 rounded-xl font-semibold bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)] text-white shadow transition"
            >
              다음 문제 →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
