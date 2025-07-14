'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import CreateQuizSetModal from './CreateQuiz'
import UploadQuizModal from './UploadQuiz'
import FolderModal from './CreateFolder'
import ShareLinkModal from './ShareLink'
import { ChevronLeft, Pencil, Trash2, Share2, Folder, FolderOpen } from 'lucide-react'
import axios from 'axios'

export default function MyQuizTab({
  quizSets: initialQuizSets,
  folders: initialFolders,
  groupedQuizSets: initialGroupedQuizSets,
  initialSort,
  initialFolderSort,
  initialFolderId,
}) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [quizSets, setQuizSets] = useState(initialQuizSets)
  const [folders, setFolders] = useState(initialFolders)
  const [groupedQuizSets, setGroupedQuizSets] = useState(initialGroupedQuizSets || [])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showFolderModal, setShowFolderModal] = useState(false)
  const [folderData, setFolderData] = useState(null)
  const [copiedId, setCopiedId] = useState(null)
  const [showShareModal, setShowShareModal] = useState(false)
  const [currentShareUrl, setCurrentShareUrl] = useState('')

  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '')

  const sort = searchParams.get('sort') ?? initialSort
  const folderSort = searchParams.get('folderSort') ?? initialFolderSort
  const folderId = searchParams.get('folder') ?? initialFolderId
  const search = searchParams.get('search') || ''

  useEffect(() => {
    setQuizSets(initialQuizSets)
    setFolders(initialFolders)
    setGroupedQuizSets(initialGroupedQuizSets || [])
  }, [initialQuizSets, initialFolders, initialGroupedQuizSets])

  // 검색 핸들러
  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (searchInput.trim()) {
      params.set('search', searchInput.trim())
      params.delete('folder')
    } else {
      params.delete('search')
    }
    router.push(`?${params.toString()}`)
  }

  // 폴더 삭제
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

  // 폴더 공유
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

      {/* 검색창 */}
      <form
        onSubmit={handleSearch}
        className="flex items-center gap-2 max-w-md mb-2"
        autoComplete="off"
      >
        <input
          type="text"
          value={searchInput}
          placeholder="퀴즈 제목 검색"
          onChange={e => setSearchInput(e.target.value)}
          className="flex-1 rounded-md border border-[var(--border-color)] bg-[var(--input-bg)] px-3 py-2 text-sm outline-none"
          style={{ color: 'var(--text-color)' }}
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-md bg-[var(--button-bg)] text-[var(--button-text)] font-semibold"
        >
          검색
        </button>
      </form>
      {/* 밑줄 */}
      <div className="border-b border-[var(--border-color)] mb-4" />

      {/* ---- 검색 시: 폴더별 그룹화 결과 ---- */}
      {search ? (
        groupedQuizSets.length === 0 ? (
          <p className="text-[var(--text-color)]">퀴즈가 없습니다.</p>
        ) : (
          groupedQuizSets.map(folder => (
            <div key={folder.id ?? 'nofolder'} className="mb-6">
              <div className="font-bold text-lg mb-2 text-[var(--text-color)] flex items-center gap-2">
                {folder.id ? (
                  <>
                    <span className="text-blue-500">/</span>
                    {folder.name}
                  </>
                ) : (
                  <>
                    <span className="text-zinc-400">/</span>
                    <span className="italic">{folder.name}</span>
                  </>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {folder.quizSets.map(quiz => (
                  <Link
                    key={quiz.id}
                    href={`/quizsets/${quiz.id}`}
                    className="block p-5 rounded-2xl bg-[var(--input-bg)] border border-[var(--border-color)] shadow hover:shadow-xl cursor-pointer transition"
                  >
                    <h2 className="font-bold text-lg truncate">{quiz.title}</h2>
                    <div className="flex gap-2 mt-2">
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[var(--badge-bg)] text-[var(--badge-text)]">{quiz.questions.length}문제</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))
        )
      ) : (
        <>
          {/* ---- 검색이 아닐 때 기존 폴더/퀴즈 리스트 ---- */}
          {folders.length > 0 && (
            <>
              <div className="flex flex-wrap gap-2 items-center mb-3">
                <select
                  className="border px-3 py-1 rounded bg-[var(--input-bg)] text-[var(--text-color)] border-[var(--border-color)] w-full sm:w-auto"
                  value={folderSort}
                  onChange={e => {
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
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-3">
                {folders.map((folder) => (
                  <Link
                    key={folder.id}
                    href={`?folder=${folder.id}`}
                    className={`flex items-center gap-2 px-4 py-2 rounded-2xl bg-[var(--input-bg)] border border-[var(--border-color)] group hover:shadow-lg transition relative w-full sm:w-auto ${folderId === String(folder.id) ? 'underline' : ''
                      }`}
                  >
                    {folderId === String(folder.id) ? <FolderOpen size={16} /> : <Folder size={16} />}
                    <span className="truncate">{folder.name}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[var(--badge-bg)] text-[var(--badge-text)]">
                      {folder._count?.quizSets ?? 0}
                    </span>
                    <div className="flex gap-2 items-center opacity-0 group-hover:opacity-100 transition">
                      <button type="button" onClick={(e) => { e.preventDefault(); handleShare(folder.id); }} title="공유"><Share2 size={16} /></button>
                      <button type="button" onClick={(e) => { e.preventDefault(); handleEditFolder(folder.id); }} title="수정"><Pencil size={16} /></button>
                      <button type="button" onClick={(e) => { e.preventDefault(); handleDeleteFolder(folder.id); }} title="삭제"><Trash2 size={16} /></button>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
          {quizSets.length > 0 && (
            <>
              <div className="flex gap-2 items-center mb-3">
                <select
                  className="border px-3 py-1 rounded bg-[var(--input-bg)] text-[var(--text-color)] border-[var(--border-color)] w-full sm:w-auto"
                  value={sort}
                  onChange={e => {
                    const params = new URLSearchParams(searchParams.toString())
                    params.set('sort', e.target.value)
                    router.push(`?${params.toString()}`)
                  }}
                >
                  <option value="updatedAt">최신순</option>
                  <option value="createdAt">생성순</option>
                  <option value="title">제목순</option>
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {quizSets.map((quiz) => (
                  <Link
                    key={quiz.id}
                    href={`/quizsets/${quiz.id}`}
                    className="block p-5 rounded-2xl bg-[var(--input-bg)] border border-[var(--border-color)] shadow-md hover:shadow-xl cursor-pointer transition relative"
                  >
                    <div className="absolute top-1 right-2 flex gap-1">
                      <span className={`px-1.5 py-0.5 rounded-full text-[0.6rem] font-bold ${quiz.isPublic ? 'bg-[var(--badge-bg-public)] text-[var(--badge-text-public)]' : 'bg-[var(--badge-bg-private)] text-[var(--badge-text-private)]'}`}>{quiz.isPublic ? '공개' : '비공개'}</span>
                      <span className="px-1.5 py-0.5 rounded-full text-[0.6rem] font-bold bg-[var(--badge-bg)] text-[var(--badge-text)]">{typeText(quiz.type)}</span>
                    </div>
                    <h2 className="font-bold text-lg truncate">{quiz.title}</h2>
                    <p className="text-xs mt-1" style={{ color: 'var(--subtext-color)' }}>{quiz.questions.length} 문제</p>
                  </Link>
                ))}
              </div>
            </>
          )}
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
