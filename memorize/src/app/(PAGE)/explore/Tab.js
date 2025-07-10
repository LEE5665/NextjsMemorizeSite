'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function ExploreTab({ initialQuizSets, total, page, search, searchType }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // SSR에서 props로 받은 값으로 state 초기화
  const [quizSets, setQuizSets] = useState(initialQuizSets)
  const [totalCount, setTotalCount] = useState(total)
  const [input, setInput] = useState(search || '')
  const [filterType, setFilterType] = useState(searchType || 'all')
  const [currentPage, setCurrentPage] = useState(page || 1)

  // searchParams 바뀔 때마다 값 다시 set
  useEffect(() => {
    setQuizSets(initialQuizSets)
    setTotalCount(total)
    setCurrentPage(page)
  }, [initialQuizSets, total, page])

  const totalPages = Math.ceil(totalCount / 12)
  const typeText = (type) => (type === 'WORD' ? '단어장' : '일반문제')

  // 검색
  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (input.trim()) {
      params.set('search', input.trim())
      params.set('searchType', filterType)
      params.set('page', 1)
    } else {
      params.delete('search')
      params.set('searchType', filterType)
      params.set('page', 1)
    }
    router.push(`?${params}`)
  }

  // 검색타입 변경
  const handleTypeChange = (e) => {
    setFilterType(e.target.value)
    const params = new URLSearchParams(searchParams.toString())
    params.set('searchType', e.target.value)
    params.set('page', 1)
    router.push(`?${params}`)
  }

  // 페이지 이동
  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', newPage)
    router.push(`?${params}`)
  }

  return (
    <div className="max-w-6xl mx-auto py-6 space-y-8">
      <h1 className="text-2xl font-extrabold tracking-tight text-[var(--text-color)]">
        공개 퀴즈
      </h1>

      {/* 검색창 */}
      <form
        onSubmit={handleSearch}
        className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full max-w-md mb-2"
        autoComplete="off"
      >
        <select
          value={filterType}
          onChange={handleTypeChange}
          className="w-full sm:w-auto rounded-md border border-[var(--border-color)] bg-[var(--input-bg)] px-2 py-2 text-sm text-[var(--text-color)] font-semibold"
        >
          <option value="all">전체</option>
          <option value="title">제목</option>
          <option value="creator">제작자</option>
        </select>
        <input
          type="text"
          value={input}
          placeholder={
            filterType === 'creator'
              ? '제작자명 검색'
              : filterType === 'title'
                ? '제목 검색'
                : '제목/제작자 검색'
          }
          onChange={e => setInput(e.target.value)}
          className="flex-1 min-w-0 w-full sm:w-auto rounded-md border border-[var(--border-color)] bg-[var(--input-bg)] px-3 py-2 text-sm outline-none"
          style={{ color: 'var(--text-color)' }}
        />
        <button
          type="submit"
          className="w-full sm:w-auto px-4 py-2 rounded-md bg-[var(--button-bg)] text-[var(--button-text)] font-semibold"
        >
          검색
        </button>
      </form>
      {/* 밑줄 */}
      <div className="border-b border-[var(--border-color)] mb-4" />

      {quizSets.length === 0 ? (
        <p className="text-[var(--text-color)]">공개된 퀴즈가 없습니다.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {quizSets.map((quiz) => (
              <div
                key={quiz.id}
                className="p-5 rounded-2xl bg-[var(--input-bg)] border border-[var(--border-color)] shadow-md hover:shadow-xl cursor-pointer transition relative"
                onClick={() => router.push(`/quizsets/${quiz.id}`)}
              >
                <div className="absolute top-1 right-2 flex gap-1">
                  <span className="px-1.5 py-0.5 rounded-full text-[0.6rem] font-bold bg-[var(--badge-bg)] text-[var(--badge-text)]">
                    {quiz.questionCount}문제
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full text-[0.6rem] font-bold bg-[var(--badge-bg)] text-[var(--badge-text)]">
                    {typeText(quiz.type)}
                  </span>
                </div>
                <h2 className="font-bold text-lg truncate">{quiz.title}</h2>
                <p className="text-xs mt-1 text-[var(--subtext-color)]">제작자: {quiz.creatorName}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
              const isActive = currentPage === p
              return (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`px-3 py-1 rounded border text-sm font-semibold transition ${isActive
                      ? 'bg-[var(--button-bg)] text-white'
                      : 'bg-[var(--input-bg)] text-[var(--text-color)] hover:bg-[var(--button-bg)] hover:text-white'
                    }`}
                  style={{ borderColor: 'var(--border-color)' }}
                >
                  {p}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
