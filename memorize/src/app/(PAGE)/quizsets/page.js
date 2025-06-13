'use client'

import { useEffect, useState } from 'react'

export default function QuizSetPage() {
  const [quizSets, setQuizSets] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    fetch('/api/quizsets')
      .then(res => res.json())
      .then(setQuizSets)
  }, [refresh])

  const createQuizSet = async () => {
    await fetch('/api/quizsets', {
      method: 'POST',
      body: JSON.stringify({ title, description }),
    })
    setTitle('')
    setDescription('')
    setRefresh(!refresh)
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">퀴즈 세트 목록</h1>

      <div className="mb-6">
        <input placeholder="제목" value={title} onChange={e => setTitle(e.target.value)}
          className="border p-2 mr-2" />
        <input placeholder="설명" value={description} onChange={e => setDescription(e.target.value)}
          className="border p-2 mr-2" />
        <button onClick={createQuizSet} className="bg-blue-500 text-white px-4 py-2 rounded">추가</button>
      </div>

      <ul className="space-y-2">
        {quizSets.map(qs => (
          <li key={qs.id} className="border p-4 rounded bg-gray-100">
            <strong>{qs.title}</strong><br />
            {qs.description || '(설명 없음)'}<br />
            <a href={`/quiz/${qs.id}`} className="text-blue-500">퀴즈 풀기 →</a>
          </li>
        ))}
      </ul>
    </div>
  )
}
