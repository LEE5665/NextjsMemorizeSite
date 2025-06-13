'use client'

import { useState } from 'react'

export default function QuizPage() {
  const quiz = {
    question: 'What is the capital of France?',
    options: ['Berlin', 'London', 'Paris', 'Madrid'],
    answer: 'Paris',
  }

  const [selected, setSelected] = useState('')
  const [result, setResult] = useState(null)

  const handleAnswer = (option) => {
    setSelected(option)
    setResult(option === quiz.answer)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-black dark:text-white flex items-center justify-center px-4">
      <div className="max-w-xl w-full bg-gray-100 dark:bg-zinc-800 p-8 rounded-lg shadow space-y-6">
        <h1 className="text-2xl font-bold">Quiz</h1>

        <p className="text-lg">{quiz.question}</p>

        <div className="grid gap-3">
          {quiz.options.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              disabled={!!result}
              className={`px-4 py-2 rounded border transition ${
                selected === option
                  ? result
                    ? 'bg-green-500 text-white border-green-500'
                    : 'bg-red-500 text-white border-red-500'
                  : 'bg-white dark:bg-zinc-700 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-zinc-600'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {result !== null && (
          <div className={`text-center mt-4 text-lg font-semibold ${result ? 'text-green-500' : 'text-red-500'}`}>
            {result ? '정답입니다!' : `틀렸습니다. 정답은 "${quiz.answer}"`}
          </div>
        )}
      </div>
    </div>
  )
}
