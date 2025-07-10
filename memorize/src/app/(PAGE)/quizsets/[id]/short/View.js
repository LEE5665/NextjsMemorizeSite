'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import axios from 'axios'

export default function ShortQuizPage() {
  const { id } = useParams()
  const searchParams = useSearchParams()

  // 문제집 타입 받아오기
  const [quizType, setQuizType] = useState('WORD') // 'WORD' | 'QA'
  const [questions, setQuestions] = useState([])
  const [order, setOrder] = useState([])
  const [current, setCurrent] = useState(0)
  const [input, setInput] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [finished, setFinished] = useState(false)
  const [incorrects, setIncorrects] = useState([])
  const [lastCorrect, setLastCorrect] = useState(null)

  // direction(단어장만), progressType 결정
  const direction = searchParams.get('direction') || 'word2mean'
  const progressType =
    quizType === 'QA'
      ? 'QA_SHORT'
      : direction === 'mean2word'
        ? 'REVERSE_SHORT'
        : 'SHORT'

  // 문제 + 진행도 동시 로딩
  useEffect(() => {
    const fetch = async () => {
      // 1. 문제셋 정보
      const quizRes = await axios.get(`/api/quizsets/${id}`)
      const quiz = quizRes.data
      setQuizType(quiz.type)
      const qs = quiz.questions

      // 2. 진행도
      let order = [...Array(qs.length).keys()].sort(() => Math.random() - 0.5)
      let current = 0
      let incorrects = []

      try {
        // QuizProgress 테이블에서 진행도 조회
        const progRes = await axios.get(`/api/quizsets/${id}/progress?type=${progressType}`)
        const progArr = progRes.data.progresses || []
        const prog = progArr.find(p => p.type === progressType)?.data
        if (prog && prog.order && prog.currentIndex != null) {
          order = prog.order
          current = prog.currentIndex
          incorrects = prog.incorrects || []
        } else {
          // 처음 플레이면 진행도 생성
          await axios.put(`/api/quizsets/${id}/progress?type=${progressType}`, {
            currentIndex: 0,
            order: order,
            incorrects: []
          })
        }
      } catch (e) {
        // 에러(진행도 없음 등) => 초기화
        await axios.put(`/api/quizsets/${id}/progress?type=${progressType}`, {
          currentIndex: 0,
          order: order,
          incorrects: []
        })
      }

      setQuestions(qs)
      setOrder(order)
      setCurrent(current)
      setIncorrects(incorrects)
      setFinished(false)
      setInput('')
    }
    fetch()
    // eslint-disable-next-line
  }, [id, direction, progressType])

  if (questions.length === 0)
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-xl" style={{ color: 'var(--text-color)' }}>
        불러오는 중…
      </div>
    )

  const idx = order[current]
  const q = questions[idx]

  // 타입별 프롬프트/정답
  let prompt, answer, label
  if (quizType === 'WORD') {
    prompt = direction === 'word2mean' ? q.content : q.answer
    answer = direction === 'word2mean' ? q.answer : q.content
    label = direction === 'word2mean' ? '단어를 보고 뜻을 입력하세요.' : '뜻을 보고 단어를 입력하세요.'
  } else {
    prompt = q.content        // 문제
    answer = q.answer         // 정답
    label = '문제를 보고 정답을 입력하세요.'
  }

  // 정답 제출
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (input.trim() === '') return
    const isCorrect = input.trim() === answer.trim()
    setShowResult(true)
    setLastCorrect(isCorrect)
    if (!isCorrect) setIncorrects(prev => [...prev, idx])
    await axios.put(`/api/quizsets/${id}/progress?type=${progressType}`, {
      currentIndex: current + 1,
      order,
      incorrects: !isCorrect ? [...incorrects, idx] : incorrects
    })
    setTimeout(() => {
      if (current + 1 >= order.length) setFinished(true)
      else {
        setCurrent(current + 1)
        setShowResult(false)
        setInput('')
      }
    }, 800)
  }

  // 다시하기
  const handleRestart = async () => {
    const newOrder = [...Array(questions.length).keys()].sort(() => Math.random() - 0.5)
    setOrder(newOrder)
    setCurrent(0)
    setIncorrects([])
    setShowResult(false)
    setInput('')
    await axios.put(`/api/quizsets/${id}/progress?type=${progressType}`, {
      currentIndex: 0,
      order: newOrder,
      incorrects: [],
    })
    setFinished(false)
  }

  if (finished) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-color)] text-[var(--text-color)] px-4">
        <div className="max-w-xl w-full bg-[var(--input-bg)] p-8 rounded-2xl shadow-xl space-y-6 text-center border border-[var(--border-color)]">
          <h2 className="text-2xl font-bold mb-3">퀴즈 완료!</h2>
          <p className="text-lg">
            점수: <span className="font-bold text-blue-500">{questions.length - incorrects.length} / {questions.length}</span>
          </p>
          {incorrects.length > 0 && (
            <div className="mt-6 text-left">
              <h3 className="font-bold mb-2 text-red-500">틀린 문제</h3>
              <div className="space-y-2">
                {incorrects.map(i => (
                  <div key={i} className="p-3 rounded-xl bg-[var(--input-bg)] border border-[var(--border-color)] text-sm shadow-sm">
                    <div>
                      <span className="font-semibold">{questions[i].content}</span>
                    </div>
                    <div>
                      <span className="font-bold">정답:</span>
                      <span className="ml-2 font-bold" style={{ color: 'var(--danger-text)' }}>
                        {direction === 'mean2word' ? questions[i]?.content : questions[i]?.answer}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <button
            onClick={handleRestart}
            className="mt-8 px-6 py-2 rounded-xl font-semibold bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)] text-white transition"
          >
            다시 하기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-color)] text-[var(--text-color)] px-2">
      <div className="w-full max-w-xl bg-[var(--input-bg)] p-8 rounded-2xl shadow-xl border border-[var(--border-color)] space-y-7">
        {/* 진행도 바 */}
        <div className="flex items-center gap-4 mb-3">
          <div className="flex-1 bg-gray-200 dark:bg-zinc-500 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-[var(--button-bg)] transition-all"
              style={{ width: `${((current + 1) / questions.length) * 100}%` }}
            />
          </div>
          <span className="text-sm font-semibold min-w-max ml-2">{current + 1} / {questions.length}</span>
        </div>

        <div className="flex flex-col gap-3 items-center">
          {/* <span className="font-semibold text-lg">{label}</span> */}
          <span className="text-xl">{prompt}</span>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <input
            autoFocus
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={showResult}
            className="border rounded-xl px-4 py-3 text-lg bg-[var(--input-bg)] border-[var(--border-color)]"
            style={{ color: 'var(--text-color)' }}
            placeholder="정답을 입력하세요"
          />
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[var(--button-bg)] text-white font-bold text-lg hover:bg-[var(--button-hover-bg)] transition"
            disabled={showResult}
          >
            제출
          </button>
        </form>
        {showResult && (
          <div className="text-center mt-2">
            {lastCorrect
              ? <span className="text-green-500 font-bold text-lg">정답입니다!</span>
              : <span className="text-red-500 font-bold text-lg">오답! 정답: {answer}</span>
            }
          </div>
        )}
      </div>
    </div>
  )
}
