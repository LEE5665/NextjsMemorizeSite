'use client'

import { useState } from 'react'
import QuizForm from './QuizForm'

export default function QuizList() {
  const [quizzes, setQuizzes] = useState([])
  const [current, setCurrent] = useState(null)
  const [selected, setSelected] = useState('')
  const [feedback, setFeedback] = useState('')

  const addQuiz = quiz => {
    setQuizzes(prev => [...prev, quiz])
  }

  const startQuiz = () => {
    if (!quizzes.length) return
    const i = Math.floor(Math.random() * quizzes.length)
    const quiz = quizzes[i]
    const others = quizzes
      .map(q => q.answer)
      .filter(ans => ans !== quiz.answer)
    const opt = [quiz.answer, ...others.sort(() => Math.random() - 0.5).slice(0,3)]
    setCurrent({ question: quiz.question, answer: quiz.answer, options: opt.sort(() => Math.random()-0.5) })
    setSelected('')
    setFeedback('')
  }

  const check = () => {
    if (selected === current.answer) setFeedback('✅ 정답입니다!')
    else setFeedback(`❌ 오답! 정답은 "${current.answer}"입니다.`)
  }

  return (
    <div className="space-y-4">
      <QuizForm onAdd={addQuiz} />

      <div className="bg-white shadow rounded p-4">
        <button onClick={startQuiz} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
          퀴즈 풀기
        </button>
      </div>

      {current && (
        <div className="bg-white shadow rounded p-4 space-y-3">
          <p className="font-semibold">{current.question}</p>
          <div className="grid grid-cols-2 gap-2">
            {current.options.map(opt => (
              <button
                key={opt}
                onClick={() => setSelected(opt)}
                className={`border rounded px-2 py-1 ${selected === opt ? 'bg-indigo-200' : 'hover:bg-gray-100'}`}
              >
                {opt}
              </button>
            ))}
          </div>
          <div>
            <button
              onClick={check}
              disabled={!selected}
              className="mt-2 bg-blue-600 text-white px-3 py-1 rounded disabled:bg-gray-300"
            >
              제출
            </button>
            {feedback && <p className="mt-2">{feedback}</p>}
          </div>
        </div>
      )}

      {quizzes.length > 0 && (
        <div className="bg-white shadow rounded p-4">
          <h3 className="font-semibold mb-2">🗂 퀴즈 목록</h3>
          <ul className="list-disc pl-5 space-y-1">
            {quizzes.map((q, i) => (
              <li key={i}>{q.question}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
