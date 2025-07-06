'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function CreateQuizSetPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [questions, setQuestions] = useState([{ content: '', answer: '' }])

  const handleAddQuestion = () => {
    setQuestions([...questions, { content: '', answer: '' }])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await axios.post('/api/quizsets', { title, questions })
    router.push('/quizsets')
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold">퀴즈 추가</h2>
      <input
        type="text"
        placeholder="퀴즈 제목"
        className="w-full p-2 border rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      {questions.map((q, index) => (
        <div key={index} className="space-y-2">
          <input
            type="text"
            placeholder={`문제 ${index + 1}`}
            className="w-full p-2 border rounded"
            value={q.content}
            onChange={(e) => {
              const newQuestions = [...questions]
              newQuestions[index].content = e.target.value
              setQuestions(newQuestions)
            }}
          />
          <input
            type="text"
            placeholder={`정답 ${index + 1}`}
            className="w-full p-2 border rounded"
            value={q.answer}
            onChange={(e) => {
              const newQuestions = [...questions]
              newQuestions[index].answer = e.target.value
              setQuestions(newQuestions)
            }}
          />
        </div>
      ))}
      <button type="button" onClick={handleAddQuestion} className="bg-[var(--button-bg)] px-4 py-2 rounded">
        + 문제 추가
      </button>
      <button type="submit" className="block w-full bg-blue-600 text-white py-2 rounded">
        저장
      </button>
    </form>
  )
}
