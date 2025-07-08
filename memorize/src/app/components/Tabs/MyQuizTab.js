'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import axios from 'axios'
import CreateQuizSetModal from './components/CreateQuiz'
import UploadQuizModal from './components/UploadQuiz'
import FolderModal from './components/CreateFolder'
import { ChevronLeft, Pencil, Trash2 } from 'lucide-react'

export default function MyQuizTab() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const sort = searchParams.get('sort') ?? 'updatedAt'
  const folderSort = searchParams.get('folderSort') ?? 'updatedAt'
  const folderId = searchParams.get('folder')

  const [quizSets, setQuizSets] = useState(null)
  const [folders, setFolders] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showFolderModal, setShowFolderModal] = useState(false)
  const [editFolder, setEditFolder] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`/api/quizsets?sort=${sort}&folder=${folderId ?? ''}&folderSort=${folderSort}`)
      setQuizSets(res.data.quizSets)
      setFolders(res.data.folders)
    }
    fetchData()
  }, [sort, folderSort, folderId, showCreateModal, showUploadModal, showFolderModal])

  const handleDeleteFolder = async (id) => {
    if (!confirm('정말 이 폴더를 삭제하시겠습니까?')) return
    await axios.delete(`/api/folders/${id}`)
    const params = new URLSearchParams(searchParams.toString())
    if (folderId === String(id)) {
      params.delete('folder')
      router.push(`?${params.toString()}`)
    } else {
      setFolders((prev) => prev.filter((f) => f.id !== id))
    }
  }

  if (!quizSets) return <p className="p-6">불러오는 중...</p>

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">내 모든 퀴즈</h1>

      {/* 폴더 정렬 및 뒤로가기 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <select
          className="border border-[var(--border-color)] bg-[var(--input-bg)] text-[var(--text-color)] px-3 py-1 rounded w-full sm:w-auto"
          value={folderSort}
          onChange={(e) => {
            const params = new URLSearchParams(searchParams.toString())
            params.set('folderSort', e.target.value)
            router.push(`?${params.toString()}`)
          }}
        >
          <option value="updatedAt">최신순</option>
          <option value="createdAt">생성순</option>
          <option value="name">제목순</option>
        </select>

        {folderId && (
          <button
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString())
              params.delete('folder')
              router.push(`?${params.toString()}`)
            }}
            className="flex items-center gap-1 px-3 py-1 border border-[var(--border-color)] text-[var(--text-color)] rounded hover:bg-[var(--input-bg)] transition"
          >
            <ChevronLeft size={16} />
            뒤로가기
          </button>
        )}
      </div>

      {/* 폴더 리스트 */}
      <div className="space-y-1">
        {folders.map((folder) => (
          <div key={folder.id} className="flex items-center justify-between group rounded hover:bg-[var(--input-bg)] px-3 py-1">
            <button
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString())
                params.set('folder', folder.id)
                router.push(`?${params.toString()}`)
              }}
              className={`text-left w-full text-[var(--text-color)] text-sm sm:text-base ${folderId === String(folder.id) ? 'font-bold' : ''}`}
            >
              📁 {folder.name}
            </button>

            <div className="flex gap-2 items-center opacity-0 group-hover:opacity-100 transition">
              <button
                onClick={() => {
                  setEditFolder(folder)
                  setShowFolderModal(true)
                }}
                className="text-[var(--text-color)] hover:text-blue-600"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => handleDeleteFolder(folder.id)}
                className="text-[var(--text-color)] hover:text-red-600"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <hr className="border-[var(--border-color)]" />

      {/* 퀴즈 정렬 및 액션 버튼들 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <select
          className="border border-[var(--border-color)] bg-[var(--input-bg)] text-[var(--text-color)] px-3 py-1 rounded w-full sm:w-auto"
          value={sort}
          onChange={(e) => {
            const params = new URLSearchParams(searchParams.toString())
            params.set('sort', e.target.value)
            router.push(`?${params.toString()}`)
          }}
        >
          <option value="updatedAt">최신순</option>
          <option value="createdAt">생성순</option>
          <option value="title">제목순</option>
        </select>

        <div className="flex flex-col sm:flex-row-reverse gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full sm:w-auto bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)] text-white px-4 py-2 rounded"
          >
            퀴즈 추가
          </button>
          <button
            onClick={() => {
              setEditFolder(null)
              setShowFolderModal(true)
            }}
            className="w-full sm:w-auto bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)] text-white px-4 py-2 rounded"
          >
            폴더 추가
          </button>
          <button
            onClick={() => setShowUploadModal(true)}
            className="w-full sm:w-auto bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)] text-white px-4 py-2 rounded"
          >
            파일 업로드
          </button>
        </div>
      </div>

      {/* 퀴즈 목록 */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {quizSets.map((quiz) => (
          <div
            key={quiz.id}
            className="bg-white dark:bg-zinc-800 p-4 rounded shadow cursor-pointer hover:shadow-lg transition"
            onClick={() => router.push(`/quizsets/${quiz.id}`)}
          >
            <h2 className="font-bold truncate">{quiz.title}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{quiz.questions.length} 문제</p>
          </div>
        ))}
      </div>

      {/* 모달들 */}
      {showCreateModal && <CreateQuizSetModal onClose={() => setShowCreateModal(false)} />}
      {showUploadModal && <UploadQuizModal onClose={() => setShowUploadModal(false)} />}
      {showFolderModal && (
        <FolderModal
          onClose={() => setShowFolderModal(false)}
          folderId={editFolder?.id ?? null}
          defaultName={editFolder?.name ?? ''}
          onDone={() => setShowFolderModal(false)}
        />
      )}
    </div>
  )
}