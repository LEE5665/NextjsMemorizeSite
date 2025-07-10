'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function QuizSetModal({
  onClose,
  initialData = null,
  editMode = false,
}) {
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [type, setType] = useState('WORD')
  const [isPublic, setIsPublic] = useState(false)
  const [questions, setQuestions] = useState([{ content: '', answer: '' }])
  const [error, setError] = useState('')

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
    if (!title.trim()) {
      setError('제목을 입력해주세요.')
      return
    }
    for (const q of questions) {
      if (!q.content.trim() || !q.answer.trim()) {
        setError('모든 문제와 정답을 입력해주세요.')
        return
      }
    }
    setError('')

    try {
      if (editMode && initialData?.id) {
        await axios.put(`/api/quizsets/${initialData.id}`, {
          title,
          type,
          isPublic,
          questions,
        })
      } else {
        await axios.post('/api/quizsets', {
          title,
          type,
          isPublic,
          questions,
        })
      }
      onClose()
      router.refresh()
    } catch {
      setError('저장 중 오류가 발생했습니다.')
    }
  }

  const submitText = editMode ? '수정 완료' : '저장'

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-[rgba(0,0,0,0.3)] modal-overlay-fade">
      {/* 카드 */}
      <div
        className="relative w-full max-w-2xl p-8 rounded-2xl shadow-2xl border bg-[var(--bg-color)] text-[var(--text-color)] border-[var(--border-color)] animate-modal-pop"
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-5 right-6 text-2xl text-[var(--subtext-color)] hover:text-[var(--text-color)] transition"
          aria-label="닫기"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">
          {editMode ? '퀴즈 수정' : '퀴즈 추가'}
        </h2>

        {/* ⚡️ form 내부만 스크롤 */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 max-h-[60vh] overflow-y-auto pr-2"
        >
          {error && (
            <div className="mb-2 text-red-500 text-sm text-center">{error}</div>
          )}

          {/* 제목 */}
          <input
            type="text"
            placeholder="퀴즈 제목"
            className="w-full p-3 rounded-xl bg-[var(--input-bg)] text-[var(--text-color)] border border-[var(--border-color)] focus:ring-2 focus:ring-[var(--button-bg)] transition"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* 유형 선택 (추가 모드에서만) */}
          {!editMode && (
            <select
              className="w-full p-3 rounded-xl bg-[var(--input-bg)] text-[var(--text-color)] border border-[var(--border-color)] focus:ring-2 focus:ring-[var(--button-bg)] transition"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="WORD">단어 퀴즈</option>
              <option value="QA">QA 퀴즈</option>
            </select>
          )}

          {/* 공개 체크 */}
          <label className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              className="rounded border-[var(--border-color)] accent-[var(--button-bg)] focus:ring-1 focus:ring-[var(--button-bg)]"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            <span className="text-sm">공개 퀴즈로 만들기</span>
          </label>

          {/* 문제 입력 */}
          <div className="space-y-6">
            {questions.map((q, idx) => (
              <div key={idx} className="space-y-2">
                <input
                  type="text"
                  placeholder={type === 'WORD' ? `단어 ${idx + 1}` : `문제 ${idx + 1}`}
                  className="w-full p-3 rounded-xl bg-[var(--input-bg)] text-[var(--text-color)] border border-[var(--border-color)] focus:ring-2 focus:ring-[var(--button-bg)] transition"
                  value={q.content}
                  onChange={(e) => handleChange(idx, 'content', e.target.value)}
                />
                <input
                  type="text"
                  placeholder={type === 'WORD' ? `뜻 ${idx + 1}` : `정답 ${idx + 1}`}
                  className="w-full p-3 rounded-xl bg-[var(--input-bg)] text-[var(--text-color)] border border-[var(--border-color)] focus:ring-2 focus:ring-[var(--button-bg)] transition"
                  value={q.answer}
                  onChange={(e) => handleChange(idx, 'answer', e.target.value)}
                />
              </div>
            ))}
          </div>

          {/* 버튼 그룹 */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={handleAddQuestion}
              className="flex-1 bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)] text-[var(--button-text)] py-3 rounded-xl font-bold shadow-sm transition"
            >
              + 문제 추가
            </button>
            <button
              type="submit"
              className="flex-1 bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)] text-[var(--button-text)] py-3 rounded-xl font-bold shadow-sm transition"
            >
              {submitText}
            </button>
          </div>
        </form>
      </div>

      {/* 모달 애니메이션 스타일 */}
      <style jsx>{`
      .animate-modal-pop {
        animation: modal-pop .23s cubic-bezier(.42,1.1,.23,1);
      }
      @keyframes modal-pop {
        0% { opacity: 0; transform: scale(.95);}
        100% { opacity: 1; transform: scale(1);}
      }
      .modal-overlay-fade {
        animation: overlay-fade .18s cubic-bezier(.42,1.1,.23,1);
      }
      @keyframes overlay-fade {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `}</style>
    </div>
  )
}