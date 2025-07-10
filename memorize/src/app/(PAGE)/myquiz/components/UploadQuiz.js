'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function UploadQuizModal({ onClose }) {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const router = useRouter()

  const handleUpload = async () => {
    if (!file) return alert('파일을 선택하세요')
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/quizsets/upload', {
        method: 'POST',
        body: formData,
      })
      if (res.status === 201) {
        alert('퀴즈 업로드 완료')
        onClose()
        router.refresh()
      } else {
        alert('업로드 실패')
      }
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.36)] modal-overlay-fade">
      <div className="relative w-full max-w-md p-8 rounded-2xl shadow-2xl border bg-[var(--bg-color)] text-[var(--text-color)] border-[var(--border-color)] animate-modal-pop"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-6 text-2xl text-[var(--subtext-color)] hover:text-[var(--text-color)] transition"
          aria-label="닫기"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">퀴즈 파일 업로드</h2>

        <label className="block mb-5 text-center">
          <input
            type="file"
            accept=".txt"
            onChange={e => setFile(e.target.files?.[0])}
            className="w-full p-2 border rounded-lg bg-[var(--input-bg)] text-[var(--text-color)] border-[var(--border-color)] focus:outline-none"
          />
        </label>

        <div className="flex justify-center gap-3 pt-3">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg font-bold bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)] text-[var(--button-text)] transition"
            type="button"
          >
            취소
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="px-6 py-2 rounded-lg font-bold shadow-sm bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)] text-[var(--button-text)] transition disabled:opacity-60 disabled:pointer-events-none"
          >
            {uploading ? '업로드 중...' : '업로드'}
          </button>
        </div>
      </div>

      <style jsx>{`
        .animate-modal-pop {
          animation: modal-pop .23s cubic-bezier(.42,1.1,.23,1);
        }
        @keyframes modal-pop {
          0% { opacity: 0; transform: scale(.95);}
          100% { opacity: 1; transform: scale(1);}
        }
        .modal-overlay-fade {
          animation: overlay-fade .15s cubic-bezier(.42,1.1,.23,1);
        }
        @keyframes overlay-fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
