'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import CreateQuizSetModal from './CreateQuiz'
import UploadQuizModal from './UploadQuiz'
import FolderModal from './CreateFolder'
import ShareLinkModal from './ShareLink'
import { ChevronLeft, Pencil, Trash2, Share2 } from 'lucide-react'
import axios from 'axios'

export default function MyQuizTab({
  quizSets: initialQuizSets,
  folders: initialFolders,
  initialSort,
  initialFolderSort,
  initialFolderId,
}) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [quizSets, setQuizSets] = useState(initialQuizSets)
  const [folders, setFolders] = useState(initialFolders)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showFolderModal, setShowFolderModal] = useState(false)
  const [folderData, setFolderData] = useState(null)
  const [copiedId, setCopiedId] = useState(null)
  const [showShareModal, setShowShareModal] = useState(false)
  const [currentShareUrl, setCurrentShareUrl] = useState('')

  const sort = searchParams.get('sort') ?? initialSort
  const folderSort = searchParams.get('folderSort') ?? initialFolderSort
  const folderId = searchParams.get('folder') ?? initialFolderId

  useEffect(() => {
    setQuizSets(initialQuizSets)
    setFolders(initialFolders)
  }, [initialQuizSets, initialFolders])

  // 폴더 정렬 로직
  const sortedFolders = [...folders].sort((a, b) => {
    if (folderSort === 'createdAt') {
      return new Date(b.createdAt) - new Date(a.createdAt)
    }
    if (folderSort === 'name') {
      return a.name.localeCompare(b.name, 'ko')
    }
    // 기본: updatedAt(최신순)
    return new Date(b.updatedAt) - new Date(a.updatedAt)
  })

  const handleDeleteFolder = async (id) => {
    if (!confirm('정말 이 폴더를 삭제하시겠습니까?')) return
    await axios.delete(`/api/folders/${id}`)
    const params = new URLSearchParams(searchParams.toString())
    if (folderId === String(id)) {
      params.delete('folder')
      router.push(`?${params.toString()}`)
    } else {
      router.refresh()
    }
  }

  const handleShare = async (folderId) => {
    try {
      const res = await axios.post(`/api/folders/${folderId}/share`)
      setCurrentShareUrl(res.data.url)
      setShowShareModal(true)
      setCopiedId(null)
    } catch {
      alert('공유 링크 생성 실패')
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentShareUrl)
      setCopiedId(true)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      alert('복사 실패')
    }
  }

  const handleEditFolder = async (id) => {
    const res = await axios.get(`/api/folders/${id}`)
    setFolderData(res.data)
    setShowFolderModal(true)
  }

  const handleCreateFolder = async () => {
    const res = await axios.get(`/api/quizsets?folder=null&sort=updatedAt`)
    const quizSets = res.data.quizSets.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    setFolderData({ folder: null, inFolder: [], notInFolder: quizSets })
    setShowFolderModal(true)
  }

  // 퀴즈 타입 한글 변환
  const typeText = (type) => (type === 'WORD' ? '단어장' : '일반문제')

