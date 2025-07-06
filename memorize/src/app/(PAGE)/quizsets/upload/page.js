'use client'

import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

export default function UploadQuizPage() {
  const [file, setFile] = useState(null)
  const router = useRouter()

  const handleUpload = async () => {
    if (!file) return alert('파일을 선택하세요')

    const formData = new FormData()
    formData.append('file', file)

    const res = await axios.post('/api/quizsets/upload', formData)
    if (res.status === 201) {
      alert('퀴즈 업로드 완료')
      router.push('/quizsets')
    } else {
      alert('업로드 실패')
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">퀴즈 txt 파일 업로드</h2>
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
  )
}
