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

  if (questions.length === 0) return <p className="p-6">불러오는 중…</p>

  if (finished) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-zinc-900 text-black dark:text-white px-4">
        <div className="max-w-xl w-full bg-white dark:bg-zinc-800 p-8 rounded shadow space-y-6 text-center">
          <h2 className="text-2xl font-bold">🎉 퀴즈 완료!</h2>
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

          <button onClick={handleRestart} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
            다시 하기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-zinc-900 text-black dark:text-white px-4">
      <div className="max-w-xl w-full bg-white dark:bg-zinc-800 p-8 rounded shadow space-y-6">
        <h2 className="text-lg font-semibold">문제 {current + 1} / {questions.length}</h2>
        <p className="text-xl">{q.content}</p>
        <div className="grid gap-3">
          {options.map((option, idx) => {
            const isSelected = selected === option
            const isWrong = showResult && isSelected && option !== q.answer

            return (
              <div key={idx} className="relative">
                <button
                  disabled={!!selected}
                  onClick={() => handleSelect(option)}
                  className={`w-full px-4 py-2 rounded border text-left transition ${
                    isSelected
                      ? option === q.answer
                        ? 'bg-green-500 text-white border-green-600'
                        : 'bg-red-500 text-white border-red-600'
                      : 'bg-white dark:bg-zinc-700 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-zinc-600'
                  }`}
                >
                  {option}
                </button>
                {isWrong && (
                  <span className="absolute right-2 top-2 text-sm text-yellow-300">
                    정답: {q.answer}
                  </span>
                )}
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

        {selected && (
          <div className="text-center mt-4">
            <button
              onClick={next}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              다음 문제 →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
