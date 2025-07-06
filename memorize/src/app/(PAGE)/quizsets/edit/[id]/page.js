'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { use } from "react";
import axios from 'axios'

export default function EditQuizPage({ params }) {
  const [title, setTitle] = useState('')
  const [questions, setQuestions] = useState([{ content: '', answer: '' }])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { id } = use(params);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/quizsets/${id}`)
      const quiz = await res.json()
      setTitle(quiz.title)
      setQuestions(quiz.questions || [])
      setLoading(false)
    }
    fetchData()
  }, [id])

  const handleChange = (index, field, value) => {
    const newQs = [...questions]
    newQs[index][field] = value
    setQuestions(newQs)
  }

  const handleAdd = () => {
    setQuestions([...questions, { content: '', answer: '' }])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await axios.put(`/api/quizsets/${id}`, { title, questions })
    router.push('/quizsets')
  }

  if (loading) return <p className="p-6">불러오는 중…</p>

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold">퀴즈 수정</h2>
      <input value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border rounded" />
      {questions.map((q, i) => (
        <div key={i} className="space-y-2">
          <input
            value={q.content}
            onChange={e => handleChange(i, 'content', e.target.value)}
            className="w-full p-2 border rounded"
            placeholder={`문제 ${i + 1}`}
          />
          <input
            value={q.answer}
            onChange={e => handleChange(i, 'answer', e.target.value)}
            className="w-full p-2 border rounded"
            placeholder={`정답 ${i + 1}`}
          />
        </div>
      ))}
      <button type="button" onClick={handleAdd} className="bg-[var(--button-bg)] px-4 py-2 rounded text-white">
        + 문제 추가
      </button>
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
        저장
      </button>
    </form>
  )
}