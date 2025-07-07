// QuizSetModal.js

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function QuizSetModal({
  onClose,
  initialData = null,
  editMode = false,
  currentUserId = null,
}) {
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [type, setType] = useState('WORD')
  const [isPublic, setIsPublic] = useState(false)
  const [questions, setQuestions] = useState([{ content: '', answer: '' }])

  // ✅ 본인이 만든 퀴즈인지 판별 (originalCreatorId !== creatorId이면 공유받은 것)
  const isSharedCopy = initialData?.originalCreatorId !== initialData?.creatorId
  const isOwner = !initialData || initialData.creatorId === currentUserId

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '')
      setIsPublic(initialData.isPublic || false)
      setType(initialData.type || 'WORD')
      setQuestions(initialData.questions || [{ content: '', answer: '' }])
    }
  }, [initialData])

  const handleAddQuestion = () => {
    setQuestions([...questions, { content: '', answer: '' }])
  }

  const handleChange = (index, key, value) => {
    const updated = [...questions]
    updated[index][key] = value
    setQuestions(updated)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (editMode && initialData?.id) {
      await axios.put(`/api/quizsets/${initialData.id}`, { title, isPublic, questions })
    } else {
      await axios.post('/api/quizsets', { title, type, isPublic, questions })
    }

    onClose()
    router.refresh()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-start overflow-auto">
      <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-xl w-full max-w-2xl mt-12 mb-12 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-xl text-zinc-500 hover:text-zinc-800 dark:hover:text-white"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-4">
          {editMode ? '퀴즈 수정' : '퀴즈 추가'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="퀴즈 제목"
            className="w-full p-2 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {!editMode && (
            <select
              className="w-full p-2 border rounded"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="WORD">단어 퀴즈</option>
              <option value="QA">QA 퀴즈</option>
            </select>
          )}

          {/* ✅ 본인이 만든 퀴즈이고, 공유받은 것이 아닐 때만 체크박스 표시 */}
          {isOwner && !isSharedCopy && (
            <label className="block">
              <input
                type="checkbox"
                className="mr-2"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
              공개 퀴즈로 만들기
            </label>
          )}

          {questions.map((q, index) => (
            <div key={index} className="space-y-2">
              <input
                type="text"
                placeholder={type === 'WORD' ? `단어 ${index + 1}` : `문제 ${index + 1}`}
                className="w-full p-2 border rounded"
                value={q.content}
                onChange={(e) => handleChange(index, 'content', e.target.value)}
              />
              <input
                type="text"
                placeholder={type === 'WORD' ? `뜻 ${index + 1}` : `정답 ${index + 1}`}
                className="w-full p-2 border rounded"
                value={q.answer}
                onChange={(e) => handleChange(index, 'answer', e.target.value)}
              />
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddQuestion}
            className="bg-[var(--button-bg)] px-4 py-2 rounded"
          >
            + 문제 추가
          </button>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            저장
          </button>
        </form>
      </div>
    </div>
  )
}
