'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function QuizPlayPage() {
  const { id } = useParams()
  const [questions, setQuestions] = useState([])
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [correct, setCorrect] = useState(null)

  useEffect(() => {
    fetch(`/api/questions?quizSetId=${id}`)
      .then(res => res.json())
      .then(setQuestions)
  }, [id])

  if (questions.length === 0) return <p className="p-8">퀴즈 불러오는 중...</p>
  const question = questions[index]

  const makeOptions = () => {
    const answers = [question.answer]
    while (answers.length < 4) {
      const random = questions[Math.floor(Math.random() * questions.length)]?.answer
      if (random && !answers.includes(random)) answers.push(random)
    }
    return answers.sort(() => Math.random() - 0.5)
  }

  const options = makeOptions()

  const handleAnswer = (option) => {
    setSelected(option)
    setCorrect(option === question.answer)
  }

  const nextQuestion = () => {
    setIndex(index + 1)
    setSelected(null)
    setCorrect(null)
  }

  return (
    <div className="min-h-screen p-8 bg-white dark:bg-black text-black dark:text-white">
      <div className="max-w-xl mx-auto space-y-4">
        <h1 className="text-xl font-bold">Q{index + 1}. {question.content}</h1>

        <div className="grid gap-3">
          {options.map((option) => (
            <button key={option}
              disabled={!!selected}
              onClick={() => handleAnswer(option)}
              className={`px-4 py-2 border rounded ${
                selected
                  ? option === question.answer
                    ? 'bg-green-500 text-white'
                    : option === selected
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200'
                  : 'hover:bg-gray-100 dark:hover:bg-zinc-700'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {selected && (
          <div className="mt-4 text-center">
            {correct ? '✅ 정답입니다!' : `❌ 오답! 정답: ${question.answer}`}
            {index < questions.length - 1 ? (
              <button onClick={nextQuestion} className="ml-4 underline text-blue-500">
                다음 문제 →
              </button>
            ) : (
              <p className="mt-2 text-green-600">🎉 모든 퀴즈를 완료했습니다.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
