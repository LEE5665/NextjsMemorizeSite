'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

export default function FolderModal({ onClose, onDone, folderData }) {
  const isEdit = !!folderData?.folder
  const [name, setName] = useState(folderData?.folder?.name ?? '')
  const [loading, setLoading] = useState(false)
  const [quizSets, setQuizSets] = useState([])
  const [selectedIds, setSelectedIds] = useState([])

  useEffect(() => {
    const selected = folderData.inFolder.map(q => q.id)
    const all = [...folderData.inFolder, ...folderData.notInFolder]

    const sorted = all.sort((a, b) => {
      const aSelected = selected.includes(a.id)
      const bSelected = selected.includes(b.id)
      if (aSelected && !bSelected) return -1
      if (!aSelected && bSelected) return 1
      return new Date(b.updatedAt) - new Date(a.updatedAt)
    })

    setQuizSets(sorted)
    setSelectedIds(selected)
  }, [folderData])

  const toggleSelection = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const handleSubmit = async () => {
    if (!name.trim()) return
    setLoading(true)

    try {
      let folder
      if (isEdit) {
        const res = await axios.patch(`/api/folders/${folderData.folder.id}`, {
          name: name.trim(),
          quizSetIds: selectedIds,
        })
        folder = res.data.folder
      } else {
        const res = await axios.post('/api/folders', {
          name: name.trim(),
          quizSetIds: selectedIds,
        })
        folder = res.data.folder
      }

      onDone(folder)
      onClose()
    } catch (err) {
      console.error('저장 실패', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.32)]">
      <div
        className="relative w-full max-w-xs sm:max-w-md p-3 sm:p-7 mx-2 rounded-2xl shadow-2xl border bg-[var(--bg-color)] text-[var(--text-color)] border-[var(--border-color)] animate-modal-pop"
      >
        {/* 닫기버튼 */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-xl sm:text-2xl text-[var(--subtext-color)] hover:text-[var(--text-color)] transition"
          aria-label="닫기"
        >
          ×
        </button>

        <h2 className="text-base sm:text-xl font-extrabold text-center mb-4">
          {isEdit ? '폴더 수정' : '폴더 생성'}
        </h2>

        <input
          type="text"
          className="w-full px-3 sm:px-4 py-2 sm:py-3 mb-2 rounded-xl bg-[var(--input-bg)] text-[var(--text-color)] border border-[var(--border-color)] focus:ring-2 focus:ring-[var(--button-bg)] transition text-sm sm:text-base"
          placeholder="폴더 이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={25}
        />

        {/* 목록 타이틀 및 스크롤 */}
        <div className="mb-2">
          <h3 className="text-xs sm:text-sm font-bold text-[var(--subtext-color)] pl-1 mb-1">
            포함할 퀴즈 목록
          </h3>
          <div className="max-h-48 sm:max-h-52 min-h-[44px] sm:min-h-[56px] overflow-y-auto space-y-1 bg-[var(--input-bg)] rounded-lg p-2 border border-[var(--border-color)]">
            {quizSets.length === 0 ? (
              <div className="text-xs sm:text-sm text-[var(--subtext-color)] text-center py-5">
                추가할 퀴즈가 없습니다.
              </div>
            ) : (
              quizSets.map((q) => (
                <label
                  key={q.id}
                  className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer 
                  hover:bg-[var(--bg-color)] transition text-xs sm:text-base`}
                >
                  <input
                    type="checkbox"
                    className="rounded border-[var(--border-color)] accent-[var(--button-bg)]"
                    checked={selectedIds.includes(q.id)}
                    onChange={() => toggleSelection(q.id)}
                  />
                  <span className="truncate">{q.title}</span>
                </label>
              ))
            )}
          </div>
        </div>

        {/* 버튼 그룹 */}
        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={onClose}
            className="px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-base text-[var(--text-color)] bg-[var(--input-bg)] border border-[var(--border-color)] hover:bg-[var(--bg-color)] transition"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !name.trim()}
            className="px-4 sm:px-5 py-2 rounded-lg font-bold text-xs sm:text-base bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)] text-[var(--button-text)] shadow-sm transition disabled:opacity-60"
          >
            {loading ? '저장 중...' : '저장'}
          </button>
        </div>

        {/* 모달 애니메이션 */}
        <style jsx>{`
        .animate-modal-pop {
          animation: modal-pop .23s cubic-bezier(.42,1.1,.23,1);
        }
        @keyframes modal-pop {
          0% { opacity: 0; transform: scale(.95);}
          100% { opacity: 1; transform: scale(1);}
        }
      `}</style>
      </div>
    </div>
  )
}
