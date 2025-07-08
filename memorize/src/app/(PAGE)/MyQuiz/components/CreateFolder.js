'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

export default function FolderModal({ onClose, onDone, folderId = null, defaultName = '' }) {
  const [name, setName] = useState(defaultName)
  const [loading, setLoading] = useState(false)
  const [quizSets, setQuizSets] = useState([])
  const [selectedIds, setSelectedIds] = useState([])
  const isEdit = !!folderId

  useEffect(() => {
    const fetchData = async () => {
      if (isEdit) {
        const res = await axios.get(`/api/folders/${folderId}`)
        const selected = res.data.inFolder.map(q => q.id)
        const all = [...res.data.notInFolder, ...res.data.inFolder]

        const sorted = all.sort((a, b) => {
          const aSelected = selected.includes(a.id)
          const bSelected = selected.includes(b.id)

          if (aSelected && !bSelected) return -1
          if (!aSelected && bSelected) return 1

          return new Date(b.updatedAt) - new Date(a.updatedAt)
        })

        setQuizSets(sorted)
        setSelectedIds(selected)
        setName(res.data.folder.name)
      } else {
        const res = await axios.get('/api/quizsets?folder=null&sort=updatedAt')
        setQuizSets(res.data.quizSets.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)))
        setSelectedIds([])
      }
    }

    fetchData()
  }, [folderId, isEdit])

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
        const res = await axios.patch(`/api/folders/${folderId}`, {
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-800 p-6 rounded shadow w-full max-w-sm space-y-4">
        <h2 className="text-xl font-bold">{isEdit ? '폴더 수정' : '폴더 생성'}</h2>

        <input
          type="text"
          className="w-full px-3 py-2 border dark:border-zinc-700 rounded"
          placeholder="폴더 이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="max-h-48 overflow-y-auto space-y-1 text-sm">
          {quizSets.map((q) => (
            <label key={q.id} className="block">
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedIds.includes(q.id)}
                onChange={() => toggleSelection(q.id)}
              />
              {q.title}
            </label>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 dark:bg-zinc-600 rounded"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {loading ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    </div>
  )
}