return (
  <div className="max-w-6xl mx-auto py-6 space-y-8">
    {/* 타이틀 + 상단 버튼 */}
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-2">
      <h1 className="text-2xl font-extrabold tracking-tight text-[var(--text-color)]">내 모든 퀴즈</h1>
      <div className="flex flex-wrap gap-2">
        <button className="rounded-xl px-4 py-2 bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)] text-white font-semibold shadow transition w-full sm:w-auto" onClick={() => setShowCreateModal(true)}>+ 퀴즈 추가</button>
        <button className="rounded-xl px-4 py-2 bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)] text-white font-semibold shadow transition w-full sm:w-auto" onClick={handleCreateFolder}>+ 폴더 추가</button>
        <button className="rounded-xl px-4 py-2 bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)] text-white font-semibold shadow transition w-full sm:w-auto" onClick={() => setShowUploadModal(true)}>파일 업로드</button>
      </div>
    </div>

    {/* 폴더 구간 */}
    {folders.length > 0 && (
      <>
        {/* 정렬 & "처음으로" 버튼 묶음 */}
        <div className="flex flex-wrap gap-2 items-center mb-3">
          <select
            className="border px-3 py-1 rounded bg-[var(--input-bg)] text-[var(--text-color)] border-[var(--border-color)] w-full sm:w-auto"
            value={folderSort}
            onChange={(e) => router.push(`?folderSort=${e.target.value}`)}
          >
            <option value="updatedAt">최신순</option>
            <option value="createdAt">생성순</option>
            <option value="name">이름순</option>
          </select>
          {folderId && (
            <button
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-color)] text-sm font-semibold shadow hover:bg-[var(--bg-color)] transition"
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString())
                params.delete('folder')
                router.push(`?${params.toString()}`)
              }}
            >
              <ChevronLeft size={18} /> 처음으로
            </button>
          )}
        </div>
        {/* 폴더 카드 목록 */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-3">
          {sortedFolders.map((folder) => (
            <div
              key={folder.id}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[var(--input-bg)] border border-[var(--border-color)] group hover:shadow-lg transition relative w-full sm:w-auto"
            >
              <button onClick={() => router.push(`?folder=${folder.id}`)} className={`text-left flex-1 truncate font-semibold text-[var(--text-color)] ${folderId === String(folder.id) ? 'underline' : ''}`}>
                📁 {folder.name}
              </button>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[var(--badge-bg)] text-[var(--badge-text)]">
                {folder._count.quizSets}
              </span>
              <div className="flex gap-2 items-center opacity-0 group-hover:opacity-100 transition">
                <button onClick={() => handleShare(folder.id)} title="공유"><Share2 size={16} /></button>
                <button onClick={() => handleEditFolder(folder.id)} title="수정"><Pencil size={16} /></button>
                <button onClick={() => handleDeleteFolder(folder.id)} title="삭제"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </>
    )}

    {/* 퀴즈 목록 구간 */}
    {quizSets.length > 0 && (
      <>
        <div className="flex gap-2 items-center mb-3">
          <select
            className="border px-3 py-1 rounded bg-[var(--input-bg)] text-[var(--text-color)] border-[var(--border-color)] w-full sm:w-auto"
            value={sort}
            onChange={(e) => router.push(`?sort=${e.target.value}`)}
          >
            <option value="updatedAt">최신순</option>
            <option value="createdAt">생성순</option>
            <option value="title">제목순</option>
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {quizSets.map((quiz) => (
            <div
              key={quiz.id}
              className="p-5 rounded-2xl bg-[var(--input-bg)] border border-[var(--border-color)] shadow-md hover:shadow-xl cursor-pointer transition relative"
              onClick={() => router.push(`/quizsets/${quiz.id}`)}
            >
              <div className="absolute top-1 right-2 flex gap-1">
                <span className={`px-1.5 py-0.5 rounded-full text-[0.6rem] font-bold ${quiz.isPublic ? 'bg-[var(--badge-bg-public)] text-[var(--badge-text-public)]' : 'bg-[var(--badge-bg-private)] text-[var(--badge-text-private)]'}`}>{quiz.isPublic ? '공개' : '비공개'}</span>
                <span className="px-1.5 py-0.5 rounded-full text-[0.6rem] font-bold bg-[var(--badge-bg)] text-[var(--badge-text)]">{typeText(quiz.type)}</span>
              </div>
              <h2 className="font-bold text-lg truncate">{quiz.title}</h2>
              <p className="text-xs mt-1" style={{ color: 'var(--subtext-color)' }}>{quiz.questions.length} 문제</p>
            </div>
          ))}
        </div>
      </>
    )}

    {/* 모달 영역 */}
    {showCreateModal && (
      <CreateQuizSetModal onClose={() => { setShowCreateModal(false); router.refresh() }} />
    )}
    {showUploadModal && (
      <UploadQuizModal onClose={() => { setShowUploadModal(false); router.refresh() }} />
    )}
    {showFolderModal && (
      <FolderModal
        folderData={folderData}
        onClose={() => {
          setShowFolderModal(false)
          setFolderData(null)
          router.refresh()
        }}
        onDone={() => {
          setShowFolderModal(false)
          router.refresh()
        }}
      />
    )}
    {showShareModal && (
      <ShareLinkModal
        url={currentShareUrl}
        onClose={() => setShowShareModal(false)}
        onCopy={handleCopy}
        copied={copiedId}
      />
    )}
  </div>
)


}
