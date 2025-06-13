'use client'

import { useState } from 'react'

export default function QuizForm({ onAdd }) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = e => {
    e.preventDefault()
    if (!question || !answer) {
      setMessage('문제와 정답을 입력해주세요.')
      return
    }
    onAdd({ question, answer })
    setQuestion(''); setAnswer('')
    setMessage('퀴즈가 추가되었습니다!')
    setTimeout(() => setMessage(''), 2000)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded p-4 space-y-3">
      <h2 className="text-lg font-semibold">📝 퀴즈 추가</h2>

      <div>
        <label className="block text-sm">문제</label>
        <input 
          type="text"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          className="w-full border rounded px-2 py-1"
        />
      </div>
      <div>
        <label className="block text-sm">정답</label>
        <input 
          type="text"
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          className="w-full border rounded px-2 py-1"
        />
      </div>

      <button type="submit" className="bg-indigo-600 text-white py-1 px-3 rounded hover:bg-indigo-700">
        추가
      </button>

      {message && <p className="text-green-600">{message}</p>}
    </form>
  )
}
