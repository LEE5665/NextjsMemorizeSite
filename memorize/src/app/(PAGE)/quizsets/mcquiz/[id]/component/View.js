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
  }, [current, questions])

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
    const utterance = new SpeechSynthesisUtterance(text)
    const isKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(text)
    utterance.lang = isKorean ? 'ko-KR' : 'en-US'
    window.speechSynthesis.speak(utterance)
    console.log(isKorean)
  }

  if (questions.length === 0) return <p className="p-6">불러오는 중…</p>

  if (finished) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-color)] text-[var(--text-color)] px-4">
        <div className="max-w-xl w-full bg-[var(--input-bg)] p-8 rounded-2xl shadow space-y-6 text-center">
          <h2 className="text-2xl font-bold">퀴즈 완료!</h2>
          <p className="text-lg">점수: {questions.length - incorrects.length} / {questions.length}</p>

          {incorrects.length > 0 && (
            <div className="mt-4 text-left">
              <h3 className="font-bold mb-2 text-red-500">틀린 문제</h3>
              {incorrects.map(i => (
                <div key={i} className="text-sm mb-2">
                  ❌ {questions[i].content}<br />
                  <span className="text-gray-500">정답: {questions[i].answer}</span>
                </div>
              ))}
            </div>
          )}

          <button onClick={handleRestart} className="mt-4 px-4 py-2 bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)] text-white rounded">
            다시 하기
          </button>
        </div>
      </div>
    )
  }

  const isWrong = showResult && selected !== null && selected !== q.answer

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-color)] text-[var(--text-color)] px-4">
      <div className="max-w-xl w-full bg-[var(--input-bg)] p-8 rounded-2xl shadow space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            문제 {current + 1} / {questions.length}
          </h2>
          {isWrong && (
            <p className="text-sm text-yellow-300 font-medium">정답: {q.answer}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <p className="text-xl font-medium">{q.content}</p>
          <button
            onClick={() => speak(q.content)}
            className="text-sm text-blue-500 hover:underline"
            title="읽어주기"
          >
            🔊
          </button>
        </div>

        <div className="grid gap-3">
          {options.map((option, idx) => {
            const isSelected = selected === option

            return (
              <div key={idx} className="relative flex items-center gap-2">
                <button
                  disabled={selected !== null}
                  onClick={() => handleSelect(option)}
                  className={`flex-1 px-4 py-2 rounded-xl border text-left transition font-medium ${isSelected
                      ? option === q.answer
                        ? 'bg-green-500 text-white border-green-600'
                        : 'bg-red-500 text-white border-red-600'
                      : 'bg-white dark:bg-zinc-700 border-[var(--border-color)] hover:bg-gray-100 dark:hover:bg-zinc-600'
                    }`}
                >
                  {option}
                </button>
                <button
                  onClick={() => speak(option)}
                  title="읽기"
                  className="text-sm px-2 py-1 text-blue-500 hover:text-blue-700"
                >
                  🔊
                </button>
              </div>
            )
          })}
        </div>

        {!selected && (
          <button
            onClick={() => handleSelect('')}
            className="text-sm text-gray-500 underline mt-2"
          >
            잘 모르겠습니다
          </button>
        )}

        {selected !== null && (
          <div className="text-center mt-4">
            <button
              onClick={next}
              className="px-4 py-2 bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)] text-white rounded"
            >
              다음 문제 →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
