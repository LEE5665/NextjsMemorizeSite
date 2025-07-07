// ✅ UploadQuizModal.js (파일 업로드를 모달로 구현)
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function UploadQuizModal({ onClose }) {
  const [file, setFile] = useState(null)
  const router = useRouter()

  const handleUpload = async () => {
    if (!file) return alert('파일을 선택하세요')

    const formData = new FormData()
    formData.append('file', file)

    const res = await axios.post('/api/quizsets/upload', formData)
    if (res.status === 201) {
      alert('퀴즈 업로드 완료')
      onClose()
      router.refresh()
    } else {
      alert('업로드 실패')
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center">
      <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-xl w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-xl text-zinc-500 hover:text-zinc-800 dark:hover:text-white"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-4">퀴즈 파일 업로드</h2>
        <input
          type="file"
          accept=".txt"
          onChange={(e) => setFile(e.target.files?.[0])}
          className="mb-4"
        />
        <button
          onClick={handleUpload}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          업로드
        </button>
      </div>
    </div>
  )
}
