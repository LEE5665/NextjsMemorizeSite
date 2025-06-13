'use client'

import { useState } from 'react'

export default function QuizPage() {
  const [quizList, setQuizList] = useState([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const text = await file.text()
    const lines = text.trim().split('\n')
    const parsed = []

    for (let i = 0; i < lines.length; i += 2) {
      const questionLine = lines[i]?.trim()
      const answerLine = lines[i + 1]?.trim()
      if (questionLine?.startsWith('문제:') && answerLine?.startsWith('정답:')) {
        const question = questionLine.slice(3).trim()
        const answer = answerLine.slice(3).trim()
        parsed.push({ question, answer })
      }
    }

    const allAnswers = parsed.map(q => q.answer)
    const withOptions = parsed.map(q => {
      const wrong = allAnswers.filter(a => a !== q.answer)
      const randomWrong = shuffle(wrong).slice(0, 3)
      const options = shuffle([...randomWrong, q.answer])
      return { ...q, options }
    })

    const randomized = shuffle(withOptions)
    setQuizList(randomized)
    setCurrent(0)
    setSelected(null)
    setScore(0)
    setFinished(false)
  }

  const handleSelect = (option) => {
    if (selected !== null) return
    setSelected(option)
    if (option === quizList[current].answer) {
      setScore(prev => prev + 1)
    }

    setTimeout(() => {
      if (current + 1 >= quizList.length) {
        setFinished(true)
      } else {
        setCurrent(prev => prev + 1)
        setSelected(null)
      }
    }, 1000)
  }

  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5)

  if (quizList.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-100 dark:bg-zinc-900 text-black dark:text-white px-4">
        <h1 className="text-2xl font-bold">퀴즈 TXT 파일 업로드</h1>
        <input
          type="file"
          accept=".txt"
          onChange={handleFileUpload}
          className="px-4 py-2 border rounded bg-white dark:bg-zinc-800"
        />
        <p className="text-sm text-gray-500 dark:text-gray-400">형식: 문제:내용 \n 정답:내용 (반복)</p>
      </div>
    )
  }

  if (finished) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-zinc-900 text-black dark:text-white">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">🎉 퀴즈 완료!</h1>
          <p className="text-lg">점수: {score} / {quizList.length}</p>
          <button
            onClick={() => setQuizList([])}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            다시하기
          </button>
        </div>
      </div>
    )
  }

  const q = quizList[current]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-zinc-900 text-black dark:text-white px-4">
      <div className="max-w-xl w-full bg-white dark:bg-zinc-800 p-8 rounded shadow space-y-6">
        <h2 className="text-lg font-semibold">문제 {current + 1} / {quizList.length}</h2>
        <p className="text-xl">{q.question}</p>
        <div className="grid gap-3">
          {q.options.map((option, idx) => (
            <button
              key={idx}
              disabled={selected !== null}
              onClick={() => handleSelect(option)}
              className={`px-4 py-2 rounded border text-left transition w-full ${
                selected === option
                  ? option === q.answer
                    ? 'bg-green-500 text-white border-green-600'
                    : 'bg-red-500 text-white border-red-600'
                  : 'bg-white dark:bg-zinc-700 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-zinc-600'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        {selected && selected !== q.answer && (
          <div className="text-right text-sm text-red-400 mt-2">정답: {q.answer}</div>
        )}
      </div>
    </div>
  )
}
